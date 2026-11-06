/**
 * A identidade dos protocolos em PDF.
 *
 * Os PDFs não reaproveitam o CSS do site, e isso é deliberado: o site é
 * um documento elástico de largura desconhecida, e um protocolo é uma
 * folha A4 de 210 por 297 milímetros que alguém vai imprimir e deixar na
 * cozinha. São dois problemas de layout diferentes, e tentar servir os
 * dois com a mesma folha de estilo costuma estragar o mais rígido.
 *
 * O que é partilhado é o que define a marca: as cores do CS Branding
 * Book, as duas tipografias e o fio de ouro. Esses valores estão abaixo
 * com os mesmos códigos de `globals.css`.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

/*
 * `__dirname` e não `import.meta.url`: o runner do Playwright transpila
 * estes módulos para CommonJS, onde `import.meta` é erro de sintaxe.
 */
const AQUI = __dirname;

/* ============================================================
   TIPOGRAFIA
   ============================================================ */

/**
 * As fontes vão embutidas em base64, não referenciadas por URL.
 *
 * Duas razões. A primeira é que o Chromium precisa de as ter carregadas
 * antes de imprimir: um `@font-face` que ainda está a descarregar quando
 * o PDF é gerado produz um documento em Georgia — e o pior é que isso não
 * falha, só sai fora da marca. A segunda é que o HTML intermédio fica
 * autossuficiente, o que o torna abrível no navegador para conferir.
 *
 * São ficheiros variáveis (um só por família cobre 400 a 700), guardados
 * em `fontes/` e obtidos uma vez do Google Fonts. Subconjunto latino, que
 * cobre o português inteiro.
 */
function fonte(arquivo: string): string {
  const bytes = readFileSync(join(AQUI, "fontes", arquivo));
  return `data:font/woff2;base64,${bytes.toString("base64")}`;
}

function faces(): string {
  const garamond = fonte("eb-garamond.woff2");
  const garamondItalico = fonte("eb-garamond-italic.woff2");
  const inter = fonte("inter.woff2");

  return [
    "@font-face{font-family:\"EB Garamond\";font-style:normal;font-weight:400 700;",
    `src:url(${garamond}) format("woff2")}`,
    "@font-face{font-family:\"EB Garamond\";font-style:italic;font-weight:400 700;",
    `src:url(${garamondItalico}) format("woff2")}`,
    "@font-face{font-family:\"Inter\";font-style:normal;font-weight:400 700;",
    `src:url(${inter}) format("woff2")}`,
  ].join("");
}

/** As famílias que o documento exige. Usado para conferir antes de imprimir. */
export const FAMILIAS = ["EB Garamond", "Inter"] as const;

/* ============================================================
   A FOLHA DE ESTILO
   ============================================================ */

/**
 * Medidas em milímetros, e não em pixels.
 *
 * Numa folha que vai ser impressa o milímetro é a unidade real: a margem
 * de 18 mm existe porque impressora doméstica não alcança os últimos
 * 10 mm da folha, e um corpo a 10,5 pt é o que se lê sem óculos à
 * distância de um balcão de cozinha.
 */
