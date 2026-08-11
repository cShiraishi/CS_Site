import type { Metadata } from "next";
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

      <main className="min-h-screen bg-black text-white">
        {trilhas.length > 0 ? (
          <CSFlix trilhas={trilhas} total={total} />
        ) : (
          <Container className="pb-32 pt-48">
            <p className="max-w-md text-white/65">
              Não consegui alcançar o YouTube agora. Tente novamente daqui a
              pouco ou veja tudo direto{" "}
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

        <Container className="pb-28">
          <div className="border-t border-white/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-white">
              Ver ajuda. Aplicar ao seu corpo é outra conversa.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-white/70">
              O canal mostra como eu treino. A consultoria monta como você deveria.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/#contato"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ouro px-8 py-4 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-white"
              >
                Solicitar avaliação <Arrow />
              </Link>
              <Link
                href={rotas.biblioteca}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-sm text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                Ir para a biblioteca <Arrow />
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
