import { hashPassword, generateRandomString, getCurrentTimestamp, deriveBTCAddress, generateXRPDestinationTag } from './utils.ts';

interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

async function parseBody(request: Request): Promise<any> {
  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  return null;
}

async function register(request: Request, env: Env) {
  const body = await parseBody(request);
  const { username, email, password } = body || {};
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const password_hash = await hashPassword(password);
  await env.DB.prepare(`INSERT INTO users (username,email,password_hash) VALUES (?1,?2,?3)`).bind(username, email, password_hash).run();
  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}

async function login(request: Request, env: Env) {
  const body = await parseBody(request);
  const { email, password } = body || {};
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const user = await env.DB.prepare('SELECT id, password_hash FROM users WHERE email=?1').bind(email).first();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const hashed = await hashPassword(password);
  if (hashed !== (user as any).password_hash) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const token = generateRandomString(32);
  await env.KV.put(`session:${token}`, String((user as any).id), { expirationTtl: 60 * 60 * 24 * 7 });
  return new Response(JSON.stringify({ token }), { headers: { 'Content-Type': 'application/json' } });
}

async function listContent(request: Request, env: Env) {
  const results = await env.DB.prepare('SELECT id, title, price_cents, is_private FROM content WHERE is_private = 0').all();
  return new Response(JSON.stringify(results.results || []), { headers: { 'Content-Type': 'application/json' } });
}

async function handler(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
    if (pathname === '/api/content' && request.method === 'POST') {

  }

  const pathname = url.pathname;
  if (pathname === '/api/register' && request.method === 'POST') {
    return register(request, env);
  }
  if (pathname === '/api/login' && request.method === 'POST') {
    return login(request, env);
  }
  if (pathname === '/api/content' && request.method === 'GET') {
    return listContent(request, env);
  }
  
    if (pathname === '/api/content' && request.method === 'POST') {
    return createContent(request, env);
  }
  if (pathname === '/api/my-content' && request.method === 'GET') {
    r
          if (pathname === '/api/purchase' && request.method === 'POST') {
      return createPurchase(request, env);
    }
    if (pathname.startsWith('/api/purchase/') && request.method === 'GET') {
      const id = pathname.split('/')[3];
      return getPurchaseStatus(request, env, id);
    }
eturn listMyContent(request, env);
  }
  if (pathname === '/api/subscriptions' && request.method === 'POST') {
    return createSubscription(request, env);
  }
  if (pathname === '/api/subscriptions' && request.method === 'GET') {
    return listSubscriptions(request, env);
  }
// TODO: implement 
  upload, purchase, subscription, messages, etc.
  if (pathname.startsWith('/api')) {
    return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('CLIPcherry API', { headers: { 'Content-Type': 'text/plain' } });
// Helper to authenticate user via session token stored in KV
async function getAuthenticatedUserId(request: Request, env: Env): Promise<number | null> {
  const authHeader = request.headers.get('Authorization') || '';
  // Expect header like "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  const session = await env.KV.get(`session:${token}`, { type: 'json' });
  if (!session || typeof session !== 'object' || !('user' in session)) return null;
  return (session as any).user as number;
}

// Create new content (for creators)
async function createContent(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const body = await parseBody(request);
  const { title, description, price_cents, is_private, type, media_url, preview_url } = body || {};
  if (!title || !type) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  // Insert into DB
  await env.DB.prepare(
    `INSERT INTO content (creator_id, title, description, price_cents, is_private, type, media_url, preview_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(userId, title, description || '', price_cents || 0, is_private ? 1 : 0, type, media_url || '', preview_url || '', getCurrentTimestamp()).run();
  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}

// List content for current creator
async function listMyContent(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const results = await env.DB.prepare(
    'SELECT id, title, price_cents, is_private, type, media_url, preview_url FROM content WHERE creator_id = ?'
  ).bind(userId).all();
  return new Response(JSON.stringify(results.results ?? []), { headers: { 'Content-Type': 'application/json' } });
}

// Subscribe to a creator
async function createSubscription(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const body = await parseBody(request);
  const { creator_id } = body || {};
  if (!creator_id) {
    return new Response(JSON.stringify({ error: 'Missing creator_id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  // Insert subscription if not exists
  await env.DB.prepare(
    'INSERT OR IGNORE INTO subscriptions (user_id, creator_id, status, started_at) VALUES (?, ?, ?, ?)'
  ).bind(userId, creator_id, 'active', getCurrentTimestamp()).run();
  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}

// List subscriptions for current user
async function listSubscriptions(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) {
    r
      
    // Create a new purchase order for content
async function createPurchase(request: Request, env: Env): Promise<Response> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const body = await parseBody(request);
  const { content_id, currency } = body || {};
  if (!content_id || !currency) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  // fetch content
  const content = await env.DB.prepare('SELECT id, creator_id, price_cents FROM content WHERE id = ?').bind(content_id).first();
  if (!content) {
    return new Response(JSON.stringify({ error: 'Content not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  // compute price; for simplicity price_cents is in USD cents; we just return that; conversion to BTC/XRP not implemented
  const priceCents = (content as any).price_cents as number;
  // Generate crypto payment details
  let address: string = '';
  let destinationTag: string | undefined;
  if (currency === 'BTC') {
    address = await deriveBTCAddress(userId.toString());
  } else if (currency === 'XRP') {
    address = 'YOUR_XRP_ACCOUNT_ADDRESS';
    destinationTag = generateXRPDestinationTag();
  } else {
    return new Response(JSON.stringify({ error: 'Unsupported currency' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  // Insert purchase record
  const { success } = await env.DB.prepare(
    'INSERT INTO purchases (user_id, content_id, currency, price_cents, status, address, destination_tag, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(userId, content_id, currency, priceCents, 'pending', address, destinationTag || null, getCurrentTimestamp()).run();
  // Get order ID (last inserted rowid)
  const orderId = (await env.DB.prepare('SELECT last_insert_rowid() as id').first()) as any;
  return new Response(JSON.stringify({
    order_id: orderId.id,
    address,
    destinationTag,
    amount_cents: priceCents,
    currency
  }), { headers: { 'Content-Type': 'application/json' } });
}

// Check purchase status
async function getPurchaseStatus(request: Request, env: Env, id: string): Promise<Response> {
  const purchase = await env.DB.prepare('SELECT id, status, currency, price_cents, address, destination_tag FROM purchases WHERE id = ?').bind(id).first();
  if (!purchase) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify(purchase), { headers: { 'Content-Type': 'application/json' } });
}
eturn new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const results = await env.DB.prepare(
    'SELECT s.id, s.creator_id, u.username as creator_username, s.status, s.started_at FROM subscriptions s JOIN users u ON u.id = s.creator_id WHERE s.user_id = ?'
  ).bind(userId).all();
  return new Response(JSON.stringify(results.results ?? []), { headers: { 'Content-Type': 'application/json' } });
}

}

export default {
  fetch: handler
};
