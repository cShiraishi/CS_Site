import { NextResponse, type NextRequest } from "next/server";

import { centavosCakto, entregaCaktoValida, estadoDoEventoCakto } from "@/lib/cakto";
import { PROGRAMA } from "@/lib/produto";
import { criarSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Webhook da Cakto — confirma (ou desfaz) a compra do Reset 21D.
 *
 * Fluxo: valida a origem → lê o evento → grava o pedido em `pedidos`
 * pelo e-mail do comprador. O app (/resetmetabolico) libera o acesso a
 * quem tem pedido 'pago' com o mesmo e-mail da conta (has_access()).
 *
 * Idempotente por `data.id` (a Cakto reenvia em timeout). Responde 2xx
 * sempre que o problema não é nosso: não-2xx não é reenviado pela Cakto,
 * então 500 só faz sentido para falha de base de dados — e aí o reenvio
 * é manual, pelo painel ("Reenviar evento").
 */
export const dynamic = "force-dynamic";

type Registro = Record<string, unknown>;
const obj = (v: unknown): Registro => (v && typeof v === "object" ? (v as Registro) : {});

export async function POST(req: NextRequest) {
  const corpoBruto = await req.text();

  let corpo: Registro;
  try {
    corpo = obj(JSON.parse(corpoBruto));
  } catch {
    return NextResponse.json({ erro: "corpo inválido" }, { status: 400 });
  }

  if (
    !entregaCaktoValida({
      corpoBruto,
      secretNoCorpo: corpo.secret,
      assinatura: req.headers.get("x-cakto-signature"),
      timestamp: req.headers.get("x-cakto-timestamp"),
    })
  ) {
    console.warn("[cakto] origem inválida");
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const evento = String(corpo.event ?? "");
  const estado = estadoDoEventoCakto(evento);
  if (!estado) return NextResponse.json({ ok: true, ignorado: evento });

  // Webhook V2 manda `data` como lista; V1, como objeto.
  const data = obj(Array.isArray(corpo.data) ? corpo.data[0] : corpo.data);
  const pedidoId = data.id ? String(data.id) : null;
  const email = String(obj(data.customer).email ?? "").trim().toLowerCase();
  const produtoCakto = obj(data.product).id ? String(obj(data.product).id) : null;

  if (!pedidoId || !email.includes("@")) {
    console.warn("[cakto] evento sem id ou e-mail:", evento);
    return NextResponse.json({ ok: true, ignorado: "sem id/e-mail" });
  }

  const produtoEsperado = process.env.CAKTO_PRODUCT_ID;
  if (produtoEsperado && produtoCakto !== produtoEsperado) {
    return NextResponse.json({ ok: true, ignorado: "outro produto" });
  }

  const supabase = criarSupabaseAdmin();
  if (!supabase) return NextResponse.json({ erro: "supabase" }, { status: 500 });

  const valor = centavosCakto(data.amount, data.baseAmount) ?? PROGRAMA.precoCentavos;
  const metodo = data.paymentMethod ? String(data.paymentMethod) : null;
  const mudanca = {
    status: estado,
    metodo,
    pago_em: estado === "pago" ? new Date().toISOString() : null,
  };

  // 1) Evento repetido deste pedido da Cakto → só atualiza.
  const { data: existente, error: erroBusca } = await supabase
    .from("pedidos")
    .select("id, status")
    .eq("provedor", "cakto")
    .eq("provedor_pagamento_id", pedidoId)
    .maybeSingle();
  if (erroBusca) {
    console.error("[cakto] busca:", erroBusca.message);
    return NextResponse.json({ erro: "base" }, { status: 500 });
  }
  if (existente) {
    if (existente.status === estado) return NextResponse.json({ ok: true, mudou: false });
    const { error } = await supabase.from("pedidos").update(mudanca).eq("id", existente.id);
    if (error) return NextResponse.json({ erro: "base" }, { status: 500 });
    return NextResponse.json({ ok: true, mudou: true });
  }

  // 2) Primeiro evento: reaproveita o pedido pendente aberto no nosso
  //    checkout (guarda o plano que a pessoa simulou), se houver.
  const { data: pendente } = await supabase
    .from("pedidos")
    .select("id")
    .eq("provedor", "cakto")
    .eq("produto", PROGRAMA.slug)
    .eq("status", "pendente")
    .is("provedor_pagamento_id", null)
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = pendente
    ? await supabase
        .from("pedidos")
        .update({ ...mudanca, provedor_pagamento_id: pedidoId, valor_centavos: valor })
        .eq("id", pendente.id)
    : await supabase.from("pedidos").insert({
        ...mudanca,
        produto: PROGRAMA.slug,
        email,
        valor_centavos: valor,
        moeda: "BRL",
        provedor: "cakto",
        provedor_pagamento_id: pedidoId,
      });

  if (error) {
    // Corrida entre duas entregas do mesmo evento: a outra já gravou.
    if (error.code === "23505") return NextResponse.json({ ok: true, mudou: false });
    console.error("[cakto] gravação:", error.message);
    return NextResponse.json({ erro: "base" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, mudou: true });
}

/** Resposta simples para o teste de URL do painel. */
export function GET() {
  return NextResponse.json({ ok: true });
}
