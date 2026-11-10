import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RaioXPostural } from "@/components/RaioXPostural";
import { Container, Eyebrow, Section } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { UI_RAIOX_PAGINA, aviso } from "@/lib/i18n/postura";
import { jsonLdRaioX } from "@/lib/jsonld";
import {
  LANG_HTML,
  LOCALE_OG,
  metadataPagina,
  rotaIdioma,
  type Idioma,
} from "@/lib/rotas-idioma";

/** /raio-x-postural, /es/raio-x-postural e /en/raio-x-postural. */

export function metadataRaioX(idioma: Idioma): Metadata {
  const ui = UI_RAIOX_PAGINA[idioma];
  const url = rotaIdioma(idioma, rotas.raioX);
  return metadataPagina({
    idioma,
    caminho: rotas.raioX,
    titulo: ui.seoTitulo,
    descricao: ui.seoDescricao,
    extra: {
      openGraph: {
        type: "article",
        locale: LOCALE_OG[idioma],
        url: `${marca.site}${url}`,
        title: `${ui.seoTitulo} | ${marca.nome}`,
        description: ui.ogDescricao,
        // Declarar openGraph aqui substitui o do layout, images incluído:
        // sem esta linha o link mandado por DM sai sem imagem.
        images: [
          {
            url: "/brand/cs-mark.jpg",
            width: 1024,
            height: 1024,
            alt: `${ui.nome} — ${marca.nome}`,
          },
        ],
      },
    },
  });
}

/** JSON-LD: o PT vem intacto de `jsonld.ts`; ES/EN são montados aqui. */
function jsonLd(idioma: Idioma) {
  if (idioma === "pt") return jsonLdRaioX();
  const ui = UI_RAIOX_PAGINA[idioma];
  const url = `${marca.site}${rotaIdioma(idioma, rotas.raioX)}`;
  const inicio = `${marca.site}${rotaIdioma(idioma, "/")}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: ui.nome,
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: ui.ldSistema,
        inLanguage: LANG_HTML[idioma],
        description: ui.ldDescricao,
        featureList: ui.ldRecursos,
        author: { "@id": `${marca.site}/#pessoa` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.inicio, item: inicio },
          { "@type": "ListItem", position: 2, name: ui.nome, item: url },
        ],
      },
    ],
  };
}

export function PaginaRaioX({ idioma }: { idioma: Idioma }) {
  const ui = UI_RAIOX_PAGINA[idioma];

  return (
    <>
      <Header idioma={idioma} />

      <main>
        <section className="relative overflow-hidden bg-porcelana pb-14 pt-28 sm:pt-32 lg:pt-36">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-24 top-10 size-[30rem] opacity-40 [mask-image:radial-gradient(circle,black,transparent_68%)]"
          />
          <Container className="relative">
            <nav aria-label={ui.migalhaAria} className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/60">
                <li>
                  <Link href={rotaIdioma(idioma, "/")} className="transition-colors hover:text-ouro-profundo">
                    {ui.inicio}
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/35">
                  /
                </li>
                <li aria-current="page" className="text-grafite/80">
                  {ui.nome}
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pt-10">
              <Eyebrow>{ui.eyebrow}</Eyebrow>
              <h1 className="t-display mt-7 text-balance">
                {ui.h1[0]}
                <br />
                {ui.h1[1]}
              </h1>
              <p className="t-sub mt-7 text-pretty text-grafite/75">{ui.sub}</p>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-grafite/60">
                {ui.chips.map((c) => (
                  <span key={c} className="flex items-center gap-2">
                    <i className="size-1.5 rounded-full bg-ouro" />
                    {c}
                  </span>
                ))}
              </div>

              {/* O nome evoca exame; o livro é explícito em que isto não
                  diagnostica. O aviso fica no topo, não escondido no rodapé. */}
              <p className="mt-9 border-l-2 border-ouro-profundo/50 pl-5 text-[0.86rem] leading-relaxed text-grafite/65">
                {aviso(idioma)}
              </p>

              <Link
                href={rotaIdioma(idioma, rotas.postura)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ouro-profundo transition-colors hover:text-grafite"
              >
                {ui.linkPostura}
              </Link>
            </div>
          </Container>
        </section>

        <Section className="py-12 sm:py-16">
          <RaioXPostural idioma={idioma} />
        </Section>
      </main>

      <Footer idioma={idioma} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(idioma)) }}
      />
    </>
  );
}
