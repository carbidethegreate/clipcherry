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
  // TODO: implement upload, purchase, subscription, messages, etc.
  if (pathname.startsWith('/api')) {
    return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('CLIPcherry API', { headers: { 'Content-Type': 'text/plain' } });
}

export default {
  fetch: handler
};
