export default async function handler(req, res) {
  let target = req.query.url || req.body?.url;

  if (!target) {
    res.status(400).send("Missing ?url= parameter");
    return;
  }

  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type") || "text/plain";
    const body = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", contentType);

    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
}
