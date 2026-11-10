import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CanalEla } from "./CanalEla";
import { GestacaoSemanas } from "./GestacaoSemanas";
import { UI_GESTACAO } from "@/lib/gestacao";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Arrow, Container, Eyebrow, buttonClass } from "./ui";
import { APPS_ELA, UI_ELA, obterAppEla, rotaEla, totalVideosEla } from "@/lib/canal-ela";
import { marca, rotas } from "@/lib/content";
import type { Idioma } from "@/lib/i18n";

/**
 * Páginas do Canal Ela (hub + um app), compartilhadas pelas rotas
 * /ela, /es/ela e /en/ela. As rotas só escolhem o idioma.
 */

const LOCALE_OG: Record<Idioma, string> = { pt: "pt_BR", es: "es_ES", en: "en_US" };

function alternativas(slug?: string) {
  return {
    "pt-BR": rotaEla("pt", slug),
    es: rotaEla("es", slug),
    en: rotaEla("en", slug),
    "x-default": rotaEla("pt", slug),
  };
}

export function metadataHubEla(idioma: Idioma): Metadata {
  const ui = UI_ELA[idioma];
  return {
    title: ui.hubSeoTitulo,
    description: ui.hubSeoDescricao,
    alternates: { canonical: rotaEla(idioma), languages: alternativas() },
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${rotaEla(idioma)}`,
      title: `${ui.hubSeoTitulo} | ${marca.nome}`,
      description: ui.hubSeoDescricao,
      images: [{ url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: marca.nome }],
    },
  };
}

export function metadataAppEla(idioma: Idioma, slug: string): Metadata {
  const app = obterAppEla(slug);
  if (!app) return {};
  const titulo = app.seo.titulo[idioma];
  const descricao = app.seo.descricao[idioma];
  const capa = app.trilhas[idioma][0]?.videos[0]?.id;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: rotaEla(idioma, slug), languages: alternativas(slug) },
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${rotaEla(idioma, slug)}`,
      title: `${titulo} | ${marca.nome}`,
      description: descricao,
      images: capa
        ? [{ url: `https://i.ytimg.com/vi/${capa}/hqdefault.jpg`, width: 480, height: 360, alt: titulo }]
        : [{ url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: marca.nome }],
    },
  };
}

export const paramsAppsEla = () => APPS_ELA.map((a) => ({ app: a.slug }));

function Titulo({ texto }: { texto: string }) {
  return (
    <h1 className="t-title mt-6 max-w-3xl text-balance text-grafite">
      {texto.split("\n").map((linha, i) => (
        <span key={i} className="block">
          {linha}
        </span>
      ))}
    </h1>
  );
}

function CartoesApps({ idioma, exceto }: { idioma: Idioma; exceto?: string }) {
  const ui = UI_ELA[idioma];
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {APPS_ELA.filter((a) => a.slug !== exceto).map((app) => {
        const capa = app.trilhas[idioma][0].videos[0].id;
        return (
          <li key={app.slug}>
            <Link
              href={rotaEla(idioma, app.slug)}
              className="group block overflow-hidden rounded-2xl border border-linha bg-papel transition-colors hover:border-destaque/60"
            >
              <span
                aria-hidden
                className="block aspect-[16/8] bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-100"
                style={{ backgroundImage: `url(https://i.ytimg.com/vi/${capa}/hqdefault.jpg)` }}
              />
              <span className="block p-5">
                <span className="block font-display text-2xl uppercase leading-none text-grafite">
                  {app.nome[idioma]}
                </span>
                <span className="mt-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-destaque">
                  {totalVideosEla(app, idioma)} {ui.videos}
                  <Arrow />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Fecho({ idioma }: { idioma: Idioma }) {
  const ui = UI_ELA[idioma];
  return (
    <div className="mt-20 border-t border-linha pt-12">
      <h2 className="t-title max-w-xl text-balance text-grafite">{ui.ctaTitulo}</h2>
      <p className="mt-5 max-w-lg leading-relaxed text-grafite/70">{ui.ctaTexto}</p>
      <a href={`${rotas.consultoria}?de=ela`} className={`${buttonClass("consultoria")} mt-8`}>
        {ui.ctaBotao}
        <Arrow />
      </a>
      <p className="mt-10 max-w-xl text-xs leading-relaxed text-grafite/45">{ui.creditos}</p>
    </div>
  );
}

export function HubEla({ idioma }: { idioma: Idioma }) {
  const ui = UI_ELA[idioma];
  return (
    <>
      <Header idioma={idioma} />
      <main className="min-h-screen pb-36 pt-36 sm:pt-44">
        <Container>
          <Eyebrow>{ui.hubEyebrow}</Eyebrow>
          <Titulo texto={ui.hubTitulo} />
          <p className="t-sub mt-6 max-w-2xl text-grafite/75">{ui.hubTexto}</p>
          <div className="mt-14">
            <CartoesApps idioma={idioma} />
          </div>
          <Fecho idioma={idioma} />
        </Container>
      </main>
      <Footer idioma={idioma} />
    </>
  );
}

export function PaginaAppEla({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const app = obterAppEla(slug);
  if (!app) notFound();
  const ui = UI_ELA[idioma];

  return (
    <>
      <Header idioma={idioma} />
      <main className="min-h-screen pb-36 pt-36 sm:pt-44">
        <Container>
          <Link
            href={rotaEla(idioma)}
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-grafite/55 transition-colors hover:text-destaque"
          >
            <Arrow className="rotate-180" />
            {ui.voltarHub}
          </Link>
          <Eyebrow>{app.eyebrow[idioma]}</Eyebrow>
          <Titulo texto={app.titulo[idioma]} />
          <p className="t-sub mt-6 max-w-2xl text-grafite/75">{app.descricao[idioma]}</p>

          <p
            role="note"
            className="mt-8 max-w-2xl rounded-xl border border-destaque/35 bg-destaque/[0.07] px-4 py-3 text-sm leading-relaxed text-grafite/80"
          >
            {app.aviso[idioma]}
          </p>

          {/* Gestação: a linha do tempo semana a semana vem primeiro; as
              trilhas de alimentação, movimento e pós-parto vêm depois. */}
          {app.slug === "gestacao" && (
            <div className="mt-16">
              <GestacaoSemanas idioma={idioma} fechar={ui.fechar} />
              <h2 className="t-title mt-20 text-grafite">{UI_GESTACAO[idioma].alemDasSemanas}</h2>
            </div>
          )}

          <div className={app.slug === "gestacao" ? "mt-10" : "mt-16"}>
            <CanalEla
              trilhas={app.trilhas[idioma]}
              ui={{ assistir: ui.assistir, fechar: ui.fechar, videos: ui.videos }}
            />
          </div>

          <div className="mt-20">
            <p className="t-eyebrow mb-5 text-destaque">{ui.outrosApps}</p>
            <CartoesApps idioma={idioma} exceto={app.slug} />
          </div>

          <Fecho idioma={idioma} />
        </Container>
      </main>
      <Footer idioma={idioma} />
    </>
  );
}
