"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarSupabaseServer } from "@/lib/supabase/server";

export async function atualizarPerfil(formData: FormData) {
  const supabase = await criarSupabaseServer();
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?retorno=/minha-conta");

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    nome: String(formData.get("nome") || "").trim().slice(0, 120) || null,
    whatsapp: String(formData.get("whatsapp") || "").trim().slice(0, 30) || null,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/minha-conta");
}

export async function sair() {
  const supabase = await criarSupabaseServer();
  await supabase?.auth.signOut();
  redirect("/");
}
