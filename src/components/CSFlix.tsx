"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gravarArmazenado, lerArmazenado, lerJson, useArmazenado } from "@/lib/useArmazenado";
import type { Trilha, Video } from "@/lib/csflix";
import { UI_CSFLIX, type UiCSFlix } from "@/lib/i18n/csflix";
import { rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

const STORAGE_ASSISTIDOS = "csflix_episodios_assistidos_v1";
const STORAGE_ULTIMO = "csflix_ultimo_episodio_v1";

type SelecaoAtiva = {
  trilha: Trilha;
  indice: number;
};

/* ============================================================
   Destaque — Série Principal estilo Netflix (Começar pelo EP. 01)
   ============================================================ */
function Destaque({
  ui,
  trilhaPrincipal,
  totalEpisodios,
  ultimoAssistido,
  aoComecarSerie,
  aoContinuar,
}: {
  ui: UiCSFlix;
  trilhaPrincipal: Trilha;
  totalEpisodios: number;
  ultimoAssistido: { trilhaId: string; indice: number; titulo: string } | null;
  aoComecarSerie: () => void;
  aoContinuar: () => void;
}) {
  const ep1 = trilhaPrincipal.videos[0];
  if (!ep1) return null;

  return (
    <section className="relative min-h-[43rem] overflow-hidden pt-32 sm:min-h-[47rem] sm:pt-40 lg:min-h-[51rem]">
      <Image
        src={`https://i.ytimg.com/vi/${ep1.id}/hqdefault.jpg`}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-center opacity-65"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-black/55"
      />

      <div className="relative mx-auto flex min-h-[35rem] w-full max-w-6xl items-end px-6 pb-40 sm:min-h-[39rem] sm:px-8 lg:min-h-[43rem] lg:px-12 lg:pb-44">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <Image
              src="/csflix/csflix.png"
              alt="CSFlix"
              width={851}
              height={273}
              priority
              className="h-auto w-36 drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:w-44"
            />
            <span className="rounded border border-[#E00513]/60 bg-[#E00513]/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              {ui.seloOriginal}
            </span>
            {ui.notaVideosPt && (
              <span className="text-[11px] font-medium text-white/60">{ui.notaVideosPt}</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#E00513] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
              {trilhaPrincipal.temporada}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[.14em] text-ouro">
              {trilhaPrincipal.subtitulo}
            </span>
          </div>

          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.03] text-white sm:text-5xl lg:text-6xl">
            {trilhaPrincipal.nome}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-emerald-400">
              {ui.relevancia}
            </span>
            <span className="rounded border border-white/35 px-1.5 py-0.5 text-[10px] text-white/80">
              HD
            </span>
            <span className="text-white/70">
              {ui.episodiosNaTemporada(trilhaPrincipal.videos.length)}
            </span>
            <span className="text-white/55">{ui.noCatalogo(totalEpisodios)}</span>
          </div>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {trilhaPrincipal.descricao}
          </p>

          <p className="mt-2.5 text-xs font-medium text-ouro">
            💡 {trilhaPrincipal.promessaMaratona}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={aoComecarSerie}
              className="inline-flex items-center gap-3 rounded-md bg-white px-7 py-3.5 text-sm font-bold text-black shadow-lg transition hover:bg-white/85"
            >
              <span className="text-lg">▶</span> {ui.assistirEp01}
            </button>

            {ultimoAssistido && (
              <button
                type="button"
                onClick={aoContinuar}
                className="inline-flex items-center gap-2.5 rounded-md border border-ouro/60 bg-ouro/20 px-6 py-3.5 text-sm font-semibold text-ouro backdrop-blur-md transition hover:bg-ouro/30"
              >
                <span>⏯</span> {ui.continuarEp(ultimoAssistido.indice + 1)}
              </button>
            )}

            <a
              href="#temporadas-csflix"
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/25"
            >
              {ui.verTemporadas}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Cartão de Episódio — com numeração sequencial, sinopse e barra de progresso
   ============================================================ */
function CartaoEpisodio({
  ui,
  video,
  indice,
  totalNaTemporada,
  assistido,
  aoAbrir,
}: {
  ui: UiCSFlix;
  video: Video;
  indice: number;
  totalNaTemporada: number;
  assistido: boolean;
  aoAbrir: () => void;
}) {
  const numFormatado = String(indice + 1).padStart(2, "0");

  return (
    <div className="w-72 shrink-0 sm:w-80 lg:w-[22rem]">
      <button
        type="button"
        onClick={aoAbrir}
        aria-label={ui.assistirEpisodioAria(indice + 1, video.titulo)}
        className="group flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#121110] p-3 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-ouro/55 hover:bg-[#181614] hover:shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
      >
        <div>
          {/* Miniatura com Selo de Episódio e Barra Estilo Netflix */}
          <span className="relative block aspect-video overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
            <Image
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 640px) 75vw, 350px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35"
            />

            {/* Badge EP. 01 no topo esquerdo */}
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md bg-[#E00513] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
              EP. {numFormatado}
              <span className="text-white/75 font-normal">/{String(totalNaTemporada).padStart(2, "0")}</span>
            </span>

            {/* Duração ou Status Assistido no topo direito */}
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
              {assistido && (
                <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
                  {ui.visto}
                </span>
              )}
              {video.duracao && (
                <span className="rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {video.duracao}
                </span>
              )}
            </span>

            {/* Ícone Play central no hover */}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex h-13 w-13 items-center justify-center rounded-full border-2 border-white bg-[#E00513]/90 text-white shadow-xl backdrop-blur-md">
                <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-6 w-6 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>

            {/* Barra de Progresso estilo Netflix na base da miniatura */}
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <span
                className={`block h-full transition-all ${
                  assistido ? "w-full bg-[#E00513]" : "w-0 bg-[#E00513] group-hover:w-1/4"
                }`}
              />
            </span>
          </span>

          {/* Título do Episódio */}
          <span className="mt-3.5 block font-display text-lg leading-snug text-white transition-colors group-hover:text-ouro">
            {indice + 1}. {video.titulo}
          </span>

          {/* Sinopse narrativa que gera curiosidade para maratonar */}
          {video.sinopse && (
            <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-white/65">
              {video.sinopse}
            </span>
          )}
        </div>

        {/* Rodapé do Card: Indicador de Continuação */}
        <span className="mt-3.5 flex items-center justify-between border-t border-white/8 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
          <span className="text-ouro">
            {assistido ? ui.assistirNovamente : ui.assistirEpisodio(indice + 1)}
          </span>
          <span className="text-white/45 group-hover:translate-x-0.5 group-hover:text-white transition-transform">
            {indice + 1 < totalNaTemporada ? ui.segueParaEp(indice + 2) : ui.seasonFinale}
          </span>
        </span>
      </button>
    </div>
  );
}

/* ============================================================
   Faixa de Temporada — carrossel horizontal com cabeçalho de série
   ============================================================ */
function FaixaTemporada({
  ui,
  trilha,
  assistidos,
  aoAbrirEpisodio,
}: {
  ui: UiCSFlix;
  trilha: Trilha;
  assistidos: Record<string, boolean>;
  aoAbrirEpisodio: (trilha: Trilha, indice: number) => void;
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
  }, [medir]);

  const deslizar = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const vistosNaTemporada = trilha.videos.filter((v) => assistidos[v.id]).length;

  return (
    <section className="mt-16 first:mt-0">
      <div className="pista flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded bg-[#E00513]/20 border border-[#E00513]/50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ff4d58]">
              {trilha.temporada}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ouro">
              {trilha.icone} {trilha.subtitulo}
            </span>
            {vistosNaTemporada > 0 && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {ui.vistosNaTemporada(vistosNaTemporada, trilha.videos.length)}
              </span>
            )}
          </div>

          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
            {trilha.nome}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-white/65">{trilha.descricao}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => aoAbrirEpisodio(trilha, 0)}
            className="inline-flex items-center gap-2 rounded-full border border-ouro/50 bg-ouro/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ouro transition hover:bg-ouro hover:text-black"
          >
            {ui.comecarPeloEp01}
          </button>

          <div className="hidden gap-1.5 lg:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => deslizar(dir)}
                disabled={dir === -1 ? !pode.antes : !pode.depois}
                aria-label={dir === -1 ? ui.voltar(trilha.nome) : ui.avancar(trilha.nome)}
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
      </div>

      <div
        ref={pista}
        onScroll={medir}
        className="pista mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {trilha.videos.map((v, i) => (
          <CartaoEpisodio
            ui={ui}
            key={`${trilha.id}-${v.id}`}
            video={v}
            indice={i}
            totalNaTemporada={trilha.videos.length}
            assistido={Boolean(assistidos[v.id])}
            aoAbrir={() => aoAbrirEpisodio(trilha, i)}
          />
        ))}
        <span aria-hidden className="w-2 shrink-0 sm:w-4" />
      </div>
    </section>
  );
}

