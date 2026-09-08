/* Registra ate onde a sessao chegou no quiz.
 *
 * Existe porque o Meta nao serve pra isso: eventos por tela sao descartados
 * por serem muitos nomes distintos de baixo volume, e a atribuicao do pixel
 * nao casa com os cliques. Aqui o dado e nosso, exato e imediato.
 *
 * Grava o ESTADO da sessao (indice maximo + acoes), nao cada tela. A primeira
 * versao fazia uma escrita por tela e queimou a cota de escrita do Vercel Blob
 * em um dia (08/09/2026): 10 telas viravam 10 escritas, e o plano Hobby da
 * 2.000 por mes. Agora e uma escrita por sessao, sobrescrita no mesmo lugar.
 *
 * Storage: usa Upstash Redis quando configurado (feito pra contador, cota
 * diaria alta) e cai no Blob quando nao ha Redis.
 */
const BLOB = "https://blob.vercel-storage.com";

const limpo = (v, max) => String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, max);
const limpoId = (v, max) => String(v || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, max);

async function noRedis(chave, valor) {
  const url = process.env.KV_REST_API_URL, tok = process.env.KV_REST_API_TOKEN;
  if (!url || !tok) return false;
  // 40 dias: o painel olha no maximo 28
  const r = await fetch(`${url}/set/${encodeURIComponent(chave)}?EX=3456000`, {
    method: "POST",
    headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" },
    body: JSON.stringify(valor)
  });
  if (!r.ok) throw new Error("redis HTTP " + r.status);
  return true;
}

async function noBlob(chave, valor) {
  const tok = process.env.BLOB_READ_WRITE_TOKEN;
  if (!tok) throw new Error("sem storage configurado");
  const r = await fetch(`${BLOB}/?pathname=${encodeURIComponent(chave)}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${tok}`,
      "x-api-version": "9",
      "x-add-random-suffix": "0",
      "x-allow-overwrite": "1",
      "x-content-type": "application/json",
      "x-cache-control-max-age": "60"
    },
    body: JSON.stringify(valor)
  });
  if (!r.ok) throw new Error("blob HTTP " + r.status);
  return true;
}

module.exports = async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ erro: "use POST" });

  let c = req.body;
  if (typeof c === "string") { try { c = JSON.parse(c); } catch { c = {}; } }
  c = c || {};

  // sessao de teste ganha prefixo proprio, pra poder ser apagada sem levar
  // trafego real junto
  const sessao = (c.teste ? "zzteste" : "") + limpo(c.s, 16);
  if (!sessao) return res.status(400).json({ erro: "falta a sessao" });

  const dia = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
  const dados = {
    i: Math.min(Math.max(parseInt(c.i, 10) || 0, 0), 99),
    t: limpoId(c.t, 24) || "tela",
    f: limpo(c.f, 12) || "direto",
    c: String(c.c || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 28) || "sem",
    a: Array.isArray(c.a) ? c.a.map(n => parseInt(n, 10)).filter(n => n >= 97 && n <= 99) : [],
    em: Date.now()
  };

  try {
    const chave = `quiz/${dia}/${sessao}`;
    const usouRedis = await noRedis(chave, dados);
    if (!usouRedis) await noBlob(chave, dados);
    res.setHeader("cache-control", "no-store");
    return res.status(204).end();
  } catch (e) {
    // medir nunca pode atrapalhar quem esta respondendo o quiz
    return res.status(202).json({ aviso: String(e.message || e) });
  }
};
