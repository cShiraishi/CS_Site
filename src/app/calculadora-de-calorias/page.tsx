import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "@/components/Calculadora";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow, Section } from "@/components/ui";
import { calculadora, marca } from "@/lib/content";
import { jsonLdCalculadora } from "@/lib/jsonld";

const titulo = "Calculadora de calorias basais (TMB e gasto diário)";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Calcule sua taxa metabólica basal e o gasto energético diário por Mifflin-St Jeor, Harris-Benedict ou Katch-McArdle. Gratuito, sem cadastro, com faixas de proteína.",
  alternates: { canonical: calculadora.slug },
  openGraph: {
    type: "article",
    url: `${marca.site}${calculadora.slug}`,
    title: `${titulo} | ${marca.nome}`,
    description:
      "Taxa metabólica basal, gasto total e alvos de emagrecimento, manutenção e ganho. Três equações validadas, sem cadastro.",
  },
};

export default function Page() {
  return (
    <>
      <Header />

      <main>
        {/* ── Cabeçalho ─────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-porcelana pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
          <div aria-hidden className="diagonals absolute -right-24 top-10 size-[30rem] opacity-40 [mask-image:radial-gradient(circle,black,transparent_68%)]" />
          <Container>
            {/* Breadcrumb visível — o mesmo caminho que vai no JSON-LD */}
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro-profundo">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-grafite">
                  /
                </li>
                <li aria-current="page" className="text-grafite">
                  Calculadora de calorias
                </li>
              </ol>
            </nav>

            <div className="rise grid items-end gap-12 pb-2 pt-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
              <div className="max-w-2xl">
                <Eyebrow>{calculadora.eyebrow}</Eyebrow>
                <h1 className="t-display mt-7 whitespace-pre-line text-balance">
                  {calculadora.titulo}
                </h1>
                <p className="t-sub mt-7 max-w-xl text-pretty text-grafite">
                  {calculadora.texto}
                </p>
                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-grafite">
                  <span className="flex items-center gap-2"><i className="size-1.5 rounded-full bg-ouro" />Sem cadastro</span>
                  <span className="flex items-center gap-2"><i className="size-1.5 rounded-full bg-ouro" />Resultado imediato</span>
                  <span className="flex items-center gap-2"><i className="size-1.5 rounded-full bg-ouro" />3 equações científicas</span>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div aria-hidden className="absolute -inset-8 rounded-full bg-ouro/10 blur-3xl" />
                <div className="glass-light relative overflow-hidden rounded-[1.75rem] border p-7">
                  <div className="flex items-center justify-between">
                    <span className="t-eyebrow text-ouro-profundo">Prévia do seu plano</span>
                    <span className="flex size-9 items-center justify-center rounded-full bg-grafite text-porcelana">↗</span>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-linha">
                    <div className="bg-white/85 p-5">
                      <p className="text-[10px] uppercase tracking-[.16em] text-grafite">Gasto diário</p>
                      <p className="mt-2 font-display text-3xl">2.674 <small className="font-sans text-xs">kcal</small></p>
                    </div>
                    <div className="bg-grafite p-5 text-porcelana">
                      <p className="text-[10px] uppercase tracking-[.16em] text-ouro">Seu alvo</p>
                      <p className="mt-2 font-display text-3xl">2.030 <small className="font-sans text-xs">kcal</small></p>
                    </div>
                  </div>
                  <div className="mt-7 flex h-24 items-end gap-2 border-b border-linha pb-px">
                    {[36, 52, 44, 68, 59, 78, 88, 72, 94].map((altura, i) => (
                      <span key={i} className="flex-1 rounded-t-sm bg-ouro/30" style={{ height: `${altura}%` }} />
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[.14em] text-grafite">
                    <span>Metabolismo</span><span>Objetivo</span><span>Progresso</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── A ferramenta ──────────────────────────────────── */}
        <Section className="py-10 sm:py-12 lg:py-14">
          <Calculadora />
        </Section>

        {/* ── Como ler o resultado ──────────────────────────── */}
        <Section>
          <div className="max-w-2xl">
            <Eyebrow>Como ler o resultado</Eyebrow>
            <h2 className="t-title reveal mt-7 text-balance">
              Três coisas que o número não diz.
            </h2>
          </div>

          <div className="stagger mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-3">
            {calculadora.comoUsar.map((item, i) => (
              <div key={item.titulo}>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm text-ouro-profundo">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="rule-gold draw-in h-px flex-1" />
                </div>
                <h3 className="mt-5 font-display text-xl">{item.titulo}</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-grafite">
                  {item.texto}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-16 max-w-2xl border-l border-linha-ouro pl-7 text-sm leading-relaxed text-grafite">
            {calculadora.aviso}
          </p>
        </Section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCalculadora()) }}
      />
    </>
  );
}
