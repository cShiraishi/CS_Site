import type { Metadata } from "next";
import Link from "next/link";
import { Biblioteca } from "@/components/Biblioteca";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Arrow, Container, Eyebrow } from "@/components/ui";
import { LIVROS, destaque, tomDaCapa } from "@/lib/biblioteca";
import { marca, rotas } from "@/lib/content";
import { jsonLdBiblioteca } from "@/lib/jsonld";

const titulo = "Biblioteca — livros que eu recomendo de verdade";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Os livros de nutrição, treino e comportamento que formam a base do meu trabalho — com o motivo de cada um estar na lista. Sem indicação vazia.",
  alternates: { canonical: rotas.biblioteca },
  openGraph: {
    type: "article",
    url: `${marca.site}${rotas.biblioteca}`,
    title: `${titulo} | ${marca.nome}`,
    description:
      "Fundamentos, nutrição aplicada, treino e comportamento. Cada livro com o porquê de estar aqui.",
  },
};

export default function Page() {
  const capa = tomDaCapa(destaque.slug);

  return (
    <>
      <Header tone="escuro" />

      <main className="bg-grafite text-porcelana">
        {/* ── Destaque, no espírito do "primeiro banner" ────── */}
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-32 -top-20 h-[30rem] w-[30rem] opacity-[0.12] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_70%)]"
          />

          <Container className="relative">
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-porcelana/45">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-porcelana/25">
                  /
                </li>
                <li aria-current="page" className="text-porcelana/75">
                  Biblioteca
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pb-24">
              <div className="rise">
                <Eyebrow tone="claro">Biblioteca · {LIVROS.length} títulos</Eyebrow>

                <h1 className="t-display mt-8 text-balance text-porcelana">
                  O que eu leio
                  <br />
                  antes de te indicar.
                </h1>

                <p className="t-sub mt-8 max-w-xl text-pretty text-porcelana/65">
                  Cada livro aqui tem uma justificativa escrita — o que ele
                  resolve e por que sobreviveu à minha leitura crítica. Nenhuma
                  indicação de vitrine.
                </p>

                <div className="mt-10 border-l border-ouro/40 pl-6">
                  <p className="t-eyebrow text-ouro">Começo por este</p>
                  <p className="mt-3 font-display text-2xl text-porcelana">
                    {destaque.titulo}
                  </p>
                  <p className="mt-1.5 text-sm text-porcelana/50">
                    {destaque.autor}
                    {destaque.ano ? ` · ${destaque.ano}` : ""}
                  </p>
                  <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-porcelana/70">
                    {destaque.chamada}
                  </p>
                </div>
              </div>

              {/* Capa grande do destaque */}
              <div className="rise mx-auto w-48 sm:w-60 lg:w-full lg:max-w-[19rem]">
                <div
                  className="flex aspect-2/3 flex-col justify-between rounded-sm p-7 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] ring-1 ring-porcelana/12"
                  style={{ backgroundImage: capa.fundo }}
                >
                  <span
                    aria-hidden
                    className="block h-px w-12"
                    style={{ background: capa.claro ? "#8C673F" : "#C7A06A" }}
                  />
                  <div>
                    <p
                      className="font-display text-2xl leading-tight sm:text-3xl"
                      style={{ color: capa.claro ? "#1D1B19" : "#F7F5F2" }}
                    >
                      {destaque.titulo}
                    </p>
                    <p
                      className="mt-3 text-[0.65rem] uppercase tracking-[0.18em]"
                      style={{ color: capa.claro ? "#8C673F" : "#C7A06A" }}
                    >
                      {destaque.autor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Trilhas ───────────────────────────────────────── */}
        <div className="pb-24 sm:pb-32">
          <Biblioteca />
        </div>

        {/* ── Ponte ─────────────────────────────────────────── */}
        <Container className="pb-28">
          <div className="border-t border-porcelana/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-porcelana">
              Ler ajuda. Aplicar ao seu corpo é outra conversa.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-porcelana/65">
              Nenhum destes livros foi escrito para você em específico. É esse o
              vão que a consultoria preenche.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#contato"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ouro px-8 py-4 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-porcelana"
              >
                Solicitar avaliação
                <Arrow />
              </Link>
              <Link
                href={rotas.calculadora}
                className="group inline-flex items-center gap-2.5 rounded-full border border-porcelana/25 px-7 py-4 text-sm text-porcelana/80 transition-all duration-300 hover:border-ouro hover:text-ouro"
              >
                Calcular minhas calorias
                <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBiblioteca()) }}
      />
    </>
  );
}
