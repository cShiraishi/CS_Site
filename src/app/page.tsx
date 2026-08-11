import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Contato } from "@/components/Contato";
import {
  Duvidas,
  Ferramenta,
  Hero,
  Metodo,
  ParaQuem,
  Pilares,
  Programa,
  Resultados,
  Sobre,
} from "@/components/sections";
import { jsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pilares />
        <Ferramenta />
        <ParaQuem />
        <Metodo />
        <Programa />
        <Resultados />
        <Sobre />
        <Duvidas />
        <Contato />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
    </>
  );
}
