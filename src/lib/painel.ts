import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Acesso ao painel interno — uma senha só, a do Carlos.
 *
 * Não passa pelo Supabase de propósito: o painel não é "a conta de um
 * cliente com mais permissões", é outra porta. Sem `PAINEL_SENHA` no
 * ambiente a página responde 404, então um deploy sem a variável não
 * deixa nada aberto.
 *
 * O cookie guarda um HMAC da senha, não a senha: trocar `PAINEL_SENHA`
 * invalida todas as sessões abertas de uma vez.
 */

export const COOKIE_PAINEL = "cs_painel";
export const VALIDADE_PAINEL = 60 * 60 * 12; // 12 h

export function painelConfigurado() {
  return Boolean(process.env.PAINEL_SENHA);
}

function ficha(senha: string) {
  return crypto.createHmac("sha256", senha).update("painel-cs").digest("hex");
}

function iguais(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function senhaConfere(tentativa: string) {
  const senha = process.env.PAINEL_SENHA;
  if (!senha) return false;
  return iguais(ficha(tentativa), ficha(senha));
}

export function fichaDaSessao() {
  return ficha(process.env.PAINEL_SENHA ?? "");
}

export async function painelLiberado() {
  const senha = process.env.PAINEL_SENHA;
  if (!senha) return false;
  const valor = (await cookies()).get(COOKIE_PAINEL)?.value;
  return Boolean(valor && iguais(valor, ficha(senha)));
}
