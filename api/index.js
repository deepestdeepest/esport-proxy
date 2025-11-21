// ✅ Simple Esport API Proxy for PandaScore and others
// Works perfectly on Vercel

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    // 1️⃣ Mindkét query paraméter formátumot kezeli (új + régi)
    const target = req.query.target || req.query.url;

    if (!target || !target.startsWith("https://")) {
      return res
        .status(400)
        .json({ error: "Invalid or missing ?target= URL parameter" });
    }

    // 2️⃣ Egységes fejlécek
    const headers = {
      "User-Agent": "Mozilla/5.0 (compatible; EsportProxy/2.0; +https://vercel.com)",
      Accept: "application/json, text/html;q=0.9,*/*;q=0.8",
    };

    // 3️⃣ Külső lekérés
    const response = await fetch(target, { headers });
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Remote API error ${response.status}` });
    }

    // 4️⃣ Ha JSON, visszaadjuk JSON-ként
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    // 5️⃣ Egyéb esetben szövegként (HTML fallback)
    const text = await response.text();
    return res.status(200).send(text);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Proxy internal error", details: err.message });
  }
};
