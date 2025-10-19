import cheerio from 'cheerio';

export default async function handler(req, res) {
  let target = req.query.url || req.body?.url;
  if (!target) return res.status(400).send("Missing ?url= parameter");
  if (!/^https?:\/\//i.test(target)) target = "https://" + target;

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type") || "text/html";
    let body = await response.text();

    if (contentType.includes("text/html")) {
      const $ = cheerio.load(body);

      // Rewrite <script>, <link>, <img>, <iframe>
      $('script[src], link[href], img[src], iframe[src]').each((i, el) => {
        const attr = el.tagName === 'link' ? 'href' : 'src';
        const url = $(el).attr(attr);
        if (url && !url.startsWith('/') && !url.startsWith('#')) {
          $(el).attr(attr, `/api/proxy?url=${encodeURIComponent(url)}`);
        }
      });

      body = $.html();
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", contentType);

    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
}
