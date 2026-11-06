import "server-only";

import { criarSupabaseAdmin } from "./supabase/admin";
import { criarSupabaseServer } from "./supabase/server";

/**
 * O ciclo de vida de um pedido, e a pergunta que ele existe para
 * responder: esta pessoa pode receber o produto?
 *
 * A resposta vem sempre da base de dados, nunca do navegador — nem de um
 * parâmetro na URL de retorno do checkout, que é a forma mais comum de
 * dar um produto digital de graça sem perceber.
 */

export type EstadoPedido =
  | "pendente"
  | "pago"
  | "recusado"
  | "reembolsado"
  | "cancelado";

/** Mapeia o vocabulário do Mercado Pago para o nosso. */
export function estadoDoPagamento(status: string): EstadoPedido {
  switch (status) {
    case "approved":
      return "pago";
    case "refunded":
    case "charged_back":
      return "reembolsado";
    case "cancelled":
      return "cancelado";
    case "rejected":
      return "recusado";
    default:
      // in_process, pending, authorized — o Pix que ainda não foi pago
      // cai aqui, e é por isso que o padrão não é "recusado".
      return "pendente";
  }
}

export async function criarPedido(dados: {
  produto: string;
  email: string;
  valorCentavos: number;
  moeda: string;
  plano?: unknown;
  userId?: string | null;
}): Promise<{ referencia: string } | { erro: string }> {
  const supabase = criarSupabaseAdmin();
  if (!supabase) return { erro: "Supabase não configurado no servidor" };

  const { data, error } = await supabase
    .from("pedidos")
    .insert({
      produto: dados.produto,
      email: dados.email.toLowerCase(),
      valor_centavos: dados.valorCentavos,
      moeda: dados.moeda,
      plano: dados.plano ?? null,
      user_id: dados.userId ?? null,
    })
    .select("referencia")
    .single();

  if (error || !data) return { erro: error?.message ?? "não consegui criar o pedido" };
  return { referencia: String(data.referencia) };
}

/**
 * Confirma (ou recusa) um pedido a partir do que o provedor afirma.
 *
 * Duas defesas aqui, e nenhuma é paranoia:
 *
 *  · O valor pago é conferido contra o valor do pedido. Sem isso, quem
 *    conseguisse criar um pagamento de um real para a nossa referência
 *    levaria o produto por um real.
 *  · Um pedido já pago não é reprocessado para pago. As notificações
 *    chegam repetidas por desenho, e cada reprocessamento seria um
 *    e-mail de entrega a mais para o mesmo cliente.
 */
export async function registrarPagamento(dados: {
  referencia: string;
  pagamentoId: string;
  estado: EstadoPedido;
  valorCentavos: number;
  metodo: string | null;
}): Promise<{ ok: true; mudou: boolean } | { erro: string }> {
  const supabase = criarSupabaseAdmin();
  if (!supabase) return { erro: "Supabase não configurado no servidor" };

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .select("id, status, valor_centavos")
    .eq("referencia", dados.referencia)
    .maybeSingle();

  if (error) return { erro: error.message };
  if (!pedido) return { erro: `pedido ${dados.referencia} não encontrado` };

  if (dados.estado === "pago" && dados.valorCentavos < pedido.valor_centavos) {
    return {
      erro:
        `valor pago (${dados.valorCentavos}) menor que o do pedido ` +
        `(${pedido.valor_centavos}) — não liberado`,
    };
  }

  if (pedido.status === dados.estado) return { ok: true, mudou: false };

  const { error: erroUpdate } = await supabase
    .from("pedidos")
    .update({
      status: dados.estado,
      provedor_pagamento_id: dados.pagamentoId,
      metodo: dados.metodo,
      pago_em: dados.estado === "pago" ? new Date().toISOString() : null,
    })
    .eq("id", pedido.id);

  if (erroUpdate) return { erro: erroUpdate.message };
  return { ok: true, mudou: true };
}

/**
 * Esta pessoa comprou este produto?
 *
 * Usa o cliente com a sessão do utilizador de propósito: quem decide o
 * que ele pode ver é a política de RLS da tabela, e não um `where` que
 * alguém possa esquecer de escrever numa página nova.
 */
export async function temAcesso(produto: string): Promise<boolean> {
  const supabase = await criarSupabaseServer();
  if (!supabase) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("pedidos")
    .select("id")
    .eq("produto", produto)
    .eq("status", "pago")
    .limit(1);

  return Boolean(data?.length);
}

/** Os pedidos da pessoa autenticada, do mais recente para o mais antigo. */
export async function meusPedidos(): Promise<
  { referencia: string; produto: string; status: EstadoPedido; created_at: string }[]
> {
  const supabase = await criarSupabaseServer();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("pedidos")
    .select("referencia, produto, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}
