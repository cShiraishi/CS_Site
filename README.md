# carlosseiti.com

Site de consultoria online de treino e dieta — **Carlos Seiti | Nutrição Avançada**.

Construído sobre o *CS Branding Book (2026)*: branco, ouro e precisão.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 — tokens da marca em `src/app/globals.css`
- Server Action para o formulário (`src/app/actions.ts`), envio via Resend
- Animações CSS orientadas por scroll — **zero biblioteca de animação**
- Deploy: Vercel

## Rodar localmente

```bash
npm install
npm run dev
```

> **Atenção:** o projeto está dentro de uma pasta sincronizada pelo OneDrive. O
> OneDrive tenta sincronizar `.next` e `node_modules` e chega a travar arquivos
> em uso, o que faz `next build` falhar com `EPERM`. Se acontecer, pare o dev
> server e rode `rm -rf .next`. O ideal é excluir essas duas pastas da
> sincronização, ou mover o projeto para fora do OneDrive.

## Onde mexer

| Quero mudar… | Arquivo |
|---|---|
| Qualquer texto do site | `src/lib/content.ts` |
| Cores, fontes, linhas, animações | `src/app/globals.css` |
| Dados estruturados (JSON-LD) | `src/lib/jsonld.ts` |
| Ordem das seções | `src/app/page.tsx` |
| Equações e regras da calculadora | `src/lib/calorias.ts` |
| **Livros da biblioteca** | `src/lib/biblioteca.ts` |
| Escala visual de gordura corporal | `src/lib/gordura.ts` |
| Endereço do formulário da consultoria | `marca.formulario` em `src/lib/content.ts` |
| Recortar a tira de níveis de abdômen | `scripts/fatiar-abs.py` |
| **Adicionar um PDF para ler online** | `scripts/preparar-livro.py` |
| Campos do formulário | `src/components/Contato.tsx` + `src/app/actions.ts` |
| Logotipo | `public/brand/` e `src/app/icon.png` |
| Redirects 301, headers, imagens | `next.config.ts` |

**Toda a copy está em `src/lib/content.ts`.** Nenhum componente precisa ser
aberto para trocar texto.

## Testes

```bash
npx playwright test --config=playwright.local.config.ts
```

A config principal usa a porta 3210 com `reuseExistingServer`. Quando outro
projeto já ocupa essa porta, o Playwright testa o site errado sem reclamar —
a config local sobe um servidor exclusivo na 3417 e fecha essa porta de erro.

> O teste `calculadora gera plano a partir dos dados básicos` falha desde antes
> da calculadora de gordura: o campo WhatsApp da captura de plano não chega a
> aparecer para o Playwright. Está fora do escopo daquela ferramenta.

## Movimento

Nada de Framer Motion ou GSAP. O site usa CSS nativo:

| Recurso | Onde |
|---|---|
| `animation-timeline: view()` | `reveal`, `stagger`, `draw-in`, `drift` |
| `animation-timeline: scroll()` | barra de progresso de leitura no header |
| `::details-content` + `interpolate-size` | abertura fluida do FAQ |
| `@view-transition` | transição entre páginas |
| `@starting-style` + `allow-discrete` | entrada e saída do painel da biblioteca |

Tudo está dentro de `@supports` + `prefers-reduced-motion`: sem suporte ou com
movimento reduzido, o conteúdo aparece normalmente. Nenhum listener de scroll,
nenhum JS de animação no bundle.

## Calculadora / planejador

`/calculadora-de-calorias` — ferramenta gratuita, sem cadastro, que serve de
porta de entrada para a consultoria.

Fluxo: dados → peso desejado → plano → macros → distribuição por refeição.

| Etapa | Base |
|---|---|
| Basal | Mifflin-St Jeor (padrão), Harris-Benedict revisada, Katch-McArdle |
| Gasto total | fatores 1,2 a 1,9 conforme atividade |
| Ritmo | 0,75 %/semana para perda, 0,35 %/semana para ganho |
| Conversão | 7 700 kcal por quilo de tecido adiposo |
| Proteína | 2,0 g/kg no corte, 1,8 g/kg nos demais |
| Gordura | 25 % das calorias, com piso de 0,6 g/kg |
| Carboidrato | o que sobra |

**Dois limites de segurança**, em `planejar()`: o déficit nunca passa de 25 % do
gasto total, e o alvo nunca cai abaixo do metabolismo basal. Quando um deles
morde, o ritmo é reduzido e a tela explica por quê — é a posição "sem dietas
extremas" imposta pela própria matemática, não só pela copy.

