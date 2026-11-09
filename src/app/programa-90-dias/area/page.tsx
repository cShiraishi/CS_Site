import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlataformaReset21D } from "@/components/PlataformaReset21D";
import { Container, Eyebrow } from "@/components/ui";
import { rotas } from "@/lib/content";
import { temAcesso } from "@/lib/pedidos";
import { PROGRAMA, precoEmReais } from "@/lib/produto";
import { PROTOCOLOS, paraOPrograma } from "@/lib/protocolos";
import type { Modo, Perfil } from "@/lib/programa";
import type { Experiencia, Local } from "@/lib/treino";
import { criarSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "CS Performance · Área de Membros | Reset Metabólico 21D",
  /* Área paga: não entra em busca, e os PDFs também não (a rota que os
     serve devolve X-Robots-Tag). */
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/* ============================================================
   O PLANO GUARDADO COM O PEDIDO
   ============================================================ */

type Situacao = { modo: Modo; local: Local; experiencia: Experiencia };

function situacao(plano: unknown): Situacao | null {
  if (!plano || typeof plano !== "object") return null;

  const p = plano as Record<string, unknown>;
  const perfil = p.perfil as Record<string, unknown> | undefined;
  if (!perfil) return null;

  const modos: Modo[] = ["perder", "ganhar", "manter", "recomposicao"];
  const locais: Local[] = ["casa", "academia"];
  const experiencias: Experiencia[] = ["nunca", "voltando", "constante"];

  const modo = modos.find((m) => m === p.modo);
  const local = locais.find((l) => l === perfil.local);
  const experiencia = experiencias.find((e) => e === perfil.experiencia);

  if (!modo || !local || !experiencia) return null;
  return { modo, local, experiencia };
}

function extrairPerfil(plano: unknown): Partial<Perfil> | null {
  if (!plano || typeof plano !== "object") return null;
  const p = plano as Record<string, unknown>;
  if (!p.perfil || typeof p.perfil !== "object") return null;
  return p.perfil as Partial<Perfil>;
}

/* ============================================================
   A PÁGINA (PLATAFORMA CS PERFORMANCE — RESET METABÓLICO 21D)
   ============================================================ */

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ demo?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const isDemo = params?.demo === "1" || params?.demo === "true";

  if (isDemo) {
    return (
      <PlataformaReset21D
        emailUsuario="Participante@carlosseiti.com"
        protocolos={PROTOCOLOS}
        modoDemo
      />
    );
  }

  const supabase = await criarSupabaseServer();
  if (!supabase) {
    return (
      <PlataformaReset21D
        emailUsuario="Participante@carlosseiti.com"
        protocolos={PROTOCOLOS}
        modoDemo
      />
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/entrar?retorno=${rotas.programa}/area`);

  if (!(await temAcesso(PROGRAMA.slug))) return <SemAcesso />;

  const { data: pedido } = await supabase
    .from("pedidos")
    .select("plano")
    .eq("produto", PROGRAMA.slug)
    .eq("status", "pago")
    .order("pago_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  const minha = situacao(pedido?.plano);
  const meus = minha ? paraOPrograma(minha) : PROTOCOLOS;
  const perfilSalvo = extrairPerfil(pedido?.plano);

  return (
    <PlataformaReset21D
      emailUsuario={user.email ?? "Participante"}
      perfilSalvo={perfilSalvo}
      protocolos={meus}
      modoDemo={false}
    />
  );
}

/** Autenticado, mas sem compra deste produto. */
function SemAcesso() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-porcelana pb-24 pt-32 sm:pb-32 sm:pt-40">
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>{PROGRAMA.nome}</Eyebrow>
              <h1 className="t-display mt-6 text-balance">
                Esta área é exclusiva de quem tem o Reset Metabólico 21D.
              </h1>
              <p className="mt-7 leading-relaxed text-grafite sm:text-lg">
                Não encontrei uma compra deste produto na sua conta. Se você comprou com
                outro e-mail, entre com esse — o acesso segue o e-mail do pagamento.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={rotas.programa}
                  className="inline-flex min-h-12 items-center rounded-lg bg-[#00ff66] px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_25px_rgba(0,255,102,0.4)] transition-all hover:bg-[#4be283]"
                >
                  Garantir acesso ao Reset 21D — {precoEmReais()}
                </Link>
                <Link
                  href={`${rotas.programa}/area?demo=1`}
                  className="inline-flex min-h-12 items-center rounded-lg border border-[#00ff66]/50 bg-[#00ff66]/10 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-[#00ff66] transition-all hover:bg-[#00ff66]/20"
                >
                  Explorar preview da plataforma →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
