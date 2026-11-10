import type { Metadata } from "next";
import { marca } from "./content";

/**
 * Endereços por idioma. O português vive na raiz (/receitas); espanhol e
 * inglês repetem o mesmo caminho com prefixo (/es/receitas, /en/receitas).
 * Os slugs não são traduzidos: um caminho só para os três idiomas mantém o
 * seletor de idioma e o hreflang triviais.
 *
 * Sem "use client": serve a Server e Client Components.
 */
export type Idioma = "pt" | "es" | "en";

export const IDIOMAS: readonly Idioma[] = ["pt", "es", "en"];

/** Valor do atributo `lang` do <html>. */
export const LANG_HTML: Record<Idioma, string> = { pt: "pt-BR", es: "es", en: "en" };

/** `og:locale`. */
export const LOCALE_OG: Record<Idioma, string> = { pt: "pt_BR", es: "es_ES", en: "en_US" };

/**
 * Caminhos com versão nativa nos três idiomas (sem prefixo). Um caminho
 * fora desta lista — conta, painel, área do aluno — só existe em português.
 */
const TRADUZIDOS = [
  "/programa-90-dias",
  "/calculadora-de-calorias",
  "/calculadora-de-gordura-corporal",
  "/calculadora-do-prato",
  "/postura",
  "/raio-x-postural",
  "/receitas",
  "/biblioteca",
  "/csflix",
  "/links",
  "/ela",
] as const;

/** O caminho (sem prefixo de idioma, sem query/hash) tem versão nativa? */
export function temTraducao(caminho: string): boolean {
  if (caminho === "/" || caminho === "") return true;
  if (/^\/leitura\/[a-z0-9-]+$/.test(caminho)) return true;
  if (/^\/ela\/[a-z0-9-]+$/.test(caminho)) return true;
  return (TRADUZIDOS as readonly string[]).includes(caminho);
}

/** Idioma de um pathname: /es/... → es, /en/... → en, o resto → pt. */
export function idiomaDoCaminho(pathname: string | null | undefined): Idioma {
  if (!pathname) return "pt";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "pt";
}

/** Tira o prefixo de idioma: /es/receitas → /receitas, /en → /. */
export function caminhoBase(pathname: string): string {
  const sem = pathname.replace(/^\/(es|en)(?=\/|$)/, "");
  return sem === "" ? "/" : sem;
}

/**
 * Leva um href escrito em português (sempre absoluto: "/receitas",
 * "/#metodo", "/csflix?t=x") para o idioma pedido. Hrefs externos, de
 * rotas só em português (/consultoria, /minha-conta, /api) e âncoras
 * soltas voltam intactos.
 */
export function rotaIdioma(idioma: Idioma, href: string): string {
  if (idioma === "pt" || !href.startsWith("/") || href.startsWith("//")) return href;
  const corte = href.search(/[?#]/);
  const caminho = corte === -1 ? href : href.slice(0, corte);
  const resto = corte === -1 ? "" : href.slice(corte);
  const base = caminhoBase(caminho);
  if (!temTraducao(base)) return href;
  return `/${idioma}${base === "/" ? "" : base}${resto}`;
}

/** hreflang de um caminho base (ex.: "/receitas"). */
export function alternativasIdioma(caminho: string) {
  return {
    "pt-BR": rotaIdioma("pt", caminho),
    es: rotaIdioma("es", caminho),
    en: rotaIdioma("en", caminho),
    "x-default": rotaIdioma("pt", caminho),
  };
}

/**
 * Metadata padrão de uma página traduzida: title, description, canonical,
 * hreflang e Open Graph no locale certo. `extra` é mesclado por cima
 * (robots, keywords, twitter...).
 */
export function metadataPagina({
  idioma,
  caminho,
  titulo,
  descricao,
  imagem,
  extra,
}: {
  idioma: Idioma;
  /** caminho base, sem prefixo: "/receitas" */
  caminho: string;
  titulo: string;
  descricao: string;
  imagem?: { url: string; width: number; height: number; alt: string };
  extra?: Metadata;
}): Metadata {
  const url = rotaIdioma(idioma, caminho);
  const img = imagem ?? { url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: marca.nome };
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: url, languages: alternativasIdioma(caminho) },
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${url === "/" ? "" : url}`,
      siteName: marca.nome,
      title: `${titulo} | ${marca.nome}`,
      description: descricao,
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | ${marca.nome}`,
      description: descricao,
      images: [img.url],
    },
    ...extra,
  };
}

/**
 * Escolhe o valor do idioma num dicionário trilíngue. Atalho para
 * `{ pt: "...", es: "...", en: "..." }[idioma]` com tipagem.
 */
export function tr<T>(idioma: Idioma, valores: Record<Idioma, T>): T {
  return valores[idioma];
}
