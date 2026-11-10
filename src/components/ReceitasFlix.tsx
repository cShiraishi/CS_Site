"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CATALOGO_RECEITAS,
  formatarViews,
  type PilulaFiltroId,
  type Receita,
  type TrilhaReceitas,
} from "@/lib/receitas";
import {
  TEXTOS_RECEITAS,
  assuntosInteresse,
  pilulasFiltro,
  type TextosReceitas,
} from "@/lib/i18n/receitas";
import type { Idioma } from "@/lib/rotas-idioma";

/* ============================================================
   Destaque — Billboard estilo Netflix (Top 1 em Views)
   ============================================================ */
function Destaque({
  receita,
  total,
  aoAbrir,
  idioma,
  t,
}: {
  receita: Receita;
  total: number;
  aoAbrir: () => void;
  idioma: Idioma;
  t: TextosReceitas;
}) {
  return (
    <section className="relative min-h-[42rem] overflow-hidden pt-32 sm:min-h-[46rem] sm:pt-40 lg:min-h-[50rem]">
      <Image
        src={`https://i.ytimg.com/vi/${receita.videoId}/hqdefault.jpg`}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-center opacity-65 blur-[1px] sm:blur-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-black via-black/75 to-black/15"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black via-black/15 to-black/50"
      />

      <div className="relative mx-auto flex min-h-[34rem] w-full max-w-6xl items-end px-6 pb-40 sm:min-h-[38rem] sm:px-8 lg:min-h-[42rem] lg:px-12 lg:pb-44">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <Image
              src="/csflix/csflix.png"
              alt="CSFlix"
              width={851}
              height={273}
              priority
              className="h-auto w-32 drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:w-40"
            />
            <span className="rounded border border-ouro/45 bg-ouro/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ouro backdrop-blur-sm">
              {t.seloPagina}
            </span>
          </div>

          {/* Selo Top 1 em Alta estilo Netflix */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#E00513] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
              TOP 1
            </span>
            <span className="text-xs font-semibold uppercase tracking-[.14em] text-white/85">
              {t.maisAssistido} · {formatarViews(receita.views, idioma)}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/85">
              {t.rotuloAlimento[receita.alimento]}
            </span>
          </div>

          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">
            {receita.titulo}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-emerald-400">
              {receita.macros.proteina}g {t.proteina}
            </span>
            <span className="rounded border border-white/35 px-1.5 py-0.5 text-[10px] text-white/80">
              {receita.macros.kcal} kcal
            </span>
            <span className="text-white/65">⏱ {receita.tempo}</span>
            <span className="text-white/65">{t.videosCatalogados(total)}</span>
          </div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {receita.subtitulo}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={aoAbrir}
              className="inline-flex items-center gap-3 rounded-md bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-white/80"
            >
              <span className="text-lg">▶</span> {t.assistirAgora}
            </button>
            <a
              href="#catalogo-receitas"
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/25"
            >
              ⓘ {t.explorarCategorias}
            </a>
          </div>

          {t.notaVideos && (
            <p className="mt-5 max-w-xl text-xs text-white/50">{t.notaVideos}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Cartão de receita — com suporte a Ranking Top 10 da Netflix
   ============================================================ */
function Cartao({
  receita,
  aoAbrir,
  posicaoRanking,
  idioma,
  t,
}: {
  receita: Receita;
  aoAbrir: () => void;
  posicaoRanking?: number;
  idioma: Idioma;
  t: TextosReceitas;
}) {
  return (
    <div className="w-64 shrink-0 sm:w-76 lg:w-84">
      <button
        type="button"
        onClick={aoAbrir}
        aria-label={t.verReceita(receita.titulo)}
        className="group min-w-0 w-full flex-1 snap-start text-left"
      >
        <span className="relative block aspect-video overflow-hidden rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,.28)] ring-1 ring-white/10 transition-all duration-500 group-hover:z-10 group-hover:-translate-y-2 group-hover:scale-[1.025] group-hover:shadow-[0_28px_70px_rgba(0,0,0,.55)] group-hover:ring-ouro/45 group-focus-visible:scale-[1.025]">
          <Image
            src={`https://i.ytimg.com/vi/${receita.videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 640px) 65vw, 340px"
            className="object-cover"
          />

          {/* Selo Top Ranking (na 1ª fileira ordenada por views) ou Alimento */}
          {posicaoRanking ? (
            <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md bg-[#E00513] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
              TOP {posicaoRanking}
            </span>
          ) : (
            <span className="absolute left-2.5 top-2.5 rounded-full border border-white/20 bg-black/65 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[.12em] text-white backdrop-blur-md">
              {t.rotuloAlimento[receita.alimento]}
            </span>
          )}

          {/* Views no canto superior direito */}
          <span className="absolute right-2.5 top-2.5 rounded bg-black/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            👁 {formatarViews(receita.views, idioma)}
          </span>

          {/* Faixa rápida de macros na base da miniatura */}
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pb-2 pt-7 text-[10px] text-white/85">
            <span className="font-semibold text-ouro">
              {receita.macros.kcal} kcal · {receita.macros.proteina}g {t.proteina}
            </span>
            <span className="text-white/70">⏱ {receita.tempo}</span>
          </span>

          {/* Botão de play no hover, igual ao CSFlix */}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="absolute inset-0 bg-black/45" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/75 backdrop-blur-md">
              <svg viewBox="0 0 24 24" aria-hidden className="ml-1 h-6 w-6 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </span>

        <span className="mt-3.5 line-clamp-2 block text-[0.86rem] font-medium leading-snug text-white/90 transition-colors group-hover:text-ouro">
          {receita.titulo}
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.12em] text-white/50">
          <b className="font-semibold text-emerald-400">
            {receita.macros.kcal <= 100
              ? t.soKcal(receita.macros.kcal)
              : t.rotuloAlimento[receita.alimento]}
          </b>
          <span>·</span>
          <span>{receita.momento}</span>
        </span>
      </button>
    </div>
  );
}

/* ============================================================
   Faixa — carrossel horizontal estilo Netflix / CSFlix
   ============================================================ */
function Faixa({
  trilha,
  aoAbrir,
  idioma,
  t,
}: {
  trilha: TrilhaReceitas;
  aoAbrir: (r: Receita) => void;
  idioma: Idioma;
  t: TextosReceitas;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const [pode, setPode] = useState({ antes: false, depois: false });

  const medir = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPode({
      antes: el.scrollLeft > 8,
      depois: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    medir();
    const el = pista.current;
    if (!el) return;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [medir, trilha.receitas.length]);

  const deslizar = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="mt-14 first:mt-0">
      <div className="pista flex items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            {trilha.ranking && (
              <span className="rounded bg-[#E00513] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                TOP VIEWS
              </span>
            )}
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              {trilha.nome}
            </h2>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm text-white/60">
            {trilha.descricao}
          </p>
        </div>

        <div className="hidden shrink-0 gap-2 lg:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => deslizar(dir)}
              disabled={dir === -1 ? !pode.antes : !pode.depois}
              aria-label={
                dir === -1 ? `${trilha.nome}: ${t.voltar}` : `${trilha.nome}: ${t.avancar}`
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-[#E00513] hover:text-white disabled:pointer-events-none disabled:opacity-25"
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden
                className={`h-3.5 w-3.5 ${dir === -1 ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={pista}
        onScroll={medir}
        className="pista mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {trilha.receitas.map((r, i) => (
          <Cartao
            key={`${trilha.id}-${r.id}`}
            receita={r}
            aoAbrir={() => aoAbrir(r)}
            posicaoRanking={trilha.ranking ? i + 1 : undefined}
            idioma={idioma}
            t={t}
          />
        ))}
        <span aria-hidden className="w-2 shrink-0 sm:w-4" />
      </div>
    </section>
  );
}

/* ============================================================
   Modal Player do YouTube + Ficha Completa da Receita
   ============================================================ */
function ModalReceita({
  receita,
  aoFechar,
  idioma,
  t,
}: {
  receita: Receita | null;
  aoFechar: () => void;
  idioma: Idioma;
  t: TextosReceitas;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (receita && !d.open) d.showModal();
    if (!receita && d.open) d.close();
  }, [receita]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className="m-auto w-[min(62rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-white/12 bg-[#0b0a09] p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {receita && (
        <div>
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${receita.videoId}?autoplay=1&rel=0`}
              title={receita.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/65">
                  <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-ouro">
                    {t.rotuloAlimento[receita.alimento]}
                  </span>
                  <span>·</span>
                  <span>👁 {formatarViews(receita.views, idioma)} {t.noYoutube}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl leading-tight text-white sm:text-3xl">
                  {receita.titulo}
                </h3>
                <p className="mt-1.5 text-sm text-white/70">{receita.subtitulo}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${receita.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.14em] text-[#E00513] transition-opacity hover:opacity-75"
                >
                  YouTube ↗
                </a>
                <button
                  type="button"
                  onClick={aoFechar}
                  aria-label={t.fechar}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Barra de Macros da Porção */}
            <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-5">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-white/50">
                  {t.macros.calorias}
                </span>
                <span className="mt-1 block font-display text-2xl text-white">
                  {receita.macros.kcal} <small className="text-xs text-white/60">kcal</small>
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-ouro">
                  {t.macros.proteina}
                </span>
                <span className="mt-1 block font-display text-2xl text-ouro">
                  {receita.macros.proteina}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-white/50">
                  {t.macros.carbo}
                </span>
                <span className="mt-1 block font-display text-2xl text-white">
                  {receita.macros.carbo}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-white/50">
                  {t.macros.gordura}
                </span>
                <span className="mt-1 block font-display text-2xl text-white">
                  {receita.macros.gordura}g
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-emerald-400">
                  {t.macros.fibras}
                </span>
                <span className="mt-1 block font-display text-2xl text-emerald-400">
                  {receita.macros.fibras}g
                </span>
              </div>
            </div>

            {/* Ingredientes e Modo de Preparo */}
            <div className="mt-7 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-ouro">
                  {t.ingredientes} · {receita.porcoes}
                </h4>
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10 text-sm">
                  {receita.ingredientes.map((ing) => (
                    <li
                      key={ing.item}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="text-white/85">{ing.item}</span>
                      <span className="shrink-0 font-medium text-ouro">
                        {ing.medida}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-ouro">
                  {t.preparo} · {receita.tempo}
                </h4>
                <ol className="mt-4 space-y-3.5 text-sm leading-relaxed text-white/80">
                  {receita.preparo.map((passo, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ouro/20 text-[11px] font-bold text-ouro">
                        {i + 1}
                      </span>
                      <span>{passo}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Nota de Ciência de Alimentos */}
            <div className="mt-7 rounded-xl border border-ouro/30 bg-ouro/[0.07] p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ouro">
                {t.ciencia}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                {receita.ciencia}
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ============================================================
   Componente Principal — Pílulas Douradas + Fileiras Netflix
   ============================================================ */
export function ReceitasFlix({
  trilhas: trilhasIniciais,
  total,
  idioma = "pt",
  catalogo = CATALOGO_RECEITAS,
}: {
  trilhas: TrilhaReceitas[];
  total: number;
  idioma?: Idioma;
  /** Catálogo já no idioma da página (o servidor localiza). */
  catalogo?: Receita[];
}) {
  const t = TEXTOS_RECEITAS[idioma];
  const assuntos = useMemo(() => assuntosInteresse(idioma), [idioma]);
  const pilulas = useMemo(() => pilulasFiltro(idioma), [idioma]);
  const [aberta, setAberta] = useState<Receita | null>(null);
  const [pilulaAtiva, setPilulaAtiva] = useState<PilulaFiltroId>("todas");

  const trilhasVisiveis = useMemo<TrilhaReceitas[]>(() => {
    if (pilulaAtiva === "todas") {
      return trilhasIniciais;
    }

    const porViews = (a: Receita, b: Receita) => b.views - a.views;

    const filtradas = catalogo.filter((r) =>
      r.interesses.includes(pilulaAtiva),
    ).sort(porViews);

    const assunto = assuntos.find((a) => a.id === pilulaAtiva);

    return [
      {
        id: `filtro-${pilulaAtiva}`,
        nome: `${assunto?.tituloTrilha ?? t.filtro.nomePadrao} · ${t.filtro.sufixo}`,
        descricao: assunto?.descricao ?? t.filtro.descricaoPadrao,
        ranking: true,
        receitas: filtradas,
      },
    ];
  }, [pilulaAtiva, trilhasIniciais, catalogo, assuntos, t]);

  const destaque = trilhasVisiveis[0]?.receitas[0] ?? catalogo[0];

  return (
    <>
      {destaque && (
        <Destaque
          receita={destaque}
          total={total}
          aoAbrir={() => setAberta(destaque)}
          idioma={idioma}
          t={t}
        />
      )}

      <div id="catalogo-receitas" className="relative z-10 -mt-28 pb-16 sm:-mt-32">
        {/* Pílulas de filtro rápido no formato exato que o usuário destacou */}
        <div className="pista mb-10 flex flex-wrap items-center gap-2.5">
          {pilulas.map((p) => {
            const ativo = pilulaAtiva === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPilulaAtiva(p.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  ativo
                    ? "bg-ouro text-[#0b0a09] shadow-[0_8px_24px_rgba(199,160,106,0.35)]"
                    : "border border-white/15 bg-black/65 text-white/80 backdrop-blur-md hover:border-ouro/45 hover:text-white"
                }`}
              >
                {p.rotulo}
              </button>
            );
          })}
        </div>

        {trilhasVisiveis.map((tr) => (
          <Faixa key={tr.id} trilha={tr} aoAbrir={setAberta} idioma={idioma} t={t} />
        ))}
      </div>

      <ModalReceita
        receita={aberta}
        aoFechar={() => setAberta(null)}
        idioma={idioma}
        t={t}
      />
    </>
  );
}
