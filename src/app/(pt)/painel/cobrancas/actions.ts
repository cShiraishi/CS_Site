"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import {
  COOKIE_PAINEL,
  VALIDADE_PAINEL,
  fichaDaSessao,
  painelLiberado,
  senhaConfere,
} from "@/lib/painel";
import { criarCobrancaRecorrente, desativarCobranca, type LinkCriado } from "@/lib/stripe";

export async function entrarNoPainel(_: unknown, form: FormData): Promise<{ erro?: string }> {
  // Atraso fixo: tentar senhas à mão por esta porta fica caro.
  await new Promise((r) => setTimeout(r, 600));
  if (!senhaConfere(String(form.get("senha") ?? ""))) return { erro: "Senha incorreta." };

  (await cookies()).set(COOKIE_PAINEL, fichaDaSessao(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/painel",
    maxAge: VALIDADE_PAINEL,
  });
  revalidatePath("/painel/cobrancas");
  return {};
}

export async function sairDoPainel() {
  (await cookies()).delete({ name: COOKIE_PAINEL, path: "/painel" });
  revalidatePath("/painel/cobrancas");
}

const Cobranca = z.object({
  cliente: z.string().trim().max(120).optional(),
  email: z.union([z.literal(""), z.string().trim().email("e-mail inválido")]).optional(),
  nome: z.string().trim().min(2, "dê um nome ao plano").max(120),
  descricao: z.string().trim().max(300).optional(),
  valor: z
    .string()
    .trim()
    .transform((v) => Number(v.replace(/\./g, "").replace(",", ".")))
    .pipe(z.number().positive("valor inválido").max(100000)),
  moeda: z.enum(["eur", "brl"]),
  intervalo: z.enum(["day", "week", "month", "year"]),
  aCada: z.coerce.number().int().min(1).max(12),
});

export type EstadoCobranca = { erro?: string; link?: LinkCriado };

export async function criarCobranca(_: unknown, form: FormData): Promise<EstadoCobranca> {
  if (!(await painelLiberado())) return { erro: "Sessão expirada — entre de novo." };

  const r = Cobranca.safeParse(Object.fromEntries(form));
  if (!r.success) return { erro: r.error.issues[0]?.message ?? "dados inválidos" };

  const d = r.data;
  const link = await criarCobrancaRecorrente({
    nome: d.nome,
    descricao: d.descricao || undefined,
    valorCentavos: Math.round(d.valor * 100),
    moeda: d.moeda,
    intervalo: d.intervalo,
    aCada: d.aCada,
    cliente: d.cliente || undefined,
    email: d.email || undefined,
  });

  if ("erro" in link) return { erro: link.erro };
  revalidatePath("/painel/cobrancas");
  return { link };
}

export async function desativar(form: FormData) {
  if (!(await painelLiberado())) return;
  const id = String(form.get("id") ?? "");
  if (!id.startsWith("plink_")) return;
  await desativarCobranca(id);
  revalidatePath("/painel/cobrancas");
}
