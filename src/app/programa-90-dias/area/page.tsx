import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow } from "@/components/ui";
import { rotas } from "@/lib/content";
import { temAcesso } from "@/lib/pedidos";
import { PROGRAMA, precoEmReais } from "@/lib/produto";
import {
  FAMILIAS,
  PROTOCOLOS,
  paraOPrograma,
  type Familia,
  type Protocolo,
} from "@/lib/protocolos";
import type { Modo } from "@/lib/programa";
import type { Experiencia, Local } from "@/lib/treino";
import { criarSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Seus protocolos | Programa 90 Dias",
  /* Área paga: não entra em busca, e os PDFs também não (a rota que os
     serve devolve X-Robots-Tag). */
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/* ============================================================
   O PLANO GUARDADO COM O PEDIDO
   ============================================================ */

type Situacao = { modo: Modo; local: Local; experiencia: Experiencia };

/**
 * Lê a situação de dentro do plano gravado no pedido.
 *
 * O plano é `jsonb`: veio do navegador no momento da compra e pode ter
 * sido gerado por uma versão anterior do motor. Por isso nada aqui
 * confia na forma — se algum campo não for o que se espera, a função
 * devolve `null` e a área mostra os protocolos todos com a explicação de
 * quando cada um se aplica. Um plano antigo nunca deve impedir alguém de
 * abrir o que pagou.
 */
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

/* ============================================================
   A PÁGINA
   ============================================================ */

export default async function Page() {
  const supabase = await criarSupabaseServer();
  if (!supabase) redirect("/entrar");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/entrar?retorno=${rotas.programa}/area`);

  if (!(await temAcesso(PROGRAMA.slug))) return <SemAcesso />;

  /*
   * O plano do pedido mais recente que foi pago. A RLS da tabela já
   * limita o que este cliente consegue ler aos próprios pedidos, então
   * não há `where` de utilizador a escrever — nem a esquecer.
   */
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

  const familias: Familia[] = ["nutricao", "treino", "nucleo"];

  return (
    <>
      <Header />

      <main>
        <section className="bg-porcelana pb-24 pt-32 sm:pb-32 sm:pt-40">
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>{PROGRAMA.nome}</Eyebrow>
              <h1 className="t-display mt-6 text-balance">Seus protocolos.</h1>
              <p className="mt-7 leading-relaxed text-grafite sm:text-lg">
                {minha
                  ? "Estes são os protocolos da sua situação — não a biblioteca inteira. Quem corta não precisa de ler o protocolo de ganho, e um PDF que não se aplica é um PDF que ensina a não abrir os outros."
                  : "Abaixo estão todos os protocolos, com a indicação de quando cada um se aplica. Abra o de nutrição que corresponde ao seu objetivo e o de treino do seu local e experiência."}
              </p>
            </div>

            <div className="mt-16 grid gap-14">
              {familias.map((familia) => {
                const daFamilia = meus.filter((p) => p.familia === familia);
                if (daFamilia.length === 0) return null;

                return (
                  <section key={familia}>
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-linha pb-5">
                      <h2 className="t-title">{FAMILIAS[familia].nome}</h2>
                      <p className="text-sm text-grafite/70">{FAMILIAS[familia].nota}</p>
                    </div>

                    <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                      {daFamilia.map((protocolo) => (
                        <li key={protocolo.codigo}>
                          <Cartao protocolo={protocolo} />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>

            <p className="mt-16 max-w-2xl border-t border-linha pt-7 text-sm leading-relaxed text-grafite/80">
              Os protocolos são seus, sem prazo. Entre com este mesmo e-mail sempre que
              quiser abri-los de novo. Se algum ainda estiver a ser escrito, ele aparece
              aqui assim que sair — não é preciso comprar nada outra vez.
            </p>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Cartao({ protocolo }: { protocolo: Protocolo }) {
  const comum =
    "flex h-full flex-col rounded-sm border border-linha bg-white p-7 transition-colors";

  if (!protocolo.pronto) {
    return (
      <div className={`${comum} opacity-70`}>
        <p className="t-eyebrow text-grafite/50">{protocolo.codigo}</p>
        <h3 className="mt-4 font-display text-2xl leading-snug">{protocolo.titulo}</h3>
        <p className="mt-3 text-sm leading-relaxed text-grafite/80">{protocolo.resumo}</p>
        <p className="mt-auto pt-6 text-xs uppercase tracking-[0.18em] text-grafite/50">
          Em preparação
        </p>
      </div>
    );
  }

  return (
    <a
      href={`/api/protocolos/${protocolo.arquivo}`}
      className={`${comum} group hover:border-ouro`}
      target="_blank"
      rel="noopener"
    >
      <p className="t-eyebrow text-ouro-profundo">{protocolo.codigo}</p>
      <h3 className="mt-4 font-display text-2xl leading-snug">{protocolo.titulo}</h3>
      <p className="mt-3 text-sm leading-relaxed text-grafite/80">{protocolo.resumo}</p>
      <p className="mt-2 text-xs leading-relaxed text-grafite/60">{protocolo.quando}</p>
      <p className="mt-auto pt-6 text-sm font-medium tracking-wide text-grafite transition-colors group-hover:text-ouro-profundo">
        Abrir o PDF →
      </p>
    </a>
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
                Esta área é de quem tem o programa.
              </h1>
              <p className="mt-7 leading-relaxed text-grafite sm:text-lg">
                Não encontrei uma compra deste produto na sua conta. Se você comprou com
                outro e-mail, entre com esse — o acesso segue o e-mail do pagamento.
              </p>
              <div className="mt-9">
                <Link
                  href={rotas.programa}
                  className="inline-flex min-h-12 items-center rounded-full bg-grafite px-8 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-colors hover:bg-ouro-profundo"
                >
                  Ver o programa — {precoEmReais()}
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
