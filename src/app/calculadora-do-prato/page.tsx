import type { Metadata } from "next";
import Link from "next/link";
import { EstimadorDePrato } from "@/components/EstimadorDePrato";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow, Section } from "@/components/ui";
import { marca, prato, rotas } from "@/lib/content";
import { jsonLdPrato } from "@/lib/jsonld";

const titulo = "Calculadora do Prato — quantas calorias tem o que você vai comer";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Monte o prato do restaurante e veja calorias, proteína, carboidrato e gordura. Medida pela mão, sem balança e sem cadastro. Alimentos brasileiros.",
  alternates: { canonical: rotas.prato },
  openGraph: {
    type: "article",
    url: `${marca.site}${rotas.prato}`,
    title: `Calculadora do Prato | ${marca.nome}`,
    description:
      "Calorias e macros do prato de restaurante, medidos em conchas e palmas — não em gramas.",
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
                  Calculadora do Prato
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pt-10">
              <Eyebrow>{prato.eyebrow}</Eyebrow>
              <h1 className="t-display mt-7 text-balance">
                Quanto pesa
                <br />
                o prato de hoje.
              </h1>
              <p className="t-sub mt-7 text-pretty text-grafite/75">{prato.texto}</p>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-grafite/60">
                {prato.destaques.map((d) => (
                  <span key={d} className="flex items-center gap-2">
                    <i className="size-1.5 rounded-full bg-ouro" />
                    {d}
                  </span>
                ))}
              </div>

              {/* Dizer cedo o que a ferramenta não faz é o que a torna
                  confiável — e evita que alguém trate a faixa como pesagem. */}
              <p className="mt-9 border-l-2 border-ouro-profundo/50 pl-5 text-[0.86rem] leading-relaxed text-grafite/65">
                Nenhuma foto, nenhum aplicativo adivinha o peso da sua comida.
                Aqui a quantidade vem de você — a ferramenta só faz a conta, e
                mostra a margem de erro que ela realmente tem.
              </p>
            </div>
          </Container>
        </section>

        <Section className="py-12 sm:py-16">
          <EstimadorDePrato />
        </Section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPrato()) }}
      />
    </>
  );
}
