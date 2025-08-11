import { hashPassword, generateRandomString, getCurrentTimestamp, deriveBTCAddress, generateXRPDestinationTag } from './utils.ts';

interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

// Base URL for raw files in the GitHub repository (for serving static HTML/CSS)
const GITHUB_BASE_RAW = 'https://raw.githubusercontent.com/carbidethegreate/clipcherry/main';

// Helper to parse JSON body safely
async function parseBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// Retrieve user ID from session token stored in KV
async function getAuthenticatedUserId(request: Request, env: Env): Promise<number | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const sessionId = authHeader.slice(7);
  const userIdStr = await env.KV.get(`session:${sessionId}`);
  return userIdStr ? Number(userIdStr) : null;
}

// Serve static files from the GitHub repository
async function serveStatic(path: string): Promise<Response> {
  const url = `${GITHUB_BASE_RAW}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    return new Response('Not Found', { status: 404 });
  }
  const ext = path.split('.').pop()?.toLowerCase() || '';
  let contentType = 'text/plain';
  if (ext === 'html') contentType = 'text/html';
  else if (ext === 'css') contentType = 'text/css';
  else if (ext === 'js') contentType = 'application/javascript';
  const body = await res.text();
  return new Response(body, { status: 200, headers: { 'Content-Type': contentType } });
}

// Return JSON response helper
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// User registration
async function register(request: Request, env: Env): Promise<Response> {
  const { username, email, password } = await parseBody(request);
  if (!username || !email || !password) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }
  // Ensure users table exists
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at TEXT
  );`);
  // Check for duplicate email
  const { results: existing } = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).all();
  if (existing.length > 0) {
    return jsonResponse({ error: 'Email already registered' }, 409);
  }
  const passwordHash = await hashPassword(password);
  await env.DB.prepare('INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)').bind(username, email, passwordHash, getCurrentTimestamp()).run();
  return jsonResponse({ success: true });
}

// User login
async function login(request: Request, env: Env): Promise<Response> {
  const { email, password } = await parseBody(request);
  if (!email || !password) {
    return jsonResponse({ error: 'Missing credentials' }, 400);
  }
  const { results } = await env.DB.prepare('SELECT id, password_hash FROM users WHERE email = ?').bind(email).all();
  const user = results[0];
  if (!user) return jsonResponse({ error: 'Invalid credentials' }, 401);
  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.password_hash) {
    return jsonResponse({ error: 'Invalid credentials' }, 401);
  }
  const sessionId = generateRandomString(32);
  await env.KV.put(`session:${sessionId}`, String(user.id), { expirationTtl: 60 * 60 * 24 });
  return jsonResponse({ session: sessionId });
}

// List all public content
async function listContent(env: Env): Promise<Response> {
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER,
    title TEXT,
    description TEXT,
    price_cents INTEGER,
    type TEXT,
    media_id TEXT,
    preview_id TEXT,
    is_private INTEGER,
    created_at TEXT
  );`);
  const { results } = await env.DB.prepare('SELECT id, creator_id, title, description, price_cents, type, preview_id, is_private FROM content WHERE is_private = 0').all();
  return jsonResponse({ items: results });
}

// Create new content (for creators)
async function createContent(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);
  const { title, description, price_cents, type, media_id, preview_id, is_private } = await parseBody(request);
  if (!title || !description || price_cents === undefined || !type || !media_id) {
    return jsonResponse({ error: 'Missing content fields' }, 400);
  }
  await env.DB.prepare('INSERT INTO content (creator_id, title, description, price_cents, type, media_id, preview_id, is_private, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(userId, title, description, price_cents, type, media_id, preview_id || null, is_private ? 1 : 0, getCurrentTimestamp())
    .run();
  return jsonResponse({ success: true });
}

// List content uploaded by the authenticated creator
async function listMyContent(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER,
    title TEXT,
    description TEXT,
    price_cents INTEGER,
    type TEXT,
    media_id TEXT,
    preview_id TEXT,
    is_private INTEGER,
    created_at TEXT
  );`);
  const { results } = await env.DB.prepare('SELECT id, title, description, price_cents, type, preview_id, is_private FROM content WHERE creator_id = ?')
    .bind(userId)
    .all();
  return jsonResponse({ items: results });
}

