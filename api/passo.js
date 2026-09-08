/* Registra que uma sessao chegou a uma tela do quiz.
 *
 * Existe porque o Meta nao serve para isso: eventos personalizados por tela
 * (QZ_00_lp, QZ_01_...) sao descartados por serem muitos nomes distintos de
 * baixo volume, e a atribuicao do pixel ja provou nao casar com os cliques.
 * Aqui o dado e nosso, exato e imediato.
 *
 * Grava um blob vazio cujo NOME carrega tudo:
 *   quiz/<dia>/<sessao>~<indice>~<fonte>~<tela>~<criativo>
 * (separador ~ porque o id da tela tem underscore: studio_reveal)
 * assim o painel monta a curva so listando, sem baixar conteudo nenhum.
 *
 * Sem dependencia: fala com a API do Blob por HTTP, porque o quiz e um site
 * estatico e nao vale adicionar build a ele.
 */
const API = "https://blob.vercel-storage.com";
const limpo = (v, max) => String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, max);
// o id da tela mantem o underscore, que faz parte do nome (studio_reveal)
const limpoId = (v, max) => String(v || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, max);

module.exports = async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ erro: "use POST" });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ erro: "falta BLOB_READ_WRITE_TOKEN" });

  let corpo = req.body;
  if (typeof corpo === "string") { try { corpo = JSON.parse(corpo); } catch { corpo = {}; } }
  corpo = corpo || {};

  // Sessoes de teste ganham prefixo proprio pra poderem ser apagadas sem
  // levar trafego real junto. Aconteceu na madrugada de 08/09: limpei os
  // registros dos meus testes e possivelmente apaguei visitas de verdade,
  // porque nao havia como distinguir uma da outra.
  const sessao = (corpo.teste ? "zzteste" : "") + limpo(corpo.s, 16);
  const indice = Math.min(Math.max(parseInt(corpo.i, 10) || 0, 0), 99);
  const fonte = limpo(corpo.f, 12) || "direto";
  const tela = limpoId(corpo.t, 24) || "tela";
  // criativo que trouxe a visita, pra dar pra cortar a retencao por anuncio
  // mantem o hifen: "leva11-ad09" le melhor que "leva11ad09"
  const criativo = String(corpo.c || "").toLowerCase()
                     .replace(/[^a-z0-9-]/g, "").slice(0, 28) || "sem";
  if (!sessao) return res.status(400).json({ erro: "falta a sessao" });

  // o dia sai em horario de Brasilia, que e como ele le os numeros
  const dia = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
  const nome = `quiz/${dia}/${sessao}~${String(indice).padStart(2, "0")}~${fonte}~${tela}~${criativo}`;

  try {
    const r = await fetch(`${API}/?pathname=${encodeURIComponent(nome)}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "x-api-version": "9",
        "x-add-random-suffix": "0",
        "x-allow-overwrite": "1",
        "x-content-type": "text/plain",
        "x-cache-control-max-age": "60"
      },
      body: "1"
    });
    if (!r.ok) throw new Error("blob HTTP " + r.status);
    res.setHeader("cache-control", "no-store");
    return res.status(204).end();
  } catch (e) {
    // medir nunca pode atrapalhar quem esta respondendo o quiz
    return res.status(202).json({ aviso: String(e.message || e) });
  }
};
