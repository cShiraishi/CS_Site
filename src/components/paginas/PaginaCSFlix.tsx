import type { Metadata } from "next";
import Link from "next/link";
import { CSFlix } from "@/components/CSFlix";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Arrow, Container, buttonClass } from "@/components/ui";
import { carregarTrilhas, totalDeVideos } from "@/lib/csflix";
import { marca, rotas } from "@/lib/content";
import { PAGINA_CSFLIX } from "@/lib/i18n/csflix";
import { jsonLdCSFlix } from "@/lib/jsonld";
import { LANG_HTML, metadataPagina, rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * Página do CSFlix, compartilhada por /csflix, /es/csflix e /en/csflix.
 * As rotas só escolhem o idioma (e mantêm o `revalidate`).
 */

export function metadataCSFlix(idioma: Idioma): Metadata {
  const t = PAGINA_CSFLIX[idioma];
  const imagem = {
    url: "/brand/cs-mark.jpg",
    width: 1024,
    height: 1024,
    alt: `CSFlix — ${marca.nome}`,
  };
  const base = metadataPagina({
    idioma,
    caminho: rotas.csflix,
    titulo: t.seoTitulo,
    descricao: t.seoDescricao,
    imagem,
  });
  // Título e descrição do Open Graph são próprios (mais curtos que os do SEO).
  // Declarar openGraph aqui substitui o do layout, images incluído:
  // sem a imagem o link mandado por DM sai sem prévia.
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title: `${t.ogTitulo} | ${marca.nome}`,
      description: t.ogDescricao,
      images: [imagem],
    },
  };
}

function jsonLd(idioma: Idioma, total: number) {
  const pt = jsonLdCSFlix(total);
  if (idioma === "pt") return pt;
  const t = PAGINA_CSFLIX[idioma];
  const url = `${marca.site}${rotaIdioma(idioma, rotas.csflix)}`;
  return {
    "@context": pt["@context"],
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#pagina`,
        url,
        name: "CSFlix",
        inLanguage: LANG_HTML[idioma],
        author: { "@id": `${marca.site}/#pessoa` },
        description: t.jsonLdDescricao(total),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t.breadcrumbInicio,
            item: `${marca.site}${rotaIdioma(idioma, "/")}`,
          },
          { "@type": "ListItem", position: 2, name: "CSFlix", item: url },
        ],
      },
    ],
  };
}

export async function PaginaCSFlix({ idioma }: { idioma: Idioma }) {
  const t = PAGINA_CSFLIX[idioma];
  const trilhas = await carregarTrilhas(idioma);
  const total = totalDeVideos(trilhas);

  return (
    <>
      <Header tone="escuro" idioma={idioma} />

      <main className="min-h-screen bg-black text-white">
        {trilhas.length > 0 ? (
          <CSFlix trilhas={trilhas} total={total} idioma={idioma} />
        ) : (
          <Container className="pb-32 pt-48">
            <p className="max-w-md text-white/65">
              {t.erroAntes}{" "}
              <Link
                href={marca.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E00513] underline-offset-4 hover:underline"
              >
                {t.erroLink}
              </Link>
              .
            </p>
          </Container>
        )}

        <Container className="pb-28">
          <div className="border-t border-white/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-white">{t.ctaTitulo}</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-white/70">{t.ctaTexto}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={rotaIdioma(idioma, "/#contato")} className={buttonClass("consultoria")}>
                {t.ctaConsultoria} <Arrow />
              </Link>
              <Link
                href={rotaIdioma(idioma, rotas.biblioteca)}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-sm text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                {t.ctaBiblioteca} <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer idioma={idioma} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(idioma, total)) }}
      />
    </>
  );
}
