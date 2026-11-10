import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Leitor } from "@/components/Leitor";
import { Arrow, Container, Eyebrow, buttonClass } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { TEXTOS_BIBLIOTECA, livroNoIdioma } from "@/lib/i18n/biblioteca";
import { jsonLdLeitura } from "@/lib/jsonld";
import { lerLeitura, listarLeituras, type Leitura } from "@/lib/leituras";
import { LANG_HTML, metadataPagina, rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * Página de um livro — compartilhada por /leitura/[slug], /es/leitura/[slug]
 * e /en/leitura/[slug]. As páginas do livro são imagens em português; em
 * ES/EN traduzimos a interface e o título, e avisamos o idioma do livro.
 */

/** Slugs para `generateStaticParams` das três rotas. */
export async function paramsLeitura() {
  const slugs = await listarLeituras();
  return slugs.map((slug) => ({ slug }));
}

export async function metadataLeitura(idioma: Idioma, slug: string): Promise<Metadata> {
  const t = TEXTOS_BIBLIOTECA[idioma];
  const original = await lerLeitura(slug);
  if (!original) return { title: t.leituraNaoEncontrada };
  const livro = livroNoIdioma(original, idioma);

  const descricao = livro.subtitulo
    ? t.leituraDescricaoComSub(livro.subtitulo, livro.total)
    : t.leituraDescricaoSemSub(livro.titulo, livro.total);

  const base = metadataPagina({
    idioma,
    caminho: `/leitura/${livro.slug}`,
    titulo: t.leituraSeoTitulo(livro.titulo),
    descricao,
    imagem: {
      url: `/leitura/${livro.slug}/${livro.paginas[0].arquivo}`,
      width: livro.largura,
      height: livro.altura,
      alt: t.capaDe(livro.titulo),
    },
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      title: `${livro.titulo} | ${marca.nome}`,
    },
  };
}

/** JSON-LD: PT usa o de `lib/jsonld`; ES/EN montam a versão localizada. */
function jsonLd(idioma: Idioma, livro: Leitura) {
  if (idioma === "pt") return jsonLdLeitura(livro);
  const t = TEXTOS_BIBLIOTECA[idioma];
  const url = `${marca.site}${rotaIdioma(idioma, `/leitura/${livro.slug}`)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": `${url}#livro`,
        name: livro.titulo,
        ...(livro.subtitulo ? { description: livro.subtitulo } : {}),
        numberOfPages: livro.total,
        // O conteúdo do livro é em português; a página é que está traduzida.
        inLanguage: "pt-BR",
        author: { "@id": `${marca.site}/#pessoa` },
        workExample: {
          "@type": "Book",
          bookFormat: "https://schema.org/EBook",
          readOnlineUrl: url,
          isAccessibleForFree: true,
          inLanguage: "pt-BR",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        inLanguage: LANG_HTML[idioma],
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t.inicio,
            item: `${marca.site}${rotaIdioma(idioma, "/")}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t.biblioteca,
            item: `${marca.site}${rotaIdioma(idioma, rotas.biblioteca)}`,
          },
          { "@type": "ListItem", position: 3, name: livro.titulo, item: url },
        ],
      },
    ],
  };
}

export async function PaginaLeitura({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const t = TEXTOS_BIBLIOTECA[idioma];
  const original = await lerLeitura(slug);
  if (!original) notFound();
  const livro = livroNoIdioma(original, idioma);
  const biblioteca = rotaIdioma(idioma, rotas.biblioteca);

  return (
    <>
      <Header tone="escuro" idioma={idioma} />

      <main className="bg-grafite text-porcelana">
        <Container className="pt-32 sm:pt-40">
          <nav aria-label={t.voceEstaEm} className="pt-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-porcelana/70">
              <li>
                <Link href={rotaIdioma(idioma, "/")} className="transition-colors hover:text-ouro">
                  {t.inicio}
                </Link>
              </li>
              <li aria-hidden className="text-porcelana/70">
                /
              </li>
              <li>
                <Link href={biblioteca} className="transition-colors hover:text-ouro">
                  {t.biblioteca}
                </Link>
              </li>
              <li aria-hidden className="text-porcelana/70">
                /
              </li>
              <li aria-current="page" className="text-porcelana/75">
                {livro.titulo}
              </li>
            </ol>
          </nav>

          <div className="rise flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-10 pt-10">
            <div>
              <Eyebrow tone="claro">{t.leituraEyebrow(livro.total)}</Eyebrow>
              <h1 className="t-title mt-6 text-balance text-porcelana">{livro.titulo}</h1>
              {livro.subtitulo && <p className="mt-3 text-porcelana/70">{livro.subtitulo}</p>}
              {t.notaIdioma && (
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-porcelana/45">
                  {t.notaIdioma}
                </p>
              )}
            </div>
          </div>
        </Container>

        {/* O leitor sangra até a borda: a página fica o maior possível */}
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Leitor livro={livro} idioma={idioma} />
          </div>
        </div>

        <Container className="py-24 sm:py-28">
          <div className="border-t border-porcelana/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-porcelana">{t.leuAteAqui}</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-porcelana/65">{t.proximoPasso}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href={rotaIdioma(idioma, "/#contato")} className={buttonClass("consultoria")}>
                {t.comecarConsultoria}
                <Arrow />
              </Link>
              <Link
                href={biblioteca}
                className="group inline-flex items-center gap-2.5 rounded-full border border-porcelana/25 px-7 py-4 text-sm text-porcelana/80 transition-all duration-300 hover:border-ouro hover:text-ouro"
              >
                {t.voltarBiblioteca}
                <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer idioma={idioma} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(idioma, livro)) }}
      />
    </>
  );
}
