// Simple Esport API Proxy for PandaScore and others
// Deploy to Vercel

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const target = req.query.target;

    if (!target || !target.startsWith("https://")) {
      return res.status(400).json({ error: "Invalid or missing ?target= URL" });
    }

    const headers = {
      "User-Agent": "Mozilla/5.0 (compatible; EsportProxy/1.0)",
      "Accept": "application/json, text/html;q=0.9,*/*;q=0.8",
    };

    const response = await fetch(target, { headers });
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Remote API error ${response.status}` });
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    const text = await response.text();
    return res.status(200).send(text);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Proxy error", details: err.message });
  }
};