// Subscribe to a creator
async function createSubscription(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);
  const { creator_id } = await parseBody(request);
  if (!creator_id) return jsonResponse({ error: 'Missing creator_id' }, 400);
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    creator_id INTEGER,
    started_at TEXT
  );`);
  await env.DB.prepare('INSERT INTO subscriptions (user_id, creator_id, started_at) VALUES (?, ?, ?)')
    .bind(userId, creator_id, getCurrentTimestamp())
    .run();
  return jsonResponse({ success: true });
}

// List all subscriptions for the authenticated user
async function listSubscriptions(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    creator_id INTEGER,
    started_at TEXT
  );`);
  const { results } = await env.DB.prepare('SELECT creator_id FROM subscriptions WHERE user_id = ?')
    .bind(userId)
    .all();
  return jsonResponse({ subscriptions: results });
}

// Create a new purchase order for content
async function createPurchase(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);
  const { content_id, currency } = await parseBody(request);
  if (!content_id || !currency) return jsonResponse({ error: 'Missing fields' }, 400);
  // Fetch content to get price
  const { results: contentRows } = await env.DB.prepare('SELECT price_cents FROM content WHERE id = ?').bind(content_id).all();
  const content = contentRows[0];
  if (!content) return jsonResponse({ error: 'Content not found' }, 404);
  const priceCents = content.price_cents;
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content_id INTEGER,
    price_cents INTEGER,
    currency TEXT,
    address TEXT,
    destination_tag TEXT,
    status TEXT,
    created_at TEXT
  );`);
  let address = '';
  let destinationTag: string | null = null;
  if (currency === 'BTC') {
    address = deriveBTCAddress(`${userId}-${content_id}`);
  } else if (currency === 'XRP') {
    address = 'YOUR_XRP_ACCOUNT_ADDRESS';
    destinationTag = generateXRPDestinationTag();
  } else {
    return jsonResponse({ error: 'Unsupported currency' }, 400);
  }
  const { lastRowId } = await env.DB.prepare('INSERT INTO purchases (user_id, content_id, price_cents, currency, address, destination_tag, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(userId, content_id, priceCents, currency, address, destinationTag, 'pending', getCurrentTimestamp())
    .run();
  return jsonResponse({
    order_id: lastRowId,
    address,
    destination_tag: destinationTag,
    amount_cents: priceCents,
    currency
  });
}

// Get purchase status
async function getPurchaseStatus(request: Request, env: Env, id: number): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);
  const { results } = await env.DB.prepare('SELECT status, address, destination_tag, price_cents AS amount_cents, currency FROM purchases WHERE id = ? AND user_id = ?')
    .bind(id, userId)
    .all();
  const purchase = results[0];
  if (!purchase) return jsonResponse({ error: 'Purchase not found' }, 404);
  return jsonResponse(purchase);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Serve static pages
    if (pathname === '/' || pathname === '/index.html' || pathname === '/public/' || pathname === '/public/index.html') {
      return await serveStatic('/public/index.html');
    }
    if (pathname.startsWith('/public/')) {
      return await serveStatic(pathname);
    }
    if (pathname.startsWith('/css/')) {
      return await serveStatic(pathname);
    }

    // API routes
    if (pathname === '/api/register' && request.method === 'POST') {
      return await register(request, env);
    }
    if (pathname === '/api/login' && request.method === 'POST') {
      return await login(request, env);
    }
    if (pathname === '/api/content' && request.method === 'GET') {
      return await listContent(env);
    }
    if (pathname === '/api/content' && request.method === 'POST') {
      return await createContent(request, env);
    }
    if (pathname === '/api/my-content' && request.method === 'GET') {
      return await listMyContent(request, env);
    }
    if (pathname === '/api/subscriptions' && request.method === 'GET') {
      return await listSubscriptions(request, env);
    }
    if (pathname === '/api/subscriptions' && request.method === 'POST') {
      return await createSubscription(request, env);
    }
    if (pathname === '/api/purchase' && request.method === 'POST') {
      return await createPurchase(request, env);
    }
    if (pathname.startsWith('/api/purchase/') && request.method === 'GET') {
      const idStr = pathname.split('/')[3];
      const id = Number(idStr);
      if (!Number.isInteger(id)) {
        return jsonResponse({ error: 'Invalid order id' }, 400);
      }
      return await getPurchaseStatus(request, env, id);
    }

    return new Response('Not Found', { status: 404 });
  }
};
