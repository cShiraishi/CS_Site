import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Aplicar } from "@/components/Aplicar";
import { Hero, Metodo, ParaQuem, Programa, Sobre } from "@/components/sections";
import { jsonLd } from "@/lib/jsonld";

/**
 * Cinco seções e o fecho, nesta ordem: quem sou eu para você, como o
 * trabalho é feito, o que você recebe (com a prova ao lado), quem está do
 * outro lado, e o pedido. Tudo o que foi tirado daqui continua no site —
 * calculadoras, CSFlix e biblioteca têm página própria e lugar no menu.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ParaQuem />
        <Metodo />
        <Programa />
        <Sobre />
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
