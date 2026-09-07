# Contexto — Comunidade da Ju

> Documento de retomada. Reconstruído a partir do código, do git e dos arquivos da pasta
> em 07/09/2026. Última atividade real do projeto: 26/08/2026.

## O que é

Funil de venda em formato de **quiz interativo** para a "Comunidade da Ju" — comunidade
paga que ensina mulheres a monetizar em plataformas de conteúdo adulto por assinatura
(Privacy / OnlyFans). A persona que fala em primeira pessoa no quiz é a **Ju**.

Promessa do topo: *"descubra como garotas comuns estão fazendo até R$8.700 por semana
sem sair de casa e sem acordar cedo"*.

## Onde está tudo

| Coisa | Onde |
|---|---|
| Pasta local | `~/Desktop/comunidade-da-ju` |
| Repo | https://github.com/matheusluswarghi-aloud/comunidadeju (**público**) |
| Vercel | projeto `comunidadeju` (`prj_EyElDEYlDKaR2Dkpjc55CAGOoIx0`) |
| Deploy | `vercel deploy --prod --yes` a partir da raiz |
| Quiz | `index.html` (~1.260 linhas, página única, tudo inline) |
| Ferramenta auxiliar | `ferramenta/index.html` — "Ju Studio — Gerador de Modelos IA" |
| Imagens | `img/` (ver `img/LEIA-ME.txt` com a convenção de nomes) |

Projeto irmão: `~/Desktop/justudio` — versão standalone do Ju Studio, mesmas fotos de
modelo em `img/modelos/`.

## Oferta e conversão

- **Preço:** R$97/mês, com 7 dias de garantia (devolução sem pergunta).
- **Checkout:** PerfectPay — `https://go.perfectpay.com.br/PPU38CQFK13`
  (constante `CHECKOUT_URL` no `index.html`).
- **Pixel da Meta:** `1583309593342549`. O `InitiateCheckout` foi **removido do quiz** de
  propósito — fica só na PerfectPay, pra não contar duas vezes. O `PageView` tem
  disparo redundante manual com `fbc`/`fbp` porque o `fbevents.js` estava travando a fila.
- Números que aparecem na simulação de ganhos: assinatura R$29,90/mês, pack médio R$80.

## Estrutura do quiz — 22 etapas

`data-step` 0 a 21, todas `<section class="step">` no mesmo HTML:

0 `lp` · 1 `q_meta` · 2 `analise` · 3 `q_dor` · 4 `q_trampo` · 5 `espelho` ·
6 `historia` · 7 `virada` · 8 `demo` · 9 `q_modelo` · 10 `batismo` · 11 `prova_ju` ·
12 `q_medo` · 13 `quebra` · 14 `depoimentos` · 15 `q_tempo` + `matematica` ·
16 `q_sonho` · 17 `projecao` · 18 `comunidade` · 19 `dentro` · 20 `urgencia` ·
21 `oferta`

Lógica do funil: pergunta de meta financeira (R$500 / 1.000 / 2.000 / 5.000+) →
personalização com o número dela → história da Ju → prova social (saques, dashboard,
depoimentos) → quebra de objeção (medo) → matemática dos ganhos → projeção 3 meses →
bastidores da comunidade → urgência → oferta R$97.

A escolha de modelo (`q_modelo` → `batismo`) faz a pessoa **dar um nome à modelo dela**,
e o quiz mostra a foto correspondente de `img/modelos/`: loira, morena, gordinha, ruiva,
madura.

## Convenção das imagens (resumo do LEIA-ME)

Nomes fixos, extensão livre (.jpg/.png/.webp — o carregador acha sozinho). Faltar
arquivo não quebra, só mantém o placeholder.

- `01-ju-perfil` — perfil redondo da primeira tela
- `07-ju-historia` — Ju na rotina pesada
- `12-saques-1` … `12-saques-5` — prints de saque (**numerar sem pular**, para no primeiro buraco)
- `12-dashboard` — painel de ganhos do Privacy
- `15-depoimentos-1` … `-6` — conversas com alunas
- `20-comunidade-1` … `-6` — bastidores do grupo
- `modelos/{loira,morena,gordinha,ruiva,madura}` — vertical/quadrada, ~800x1000, com roupa

⚠️ **O repo é público.** Print com nome de assinante, @ de perfil ou dado bancário
precisa ser borrado antes de subir.

## Histórico do git (o que já foi feito)

```
373b5ee  quiz interativo do funil comunidade da ju
a48625d  expande quiz de 11 para 22 etapas com personalizacao
e9761e0  move o quiz para a raiz do repo
a3d801a  11 ajustes no quiz
3f90e52  carregador automatico de imagens
daf4a8a  aponta o checkout pro link da PerfectPay
8fccfcd  pixel da Meta + carregador de imagens sequencial
a988907  pagina cola no topo no mobile (100dvh, overscroll, scrollRestoration, safe-area)
d2e7644  garante o disparo do PageView do pixel
ffa8058  tira o InitiateCheckout do quiz, fica so na PerfectPay
eaaf147  PageView com parametros de atribuicao (fbc/fbp)
```

## Criativos

`img/ads/criativo-01` a `-06` (feed) e `img/ads/story-9x16/criativo-02` a `-06`
(story). Não há doc de roteiro nem planilha de nomenclatura dentro do projeto.

## Pontas soltas / o que verificar ao retomar

- O `ferramenta/index.html` (Ju Studio) não tem chamada de API no código — é só layout,
  a geração de imagem não foi ligada.
- Não existe registro de resultado: nenhum dado de tráfego, CPA ou conversão foi salvo
  na pasta. Se rodou anúncio, os números estão só no Meta Ads / PerfectPay.
- Não há transcript de sessão do Claude Code guardado para esta pasta — este documento
  é a única memória escrita do projeto.
