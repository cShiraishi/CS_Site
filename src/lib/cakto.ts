import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { EstadoPedido } from "./pedidos";

/**
 * Cakto — checkout externo do Reset 21D (Pix, cartão, boleto).
 *
 * A Cakto não cria pedido do nosso lado: quem compra paga no checkout dela
 * e o webhook (`/api/pagamentos/cakto`) é o único lugar que declara o
 * pedido pago. Docs: https://docs.cakto.com.br/conceitos/webhooks
 *
 * Variáveis (servidor):
 *   CAKTO_CHECKOUT_URL      link do checkout do produto na Cakto
 *   CAKTO_WEBHOOK_SECRET    o secret do webhook cadastrado no painel
 *   CAKTO_PRODUCT_ID        (opcional) só aceita eventos deste produto
 */

/** Endereço do checkout com o e-mail já preenchido, ou null se não configurado. */
export function urlCheckoutCakto(email: string): string | null {
  const base = process.env.CAKTO_CHECKOUT_URL;
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("email", email);
    return url.toString();
  } catch {
    return null;
  }
}

function iguais(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * A entrega veio mesmo da Cakto?
 *
 * Preferimos a assinatura do header (`X-Cakto-Signature: v1=<hmac-sha256>`
 * sobre `timestamp.corpo`, com o secret como chave), que não viaja em
 * claro. Sem header, aceitamos o `secret` que a Cakto também põe no corpo.
 * Sem secret configurado, recusa tudo — de propósito.
 */
export function entregaCaktoValida(dados: {
  corpoBruto: string;
  secretNoCorpo: unknown;
  assinatura: string | null;
  timestamp: string | null;
}): boolean {
  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  if (!secret) return false;

  if (dados.assinatura && dados.timestamp) {
    const ts = Number(dados.timestamp);
    if (!Number.isFinite(ts)) return false;
    const segundos = ts > 1e12 ? ts / 1000 : ts;
    if (Math.abs(Date.now() / 1000 - segundos) > 5 * 60) return false;

    const esperado =
      "v1=" + createHmac("sha256", secret).update(`${dados.timestamp}.${dados.corpoBruto}`).digest("hex");
    return dados.assinatura
      .split(",")
      .map((s) => s.trim())
      .some((s) => iguais(s, esperado));
  }

  return typeof dados.secretNoCorpo === "string" && iguais(dados.secretNoCorpo, secret);
}

/** Evento da Cakto → estado do nosso pedido (null = não nos interessa). */
export function estadoDoEventoCakto(evento: string): EstadoPedido | null {
  switch (evento) {
    case "purchase_approved":
      return "pago";
    case "purchase_refused":
      return "recusado";
    case "refund":
    case "chargeback":
      return "reembolsado";
    default:
      return null;
  }
}

/**
 * `data.amount` é um número em reais (ex.: 297 ou 297.0) e pode vir nulo;
 * `data.baseAmount` é o fallback.
 */
export function centavosCakto(amount: unknown, baseAmount: unknown): number | null {
  const v = typeof amount === "number" ? amount : typeof baseAmount === "number" ? baseAmount : null;
  if (v === null || !Number.isFinite(v)) return null;
  return Math.round(v * 100);
}
