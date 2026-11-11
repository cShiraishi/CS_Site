import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Aplicar } from "@/components/Aplicar";
import { ComoFunciona, Hero, Resultados, SobreCurto } from "@/components/sections";
import { marca } from "@/lib/content";
import { jsonLd } from "@/lib/jsonld";

const titulo = `${marca.nome} | Asesoría online de entrenamiento y nutrición`;
const descricao =
  "Asesoría online de entrenamiento y dieta con base científica: protocolo individual, ajustes quincenales y soporte directo con Carlos Seiti.";

export const metadata: Metadata = {
  title: {
    absolute: titulo,
  },
  description: descricao,
  alternates: {
    canonical: "/es",
    languages: {
      "pt-BR": "/",
      es: "/es",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${marca.site}/es`,
    siteName: marca.nome,
    title: titulo,
    description: descricao,
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: "Monograma CS — blanco y oro, con flecha ascendente",
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

export default function HomeEs() {
  return (
    <>
      <Header idioma="es" />
      <main lang="es">
        <Hero idioma="es" />
        <Resultados idioma="es" />
        <ComoFunciona idioma="es" />
        <SobreCurto idioma="es" />
        <Aplicar idioma="es" />
      </main>
      <Footer idioma="es" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd("es")) }}
      />
    </>
  );
}
