import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Aplicar } from "@/components/Aplicar";
import { ComoFunciona, Hero, Resultados, SobreCurto } from "@/components/sections";
import { jsonLd } from "@/lib/jsonld";

/**
 * Home enxuta (nov/2026): um objetivo só, começar a consultoria.
 *
 * Promessa → prova → como funciona → quem é → começar. "Para quem é", os
 * pilares e a faixa de credenciais saíram; as ferramentas gratuitas
 * continuam no dock, em "Ferramentas", fora do caminho principal.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Resultados />
        <ComoFunciona />
        <SobreCurto />
        <Aplicar />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
    </>
  );
}
