import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { PROTOCOLOS, type Protocolo } from "../../src/lib/protocolos";
import { FAMILIAS } from "./identidade";
import { n1 } from "./n1-nutricao-deficit";

/**
 * O gerador dos protocolos em PDF.
 *
 *   npx playwright test -c playwright.protocolos.config.ts
 *
 * Cada protocolo marcado `pronto: true` no catálogo é construído em HTML,
 * impresso pelo Chromium e conferido. As conferências não são decoração:
 *
 *  · As fontes têm de estar carregadas no momento da impressão. Um
 *    `@font-face` que ainda não chegou produz um PDF em Georgia — e isso
 *    não falha, só sai fora da marca. É o defeito mais provável aqui e o
 *    mais difícil de notar numa revisão rápida.
 *  · Nenhuma folha pode transbordar. As folhas têm altura fixa de 297 mm
 *    e `overflow: hidden`, então conteúdo a mais não empurra página nova:
 *    é cortado em silêncio. Uma tabela que cresceu uma linha levaria o
 *    rodapé para fora da folha sem nenhum sinal.
 *  · O PDF tem de ter o número de páginas que o documento declara.
 */

/* CommonJS: o runner do Playwright transpila para lá, onde não existe
   `import.meta`. */
const RAIZ = join(__dirname, "..", "..");
const SAIDA = join(RAIZ, "protocolos");
const INTERMEDIARIO = join(SAIDA, "html");
const PROVAS = join(SAIDA, "provas");

/**
 * A marca, para impressão.
 *
 * O endereço é escrito como se lê em voz alta, sem protocolo: o PDF é
 * impresso e ninguém digita "https://". E não vem de `content.ts` de
 * propósito — lá o endereço cai para localhost quando não há ambiente
 * definido, e um protocolo com "localhost:3000" no rodapé é um protocolo
 * que já saiu para um cliente.
 */
const MARCA = {
  monograma: "CS",
  nome: "Carlos Seiti",
  assinatura: "Evolução com propósito",
  site: "carlosseiti.com",
};