const ESTILO = `
:root {
  --branco: #ffffff;
  --porcelana: #f7f5f2;
  --ouro: #c7a06a;
  --ouro-profundo: #76512e;
  --grafite: #1d1b19;
  --linha: rgba(29, 27, 25, 0.12);
  --tinta-fraca: rgba(29, 27, 25, 0.62);
  --serif: "EB Garamond", Georgia, serif;
}

/* O tamanho da folha vem do CSS e o gerador é instruído a respeitá-lo
   (preferCSSPageSize). Margem zero aqui porque cada folha controla o seu
   recuo: a capa sangra até à borda, o interior não. */
@page {
  size: A4;
  margin: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  /* Sem isto o Chromium descarta fundos ao imprimir e a capa escura sai
     branca com texto branco. */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  font-family: "Inter", sans-serif;
  font-size: 10.5pt;
  line-height: 1.55;
  color: var(--grafite);
  background: var(--branco);
  -webkit-font-smoothing: antialiased;
}

.folha {
  position: relative;
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  background: var(--branco);
  page-break-after: always;
  break-after: page;
}

/* A última folha não força página nova: senão o PDF termina com uma folha
   branca, que é o detalhe que denuncia documento gerado às pressas. */
.folha:last-child {
  page-break-after: auto;
  break-after: auto;
}

.folha.escura {
  background: var(--grafite);
  color: var(--porcelana);
}

.corpo {
  padding: 18mm 20mm 16mm;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ── Cabeçalho e rodapé corridos ───────────────────────────── */

.corrido {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 7pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tinta-fraca);
  padding-bottom: 3mm;
  border-bottom: 0.5pt solid var(--linha);
  margin-bottom: 9mm;
}

.rodape {
  margin-top: auto;
  padding-top: 4mm;
  border-top: 0.5pt solid var(--linha);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 7pt;
  letter-spacing: 0.1em;
  color: var(--tinta-fraca);
}

/* ── Hierarquia ────────────────────────────────────────────── */

h1 {
  font-family: var(--serif);
  font-size: 34pt;
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

h2 {
  font-family: var(--serif);
  font-size: 21pt;
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.015em;
  margin-bottom: 5mm;
}

h3 {
  font-size: 8pt;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ouro-profundo);
  margin-bottom: 2.5mm;
}

h4 {
  font-size: 10.5pt;
  font-weight: 600;
  margin-bottom: 1.5mm;
}

p {
  margin-bottom: 3.5mm;
  max-width: 158mm;
}

p:last-child {
  margin-bottom: 0;
}

.conduz {
  font-family: var(--serif);
  font-size: 13pt;
  line-height: 1.5;
  color: var(--tinta-fraca);
  margin-bottom: 7mm;
  max-width: 152mm;
}

.fio {
  height: 1pt;
  background: linear-gradient(90deg, var(--ouro) 0%, rgba(199, 160, 106, 0.12) 100%);
  border: 0;
}

.fio-curto {
  width: 22mm;
  height: 1pt;
  background: var(--ouro);
  border: 0;
  margin: 0 0 6mm;
}

em { font-style: italic; }
strong { font-weight: 600; }

/* ── Blocos ────────────────────────────────────────────────── */

.secao { margin-bottom: 7mm; }
.secao:last-child { margin-bottom: 0; }

.nota {
  padding: 5mm 6mm;
  background: var(--porcelana);
  border-left: 1.5pt solid var(--ouro);
  font-size: 9.5pt;
  line-height: 1.5;
}

.nota p { max-width: none; margin-bottom: 2.5mm; }

.cartao {
  padding: 5mm 6mm;
  border: 0.5pt solid var(--linha);
  background: var(--branco);
}

/* Cartão escuro: a cor vai na própria regra, não numa utility, porque
   aqui não há Tailwind nem cascata de camadas para perder. */
.escuro {
  padding: 5mm 6mm;
  background: var(--grafite);
  color: var(--porcelana);
}

.escuro h3 { color: var(--ouro); }
.escuro .num, .escuro td { border-color: rgba(247, 245, 242, 0.16); }

.grade { display: grid; gap: 4mm; }
.g2 { grid-template-columns: 1fr 1fr; }
.g3 { grid-template-columns: 1fr 1fr 1fr; }

/* ── Listas ────────────────────────────────────────────────── */

ul, ol {
  margin: 0 0 3.5mm 0;
  padding-left: 5mm;
}

li {
  margin-bottom: 1.8mm;
  padding-left: 1mm;
}

li::marker { color: var(--ouro-profundo); }

ul.limpa { list-style: none; padding-left: 0; }

ul.limpa li {
  padding-left: 6mm;
  position: relative;
}

ul.limpa li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 2.2mm;
  width: 3mm;
  height: 1pt;
  background: var(--ouro);
}

/* ── Tabelas ───────────────────────────────────────────────── */

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
}

/*
 * Largura fixa só onde há colunas declaradas.
 *
 * É o que mantém tabelas empilhadas na mesma folha com as colunas
 * alinhadas entre si. Aplicar isto a todas as tabelas estragaria as
 * outras: sem colgroup, o layout fixo reparte a largura em partes iguais,
 * e uma coluna de texto corrido ao lado de duas de números passa a ter um
 * terço do espaço.
 */
table:has(colgroup) {
  table-layout: fixed;
}

caption {
  text-align: left;
  font-size: 8pt;
  color: var(--tinta-fraca);
  padding-bottom: 2mm;
}

th {
  text-align: left;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tinta-fraca);
  padding: 0 3mm 2mm 0;
  border-bottom: 1pt solid var(--ouro);
}

td {
  padding: 2mm 3mm 2mm 0;
  border-bottom: 0.5pt solid var(--linha);
  vertical-align: baseline;
}

td:last-child, th:last-child { padding-right: 0; }

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

tr.total td {
  border-bottom: 0;
  border-top: 1pt solid var(--ouro);
  font-weight: 600;
}

/* Rótulo de grupo dentro de uma tabela longa: sem ele, a linha onde as
   proteínas acabam e os carboidratos começam é invisível. */
td.grupo {
  padding-top: 4.5mm;
  padding-bottom: 1.2mm;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ouro-profundo);
  border-bottom: 0.5pt solid var(--linha);
}

/* Campos para preencher à mão: o protocolo é impresso e escrito. */
.vago {
  display: inline-block;
  min-width: 18mm;
  border-bottom: 0.5pt solid var(--linha);
}

td.vago-celula {
  height: 6.8mm;
  background: var(--porcelana);
}
`;

