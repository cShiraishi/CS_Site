import type { Metadata } from "next";
import Link from "next/link";
import { CalculadoraGordura } from "@/components/CalculadoraGordura";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow, Section } from "@/components/ui";
import { gordura, marca, rotas } from "@/lib/content";
import { listarFigurasDeGordura } from "@/lib/gordura-figuras";
import { jsonLdGordura } from "@/lib/jsonld";

const titulo = "Calculadora de gordura corporal — com fita métrica, em 2 minutos";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Calcule seu percentual de gordura corporal com uma fita métrica, escolha onde quer chegar e receba as calorias, os macros e o prazo estimado. Grátis, sem cadastro.",
  alternates: { canonical: rotas.gordura },
  openGraph: {
    type: "article",
    url: `${marca.site}${rotas.gordura}`,
    title: `Calculadora de gordura corporal | ${marca.nome}`,
    description:
      "Seu percentual de gordura, o corpo que você quer e quantas semanas separam um do outro.",
    /*
     * A imagem precisa ser repetida aqui. O metadata do Next mescla campo a
     * campo: declarar `openGraph` na página substitui o objeto inteiro do
     * layout, `images` incluído. Sem esta linha, o link compartilhado no
     * story, no WhatsApp e na bio sai como card cinza — justamente por onde
     * este tráfego chega.
     */
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: `Calculadora de gordura corporal — ${marca.nome}`,
      },
    ],
  },
};

export default async function Page() {
  const figuras = await listarFigurasDeGordura();

  return (
    <>
      <Header />

      <main>
        {/* Hero curto de propósito: quem vem do Instagram decide em
            segundos, e a ferramenta precisa aparecer sem rolar muito. */}
        <section className="relative overflow-hidden bg-porcelana pb-10 pt-24 sm:pb-14 sm:pt-32">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-24 top-10 size-[30rem] opacity-40 [mask-image:radial-gradient(circle,black,transparent_68%)]"
          />
          <Container className="relative">
            <nav aria-label="Você está em" className="pt-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/80">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro-profundo">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/35">
                  /
                </li>
                <li aria-current="page" className="text-grafite/80">
                  Gordura corporal
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pt-8">
              <Eyebrow>{gordura.eyebrow}</Eyebrow>
              <h1 className="t-display mt-6 text-balance">
                Quanta gordura
                <br />
                você carrega hoje.
              </h1>
              <p className="t-sub mt-6 text-pretty text-grafite/75">{gordura.texto}</p>

              <div className="mt-7 hidden flex-wrap gap-x-6 gap-y-3 text-xs text-grafite/80 sm:flex">
                {gordura.destaques.map((d) => (
                  <span key={d} className="flex items-center gap-2">
                    <i className="size-1.5 rounded-full bg-ouro" />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <Section denso>
          <CalculadoraGordura figuras={figuras} />
        </Section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGordura()) }}
      />
    </>
  );
}
