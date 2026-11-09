import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReceitasFlix } from "@/components/ReceitasFlix";
import { Arrow, Container, buttonClass } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { jsonLdReceitas } from "@/lib/jsonld";
import { carregarTrilhasReceitas, totalDeReceitas } from "@/lib/receitas";

export const metadata: Metadata = {
  title: "Receitas Fit — Panquecas de Aveia e mais | CSFlix",
  description:
    "Receitas fit práticas com calorias, proteínas, carboidratos, gorduras e fibras calculadas — começando pela série de Panquecas de Aveia.",
  alternates: { canonical: rotas.receitas },
  openGraph: {
    type: "website",
    url: `${marca.site}${rotas.receitas}`,
    title: `Receitas Fit | ${marca.nome}`,
    description:
      "Receitas fit práticas com macros calculados e base em Ciência de Alimentos.",
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: `Receitas Fit — ${marca.nome}`,
      },
    ],
  },
};

export default function Page() {
  const trilhas = carregarTrilhasReceitas();
  const total = totalDeReceitas();

  return (
    <>
      <Header tone="escuro" />

      <main className="min-h-screen bg-black text-white">
        <ReceitasFlix trilhas={trilhas} total={total} />

        <Container className="pb-28">
          <div className="border-t border-white/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-white">
              A receita facilita. O protocolo encaixa no seu dia.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-white/70">
              Comer bem sem enjoar é parte da adesão. Na consultoria, as quantidades e substituições já saem ajustadas para a sua meta.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={`${rotas.consultoria}?de=receitas`}
                className={buttonClass("consultoria")}
              >
                Começar consultoria <Arrow />
              </a>
              <Link
                href={rotas.calculadora}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-sm text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                Calcular minhas calorias <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdReceitas(total)) }}
      />
    </>
  );
}
