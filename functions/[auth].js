export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const slug = params.auth; // 获取路径中的密码

  // 验证 env.TOKEN (由 GitHub Secrets 注入)
  if (slug === env.TOKEN) {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <p>Verifying...</p>
        <script>
          // 将密码存入 LocalStorage
          localStorage.setItem('cal_token', '${slug}');
          // 跳转回纯净首页
          window.location.replace('/');
        </script>
      </body>
      </html>
    `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  // 密码错误，直接跳回首页（访客模式）
  return Response.redirect(url.origin, 302);
}
