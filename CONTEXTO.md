# Contexto — Comunidade da Ju

> Documento de retomada. Reconstruído a partir do código em 07/09/2026 e atualizado no
> mesmo dia, quando o Ju Studio entrou na oferta.

## O que é

Funil de venda em formato de **quiz interativo** para a "Comunidade da Ju" — comunidade
paga que ensina mulheres a monetizar em plataformas de conteúdo adulto por assinatura
(Privacy / OnlyFans). A persona que fala em primeira pessoa no quiz é a **Ju**.

Desde 07/09/2026 a mensalidade inclui também o **Ju Studio**, a ferramenta de geração de
imagem e vídeo, com **5.000 créditos mensais**. Isso mudou o eixo do funil: o quiz não
vende mais só o método, vende a máquina. A dificuldade de fazer IA que não fica "zoada"
deixou de ser a janela de oportunidade e virou a objeção que o produto resolve.

Promessa do topo: *"descubra como garotas comuns estão fazendo até R$8.700 por semana
sem sair de casa e sem acordar cedo"*.

## Onde está tudo

| Coisa | Onde |
|---|---|
| Pasta local | `~/Desktop/comunidade-da-ju` |
| Repo | https://github.com/matheusluswarghi-aloud/comunidadeju (**público**) |
| Vercel | projeto `comunidadeju` (`prj_EyElDEYlDKaR2Dkpjc55CAGOoIx0`) |
| Deploy | `vercel deploy --prod --yes` a partir da raiz |
| Quiz | `index.html` (~1.700 linhas, página única, tudo inline) |
| Ferramenta auxiliar | `ferramenta/index.html` — cópia antiga do MVP do Studio |
| Imagens | `img/` (ver `img/LEIA-ME.txt` com a convenção de nomes) |
| Prints do Studio | `img/studio/*.jpg` (web, 900px) e `img/studio/hd/*.png` (@2x, para criativo) |
| Vídeo do tour | `video/tour.mp4` (19s, 353KB) + `tour.jpg` de poster |

Projeto irmão: `~/Desktop/justudio` — versão standalone do Ju Studio, mesmas fotos de
modelo em `img/modelos/`.

## Oferta e conversão

- **Preço:** **acesso vitalício**, pagamento único. Ancorado em R$497 e fechado em R$97
  via cupom de 80% liberado num pop-up na última etapa. 7 dias de garantia. Inclui a
  comunidade **e** o Ju Studio com 5.000 créditos/mês, que continuam entrando para
  sempre. Sem tabela comparativa de preço com concorrente — decisão explícita.
- **Checkout:** `https://go.perfectpay.com.br/PPU38CQFUMM` — produto vitalício, R$97 à
  vista. Trocado em 07/09/2026 (o `PPU38CQFK13` era a assinatura mensal antiga).
- **Créditos:** 1 foto = 10 créditos, 1 vídeo de 5s = 100. Então 5.000/mês = 500 fotos
  ou 50 vídeos. Renovam todo mês, não acumulam. As constantes vivem no topo do
  `<script>`: `CREDITOS_MES`, `CUSTO_FOTO`, `CUSTO_VIDEO`.
- **Checkout:** PerfectPay `https://go.perfectpay.com.br/PPU38CQFUMM` (constante `CHECKOUT_URL`).
- **Pixel da Meta:** `1583309593342549`. O `InitiateCheckout` foi **removido do quiz** de
  propósito — fica só na PerfectPay, pra não contar duas vezes. O `PageView` tem
  disparo redundante manual com `fbc`/`fbp` porque o `fbevents.js` estava travando a fila.
- Números que aparecem na simulação de ganhos: assinatura R$29,90/mês, pack médio R$80.

## Estrutura do quiz — 27 etapas

`data-step` 0 a 26, todas `<section class="step">` no mesmo HTML:

```
0  lp             8  studio_reveal    16 quebra          24 urgencia
1  q_meta         9  q_modelo         17 depoimentos     25 oferta
2  analise       10  batismo          18 q_tempo         26 fechamento
3  q_dor         11  studio_sim       19 matematica
4  q_trampo      12  studio_video     20 q_sonho
5  espelho       13  creditos         21 projecao
6  historia      14  prova_ju         22 comunidade
7  virada        15  q_medo           23 dentro
```

**A oferta é dividida em duas etapas de propósito:** `oferta` mostra só o que ela leva
(a lista de entregáveis) mais depoimentos em formato de conversa de WhatsApp — bolhas,
áudio com forma de onda, valores sacados, checks azuis (`ZAPS` no script). Nenhum preço
aparece ali. `fechamento` é onde o preço entra.

O bloco do Studio (8, 11, 12, 13) é o que mudou o funil:

