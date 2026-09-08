/* Manda o PageView tambem pelo servidor (Conversions API).
 *
 * Por que: o pixel do navegador e o unico caminho que a landing tinha, e ele
 * falha justamente onde esta o nosso trafego — no navegador embutido do
 * Instagram, com cookie de terceiro bloqueado. O resultado media 42 cliques
 * no link virando 4 landing page views. O checkout ja manda pelo servidor
 * (Hubla); a entrada do funil nao mandava.
 *
 * Deduplicacao: o navegador gera um event_id, manda no parametro `eid` do
 * pixel e no corpo daqui. Chegando os dois com o mesmo id, o Meta entende
 * que e a mesma visita e conta uma vez. Sem isso o PageView dobra e o
 * connect rate passa de 100% — pior que nao ter CAPI nenhuma.
 */
const API = "https://graph.facebook.com/v26.0";

const primeiroIp = (v) => String(v || "").split(",")[0].trim();

module.exports = async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ erro: "use POST" });

  const token = process.env.META_TOKEN;
  const pixel = process.env.META_PIXEL;
  if (!token || !pixel) return res.status(500).json({ erro: "falta META_TOKEN ou META_PIXEL" });

  let c = req.body;
  if (typeof c === "string") { try { c = JSON.parse(c); } catch { c = {}; } }
  c = c || {};

  const eventId = String(c.eid || "").slice(0, 64);
  if (!eventId) return res.status(400).json({ erro: "falta o event_id" });

  const user_data = {
    client_ip_address: primeiroIp(req.headers["x-forwarded-for"]) ||
                       (req.socket && req.socket.remoteAddress) || undefined,
    client_user_agent: req.headers["user-agent"] || undefined,
  };
  // fbp e fbc sao o que o Meta usa pra ligar o evento ao clique no anuncio
  if (c.fbp) user_data.fbp = String(c.fbp).slice(0, 128);
  if (c.fbc) user_data.fbc = String(c.fbc).slice(0, 256);

  const evento = {
    event_name: "PageView",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: String(c.url || "").slice(0, 1000) || undefined,
    user_data,
  };

  const corpo = { data: [evento] };
  if (c.teste) corpo.test_event_code = String(c.teste).slice(0, 40);

  try {
    const r = await fetch(`${API}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const j = await r.json();
    if (!r.ok || j.error) throw new Error((j.error && j.error.message) || ("HTTP " + r.status));

    res.setHeader("cache-control", "no-store");
    return res.status(200).json({ ok: true, recebidos: j.events_received, id: eventId });
  } catch (e) {
    // medir nunca pode derrubar a pagina de venda
    return res.status(202).json({ aviso: String(e.message || e) });
  }
};
