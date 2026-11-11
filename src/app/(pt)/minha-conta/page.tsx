import Link from "next/link";
import { redirect } from "next/navigation";
import { rotas } from "@/lib/content";
import { temAcesso } from "@/lib/pedidos";
import { PROGRAMA } from "@/lib/produto";
import { CURSOS, UI_CURSOS } from "@/lib/cursos";
import { CapaCurso } from "@/components/CapaCurso";
import { criarSupabaseServer } from "@/lib/supabase/server";
import { atualizarPerfil, sair } from "./actions";

export const metadata = { title: "Minha conta | Carlos Seiti" };

export default async function MinhaContaPage() {
  const supabase = await criarSupabaseServer();
  if (!supabase) redirect("/entrar");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?retorno=/minha-conta");
  const [{ data: perfil }, { data: resultados }, comprou] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("calculator_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    temAcesso(PROGRAMA.slug),
  ]);
  /* Produtos comprados que liberam cursos da vitrine. Hoje só existe o
     Reset; um curso novo entra com o seu `produto` em lib/cursos.ts. */
  const liberados = new Set<string>(comprou ? [PROGRAMA.slug] : []);

  return (
    <main className="min-h-screen bg-porcelana px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linha pb-9">
          <div><p className="t-eyebrow text-ouro-profundo">Área privada</p><h1 className="t-title mt-4">Olá, {perfil?.nome?.split(" ")[0] || "bem-vindo"}.</h1><p className="mt-3 text-grafite">{user.email}</p></div>
          <form action={sair}><button className="text-sm text-grafite underline decoration-ouro/60 underline-offset-4">Sair da conta</button></form>
        </div>

        {/* O que a pessoa comprou vem antes do que ela pode editar: quem
            entra aqui depois de pagar está à procura do produto, não do
            formulário de perfil. */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="t-eyebrow text-ouro-profundo">{UI_CURSOS.pt.meusCursos}</p>
            <Link href={rotas.cursos} className="text-sm text-grafite underline decoration-ouro/60 underline-offset-4">
              {UI_CURSOS.pt.verNaVitrine}
            </Link>
          </div>
          <ol className="-mx-5 mt-5 flex snap-x gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0">
            {CURSOS.map((c) => {
              const meu = c.produto ? liberados.has(c.produto) : false;
              const aVenda = c.status === "disponivel";
              const href = meu
                ? `${rotas.programa}/area`
                : c.modulos
                  ? `${rotas.cursos}/${c.slug}`
                  : rotas.cursos;
              return (
                <li key={c.slug} className="w-[60%] shrink-0 snap-start sm:w-[34%] lg:w-auto">
                  <Link href={href} className="group block h-full rounded-2xl outline-none">
                    <CapaCurso
                      tom={c.tom}
                      icone={c.icone}
                      selo={`${UI_CURSOS.pt.modulo} ${c.numero}`}
                      titulo={c.titulo.pt}
                      chip={c.duracao?.pt}
                      texto={c.resultado.pt}
                      bloqueado={!meu}
                      status={meu ? UI_CURSOS.pt.liberado : aVenda ? UI_CURSOS.pt.disponivel : UI_CURSOS.pt.emBreve}
                      acao={meu ? UI_CURSOS.pt.abrir : UI_CURSOS.pt.verDetalhes}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="surface-card bg-white p-7 sm:p-9">
            <p className="t-eyebrow text-ouro-profundo">Seu perfil</p>
            <form action={atualizarPerfil} className="mt-7 grid gap-6">
              <Campo nome="nome" rotulo="Nome" valor={perfil?.nome} />
              <label className="text-xs uppercase tracking-wider text-grafite">E-mail<input type="email" value={user.email || ""} disabled className="mt-2 block w-full border-b border-linha bg-transparent py-3 text-base normal-case tracking-normal text-grafite/60 outline-none" /></label>
              <Campo nome="whatsapp" rotulo="Telefone" valor={perfil?.whatsapp} tipo="tel" />
              <button className="rounded-full bg-grafite px-7 py-3 text-sm text-porcelana transition-colors hover:bg-ouro-profundo">Salvar meus dados</button>
            </form>
          </section>

          <section className="surface-card bg-white p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4"><p className="t-eyebrow text-ouro-profundo">Histórico</p><Link href="/calculadora-de-calorias" className="text-sm text-grafite underline decoration-ouro/60 underline-offset-4">Novo cálculo</Link></div>
            {resultados?.length ? <div className="mt-7 divide-y divide-linha">{resultados.map((r) => <article key={r.id} className="grid grid-cols-3 gap-3 py-5"><div><p className="text-xs text-grafite">Data</p><p className="mt-1 text-sm">{new Date(r.created_at).toLocaleDateString("pt-BR")}</p></div><div><p className="text-xs text-grafite">Meta</p><p className="mt-1 font-display text-xl">{r.target_calories} kcal</p></div><div><p className="text-xs text-grafite">Objetivo</p><p className="mt-1 text-sm capitalize">{r.direction}</p></div></article>)}</div> : <div className="mt-10 border-l border-ouro pl-5"><p className="font-display text-2xl">Seu primeiro resultado aparecerá aqui.</p><p className="mt-3 text-sm leading-relaxed text-grafite">Faça a calculadora uma vez. Da próxima, seus dados já estarão preenchidos.</p></div>}
          </section>
        </div>
      </div>
    </main>
  );
}

function Campo({ nome, rotulo, valor, tipo = "text" }: { nome: string; rotulo: string; valor?: string | number | null; tipo?: string }) {
  return <label className="text-xs uppercase tracking-wider text-grafite">{rotulo}<input name={nome} type={tipo} defaultValue={valor ?? ""} className="mt-2 block w-full border-b border-linha bg-transparent py-3 text-base normal-case tracking-normal outline-none focus:border-ouro" /></label>;
}