/* ============================================================
   Player Modal em Modo Maratona (Com "Próximo Episódio" e Lista da Temporada)
   ============================================================ */
function PlayerMaratona({
  ui,
  idioma,
  selecao,
  assistidos,
  aoTrocarEpisodio,
  aoFechar,
}: {
  ui: UiCSFlix;
  idioma: Idioma;
  selecao: SelecaoAtiva | null;
  assistidos: Record<string, boolean>;
  aoTrocarEpisodio: (trilha: Trilha, novoIndice: number) => void;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (selecao && !d.open) d.showModal();
    if (!selecao && d.open) d.close();
  }, [selecao]);

  if (!selecao) {
    return <dialog ref={ref} onClose={aoFechar} className="hidden" />;
  }

  const { trilha, indice } = selecao;
  const video = trilha.videos[indice];
  const proximo = indice + 1 < trilha.videos.length ? trilha.videos[indice + 1] : null;
  const anterior = indice > 0 ? trilha.videos[indice - 1] : null;

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className="m-auto max-h-[92vh] w-[min(68rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0a09] p-0 text-white shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md"
    >
      {video && (
        <div>
          {/* Topo do Player */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#12100e] px-5 py-3">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="rounded bg-[#E00513] px-2 py-0.5 font-extrabold uppercase tracking-wider text-white">
                {trilha.temporada}
              </span>
              <span className="font-semibold text-ouro">
                {ui.episodioDe(indice + 1, trilha.videos.length)}
              </span>
              <span className="hidden text-white/45 sm:inline">· {trilha.nome}</span>
            </div>

            <button
              type="button"
              onClick={aoFechar}
              aria-label={ui.fechar}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Vídeo YouTube */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              key={video.id}
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          {/* Barra de Controle de Maratona: Episódio Atual + Botão PRÓXIMO EPISÓDIO */}
          <div className="grid gap-6 border-b border-white/10 bg-[#141210] p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl leading-tight text-white">
                EP. {String(indice + 1).padStart(2, "0")} — {video.titulo}
              </h3>
              {video.sinopse && (
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {video.sinopse}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold uppercase tracking-[0.14em] text-[#E00513] hover:underline"
                >
                  {ui.abrirNoYoutube}
                </a>
                {anterior && (
                  <button
                    type="button"
                    onClick={() => aoTrocarEpisodio(trilha, indice - 1)}
                    className="text-white/60 hover:text-white"
                  >
                    {ui.voltarAoEp(indice)}
                  </button>
                )}
              </div>
            </div>

            {/* Card de Próximo Episódio Estilo Netflix */}
            {proximo ? (
              <div className="rounded-xl border border-ouro/45 bg-ouro/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ouro">
                  {ui.proximoNaMaratona(indice + 2)}
                </p>
                <p className="mt-1 line-clamp-1 font-display text-base text-white">
                  {proximo.titulo}
                </p>
                <button
                  type="button"
                  onClick={() => aoTrocarEpisodio(trilha, indice + 1)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black transition hover:bg-ouro"
                >
                  {ui.assistirProximo}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-400">
                  {ui.fimDaTemporada}
                </p>
                <p className="mt-1 text-xs text-white/75">
                  {ui.aplicarMetodo}
                </p>
                <a
                  href={rotaIdioma(idioma, "/consultoria?de=csflix_maratona")}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1fc15b] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#06140b] transition hover:opacity-90"
                >
                  {ui.comecarMinhaConsultoria}
                </a>
              </div>
            )}
          </div>

          {/* Lista de Todos os Episódios da Temporada dentro do Modal */}
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
              {ui.todosEpisodiosDe(trilha.temporada, trilha.nome)}
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {trilha.videos.map((ep, idx) => {
                const ehAtual = idx === indice;
                const jaViu = Boolean(assistidos[ep.id]);
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => aoTrocarEpisodio(trilha, idx)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      ehAtual
                        ? "border-[#E00513] bg-[#E00513]/15"
                        : "border-white/10 bg-white/[0.03] hover:border-ouro/45 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-12 shrink-0 items-center justify-center rounded text-[10px] font-extrabold uppercase ${
                        ehAtual
                          ? "bg-[#E00513] text-white"
                          : jaViu
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/10 text-white/75"
                      }`}
                    >
                      EP.{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 block text-xs font-semibold text-white">
                        {ep.titulo}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-white/50">
                        {ep.duracao ?? "HD"} {ehAtual ? ui.reproduzindoAgora : jaViu ? ui.assistido : ""}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ============================================================
   Componente Principal CSFlix — Série & Maratona
   ============================================================ */
export function CSFlix({
  trilhas,
  total,
  idioma = "pt",
}: {
  trilhas: Trilha[];
  total: number;
  idioma?: Idioma;
}) {
  const ui = UI_CSFLIX[idioma];
  const [selecao, setSelecao] = useState<SelecaoAtiva | null>(null);
  const [temporadaFiltro, setTemporadaFiltro] = useState<string>("todas");
  type Ultimo = { trilhaId: string; indice: number; titulo: string };
  const assistidosBruto = useArmazenado(STORAGE_ASSISTIDOS);
  const ultimoBruto = useArmazenado(STORAGE_ULTIMO);
  const assistidos = useMemo(
    () => lerJson<Record<string, boolean>>(assistidosBruto) ?? {},
    [assistidosBruto],
  );
  const ultimoAssistido = useMemo(() => lerJson<Ultimo>(ultimoBruto), [ultimoBruto]);

  const abrirEpisodio = useCallback((trilha: Trilha, indice: number) => {
    const ep = trilha.videos[indice];
    if (!ep) return;
    setSelecao({ trilha, indice });

    const antes =
      lerJson<Record<string, boolean>>(lerArmazenado(STORAGE_ASSISTIDOS)) ?? {};
    gravarArmazenado(STORAGE_ASSISTIDOS, JSON.stringify({ ...antes, [ep.id]: true }));

    const registroUltimo: Ultimo = { trilhaId: trilha.id, indice, titulo: ep.titulo };
    gravarArmazenado(STORAGE_ULTIMO, JSON.stringify(registroUltimo));
  }, []);

  const trilhasVisiveis = useMemo(() => {
    if (temporadaFiltro === "todas") return trilhas;
    return trilhas.filter((t) => t.id === temporadaFiltro);
  }, [trilhas, temporadaFiltro]);

  const totalAssistidos = Object.keys(assistidos).length;
  const trilhaDestaque = trilhas[0];

  return (
    <>
      {trilhaDestaque && (
        <Destaque
          ui={ui}
          trilhaPrincipal={trilhaDestaque}
          totalEpisodios={total}
          ultimoAssistido={ultimoAssistido}
          aoComecarSerie={() => abrirEpisodio(trilhaDestaque, 0)}
          aoContinuar={() => {
            if (!ultimoAssistido) return;
            const t = trilhas.find((x) => x.id === ultimoAssistido.trilhaId) ?? trilhaDestaque;
            abrirEpisodio(t, ultimoAssistido.indice);
          }}
        />
      )}

      {/* Barra de Seleção de Temporadas & Progresso de Maratona */}
      <div id="temporadas-csflix" className="relative z-10 -mt-28 pb-20 sm:-mt-32">
        <div className="pista mb-10">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/12 bg-[#11100e]/90 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTemporadaFiltro("todas")}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  temporadaFiltro === "todas"
                    ? "bg-[#E00513] text-white shadow-lg"
                    : "border border-white/15 bg-white/5 text-white/75 hover:border-ouro/50 hover:text-white"
                }`}
              >
                {ui.todasTemporadas(total)}
              </button>

              {trilhas.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemporadaFiltro(t.id)}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    temporadaFiltro === t.id
                      ? "bg-ouro text-black font-bold"
                      : "border border-white/12 bg-white/5 text-white/75 hover:border-ouro/50 hover:text-ouro"
                  }`}
                >
                  {t.icone} {ui.abreviaturaTemporada}{i + 1} · {t.nome.split("·")[0].trim()}
                </button>
              ))}
            </div>

            <div className="shrink-0 text-xs text-white/65">
              {ui.progresso}{" "}
              <strong className="text-emerald-400">
                {ui.episodiosVistos(totalAssistidos, total)}
              </strong>
            </div>
          </div>
        </div>

        {/* Faixas de Temporadas */}
        {trilhasVisiveis.map((t) => (
          <FaixaTemporada
            ui={ui}
            key={t.id}
            trilha={t}
            assistidos={assistidos}
            aoAbrirEpisodio={abrirEpisodio}
          />
        ))}
      </div>

      <PlayerMaratona
        ui={ui}
        idioma={idioma}
        selecao={selecao}
        assistidos={assistidos}
        aoTrocarEpisodio={abrirEpisodio}
        aoFechar={() => setSelecao(null)}
      />
    </>
  );
}