/** Mês e ano da edição — é o que datará uma revisão futura. */
function edicao(): string {
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const hoje = new Date();
  return `Edição de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
}

/** Os construtores, por código do catálogo. */
const CONSTRUTORES: Record<string, () => string> = {
  N1: () => n1({ marca: MARCA, quando: edicao() }),
};

/**
 * Quantas páginas o PDF tem, contadas no próprio ficheiro.
 *
 * Conta objetos `/Type /Page`, e não o `/Count` do nó `/Pages`. O
 * `/Count` parecia a leitura óbvia e está errada: o Chromium escreve a
 * árvore de páginas aninhada, com nós intermédios que têm cada um o seu
 * `/Count` — num documento de 11 folhas aparecem `/Count 8`, `/Count 3` e
 * só depois `/Count 11`. Quem lê o primeiro recebe o tamanho de uma
 * subárvore e acredita que o PDF ficou incompleto.
 *
 * O lookahead negativo é o que separa `/Type /Page` de `/Type /Pages`.
 */
function paginas(caminho: string): number {
  const bruto = readFileSync(caminho, "latin1");
  const objetos = bruto.match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;

  /*
   * Zero não é um PDF vazio — é esta leitura a deixar de funcionar, o que
   * aconteceria se uma versão futura do Chromium passasse a comprimir os
   * objetos em `/ObjStm`. Falhar aqui é melhor que devolver 0 e fazer o
   * teste acusar o documento.
   */
  if (objetos === 0) {
    throw new Error(
      `não consegui contar páginas em ${caminho} — ` +
        "o PDF pode estar com os objetos comprimidos (/ObjStm)",
    );
  }

  return objetos;
}

test.beforeAll(() => {
  mkdirSync(SAIDA, { recursive: true });
  mkdirSync(INTERMEDIARIO, { recursive: true });
});

const aGerar = PROTOCOLOS.filter((p) => p.pronto);

test("o catálogo e os construtores concordam", () => {
  /*
   * Um protocolo marcado como pronto sem construtor seria anunciado na
   * área de entrega e daria 404 ao ser clicado — a pior ordem possível
   * para descobrir o problema.
   */
  const semConstrutor = aGerar.filter((p) => !CONSTRUTORES[p.codigo]);
  expect(
    semConstrutor.map((p) => p.codigo),
    "protocolos marcados pronto:true sem construtor",
  ).toEqual([]);

  const semCatalogo = Object.keys(CONSTRUTORES).filter(
    (codigo) => !aGerar.some((p) => p.codigo === codigo),
  );
  expect(
    semCatalogo,
    "construtores sem entrada pronto:true no catálogo",
  ).toEqual([]);
});

for (const protocolo of aGerar) {
  test(`${protocolo.codigo} — ${protocolo.titulo}`, async ({ page }) => {
    const html = CONSTRUTORES[protocolo.codigo]();

    const nomeHtml = protocolo.arquivo.replace(/\.pdf$/, ".html");
    writeFileSync(join(INTERMEDIARIO, nomeHtml), html, "utf8");

    await page.setContent(html, { waitUntil: "load" });

    // 1 · As fontes da marca chegaram?
    const fontes = await page.evaluate(async (familias: readonly string[]) => {
      await document.fonts.ready;
      return familias.map((familia) => document.fonts.check(`12pt "${familia}"`));
    }, FAMILIAS);

    expect(fontes, `fontes em falta: ${FAMILIAS.join(", ")}`).toEqual(
      FAMILIAS.map(() => true),
    );

    /*
     * 2 · Alguma folha transbordou?
     *
     * O relatório traz a decomposição por bloco, e não só o excesso. Sem
     * isso, corrigir um transbordo é tirar uma frase, gerar outra vez, e
     * repetir — e frase curta demais estraga o texto mais depressa do que
     * o transbordo. Com a decomposição vê-se logo qual tabela é que não
     * cabe.
     */
    const transbordos = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>(".folha"))
        .map((folha, i) => ({
          folha: i,
          excesso: folha.scrollHeight - folha.clientHeight,
          blocos: Array.from(folha.querySelector(".corpo")?.children ?? []).map(
            (bloco) =>
              `${Math.round(bloco.getBoundingClientRect().height)}px ${
                bloco.className || bloco.tagName.toLowerCase()
              }`,
          ),
        }))
        .filter((f) => f.excesso > 1),
    );

    expect(
      transbordos,
      "folhas cujo conteúdo foi cortado (excesso em px além dos 297 mm)",
    ).toEqual([]);

    // 3 · Imprimir.
    const caminho = join(SAIDA, protocolo.arquivo);
    await page.pdf({
      path: caminho,
      printBackground: true,
      // O tamanho vem do `@page` do CSS, não de um parâmetro aqui: a
      // folha de estilo é que sabe que o documento é A4.
      preferCSSPageSize: true,
    });

    // 4 · Saiu um PDF com o número de folhas do documento?
    const esperadas = await page.evaluate(
      () => document.querySelectorAll(".folha").length,
    );

    expect(paginas(caminho), "páginas no PDF").toBe(esperadas);
    expect(statSync(caminho).size).toBeGreaterThan(40_000);

    /*
     * 5 · Provas visuais, a pedido.
     *
     *   PROVAS=1 npx playwright test -c playwright.protocolos.config.ts
     *
     * Os testes acima garantem que nada foi cortado e que as fontes estão
     * lá. Não garantem que está bem composto — uma tabela desalinhada ou
     * uma unidade sozinha no fim da linha passam em todos eles. Para isso
     * é preciso olhar, e uma folha PNG por página é mais rápido de rever
     * do que abrir o PDF e navegar.
     */
    if (process.env.PROVAS) {
      const pasta = join(PROVAS, protocolo.codigo.toLowerCase());
      mkdirSync(pasta, { recursive: true });

      const folhas = await page.locator(".folha").all();
      for (let i = 0; i < folhas.length; i++) {
        await folhas[i].screenshot({
          path: join(pasta, `folha-${String(i).padStart(2, "0")}.png`),
          scale: "css",
        });
      }
    }

    anunciar(protocolo, caminho, esperadas);
  });
}

function anunciar(protocolo: Protocolo, caminho: string, folhas: number) {
  const kb = Math.round(statSync(caminho).size / 1024);
  console.log(
    `  ${protocolo.codigo}  ${protocolo.arquivo}  ${folhas} folhas  ${kb} kB`,
  );
}
