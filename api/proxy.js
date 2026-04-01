export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const target = decodeURIComponent(url);
    const isTelegram = target.includes('t.me');
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': isTelegram ? 'text/html,application/xhtml+xml,*/*' : 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        ...(isTelegram ? { 'Referer': 'https://t.me/' } : {}),
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const ct = response.headers.get('content-type') || (isTelegram ? 'text/html' : 'text/xml');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=120');
    res.setHeader('Content-Type', ct.includes('charset') ? ct : `${ct}; charset=utf-8`);
    res.status(200).send(text);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
