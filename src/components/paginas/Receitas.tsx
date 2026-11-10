import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReceitasFlix } from "@/components/ReceitasFlix";
import { Arrow, Container, buttonClass } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { TEXTOS_RECEITAS } from "@/lib/i18n/receitas";
import { carregarTrilhasReceitasIdioma, catalogoReceitas } from "@/lib/i18n/receitas-catalogo";
import { jsonLdReceitas } from "@/lib/jsonld";
import { totalDeReceitas } from "@/lib/receitas";
import { LANG_HTML, LOCALE_OG, metadataPagina, rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

export function metadataReceitas(idioma: Idioma): Metadata {
  const m = TEXTOS_RECEITAS[idioma].meta;
  const base = metadataPagina({
    idioma,
    caminho: rotas.receitas,
    titulo: m.titulo,
    descricao: m.descricao,
  });
  const url = rotaIdioma(idioma, rotas.receitas);
  // Open Graph com título/descrição curtos, como a página PT sempre teve.
  return {
    ...base,
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${url}`,
      siteName: marca.nome,
      title: `${m.ogTitulo} | ${marca.nome}`,
      description: m.ogDescricao,
      images: [
        {
          url: "/brand/cs-mark.jpg",
          width: 1024,
          height: 1024,
          alt: `${m.alt} — ${marca.nome}`,
        },
      ],
    },
  };
}

/** JSON-LD: PT usa o original de jsonld.ts; ES/EN localizam por cima. */
function jsonLd(idioma: Idioma, total: number) {
  const original = jsonLdReceitas(total);
  if (idioma === "pt") return original;
  const j = TEXTOS_RECEITAS[idioma].jsonLd;
  const url = `${marca.site}${rotaIdioma(idioma, rotas.receitas)}`;
  const [pagina, breadcrumb] = original["@graph"];
  return {
    ...original,
    "@graph": [
      {
        ...pagina,
        "@id": `${url}#pagina`,
        url,
        name: j.nome,
        inLanguage: LANG_HTML[idioma],
        description: j.descricao(total),
      },
      {
        ...breadcrumb,
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: j.inicio, item: `${marca.site}/${idioma}` },
          { "@type": "ListItem", position: 2, name: j.receitas, item: url },
        ],
      },
    ],
  };
}

export function PaginaReceitas({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS_RECEITAS[idioma];
  const trilhas = carregarTrilhasReceitasIdioma(idioma);
  const total = totalDeReceitas();

  return (
    <>
      <Header tone="escuro" idioma={idioma} />

      <main className="min-h-screen bg-black text-white">
        <ReceitasFlix
          trilhas={trilhas}
          total={total}
          idioma={idioma}
          catalogo={idioma === "pt" ? undefined : catalogoReceitas(idioma)}
        />

        <Container className="pb-28">
          <div className="border-t border-white/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-white">{t.cta.titulo}</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-white/70">{t.cta.texto}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={rotaIdioma(idioma, `${rotas.consultoria}?de=receitas`)}
                className={buttonClass("consultoria")}
              >
                {t.cta.consultoria} <Arrow />
              </a>
              <Link
                href={rotaIdioma(idioma, rotas.calculadora)}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 text-sm text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                {t.cta.calculadora} <Arrow />
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