Toda a lógica está em `src/lib/calorias.ts`, sem nenhuma dependência de
interface. Conferido à mão: homem, 32 anos, 78 kg, 176 cm, moderadamente ativo
→ TMB 1 725, GET 2 674, alvo 2 030 kcal, e a soma das refeições bate exatamente
com o total em kcal e nos três macros.

## Calculadora de gordura corporal

`/calculadora-de-gordura-corporal` — e `/bf`, o atalho para caber na bio e na
legenda do Reels (redirect 307 em `next.config.ts`, que repassa a query string).

É a porta de entrada do tráfego pago. O caminho é: percentual estimado →
escolher o abdômen desejado na escala → calorias, macros e prazo → formulário
da consultoria.

| Etapa | Base |
|---|---|
| Estimativa com fita | Hodgdon & Beckett (Marinha dos EUA), erro padrão de 3,5 pp |
| Estimativa sem fita | Deurenberg, pelo IMC, erro padrão de 5 pp |
| Classificação | Faixas do American Council on Exercise, por sexo |
| Peso alvo | Massa magra mantida: `MM / (1 − %GC alvo)` |
| Calorias e prazo | `planejar()` de `src/lib/calorias.ts`, com os mesmos limites de segurança |

O resultado sai **em faixa**, nunca como número seco — o método não tem
precisão para a segunda casa, e fingir que tem é o que as calculadoras da
internet fazem. O metabolismo usa Mifflin, não Katch-McArdle, mesmo havendo
um %GC em mãos: esse percentual é estimado, e a Katch levaria o erro dele
para dentro do gasto energético.

### A escala visual

`NIVEIS` em `src/lib/gordura.ts`. Os seis degraus masculinos com foto são os
seis painéis da tira de referência, recortados por
`scripts/fatiar-abs.py`, com o percentual que cada um de fato representa
(de ~7 % a ~17 %). Os dois degraus acima (`Médio`, `Acima`) existem porque é
onde está boa parte de quem chega pelo anúncio — e ainda não têm foto:
aparecem como cartão tipográfico.

Para acrescentar as fotos que faltam, ou a tira feminina, corte os painéis em
`public/gordura/` seguindo o padrão `h-<pct>.png` / `m-<pct>.png` e aponte o
campo `figura` do nível. A página lê a pasta no servidor
(`src/lib/gordura-figuras.ts`) e só usa o arquivo se ele existir — sem 404 e
sem imagem quebrada enquanto a coleção não está completa.

```bash
python scripts/fatiar-abs.py tira-masculina.png public/gordura h "17,15,13,11,09,07" 0.08
python scripts/fatiar-abs.py tira-feminina.png  public/gordura m "25,23,21,19,16,13" 0.16
```

Os percentuais vão da esquerda para a direita, na ordem dos painéis. O último
argumento é a folga descartada de cada lado: quanto maior, mais fechado no
abdômen. A montagem feminina é mais apertada que a masculina e precisa de
mais folga para não trazer o braço do painel vizinho.

> **Trocou uma imagem e o site continua mostrando a antiga?** O cache do
> otimizador no Next 16 fica em **`.next/dev/cache/images`** — não em
> `.next/cache/images`. Ele não revalida quando o arquivo em `public/` muda
> com o mesmo nome, e chega a servir a versão velha só em alguns tamanhos do
> `srcset`, o que aparece como foto borrada em certas telas e nítida em
> outras. Pare o dev server, apague essa pasta e suba de novo.

### Atribuição de campanha

`src/lib/campanha.ts` repassa ao formulário os `utm_*` e o `fbclid` que a
visita trouxe, e acrescenta `cs_bf`, `cs_meta`, `cs_sexo` e `cs_kcal` para o
lead não chegar sem contexto no CRM. Sem origem nenhuma na URL, entra
`utm_source=site&utm_medium=calculadora-bf`. Parâmetro de clique não se
inventa: cravar um `fbclid` no código atribuiria todo lead a um clique que
nunca houve.

O endereço do formulário está em `marca.formulario` (`src/lib/content.ts`) e
pode ser trocado por `NEXT_PUBLIC_FORMULARIO_CONSULTORIA` sem mexer no código.

## Biblioteca

`/biblioteca` — trilhas horizontais no padrão de interação da Netflix
(carrossel com scroll-snap, cartão que levanta no hover, painel de detalhe),
mas na paleta grafite e ouro da marca, não no preto e vermelho deles.