/* ============================================================
   PÁGINAS
   ============================================================ */

export type Marca = {
  monograma: string;
  nome: string;
  assinatura: string;
  site: string;
};

/** A capa — a única folha que sangra e a única escura. */
export function capa(dados: {
  marca: Marca;
  codigo: string;
  titulo: string;
  subtitulo: string;
  programa: string;
  quando: string;
}): string {
  return `
<section class="folha escura">
  <div class="corpo" style="padding: 26mm 22mm 20mm">
    <div style="display:flex; justify-content:space-between; align-items:flex-start">
      <div>
        <div style="font-family:var(--serif); font-size:26pt; letter-spacing:0.06em">${dados.marca.monograma}</div>
        <div style="font-size:7pt; letter-spacing:0.24em; text-transform:uppercase; color:var(--ouro); margin-top:1mm">${dados.marca.nome}</div>
      </div>
      <div style="text-align:right; font-size:7.5pt; letter-spacing:0.18em; text-transform:uppercase; color:rgba(247,245,242,0.55); line-height:1.8">
        ${dados.programa}<br />${dados.codigo}
      </div>
    </div>

    <div style="margin-top:auto">
      <hr class="fio" style="margin-bottom:10mm" />
      <h1 style="font-size:44pt; max-width:152mm">${dados.titulo}</h1>
      <p style="font-family:var(--serif); font-size:15pt; line-height:1.45; color:rgba(247,245,242,0.74); margin-top:7mm; max-width:134mm">
        ${dados.subtitulo}
      </p>
    </div>

    <div style="margin-top:20mm; display:flex; justify-content:space-between; align-items:flex-end; font-size:8pt; letter-spacing:0.12em; text-transform:uppercase; color:rgba(247,245,242,0.5)">
      <span>${dados.quando}</span>
      <span style="font-family:var(--serif); font-size:12pt; letter-spacing:0.02em; text-transform:none; color:var(--ouro)">${dados.marca.assinatura}</span>
    </div>
  </div>
</section>`;
}

/** Uma folha de interior, com cabeçalho e rodapé corridos. */
export function folha(dados: {
  corrido: string;
  numero: number;
  total: number;
  site: string;
  conteudo: string;
}): string {
  return `
<section class="folha">
  <div class="corpo">
    <div class="corrido">
      <span>${dados.corrido}</span>
      <span>${dados.numero} / ${dados.total}</span>
    </div>
    ${dados.conteudo}
    <div class="rodape">
      <span>${dados.site}</span>
      <span>Uso pessoal · não substitui avaliação individual</span>
    </div>
  </div>
</section>`;
}

/** Monta o documento completo. */
export function documento(dados: { titulo: string; folhas: string[] }): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${dados.titulo}</title>
<style>${faces()}${ESTILO}</style>
</head>
<body>
${dados.folhas.join("\n")}
</body>
</html>`;
}

/** Número com vírgula decimal — o resto do produto escreve "15,5 %". */
export function n(valor: number, casas = 1): string {
  const texto = valor.toFixed(casas).replace(".", ",");
  return casas > 0 ? texto.replace(/,0+$/, "") : texto;
}

/**
 * Inteiro com ponto de milhar — "1.040 kcal".
 *
 * Escrito à mão, e não com `toLocaleString`, pela mesma razão do resto do
 * produto: o resultado passa a depender dos dados de locale instalados na
 * máquina que gerou o ficheiro, e dois PDFs da mesma edição passariam a
 * poder sair diferentes conforme quem os gerou.
 */
export function milhar(valor: number): string {
  const inteiro = String(Math.round(Math.abs(valor)));
  const sinal = valor < 0 ? "−" : "";
  return sinal + inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
