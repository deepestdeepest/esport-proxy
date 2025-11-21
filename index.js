// ✅ Esport API Proxy — Vercel Serverless Function
// Works with: PandaScore, EGamersWorld, Liquipedia

export default async function handler(req, res) {
  try {
    const { target } = req.query;

    if (!target || !target.startsWith("https://")) {
      return res.status(400).json({ error: "Missing or invalid ?target= parameter" });
    }

    // Dinamikus import - a fetch alapértelmezett Node 18+ verzióban
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EsportProxy/1.0; +https://vercel.com)",
        "Accept": "application/json, text/html;q=0.9,*/*;q=0.8"
      },
      timeout: 15000
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    // Ha JSON-t kaptunk, akkor parse-oljuk
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        return res.status(200).json(json);
      } catch {
        // Ha nem szabályos JSON, küldjük vissza sima szövegként
        return res.status(200).send(text);
      }
    }

    // Ha nem JSON, simán szöveget küldünk vissza
    return res.status(200).send(text);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({
      error: "Internal proxy error",
      details: err.message || "Unknown"
    });
  }
}