**Para adicionar um livro**, acrescente um item em `LIVROS` dentro de
`src/lib/biblioteca.ts`. Só isso — as trilhas, o sitemap, o JSON-LD e a
contagem de títulos se atualizam sozinhos.

```ts
{
  slug: "identificador-unico",
  titulo: "Nome do livro",
  autor: "Autor",
  ano: 2024,                    // opcional
  trilha: "nutricao",           // fundamentos | nutricao | treino | comportamento
  nivel: "Intermediário",       // Introdução | Intermediário | Técnico
  chamada: "Uma linha: o que este livro resolve.",
  porque: "Por que ele está aqui, na primeira pessoa.",
  capa: "/biblioteca/arquivo.jpg",   // opcional
  link: "https://...",               // opcional
  destaque: true,                    // opcional, só um livro
}
```

**Capas:** sem o campo `capa`, o site desenha uma capa tipográfica na
identidade da marca, com um tom derivado do `slug` (estável entre
renderizações). Para usar arte real, coloque o arquivo em
`public/biblioteca/` e aponte em `capa`.

Os dez títulos que já estão lá são um ponto de partida — livros reais, com a
justificativa escrita. Revise e troque pelo que você de fato recomenda.

## Leitura online

`/leitura/<slug>` — o PDF vira um livro que se folheia no navegador, com virada
de página em três dimensões, teclado, tela cheia e download do original.

### Adicionar um livro

Aceita PDF ou Word:

```bash
python scripts/preparar-livro.py "Meu Guia.docx" meu-guia     --titulo "Guia de macros" --subtitulo "Do básico ao ajuste"
```

Arquivo do Word é exportado para PDF pelo próprio Word antes de começar — é o
que preserva a diagramação. Exige Windows com Word instalado.

O script converte cada página em WebP, extrai o texto e escreve o manifesto em
`public/leitura/meu-guia/`. A rota, o sitemap, o JSON-LD e a listagem na
biblioteca aparecem sozinhos — nenhum código precisa mudar.

Opções: `--largura` (padrão 1600 px), `--qualidade` (padrão 82) e
`--sem-download` para não publicar o PDF original.

Requer `pip install pymupdf`.

### Publicar é uma decisão à parte

O script escreve em `public/leitura/`, mas nada ali sobe sozinho: cada livro
entra no repositório de propósito, com `git add public/leitura/<slug>`.


### Por que imagens e não pdf.js

Renderizar PDF no navegador custa cerca de 1 MB de JavaScript. Aqui as páginas
são imagens comuns: passam pela otimização do `next/image` (AVIF/WebP), a
página é estática e o bundle não cresce um byte. O texto de cada página vai
junto no manifesto e é publicado numa camada invisível — leitor de tela e
Ctrl+F continuam funcionando.

### Dois formatos

O script mede a proporção da primeira página e decide:

- **retrato** → página dupla, como um livro aberto, com folhas girando na
  lombada. Capa e contracapa deslocam meia página para o livro abrir centrado.
- **paisagem** → página única virando. Duas páginas 16:9 lado a lado dariam
  algo como 32:9, largo demais para ler.

Em tela estreita o modo duplo cai para página única automaticamente.

O tamanho do livro sai do menor entre a largura disponível e o que a altura da
janela permite, então ele nunca estoura a tela nem distorce.

## Formulário de contato

Sem `RESEND_API_KEY` o formulário funciona, mas só registra o lead no log do
servidor. Para receber por e-mail:

1. Crie a chave em <https://resend.com/api-keys>.
2. Copie `.env.example` para `.env.local` e preencha.
3. Na Vercel, adicione as mesmas variáveis em *Settings → Environment Variables*.

Enquanto o domínio não estiver verificado na Resend, mantenha
`onboarding@resend.dev` como remetente — ele entrega apenas para o e-mail da
conta.

## Deploy na Vercel

```bash
npm i -g vercel
vercel        # preview
vercel --prod # produção
```

Ou conecte o repositório em <https://vercel.com/new> — a Vercel detecta o
Next.js sozinho e cada `git push` vira um deploy.

## SEO — estado da checklist

### Implementado

