import { NextResponse, type NextRequest } from "next/server";

import { assinaturaValida, consultarPagamento } from "@/lib/pagamento";
import { estadoDoPagamento, registrarPagamento } from "@/lib/pedidos";

/**
 * Webhook do Mercado Pago — o único lugar que declara um pedido pago.
 *
 * A página de retorno do checkout NÃO confirma nada: ela é um endereço
 * que a pessoa vê no navegador e pode voltar a abrir, partilhar ou
 * escrever à mão. Quem confirma é esta rota, e só depois de:
 *
 *   1. verificar a assinatura do pedido (senão qualquer POST liberta o
 *      produto);
 *   2. perguntar ao Mercado Pago, com o nosso token, qual é mesmo o
 *      estado daquele pagamento — o corpo da notificação não é fonte;
 *   3. conferir o valor contra o pedido, em `registrarPagamento`.
 *
 * Responde 200 em quase todo o caso. O Mercado Pago reenvia o que não
 * recebeu 2xx, e uma notificação que não nos diz respeito reenviada em
 * ciclo é ruído sem fim. Guardamos o 500 para falha nossa, que é
 * justamente quando vale a pena ser reenviada.
 */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = req.nextUrl;

  /*
   * O id do pagamento chega na query (`data.id`) ou no corpo
   * (`data: { id }`), conforme o tipo de notificação configurada.
   * Aceitar as duas formas evita depender de um detalhe do painel.
   */
  let dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  let tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");

  try {
    const corpo = await req.json();
    if (!dataId && corpo?.data?.id) dataId = String(corpo.data.id);
    if (!tipo && corpo?.type) tipo = String(corpo.type);
  } catch {
    // Notificação sem corpo JSON é normal: a query basta.
  }

  // Só pagamento interessa. `merchant_order` e afins chegam aqui também.
  if (tipo && tipo !== "payment") return NextResponse.json({ ok: true });
  if (!dataId) return NextResponse.json({ ok: true });

  if (
    !assinaturaValida({
      xSignature: req.headers.get("x-signature"),
      xRequestId: req.headers.get("x-request-id"),
      dataId,
    })
  ) {
    console.warn("[webhook] assinatura inválida para", dataId);
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 401 });
  }

  const pagamento = await consultarPagamento(dataId);
  if ("erro" in pagamento) {
    console.error("[webhook] consulta:", pagamento.erro);
    // Falha de rede ou token: vale ser reenviado.
    return NextResponse.json({ erro: "falha ao consultar" }, { status: 500 });
  }

  if (!pagamento.referencia) {
    console.warn("[webhook] pagamento", dataId, "sem external_reference");
    return NextResponse.json({ ok: true });
  }

  const resultado = await registrarPagamento({
    referencia: pagamento.referencia,
    pagamentoId: pagamento.id,
    estado: estadoDoPagamento(pagamento.status),
    valorCentavos: pagamento.valorCentavos,
    metodo: pagamento.metodo,
  });

  if ("erro" in resultado) {
    console.error("[webhook] registro:", resultado.erro);
    return NextResponse.json({ erro: "falha ao registrar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mudou: resultado.mudou });
}

/**
 * O Mercado Pago faz um GET ao guardar a URL no painel, para ver se ela
 * responde. Sem isto, a configuração falha com "endpoint inválido".
 */
export function GET() {
  return NextResponse.json({ ok: true });
}
