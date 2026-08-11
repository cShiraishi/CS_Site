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
        <section className="bg-porcelana pt-32 sm:pt-40">
          <Container>
            {/* Breadcrumb visível — o mesmo caminho que vai no JSON-LD */}
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/50">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro-profundo">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/30">
                  /
                </li>
                <li aria-current="page" className="text-grafite/75">
                  Calculadora de calorias
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pb-16 pt-10">
              <Eyebrow>{calculadora.eyebrow}</Eyebrow>
              <h1 className="t-display mt-8 whitespace-pre-line text-balance">
                {calculadora.titulo}
              </h1>
              <p className="t-sub mt-8 text-pretty text-grafite/72">
                {calculadora.texto}
              </p>
            </div>
          </Container>
        </section>

        {/* ── A ferramenta ──────────────────────────────────── */}
        <Section tone="branco" className="py-16 sm:py-20 lg:py-24">
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
                  <span className="font-display text-sm text-ouro-profundo/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="rule-gold draw-in h-px flex-1" />
                </div>
                <h3 className="mt-5 font-display text-xl">{item.titulo}</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-grafite/70">
                  {item.texto}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-16 max-w-2xl border-l border-linha-ouro pl-7 text-sm leading-relaxed text-grafite/60">
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
