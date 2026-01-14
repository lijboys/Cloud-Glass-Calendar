export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const month = url.searchParams.get('month'); // ex: 2026-01
  
  // 获取请求头中的 Token
  const clientToken = request.headers.get('X-Auth-Token');

  // 🔒 鉴权：如果 Token 不对，返回空数组（假装没日记）
  if (clientToken !== env.TOKEN) {
    return Response.json([]); 
  }

  // 🔓 Token 正确，查询数据库
  const { results } = await env.DB.prepare(
    "SELECT date_str, content FROM notes WHERE date_str LIKE ?"
  ).bind(`${month}%`).all();

  return Response.json(results || []);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const clientToken = request.headers.get('X-Auth-Token');

  // 🔒 写入保护：严格验证 Token
  if (clientToken !== env.TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { date, content } = await request.json();

  if (!content || content.trim() === "") {
    // 内容为空则删除
    await env.DB.prepare("DELETE FROM notes WHERE date_str = ?").bind(date).run();
  } else {
    // 插入或更新
    await env.DB.prepare(
      "INSERT INTO notes (date_str, content, updated_at) VALUES (?, ?, ?) ON CONFLICT(date_str) DO UPDATE SET content = ?, updated_at = ?"
    ).bind(date, content, Date.now(), content, Date.now()).run();
  }

  return Response.json({ success: true });
}
