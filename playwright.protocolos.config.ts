import { defineConfig } from "@playwright/test";

/**
 * Configuração só para gerar os protocolos em PDF.
 *
 * Separada da de testes por dois motivos. O primeiro é que esta não sobe
 * servidor nenhum: os protocolos são documentos estáticos construídos a
 * partir dos módulos de `src/lib`, e esperar pelo `next dev` seria esperar
 * por nada. O segundo é que `npm run test:e2e` não deve escrever
 * ficheiros no repositório — um teste que produz artefactos deixa de
 * poder correr em paralelo consigo mesmo.
 *
 * O runner do Playwright é usado aqui como executor de TypeScript, e isso
 * é a escolha deliberada: ele transpila `.ts` sem configuração e já traz
 * o Chromium que imprime o PDF. A alternativa — tsx ou ts-node — era uma
 * dependência nova para fazer o que já estava instalado.
 */
export default defineConfig({
  testDir: "./scripts/protocolos",
  testMatch: /gerar\.spec\.ts$/,
  reporter: [["list"]],
  // Um protocolo de cada vez: a geração escreve em disco e o tempo total
  // é de segundos.
  workers: 1,
  projects: [{ name: "gerar" }],
});
