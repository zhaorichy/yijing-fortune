import type { ServerWebSocket } from "bun";

// 简单的代理服务器，用于转发 Kimi API 请求
const server = Bun.serve({
  port: 3001,
  async fetch(request) {
    // 设置 CORS 头
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST" && new URL(request.url).pathname === "/api/chat") {
      try {
        const body = await request.json();
        
        // 转发到 Kimi API
        const response = await fetch("https://api.kimi.com/coding/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-kimi-WH9bxUx5E6aip6ftwHf0PLdA2kZhXVGBf5uvxAixNmo4bqhYdvAvwK3kgPagjty1",
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Proxy server running at http://localhost:${server.port}`);