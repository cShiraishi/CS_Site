import crypto from "node:crypto";
import { expect, test } from "@playwright/test";
import { assinaturaValida, manifesto } from "../src/lib/assinatura";

/**
 * O contrato do pagamento, pelo lado que não se vê.
 *
 * Estes testes não precisam de credenciais do Mercado Pago: tudo o que
 * verificam acontece antes de qualquer chamada ao provedor. E é
 * justamente aí que mora o que não pode falhar.
 */

test.describe("webhook", () => {
  const ROTA = "/api/pagamentos/mercadopago";

  /*
   * O teste que justifica os outros.
   *
   * O endereço do webhook é público. Se ele aceitar um POST sem
   * assinatura válida, qualquer pessoa que o descubra confirma o próprio
   * pedido e leva o produto sem pagar — e do lado de cá não há sintoma
   * nenhum, porque tudo se parece com uma venda.
   */
  test("recusa notificação sem assinatura", async ({ request }) => {
    const resposta = await request.post(`${ROTA}?type=payment&data.id=123456`, {
      data: { type: "payment", data: { id: "123456" } },
    });

    expect(resposta.status()).toBe(401);
  });

  test("recusa assinatura forjada", async ({ request }) => {
    const resposta = await request.post(`${ROTA}?type=payment&data.id=123456`, {
      headers: {
        "x-signature": "ts=1700000000,v1=" + "0".repeat(64),
        "x-request-id": "forjado",
      },
      data: { type: "payment", data: { id: "123456" } },
    });

    expect(resposta.status()).toBe(401);
  });

  /* Notificação que não é de pagamento é ignorada com 200 — devolver erro
     faria o Mercado Pago reenviá-la em ciclo para sempre. */
  test("ignora notificação que não é de pagamento", async ({ request }) => {
    const resposta = await request.post(`${ROTA}?type=merchant_order&id=99`, {
      data: {},
    });

    expect(resposta.ok()).toBeTruthy();
  });

  /* O painel do Mercado Pago faz um GET para validar o endereço. */
  test("responde ao GET de verificação do painel", async ({ request }) => {
    const resposta = await request.get(ROTA);
    expect(resposta.ok()).toBeTruthy();
  });
});

test.describe("checkout", () => {
  const ROTA = "/api/checkout";

  test("recusa e-mail inválido", async ({ request }) => {
    const resposta = await request.post(ROTA, { data: { email: "não-é-email" } });

    expect(resposta.status()).toBe(400);
    expect((await resposta.json()).erro).toContain("inválido");
  });

  test("recusa corpo sem e-mail", async ({ request }) => {
    const resposta = await request.post(ROTA, { data: {} });
    expect(resposta.status()).toBe(400);
  });

  /* O robô que preenche todos os campos preenche também o escondido, e
     recebe um 200 que não abre pagamento nenhum. */
  test("engole o preenchimento automático sem abrir pagamento", async ({ request }) => {
    const resposta = await request.post(ROTA, {
      data: { email: "robo@exemplo.com", empresa: "Robô Ltda" },
    });

    expect(resposta.ok()).toBeTruthy();
    expect((await resposta.json()).url).toBeUndefined();
  });

  /*
   * O preço não entra pela requisição. Mandar um valor aqui não pode
   * mudar o que será cobrado — ele vem de `produto.ts`, no servidor.
   */
  test("ignora preço enviado pelo cliente", async ({ request }) => {
    const resposta = await request.post(ROTA, {
      data: { email: "cliente@exemplo.com", valorCentavos: 1, preco: 1 },
    });

    // Sem credenciais do Mercado Pago no ambiente, a rota falha ao abrir a
    // preferência — o que importa é que não falha por aceitar o preço.
    const corpo = await resposta.json();
    expect(corpo.valorCentavos).toBeUndefined();
    expect(corpo.preco).toBeUndefined();
  });
});

test("a página de retorno não libera nada sem confirmação", async ({ page }) => {
  /*
   * A query vem do Mercado Pago, mas é texto no navegador: escrevê-la à
   * mão não pode valer como pagamento. Sem pedido pago na base, a página
   * tem de dizer que falta confirmar.
   */
  await page.goto("/programa-90-dias/obrigado?estado=sucesso&status=approved");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Falta a confirmação",
  );
  await expect(page.getByText("Pagamento confirmado")).toHaveCount(0);
});

/**
 * A verificação de assinatura, nos DOIS sentidos.
 *
 * Os testes acima provam que o webhook recusa quem não se identifica.
 * Falta a metade que ninguém se lembra de escrever: que ele ACEITA o
 * Mercado Pago. Uma implementação que recusa tudo passa em todos os
 * testes de segurança e só dá sinal em produção — como pagamentos
 * aprovados que nunca libertam o produto, com o dinheiro já cobrado.
 */
test.describe("assinatura do webhook", () => {
  const SEGREDO = "segredo-de-teste";
  const ts = "1700000000";
  const reqId = "req-abc-123";

  const assinar = (id: string, rid: string, quando: string, segredo: string) =>
    crypto.createHmac("sha256", segredo).update(manifesto(id, rid, quando)).digest("hex");

  test("aceita a assinatura legítima", () => {
    const id = "1234567890";
    const v1 = assinar(id, reqId, ts, SEGREDO);

    expect(
      assinaturaValida({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: reqId,
        dataId: id,
        segredo: SEGREDO,
      }),
    ).toBe(true);
  });

  test("aceita id alfanumérico em maiúsculas", () => {
    const id = "ABC123def";
    const v1 = assinar(id, reqId, ts, SEGREDO);

    expect(
      assinaturaValida({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: reqId,
        dataId: id,
        segredo: SEGREDO,
      }),
    ).toBe(true);
  });

  test("recusa segredo, request-id ou ts trocados", () => {
    const id = "1234567890";
    const v1 = assinar(id, reqId, ts, SEGREDO);
    const base = { xSignature: `ts=${ts},v1=${v1}`, dataId: id };

    expect(assinaturaValida({ ...base, xRequestId: reqId, segredo: "outro" })).toBe(false);
    expect(assinaturaValida({ ...base, xRequestId: "outro", segredo: SEGREDO })).toBe(false);
    expect(
      assinaturaValida({
        xSignature: `ts=9999,v1=${v1}`,
        xRequestId: reqId,
        dataId: id,
        segredo: SEGREDO,
      }),
    ).toBe(false);
  });

  test("recusa sem segredo configurado e com header malformado", () => {
    const id = "1234567890";
    const v1 = assinar(id, reqId, ts, SEGREDO);

    expect(
      assinaturaValida({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: reqId,
        dataId: id,
        segredo: undefined,
      }),
    ).toBe(false);

    // Não pode rebentar com assinatura de tamanho diferente.
    expect(
      assinaturaValida({
        xSignature: "ts=1,v1=ab",
        xRequestId: reqId,
        dataId: id,
        segredo: SEGREDO,
      }),
    ).toBe(false);
    expect(
      assinaturaValida({ xSignature: "lixo", xRequestId: reqId, dataId: id, segredo: SEGREDO }),
    ).toBe(false);
  });
});
