import fetch from "node-fetch";
import { parse } from "node-html-parser";

export default async function handler(req, res) {
  let target = req.query.url || req.body?.url;
  if (!target) return res.status(400).send("Missing ?url= parameter");

  if (!/^https?:\/\//i.test(target)) target = "https://" + target;

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type");

    let body = await response.text();

    // If HTML, rewrite URLs to go through proxy
    if (contentType && contentType.includes("text/html")) {
      const root = parse(body);

      // Rewrite <script src>, <link href>, <img src>
      root.querySelectorAll("script[src], link[href], img[src]").forEach(el => {
        const attr = el.tagName === "LINK" ? "href" : "src";
        const url = el.getAttribute(attr);
        if (url && !url.startsWith("http")) return; // skip relative
        el.setAttribute(attr, `/api/proxy?url=${encodeURIComponent(url)}`);
      });

      body = root.toString();
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
}
