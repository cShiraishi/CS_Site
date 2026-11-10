import type { Metadata } from "next";
import Link from "next/link";
import { EstimadorDePrato } from "@/components/EstimadorDePrato";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow, Section } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { TEXTOS_PRATO } from "@/lib/i18n/prato";
import { jsonLdPrato } from "@/lib/jsonld";
import {
  type Idioma,
  LANG_HTML,
  LOCALE_OG,
  metadataPagina,
  rotaIdioma,
} from "@/lib/rotas-idioma";

/**
 * Calculadora do Prato — página compartilhada por /calculadora-do-prato,
 * /es/calculadora-do-prato e /en/calculadora-do-prato.
 */

const CAMINHO = rotas.prato;

export function metadataCalculadoraPrato(idioma: Idioma): Metadata {
  const t = TEXTOS_PRATO[idioma].seo;
  const url = rotaIdioma(idioma, CAMINHO);
  const base = metadataPagina({ idioma, caminho: CAMINHO, titulo: t.titulo, descricao: t.descricao });
  return {
    ...base,
    openGraph: {
      type: "article",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${url}`,
      title: `${t.ogTitulo} | ${marca.nome}`,
      description: t.ogDescricao,
      // Declarar openGraph aqui substitui o do layout, images incluído:
      // sem esta linha o link mandado por DM sai sem imagem.
      images: [
        {
          url: "/brand/cs-mark.jpg",
          width: 1024,
          height: 1024,
          alt: `${t.ogAlt} — ${marca.nome}`,
        },
      ],
    },
  };
}

/** PT: o JSON-LD de sempre. ES/EN: o mesmo grafo, com nomes e URL locais. */
function jsonLd(idioma: Idioma) {
  if (idioma === "pt") return jsonLdPrato();
  const t = TEXTOS_PRATO[idioma].jsonld;
  const url = `${marca.site}${rotaIdioma(idioma, CAMINHO)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: t.nome,
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: t.sistema,
        inLanguage: LANG_HTML[idioma],
        description: t.descricao,
        featureList: t.recursos,
        author: { "@id": `${marca.site}/#pessoa` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.inicio, item: `${marca.site}${rotaIdioma(idioma, "/")}` },
          { "@type": "ListItem", position: 2, name: t.nome, item: url },
        ],
      },
    ],
  };
}

export function PaginaCalculadoraPrato({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS_PRATO[idioma].pagina;

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
            <nav aria-label={t.voceEsta} className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/60">
                <li>
                  <Link href={rotaIdioma(idioma, "/")} className="transition-colors hover:text-ouro-profundo">
                    {t.inicio}
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/35">
                  /
                </li>
                <li aria-current="page" className="text-grafite/80">
                  {t.migalha}
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pt-10">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="t-display mt-7 text-balance">
                {t.titulo[0]}
                <br />
                {t.titulo[1]}
              </h1>
              <p className="t-sub mt-7 text-pretty text-grafite/75">{t.texto}</p>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-grafite/60">
                {t.destaques.map((d) => (
                  <span key={d} className="flex items-center gap-2">
                    <i className="size-1.5 rounded-full bg-ouro" />
                    {d}
                  </span>
                ))}
              </div>

              {/* Dizer cedo o que a ferramenta não faz é o que a torna
                  confiável — e evita que alguém trate a faixa como pesagem. */}
              <p className="mt-9 border-l-2 border-ouro-profundo/50 pl-5 text-[0.86rem] leading-relaxed text-grafite/65">
                {t.honestidade}
              </p>
            </div>
          </Container>
        </section>

        <Section className="py-12 sm:py-16">
          <EstimadorDePrato idioma={idioma} />
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
