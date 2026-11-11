import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CapaCurso } from "@/components/CapaCurso";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrecoDinamico } from "@/components/SeletorMoeda";
import { Container } from "@/components/ui";
import { VitrineCursos } from "@/components/VitrineCursos";
import { marca, rotas } from "@/lib/content";
import { CURSOS, UI_CURSOS, type Curso } from "@/lib/cursos";
import { LANG_HTML, metadataPagina, rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * Vitrine de cursos (/cursos) e página de cada curso com módulos
 * (/cursos/[slug]), nos três idiomas. As rotas só escolhem o idioma.
 */

const LOGO_RESET = { url: "/brand/reset-metabolico-21d.jpg", width: 1024, height: 512 };

export const ROTA_CURSOS = "/cursos";

export function cursosComPagina(): Curso[] {
  return CURSOS.filter((c) => c.modulos);
}

export function metadataCursos(idioma: Idioma): Metadata {
  const t = UI_CURSOS[idioma];
  return metadataPagina({
    idioma,
    caminho: ROTA_CURSOS,
    titulo: t.seoTitulo,
    descricao: t.seoDescricao,
    imagem: { ...LOGO_RESET, alt: `${t.nome} | ${marca.nome}` },
  });
}

export function metadataCurso(idioma: Idioma, slug: string): Metadata {
  const c = CURSOS.find((x) => x.slug === slug && x.modulos);
  if (!c) return {};
  const t = UI_CURSOS[idioma];
  const n = c.modulos!.length;
  return metadataPagina({
    idioma,
    caminho: `${ROTA_CURSOS}/${c.slug}`,
    titulo: `${c.titulo[idioma]} ${c.duracao?.[idioma] ?? ""}: ${t.modulosTitulo(n).toLowerCase()}`.replace(/\s+:/, ":"),
    descricao: c.descricao[idioma],
    imagem: { ...LOGO_RESET, alt: `${c.titulo[idioma]} | ${marca.nome}` },
  });
}

function breadcrumb(idioma: Idioma, itens: { nome: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: itens.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nome,
      item: `${marca.site}${it.url}`,
    })),
  };
}

/* ============================================================
   /cursos
   ============================================================ */

