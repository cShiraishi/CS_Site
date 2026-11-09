import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Aplicar } from "@/components/Aplicar";
import { ComoFunciona, Hero, Resultados, SobreCurto } from "@/components/sections";
import { marca } from "@/lib/content";
import { jsonLd } from "@/lib/jsonld";

const titulo = `${marca.nome} | Online training & nutrition coaching`;
const descricao =
  "Science-based online training and nutrition coaching. Custom nutrition and workout protocols, bi-weekly adjustments, and direct 1-on-1 support with Carlos Seiti.";

export const metadata: Metadata = {
  title: {
    absolute: titulo,
  },
  description: descricao,
  alternates: {
    canonical: "/en",
    languages: {
      "pt-BR": "/",
      es: "/es",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${marca.site}/en`,
    siteName: marca.nome,
    title: titulo,
    description: descricao,
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: "CS Monogram — white and gold, with ascending arrow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descricao,
    images: ["/brand/cs-mark.jpg"],
  },
};

export default function HomeEn() {
  return (
    <>
      <Header idioma="en" />
      <main lang="en">
        <Hero idioma="en" />
        <Resultados idioma="en" />
        <ComoFunciona idioma="en" />
        <SobreCurto idioma="en" />
        <Aplicar idioma="en" />
      </main>
      <Footer idioma="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
    </>
  );
}