| Item | Onde |
|---|---|
| `robots.txt` | `src/app/robots.ts` |
| `sitemap.xml` (regenerado a cada build) | `src/app/sitemap.ts` |
| `favicon.ico` 16/32/48/64 + ícone 64 + apple-touch 180 | `src/app/` |
| `manifest.webmanifest` + ícones PWA 192/512/maskable | `src/app/manifest.ts` |
| Página 404 personalizada (`noindex`) | `src/app/not-found.tsx` |
| `<title>` único, 51 caracteres | `src/app/layout.tsx` |
| `<meta description>` única, 154 caracteres | `src/app/layout.tsx` |
| `<link rel="canonical">` | `alternates.canonical` |
| Open Graph completo (title, description, image 1024², url) | `src/app/layout.tsx` |
| Twitter Card `summary_large_image` | `src/app/layout.tsx` |
| `<html lang="pt-BR">` | `src/app/layout.tsx` |
| JSON-LD home: `Person`, `WebSite`, `Service` + `OfferCatalog`, `FAQPage` | `src/lib/jsonld.ts` |
| JSON-LD calculadora: `WebApplication` + `Offer`, `BreadcrumbList` | `src/lib/jsonld.ts` |
| JSON-LD biblioteca: `CollectionPage` + `ItemList` de `Book`, `BreadcrumbList` | `src/lib/jsonld.ts` |
| JSON-LD leitura: `Book` + `readOnlineUrl`, `BreadcrumbList` | `src/lib/jsonld.ts` |
| Breadcrumb visível na calculadora | `src/app/calculadora-de-calorias/page.tsx` |
| Um `<h1>`, hierarquia H2/H3 sem saltos | verificado no navegador |
| `alt` descritivo em 100 % das imagens | — |
| `<nav>`, `<main>`, `<footer>`, `<section>` | — |
| Anchor text descritivo (nenhum "clique aqui") | — |
| AVIF/WebP automático, `width`/`height` definidos (sem CLS) | `next/image` |
| Lazy loading fora da dobra, `priority` só no logotipo do topo | `src/components/Logo.tsx` |
| `next/font` (sem FOUT) | `src/app/layout.tsx` |
| Bundle splitting, Brotli | Next + Vercel |
| URLs minúsculas, sem parâmetros, sem barra final | `next.config.ts` |
| Headers de segurança + cache longo em `/brand` | `next.config.ts` |
| Verificação Search Console / Bing por variável de ambiente | `.env.example` |
| Analytics sem cookies (Plausible ou Umami), opcional | `src/components/Analytics.tsx` |

### Não se aplica a este site

- **Redirects 301** — o site é novo, não há URLs antigas. O lugar de colocá-los
  já está preparado e comentado em `next.config.ts`.
- **hreflang** — só existe versão PT-BR. Se um dia houver EN, entra em
  `alternates.languages`.
- **`SearchAction` no JSON-LD** — o site não tem busca; declarar a caixa de
  pesquisa sem ela é marcação falsa.
- **`Product` / `Offer` com preço** — nenhum preço público. O `Service` já
  declara o catálogo do que está incluso, sem inventar valor. (A calculadora
  usa `Offer` com preço 0, que é verdade.)
- **RSS, paginação, página de autor, datas de publicação** — dependem de blog.

### Depende de você (contas externas)

1. **Google Search Console** — verificar a propriedade e submeter
   `https://carlosseiti.com/sitemap.xml`.
2. **Bing Webmaster Tools** — importa a verificação do Google em dois cliques e
   alimenta o Copilot.
3. **Analytics** — escolher Plausible ou Umami e preencher a variável.

## A verificar antes de publicar

- `marca.email` e `marca.site` em `src/lib/content.ts` estão com valores de
  exemplo — trocar pelos reais.
- Os depoimentos em `resultados.depoimentos` são de exemplo. Substituir por
  feedbacks reais (com autorização de quem os escreveu) antes de ir ao ar.
- O site fala em "consultoria de orientação em treino e nutrição esportiva" e
  não usa o título "nutricionista", que é privativo de profissional inscrito no
  CFN. Se você tiver registro, dá para mudar a copy.

## Regras da marca respeitadas

- Paleta restrita: `#FFFFFF` · `#F7F5F2` · `#C7A06A` · `#8C673F` · `#1D1B19`
- EB Garamond nos títulos, Inter no corpo
- Ouro apenas como ponto de direção, nunca como decoração
- Logotipo em tamanho mínimo de 48 px e respiro de 12,5 % da altura do símbolo
- Linhas de 1 px, diagonais discretas, composições arejadas
- Movimento sempre "orientado para cima" (09 / direção fotográfica)