- **`studio_reveal`** — "o problema nunca foi a IA, foi a IA mal feita". Comparativo
  lado a lado usando a **mesma** foto de modelo, a da esquerda com filtro de cara-de-IA
  (`saturate/contrast/hue-rotate` no CSS, classe `.vs-item.ruim`). É ilustração e está
  legendado como tal.
- **`studio_sim`** — réplica mobile do Studio, interativa. Ela escolhe cenário, roupa e
  luz em chips reais, o prompt se reescreve sozinho, e ao clicar em gerar nascem 4 fotos
  da modelo que ela batizou enquanto os créditos caem de 5.000 para 4.960. Dispara
  `fbq trackCustom StudioGerou` — sinal de engajamento forte para a campanha.
  **A cena escolhida troca a foto de verdade:** cada chip aponta para um arquivo
  (`<tipo>` = quarto, `-2` academia, `-3` praia, `-4` carro), e os 4 cards são
  enquadramentos daquela foto (`.stu-card.c0` a `.c3`, dois deles espelhados). A roupa
  vem junto da cena, e não como chip próprio, porque as fotos já foram geradas assim —
  escolher "academia" e receber vestido quebraria a demo. Trocar de cena depois de gerar
  rearma o botão: ela gera de novo, vê fotos de outro cenário e os créditos caem outros
  40. Se um arquivo faltar, cai na foto base sem quebrar.
- **`studio_video`** — o `video/tour.mp4`. O `src` só é atribuído quando ela chega na
  etapa (`tocarTour()`), então quem não chega lá nunca baixa o arquivo.
- **`creditos`** — a matemática dos 5.000 créditos.

E o fechamento com cupom:

- **`fechamento`** — mostra R$497 por 1,5s (a âncora precisa existir antes do desconto),
  então o pop-up entra com confete e o selo de 80%. Ao aceitar, o 497 risca, o 97 aparece
  e começa um relógio de 15 minutos.
- **Caminhos alternativos, todos testados:** recusar o cupom deixa o preço em R$497 e
  mostra um botão para resgatar depois; ao expirar, o preço **volta mesmo** para R$497 e
  o timer diz que expirou. O prazo fica em `localStorage` (`quiz_ju_cupom_fim`), então
  recarregar a página não reinicia o relógio.
- Constantes no topo do script: `PRECO_CHEIO`, `PRECO_CUPOM`, `CUPOM_PCT` e
  `CUPOM_MINUTOS` (0 desliga a expiração). Eventos novos no pixel: `CupomAberto` e
  `CupomAplicado`; o cupom e o preço vão como parâmetro na URL do checkout.

A antiga etapa `demo` (step 8, com `rodarDemo`/`venderDemo`) foi **removida**: o
simulador faz o mesmo papel, depois do batismo e com a modelo dela.

Fluxo geral: meta financeira → dor → história da Ju → revelação da ferramenta → ela cria
e batiza a modelo → **usa o Studio** → vê o tour → entende os créditos → prova social →
quebra de objeção → matemática → projeção → comunidade → urgência → oferta.

## Como regravar prints e vídeo

O Studio de captura é `~/Desktop/justudio/index.html` (5 telas: gerar, vídeo, modelos,
agendador, ganhos; `?rec=1` liga o cursor falso e as legendas). Para refazer tudo depois
de mexer no layout:

```bash
cd ~/Desktop/justudio
python3 -m http.server 8080     # deixe rodando
node captura.mjs                # prints + vídeo
node captura.mjs prints         # só os prints
```

O vídeo é gravado em 1180×760 e recortado em 4:5 por cena (`CENAS` no `captura.mjs`),
porque UI de desktop fica ilegível a 350px de largura no celular. As legendas grandes
são desenhadas no DOM e normalizadas pelo zoom de cada recorte.

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

- **O Ju Studio real ainda não existe como produto.** O backend de geração foi feito com
  o Gemini, mas o front definitivo não. O que está em `~/Desktop/justudio` é a versão de
  captura — serve de esqueleto para o produto, e é dele que saem os prints e o vídeo.
  Esse é o próximo trabalho combinado.
- `ferramenta/index.html` é uma cópia antiga do MVP e está desatualizada em relação ao
  `justudio`. Ou sincronizar ou apagar.
- Se ele subir `img/modelos/<tipo>-2.jpg`, `-3` e `-4`, o simulador melhora sozinho —
  passa a mostrar 4 fotos de verdade em vez de 4 enquadramentos da mesma.
- Não existe registro de resultado: nenhum dado de tráfego, CPA ou conversão foi salvo
  na pasta. Se rodou anúncio, os números estão só no Meta Ads / PerfectPay.
- Não há transcript de sessão do Claude Code guardado para esta pasta — este documento
  é a única memória escrita do projeto.
