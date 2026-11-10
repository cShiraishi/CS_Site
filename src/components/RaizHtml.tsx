import type { Metadata, Viewport } from "next";
import { Anton, EB_Garamond, Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { marca } from "@/lib/content";
import { SCRIPT_MODO } from "@/lib/modo";
import { GTM_ID, SCRIPT_CONSENTIMENTO } from "@/lib/consentimento";
import { BannerCookies } from "@/components/BannerCookies";
import { LANG_HTML, LOCALE_OG, rotaIdioma, type Idioma } from "@/lib/rotas-idioma";
import "@/app/globals.css";

/**
 * Casca <html> compartilhada pelos três root layouts — (pt), es e en.
 * Cada idioma tem o seu root layout para o `lang` do <html> sair certo
 * já no HTML do servidor, sem script e sem tornar as páginas dinâmicas.
 * Trocar de idioma cruza root layouts e faz um carregamento completo —
 * aceitável para uma ação rara.
 */

/* 06 / TIPOGRAFIA — Primária: EB Garamond. Secundária: Inter. */
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/* Títulos do tema escuro (nov/2026): condensada, pesada, caixa alta. */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  // 700 existe por causa do @carlosseiti da pagina /links; o browser so
  // baixa o peso que a pagina usa de facto.
  weight: ["400", "500", "700"],
});

const SEO: Record<
  Idioma,
  { titulo: string; descricao: string; keywords: string[]; altImagem: string }
> = {
  pt: {
    /** 50 caracteres — dentro da faixa que o Google exibe sem truncar. */
    titulo: `${marca.nome} | Consultoria online de treino e dieta`,
    /** 154 caracteres — abaixo do corte de 160 do Google. */
    descricao:
      "Consultoria online de treino e dieta com base científica. Protocolo individual de nutrição e treino, ajustes quinzenais e suporte direto com Carlos Seiti.",
    keywords: [
      "consultoria online",
      "nutrição esportiva",
      "emagrecimento",
      "treino personalizado",
      "dieta flexível",
      "Carlos Seiti",
    ],
    altImagem: "Monograma CS — branco e ouro, com seta ascendente",
  },
  es: {
    titulo: `${marca.nome} | Asesoría online de entrenamiento y nutrición`,
    descricao:
      "Asesoría online de entrenamiento y dieta con base científica. Protocolo individual de nutrición y entrenamiento, ajustes quincenales y soporte directo con Carlos Seiti.",
    keywords: [
      "asesoría online",
      "nutrición deportiva",
      "pérdida de grasa",
      "entrenamiento personalizado",
      "dieta flexible",
      "Carlos Seiti",
    ],
    altImagem: "Monograma CS — blanco y oro, con flecha ascendente",
  },
  en: {
    titulo: `${marca.nome} | Online training & nutrition coaching`,
    descricao:
      "Science-based online training and nutrition coaching. Custom nutrition and workout protocols, bi-weekly adjustments, and direct 1-on-1 support with Carlos Seiti.",
    keywords: [
      "online coaching",
      "sports nutrition",
      "fat loss",
      "personalized training",
      "flexible dieting",
      "Carlos Seiti",
    ],
    altImagem: "CS Monogram — white and gold, with ascending arrow",
  },
};

export function metadataRaiz(idioma: Idioma): Metadata {
  const seo = SEO[idioma];
  const home = rotaIdioma(idioma, "/");
  return {
    metadataBase: new URL(marca.site),
    title: { default: seo.titulo, template: `%s | ${marca.nome}` },
    description: seo.descricao,
    alternates: {
      canonical: home,
      languages: { "pt-BR": "/", es: "/es", en: "/en", "x-default": "/" },
    },
    // Preenchidas por variável de ambiente; ausentes, as tags não são emitidas.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : undefined,
    },
    formatDetection: { telephone: false },
    keywords: seo.keywords,
    authors: [{ name: marca.nome, url: marca.site }],
    creator: marca.nome,
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${home === "/" ? "" : home}`,
      siteName: marca.nome,
      title: seo.titulo,
      description: seo.descricao,
      images: [{ url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: seo.altImagem }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.titulo,
      description: seo.descricao,
      images: ["/brand/cs-mark.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewportRaiz: Viewport = {
  themeColor: "#0b0a09",
};

/** Classes das fontes — também usadas pelo global-not-found. */
export const classesFontes = `${anton.variable} ${garamond.variable} ${inter.variable}`;

export function RaizHtml({
  idioma,
  children,
}: {
  idioma: Idioma;
  children: React.ReactNode;
}) {
  return (
    // As variáveis das fontes precisam existir em :root — é lá que
    // --font-display e --font-sans as consomem (globals.css).
    <html
      lang={LANG_HTML[idioma]}
      className={classesFontes}
      // O globals.css usa scroll-behavior: smooth (âncoras da home). Com
      // este atributo o Next desliga o smooth na troca de página e volta
      // ao topo de verdade; sem ele, a página nova abria na altura da
      // anterior ("desce tudo pra baixo").
      data-scroll-behavior="smooth"
      // O script do <head> pode pôr data-modo="ela" antes do React hidratar.
      suppressHydrationWarning
    >
      {/* É a casca dos root layouts do App Router, não uma página do
          Pages Router: <head> literal é o certo aqui. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_MODO }} />
        {/* Consent Mode v2: padrão negado, antes de o GTM carregar. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CONSENTIMENTO }} />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
        <BannerCookies idioma={idioma} />
      </body>
    </html>
  );
}