export function PaginaCursos({ idioma }: { idioma: Idioma }) {
  const t = UI_CURSOS[idioma];
  const reset = CURSOS[0];
  const url = rotaIdioma(idioma, ROTA_CURSOS);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: `${marca.site}${url}`,
        name: t.titulo,
        inLanguage: LANG_HTML[idioma],
        author: { "@id": `${marca.site}/#pessoa` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: CURSOS.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Course",
              name: c.titulo[idioma],
              description: c.descricao[idioma],
              provider: { "@type": "Person", name: marca.nome, url: marca.site },
              ...(c.modulos ? { url: `${marca.site}${rotaIdioma(idioma, `${ROTA_CURSOS}/${c.slug}`)}` } : {}),
            },
          })),
        },
      },
      breadcrumb(idioma, [
        { nome: t.breadcrumbInicio, url: rotaIdioma(idioma, "/") },
        { nome: t.nome, url },
      ]),
    ],
  };

  return (
    <>
      <Header tone="escuro" idioma={idioma} />
      <main className="min-h-screen overflow-hidden bg-porcelana text-grafite">
        {/* Abertura */}
        <section className="relative pb-10 pt-28 sm:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,color-mix(in_srgb,var(--color-verde)_16%,transparent),transparent_55%),radial-gradient(ellipse_at_90%_0%,color-mix(in_srgb,var(--color-ouro)_14%,transparent),transparent_50%)]"
          />
          <Container className="relative">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ouro">{t.eyebrow}</p>
            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <h1 className="font-display text-4xl uppercase leading-[0.95] text-balance sm:text-6xl">
                  {t.titulo}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-grafite/85 sm:text-lg">{t.texto}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={rotaIdioma(idioma, `${ROTA_CURSOS}/${reset.slug}`)}
                    className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-verde px-6 text-sm font-extrabold uppercase tracking-wider text-[#0b0a09] shadow-[0_0_28px_color-mix(in_srgb,var(--color-verde)_40%,transparent)] transition-opacity hover:opacity-90"
                  >
                    {t.ctaComecar} · <PrecoDinamico />
                  </Link>
                  <a
                    href="#trilha"
                    className="inline-flex min-h-12 items-center rounded-xl border border-grafite/20 px-6 text-sm font-bold text-grafite/85 transition-colors hover:border-grafite/50 hover:text-grafite"
                  >
                    {t.ctaTrilha} ↓
                  </a>
                </div>
              </div>
              <ul className="hidden grid-cols-2 gap-3 lg:grid">
                {t.pilares.map((p, i) => (
                  <li
                    key={p}
                    className="rounded-2xl border border-grafite/10 bg-white/[0.03] p-4 text-sm font-semibold uppercase leading-snug tracking-wide sm:p-5"
                  >
                    <span className={`block font-display text-3xl ${i < 2 ? "text-verde" : "text-ouro"}`}>
                      0{i + 1}
                    </span>
                    <span className="mt-2 block text-grafite/85">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Trilha */}
        <section id="trilha" className="scroll-mt-24 pb-16 pt-6">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl uppercase sm:text-4xl">{t.trilhaTitulo}</h2>
              <p className="text-sm text-grafite/70">{t.trilhaTexto}</p>
            </div>
            <div className="mt-6">
              <VitrineCursos idioma={idioma} />
            </div>
          </Container>
        </section>

        {/* Já é aluno */}
        <section className="pb-32">
          <Container>
            <div className="flex flex-col gap-6 rounded-3xl border border-grafite/10 bg-white/[0.03] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <h2 className="font-display text-2xl uppercase sm:text-3xl">{t.alunoTitulo}</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-grafite/75">{t.alunoTexto}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/minha-conta"
                  className="inline-flex min-h-11 items-center rounded-xl bg-grafite px-5 text-sm font-bold text-porcelana transition-opacity hover:opacity-90"
                >
                  {t.alunoEntrar}
                </Link>
                <Link
                  href={`${rotas.programa}/area?demo=1`}
                  className="inline-flex min-h-11 items-center rounded-xl border border-grafite/20 px-5 text-sm font-bold text-grafite/85 transition-colors hover:border-grafite/50"
                >
                  {t.alunoPreview}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer idioma={idioma} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

/* ============================================================
   /cursos/[slug]
   ============================================================ */

export function PaginaCurso({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const c = CURSOS.find((x) => x.slug === slug && x.modulos);
  if (!c || !c.modulos) notFound();
  const t = UI_CURSOS[idioma];
  const venda = rotaIdioma(idioma, c.href ?? rotas.programa);
  const urlCursos = rotaIdioma(idioma, ROTA_CURSOS);
  const url = rotaIdioma(idioma, `${ROTA_CURSOS}/${c.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        url: `${marca.site}${url}`,
        name: c.titulo[idioma],
        description: c.descricao[idioma],
        inLanguage: LANG_HTML[idioma],
        provider: { "@type": "Person", name: marca.nome, url: marca.site },
        syllabusSections: c.modulos.map((m) => ({
          "@type": "Syllabus",
          name: m.titulo[idioma],
          description: m.texto[idioma],
        })),
      },
      breadcrumb(idioma, [
        { nome: t.breadcrumbInicio, url: rotaIdioma(idioma, "/") },
        { nome: t.nome, url: urlCursos },
        { nome: c.titulo[idioma], url },
      ]),
    ],
  };

  const cta = (
    <Link
      href={venda}
      className="inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-verde px-7 text-sm font-extrabold uppercase tracking-wider text-[#0b0a09] shadow-[0_0_28px_color-mix(in_srgb,var(--color-verde)_40%,transparent)] transition-opacity hover:opacity-90"
    >
      {t.garantir} · <PrecoDinamico />
    </Link>
  );

  return (
    <>
      <Header tone="escuro" idioma={idioma} />
      <main className="min-h-screen overflow-hidden bg-porcelana text-grafite">
        <section className="relative pb-10 pt-28 sm:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_15%,color-mix(in_srgb,var(--color-verde)_18%,transparent),transparent_55%),radial-gradient(ellipse_at_95%_0%,color-mix(in_srgb,var(--color-ouro)_14%,transparent),transparent_50%)]"
          />
          <Container className="relative">
            <Link href={urlCursos} className="text-sm text-grafite/70 transition-colors hover:text-grafite">
              ← {t.voltarCursos}
            </Link>
            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-2xl border border-verde/40 bg-[#030b05] p-2 shadow-[0_0_50px_color-mix(in_srgb,var(--color-verde)_22%,transparent)]">
                <Image
                  src={LOGO_RESET.url}
                  alt={c.titulo[idioma]}
                  width={LOGO_RESET.width}
                  height={LOGO_RESET.height}
                  priority
                  sizes="(max-width: 1024px) 95vw, 560px"
                  className="h-auto w-full rounded-xl"
                />
              </div>
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-verde">
                  {t.programaCompleto(c.duracao?.[idioma] ?? "")}
                </p>
                <h1 className="mt-3 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
                  {c.titulo[idioma]} {c.duracao?.[idioma]}
                </h1>
                <p className="mt-5 leading-relaxed text-grafite/85 sm:text-lg">{c.descricao[idioma]}</p>
                {c.beneficios && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.beneficios[idioma].map((b) => (
                      <li
                        key={b}
                        className="rounded-full border border-verde/40 bg-verde/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-verde"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-8">{cta}</div>
                <p className="mt-3 text-xs text-grafite/60">{t.meios}</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-16 pt-8">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl uppercase sm:text-4xl">{t.modulosTitulo(c.modulos.length)}</h2>
              <p className="text-sm text-grafite/70">{t.modulosTexto}</p>
            </div>
            <ol className="-mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 pt-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
              {c.modulos.map((m, i) => (
                <li key={m.titulo.pt} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
                  <Link href={venda} className="group block h-full rounded-2xl outline-none">
                    <CapaCurso
                      formato="cartao"
                      tom={m.tom}
                      icone={m.icone}
                      selo={`${t.modulo} ${String(i + 1).padStart(2, "0")}`}
                      titulo={m.titulo[idioma]}
                      texto={m.texto[idioma]}
                      acao={t.garantir}
                    />
                  </Link>
                </li>
              ))}
              {/* No desktop, a 8ª casa da grade (7 módulos) vira a chamada. */}
              <li className="hidden lg:block">
                <Link
                  href={venda}
                  className="flex h-full min-h-[19rem] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-verde/50 bg-verde/[0.06] p-6 text-center transition-colors hover:border-verde hover:bg-verde/[0.12]"
                >
                  <span className="font-display text-5xl text-verde">
                    <PrecoDinamico />
                  </span>
                  <span className="text-sm font-extrabold uppercase tracking-wider text-verde">{t.garantir} →</span>
                  <span className="text-xs text-grafite/60">{t.meios}</span>
                </Link>
              </li>
            </ol>
          </Container>
        </section>

        <section className="pb-32">
          <Container>
            <div className="flex flex-col items-start gap-6 rounded-3xl border border-verde/30 bg-verde/[0.06] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <p className="font-display text-2xl uppercase sm:text-3xl">
                  {c.titulo[idioma]} {c.duracao?.[idioma]}
                </p>
                <p className="mt-2 text-sm text-grafite/75">{c.inclui[idioma].join(" · ")}</p>
              </div>
              {cta}
            </div>
          </Container>
        </section>
      </main>
      <Footer idioma={idioma} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
