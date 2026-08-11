import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { marca } from "@/lib/content";
import "./globals.css";

/* 06 / TIPOGRAFIA — Primária: EB Garamond. Secundária: Inter. */
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

/** 50 caracteres — dentro da faixa que o Google exibe sem truncar. */
const titulo = `${marca.nome} | Consultoria online de treino e dieta`;

/** 154 caracteres — abaixo do corte de 160 do Google. */
const descricao =
  "Consultoria online de treino e dieta com base científica. Protocolo individual de nutrição e treino, ajustes quinzenais e suporte direto com Carlos Seiti.";

export const metadata: Metadata = {
  metadataBase: new URL(marca.site),
  title: {
    default: titulo,
    template: `%s | ${marca.nome}`,
  },
  description: descricao,
  alternates: {
    canonical: "/",
  },
  // Preenchidas por variável de ambiente; ausentes, as tags não são emitidas.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  formatDetection: { telephone: false },
  keywords: [
    "consultoria online",
    "nutrição esportiva",
    "emagrecimento",
    "treino personalizado",
    "dieta flexível",
    "Carlos Seiti",
  ],
  authors: [{ name: marca.nome, url: marca.site }],
  creator: marca.nome,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: marca.site,
    siteName: marca.nome,
    title: titulo,
    description: descricao,
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: "Monograma CS — branco e ouro, com seta ascendente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descricao,
    images: ["/brand/cs-mark.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // As variáveis das fontes precisam existir em :root — é lá que
    // --font-display e --font-sans as consomem (globals.css).
    <html lang="pt-BR" className={`${garamond.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
