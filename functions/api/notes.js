export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const month = url.searchParams.get('month');
  const clientToken = request.headers.get('X-Auth-Token');

  if (clientToken !== env.TOKEN) {
    return Response.json([]); 
  }

  // 修改点：env.DB -> env.db
  const { results } = await env.db.prepare(
    "SELECT date_str, content FROM notes WHERE date_str LIKE ?"
  ).bind(`${month}%`).all();

  return Response.json(results || []);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const clientToken = request.headers.get('X-Auth-Token');

  if (clientToken !== env.TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { date, content } = await request.json();

  if (!content || content.trim() === "") {
    // 修改点：env.DB -> env.db
    await env.db.prepare("DELETE FROM notes WHERE date_str = ?").bind(date).run();
  } else {
    // 修改点：env.DB -> env.db
    await env.db.prepare(
      "INSERT INTO notes (date_str, content, updated_at) VALUES (?, ?, ?) ON CONFLICT(date_str) DO UPDATE SET content = ?, updated_at = ?"
    ).bind(date, content, Date.now(), content, Date.now()).run();
  }

  return Response.json({ success: true });
}
