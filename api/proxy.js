export default async function handler(req, res) {
  // Get URL from query string
  let target = req.query.url || req.body?.url;

  if (!target) {
    res.status(400).send("Missing ?url= parameter");
    return;
  }

  // Add https:// if missing
  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }

  try {
    // Fetch the target URL
    const response = await fetch(target);

    // Get content type
    const contentType = response.headers.get("content-type") || "text/plain";

    // Read response body
    const body = await response.text();

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", contentType);

    // Send back fetched content
    res.status(response.status).send(body);

  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
}
