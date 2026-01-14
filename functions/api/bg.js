export async function onRequest(context) {
  const { env } = context;

  // 1. 优先使用自定义背景 (env.URL)
  if (env.URL && env.URL.startsWith('http')) {
    return Response.json({ url: env.URL });
  }

  // 2. 默认使用 Bing 每日一图
  try {
    const bingRes = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
    const bingJson = await bingRes.json();
    const bingUrl = 'https://www.bing.com' + bingJson.images[0].url;
    return Response.json({ url: bingUrl });
  } catch (e) {
    return Response.json({ url: '' }); // 前端有默认降级
  }
}
