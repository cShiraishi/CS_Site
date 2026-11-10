import type { Metadata } from "next";
import Link from "next/link";
import { CalculadoraGordura } from "@/components/CalculadoraGordura";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow, Section } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { listarFigurasDeGordura } from "@/lib/gordura-figuras";
import { TEXTOS_GORDURA } from "@/lib/i18n/gordura";
import { jsonLdGordura } from "@/lib/jsonld";
import {
  type Idioma,
  LANG_HTML,
  LOCALE_OG,
  metadataPagina,
  rotaIdioma,
} from "@/lib/rotas-idioma";

/**
 * Calculadora de gordura corporal — corpo da página, compartilhado por
 * /calculadora-de-gordura-corporal, /es/... e /en/... (a de maior tráfego
 * pago: o anúncio /bf cai aqui).
 */

export function metadataGordura(idioma: Idioma): Metadata {
  const t = TEXTOS_GORDURA[idioma].seo;
  const url = rotaIdioma(idioma, rotas.gordura);
  const base = metadataPagina({
    idioma,
    caminho: rotas.gordura,
    titulo: t.titulo,
    descricao: t.descricao,
  });

  return {
    ...base,
    ...(t.keywords ? { keywords: t.keywords } : {}),
    openGraph: {
      type: "article",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${url}`,
      title: `${t.ogTitulo} | ${marca.nome}`,
      description: t.ogDescricao,
      /*
       * A imagem precisa ser repetida aqui. O metadata do Next mescla campo a
       * campo: declarar `openGraph` na página substitui o objeto inteiro do
       * layout, `images` incluído. Sem esta linha, o link compartilhado no
       * story, no WhatsApp e na bio sai como card cinza — justamente por onde
       * este tráfego chega.
       */
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

/** JSON-LD: o PT sai intacto de jsonld.ts; ES/EN são montados por cima. */
function jsonLd(idioma: Idioma) {
  if (idioma === "pt") return jsonLdGordura();
  const t = TEXTOS_GORDURA[idioma].jsonld;
  const url = `${marca.site}${rotaIdioma(idioma, rotas.gordura)}`;
  const inicio = `${marca.site}${rotaIdioma(idioma, "/")}`;

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
          { "@type": "ListItem", position: 1, name: t.inicio, item: inicio },
          { "@type": "ListItem", position: 2, name: t.nome, item: url },
        ],
      },
    ],
  };
}

export async function PaginaGordura({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS_GORDURA[idioma];
  const figuras = await listarFigurasDeGordura();

  return (
    <>
      <Header idioma={idioma} />

      <main>
        {/* Hero curto de propósito: quem vem do Instagram decide em
            segundos, e a ferramenta precisa aparecer sem rolar muito. */}
        <section className="relative overflow-hidden bg-porcelana pb-10 pt-24 sm:pb-14 sm:pt-32">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-24 top-10 size-[30rem] opacity-40 [mask-image:radial-gradient(circle,black,transparent_68%)]"
          />
          <Container className="relative">
            <nav aria-label={t.migalha.aria} className="pt-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/80">
                <li>
                  <Link
                    href={rotaIdioma(idioma, "/")}
                    className="transition-colors hover:text-ouro-profundo"
                  >
                    {t.migalha.inicio}
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/35">
                  /
                </li>
                <li aria-current="page" className="text-grafite/80">
                  {t.migalha.atual}
                </li>
              </ol>
            </nav>

            <div className="rise max-w-2xl pt-8">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="t-display mt-6 text-balance">
                {t.tituloLinhas[0]}
                <br />
                {t.tituloLinhas[1]}
              </h1>
              <p className="t-sub mt-6 text-pretty text-grafite/75">{t.texto}</p>

              <div className="mt-7 hidden flex-wrap gap-x-6 gap-y-3 text-xs text-grafite/80 sm:flex">
                {t.destaques.map((d) => (
                  <span key={d} className="flex items-center gap-2">
                    <i className="size-1.5 rounded-full bg-ouro" />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <Section denso>
          <CalculadoraGordura figuras={figuras} idioma={idioma} />
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
