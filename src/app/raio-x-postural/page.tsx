import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RaioXPostural } from "@/components/RaioXPostural";
import { Container, Eyebrow, Section } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { AVISO } from "@/lib/postura";
import { jsonLdRaioX } from "@/lib/jsonld";

const titulo = "Raio-X Postural — descubra seu padrão em 5 minutos";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Identifique seu padrão postural pelo teste da parede e receba os exercícios certos, com dose e ponto de falha. Gratuito, sem cadastro, baseado em evidência.",
  alternates: { canonical: rotas.raioX },
  openGraph: {
    type: "article",
    url: `${marca.site}${rotas.raioX}`,
    title: `${titulo} | ${marca.nome}`,
    description:
      "Quatro padrões, doze exercícios e um protocolo de oito semanas que entra no treino que você já faz.",
  },
};

export default function Page() {
  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden bg-porcelana pb-14 pt-28 sm:pt-32 lg:pt-36">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-24 top-10 size-[30rem] opacity-40 [mask-image:radial-gradient(circle,black,transparent_68%)]"
          />
          <Container className="relative">
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/60">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro-profundo">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/35">
                  /
                </li>
                <li aria-current="page" className="text-grafite/80">
                  Raio-X Postural
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pt-10">
              <Eyebrow>Ferramenta gratuita</Eyebrow>
              <h1 className="t-display mt-7 text-balance">
                Raio-X
                <br />
                Postural.
              </h1>
              <p className="t-sub mt-7 text-pretty text-grafite/75">
                Descubra o seu padrão em cinco minutos, sem equipamento, e receba
                os exercícios que correspondem a ele — com dose, execução e o
                erro que anula cada um.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-grafite/60">
                <span className="flex items-center gap-2">
                  <i className="size-1.5 rounded-full bg-ouro" />4 padrões
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-1.5 rounded-full bg-ouro" />12 exercícios
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-1.5 rounded-full bg-ouro" />
                  Protocolo de 8 semanas
                </span>
              </div>

              {/* O nome evoca exame; o livro é explícito em que isto não
                  diagnostica. O aviso fica no topo, não escondido no rodapé. */}
              <p className="mt-9 border-l-2 border-ouro-profundo/50 pl-5 text-[0.86rem] leading-relaxed text-grafite/65">
                {AVISO}
              </p>
            </div>
          </Container>
        </section>

        <Section className="py-12 sm:py-16">
          <RaioXPostural />
        </Section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRaioX()) }}
      />
    </>
  );
}
