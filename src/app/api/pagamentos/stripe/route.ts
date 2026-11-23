import { NextResponse, type NextRequest } from "next/server";

import { registrarPagamento, type EstadoPedido } from "@/lib/pedidos";
import { eventoStripeValido } from "@/lib/stripe";

/**
 * Webhook da Stripe — o único lugar que declara pago um pedido do Reset.
 *
 * Eventos a assinar no painel (Developers → Webhooks), apontando para
 * https://carlosseiti.com/api/pagamentos/stripe :
 *   · checkout.session.completed            (cartão: já vem pago)
 *   · checkout.session.async_payment_succeeded (Pix/boleto pagos depois)
 *   · checkout.session.async_payment_failed
 *   · charge.refunded
 *
 * O valor é conferido contra o pedido em `registrarPagamento`.
 */
export const dynamic = "force-dynamic";

type Sessao = {
  id: string;
  client_reference_id?: string | null;
  metadata?: Record<string, string> | null;
  payment_status?: string;
  amount_total?: number | null;
  payment_intent?: string | null;
  payment_method_types?: string[];
};

type Cobranca = {
  id: string;
  amount: number;
  payment_intent?: string | null;
  metadata?: Record<string, string> | null;
};

export async function POST(req: NextRequest) {
  const corpo = await req.text();
  if (!(await eventoStripeValido(corpo, req.headers.get("stripe-signature")))) {
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 401 });
  }

  const evento = JSON.parse(corpo) as { type: string; data: { object: unknown } };

  let referencia: string | null | undefined;
  let estado: EstadoPedido | null = null;
  let valor = 0;
  let pagamentoId = "";
  let metodo: string | null = null;

  if (evento.type.startsWith("checkout.session.")) {
    const s = evento.data.object as Sessao;
    referencia = s.client_reference_id ?? s.metadata?.referencia;
    valor = s.amount_total ?? 0;
    pagamentoId = s.payment_intent ?? s.id;
    metodo = s.payment_method_types?.join(",") ?? null;
    if (evento.type === "checkout.session.async_payment_failed") estado = "recusado";
    else if (s.payment_status === "paid") estado = "pago";
    else estado = "pendente"; // Pix/boleto gerado, ainda não pago
  } else if (evento.type === "charge.refunded") {
    const c = evento.data.object as Cobranca;
    referencia = c.metadata?.referencia;
    valor = c.amount;
    pagamentoId = c.payment_intent ?? c.id;
    estado = "reembolsado";
  } else {
    return NextResponse.json({ ok: true });
  }

  if (!referencia || !estado) return NextResponse.json({ ok: true });

  const r = await registrarPagamento({ referencia, pagamentoId, estado, valorCentavos: valor, metodo });
  if ("erro" in r) {
    console.error("[stripe] registro:", r.erro);
    return NextResponse.json({ erro: "falha ao registrar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, mudou: r.mudou });
}
