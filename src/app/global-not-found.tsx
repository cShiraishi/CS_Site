import type { Metadata } from "next";
import { NaoEncontrada } from "@/components/NaoEncontrada";
import { classesFontes } from "@/components/RaizHtml";
import { SCRIPT_MODO } from "@/lib/modo";

/**
 * 404 de endereços que não casam com rota nenhuma. Com três root layouts
 * (pt, es, en) não há layout único para compor o 404, e este arquivo não
 * conhece o caminho no servidor — então as três versões vão no HTML e um
 * script de uma linha escolhe pelo prefixo (/es, /en) antes da pintura.
 */
export const metadata: Metadata = {
  title: "404 | Carlos Seiti",
  robots: { index: false, follow: true },
};

const SCRIPT_IDIOMA = String.raw`(function(){var p=location.pathname,l=/^\/es(\/|$)/.test(p)?"es":/^\/en(\/|$)/.test(p)?"en":"pt-BR";document.documentElement.lang=l})()`;

const CSS = `html:not([lang="es"]) [data-so="es"],html:not([lang="en"]) [data-so="en"],html[lang="es"] [data-so="pt"],html[lang="en"] [data-so="pt"]{display:none}`;

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={classesFontes} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_IDIOMA }} />
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_MODO }} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>
        <div data-so="pt">
          <NaoEncontrada idioma="pt" />
        </div>
        <div data-so="es">
          <NaoEncontrada idioma="es" />
        </div>
        <div data-so="en">
          <NaoEncontrada idioma="en" />
        </div>
      </body>
    </html>
  );
}
