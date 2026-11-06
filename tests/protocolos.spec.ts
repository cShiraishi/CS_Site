import { expect, test } from "@playwright/test";

import { PROTOCOLOS } from "../src/lib/protocolos";

/**
 * A entrega dos protocolos, pelo lado que decide se o produto é pago.
 *
 * O teste que importa aqui é um só, e todos os outros são variações dele:
 * um visitante sem compra não consegue tirar o PDF deste site por
 * caminho nenhum. É a diferença entre um produto de R$ 47 e um ficheiro
 * que circula num grupo de WhatsApp na primeira semana.
 */

const PRONTO = PROTOCOLOS.find((p) => p.pronto);

test.describe("a rota que serve os PDFs", () => {
  test("recusa quem não está autenticado", async ({ request }) => {
    test.skip(!PRONTO, "nenhum protocolo gerado ainda");

    const resposta = await request.get(`/api/protocolos/${PRONTO!.arquivo}`);

    expect(resposta.status()).toBe(403);
    expect(resposta.headers()["content-type"]).not.toContain("application/pdf");
  });

  /*
   * O nome do ficheiro vem do navegador. Se alguma vez for concatenado a
   * um caminho em disco em vez de procurado no catálogo, estas sequências
   * deixam de devolver 404 — e passam a devolver ficheiros do servidor.
   */
  const travessias = [
    "../.env.local",
    "..%2F..%2F.env.local",
    "....//....//.env.local",
    "%2e%2e%2f%2e%2e%2fpackage.json",
    "/etc/passwd",
  ];

  for (const nome of travessias) {
    test(`não escapa da pasta com "${nome}"`, async ({ request }) => {
      const resposta = await request.get(`/api/protocolos/${nome}`, {
        maxRedirects: 0,
      });

      expect(resposta.status()).not.toBe(200);
      expect(resposta.headers()["content-type"] ?? "").not.toContain("application/pdf");
    });
  }

  test("devolve 404 para um nome fora do catálogo", async ({ request }) => {
    const resposta = await request.get("/api/protocolos/inventado.pdf");
    expect(resposta.status()).toBe(404);
  });

  /*
   * Um protocolo ainda por escrever é 404 e não 403: ele não existe, e
   * dizer "sem acesso" mandaria a pessoa certa procurar um problema de
   * conta que não tem.
   */
  test("devolve 404 para um protocolo ainda não escrito", async ({ request }) => {
    const porEscrever = PROTOCOLOS.find((p) => !p.pronto);
    test.skip(!porEscrever, "todos os protocolos já estão escritos");

    const resposta = await request.get(`/api/protocolos/${porEscrever!.arquivo}`);
    expect(resposta.status()).toBe(404);
  });

  /*
   * O erro que esta suite existe para apanhar se alguém mover os
   * ficheiros para `public/` por conveniência: ali o CDN serve-os sem
   * passar por código nenhum, e a verificação de compra deixa de existir.
   */
  test("os PDFs não são servidos como ficheiros estáticos", async ({ request }) => {
    test.skip(!PRONTO, "nenhum protocolo gerado ainda");

    for (const caminho of [
      `/protocolos/${PRONTO!.arquivo}`,
      `/${PRONTO!.arquivo}`,
    ]) {
      const resposta = await request.get(caminho);
      expect(resposta.status(), caminho).toBe(404);
    }
  });
});

test("a área de entrega manda quem não entrou para o login", async ({ page }) => {
  await page.goto("/programa-90-dias/area");

  await expect(page).toHaveURL(/\/entrar/);
});
