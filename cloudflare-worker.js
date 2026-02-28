// Cloudflare Worker 代理脚本
// 部署步骤：
// 1. 登录 https://dash.cloudflare.com
// 2. 点击 Workers & Pages
// 3. 创建 Worker
// 4. 粘贴以下代码
// 5. 部署后获得 worker 地址，如：https://your-worker.your-subdomain.workers.dev

export default {
  async fetch(request, env, ctx) {
    // 设置 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        
        // 转发到 Kimi API
        const response = await fetch('https://api.kimi.com/coding/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || '',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};