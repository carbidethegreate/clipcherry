export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/api/ping") {
      return new Response(JSON.stringify({ message: "pong" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Example of writing to KV
    if (pathname === "/api/kv") {
      await env.KV.put("testKey", "testValue");
      const value = await env.KV.get("testKey");
      return new Response(JSON.stringify({ value }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Example of writing to D1
    if (pathname === "/api/d1") {
      // Make sure you have created a table via D1 migrations
      const { results } = await env.DB.prepare("SELECT 1 AS number").all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
