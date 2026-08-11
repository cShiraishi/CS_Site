import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CSFlix } from "@/components/CSFlix";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Arrow, Container } from "@/components/ui";
import { carregarTrilhas, totalDeVideos } from "@/lib/csflix";
import { marca, rotas } from "@/lib/content";
import { jsonLdCSFlix } from "@/lib/jsonld";

/** Vídeo novo aparece sozinho, sem deploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CSFlix — os vídeos do canal, por área",
  description:
    "Treino, culturismo de competição, nutrição e método. Os vídeos do canal Carlos Seiti TV organizados por área, para ver direto aqui.",
  alternates: { canonical: rotas.csflix },
  openGraph: {
    type: "website",
    url: `${marca.site}${rotas.csflix}`,
    title: `CSFlix | ${marca.nome}`,
    description:
      "Os vídeos do canal organizados por área: treino, competição, nutrição e método.",
  },
};

export default async function Page() {
  const trilhas = await carregarTrilhas();
  const total = totalDeVideos(trilhas);

  return (
    <>
      <Header tone="escuro" />

      <main className="bg-black text-white">
        {/* ── Abertura ──────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          {/* clarão vermelho, discreto */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[#E00513]/12 blur-[120px]"
          />

          <Container className="relative">
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-white/25">
                  /
                </li>
                <li aria-current="page" className="text-white/75">
                  CSFlix
                </li>
              </ol>
            </nav>

            <div className="rise max-w-3xl pb-14 pt-10">
              <h1>
                <span className="sr-only">CSFlix</span>
                <Image
                  src="/csflix/csflix.png"
                  alt=""
                  width={851}
                  height={273}
                  priority
                  className="h-auto w-56 sm:w-72"
                />
              </h1>

              <p className="t-sub mt-8 max-w-xl text-pretty text-white/65">
                Os vídeos do canal, organizados por área — treino, competição,
                nutrição e método. Atualiza sozinho a cada vídeo novo.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={marca.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#E00513] px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
                >
                  Inscrever-se no canal
                  <Arrow />
                </Link>
                <span className="text-xs text-white/40">
                  {total} em exibição · 640 no canal
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Trilhas ───────────────────────────────────────── */}
        <div className="pb-24 sm:pb-32">
          {trilhas.length > 0 ? (
            <CSFlix trilhas={trilhas} />
          ) : (
            <Container>
              <p className="max-w-md text-white/55">
                Não consegui alcançar o YouTube agora. Tenta daqui a pouco, ou vê
                tudo direto{" "}
                <Link
                  href={marca.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E00513] underline-offset-4 hover:underline"
                >
                  no canal
                </Link>
                .
              </p>
            </Container>
          )}
        </div>

        {/* ── Ponte ─────────────────────────────────────────── */}
        <Container className="pb-28">
          <div className="border-t border-white/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-white">
              Ver ajuda. Aplicar ao seu corpo é outra conversa.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-white/60">
              O canal mostra como eu treino. A consultoria monta como você deveria.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/#contato"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ouro px-8 py-4 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-white"
              >
                Solicitar avaliação
                <Arrow />
              </Link>
              <Link
                href={rotas.biblioteca}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-sm text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                Ir para a biblioteca
                <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCSFlix(total)) }}
      />
    </>
  );
}
