# Imagens do quiz

Coloque os arquivos nesta pasta com **exatamente** estes nomes.
Aceita `.jpg`, `.jpeg`, `.png` ou `.webp` — o quiz acha sozinho, não precisa mexer no código.
Arquivo que não existir simplesmente não aparece (o placeholder pontilhado continua no lugar).

Os números na frente são a ordem em que a imagem aparece no quiz.

---

## Rosto da Ju

| arquivo | onde aparece | o que é |
|---|---|---|
| `01-ju-perfil` | primeira tela, acima do título | foto de perfil redonda da Ju. opcional, mas dá cara humana logo de cara |
| `07-ju-historia` | etapa "minha história rapidinho" | foto da Ju no ônibus / cansada / clima de rotina pesada |

## Provas de ganho

| arquivo | onde aparece | o que é |
|---|---|---|
| `12-saques-1` até `12-saques-5` | etapa "já faz 4 meses que eu vivo só disso" | prints dos seus saques / extrato. de 1 a 5 imagens, vira galeria |
| `12-dashboard` | mesma etapa, logo abaixo | print do painel de ganhos do Privacy |
| `15-depoimentos-1` até `-6` | etapa "olha o que as meninas fizeram" | prints das conversas com as alunas. de 1 a 6 |
| `20-comunidade-1` até `-6` | etapa "bastidores" | prints do grupo: comemorando, tirando dúvida, postando ganho. de 1 a 6 |

Nas galerias: 1 imagem ocupa a largura toda, 2 ou mais viram grade de duas colunas.
Não precisa subir todas — suba quantas tiver, o quiz monta com o que achar.

## Modelos (pasta `modelos/`)

Uma foto por tipo, **com roupa**, só pra mostrar que a modelo ficou pronta.
Aparece na etapa em que ela dá nome à modelo.

| arquivo | opção escolhida no quiz |
|---|---|
| `modelos/loira` | uma loirinha |
| `modelos/morena` | uma morena |
| `modelos/gordinha` | uma gordinha |
| `modelos/ruiva` | uma ruiva |
| `modelos/madura` | uma coroa |

Formato ideal: vertical ou quadrada (ex: 800x1000). Aparece cortada em retrato.

---

## Depois de subir

```bash
cd ~/Desktop/comunidade-da-ju
vercel deploy --prod --yes
```

Prints têm nome de pessoa, @ ou valor que você não quer expor? Borre antes de subir —
o repositório é público.
