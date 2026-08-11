"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Trilha, Video } from "@/lib/csflix";

function Destaque({ video, total, aoAbrir }: { video: Video; total: number; aoAbrir: () => void }) {
  return (
    <section className="relative min-h-[42rem] overflow-hidden pt-32 sm:min-h-[46rem] sm:pt-40 lg:min-h-[50rem]">
      <Image src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-70" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-black via-black/65 to-black/10" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black via-black/5 to-black/45" />
      <div className="relative mx-auto flex min-h-[34rem] w-full max-w-6xl items-end px-6 pb-40 sm:min-h-[38rem] sm:px-8 lg:min-h-[42rem] lg:px-12 lg:pb-44">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-white/80">
            <span className="flex size-6 items-center justify-center rounded-sm bg-[#E00513] text-[10px] text-white">CS</span>
            Seleção CSFlix
          </p>
          <h1 className="mt-5 max-w-xl font-display text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">{video.titulo}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-emerald-400">Novo no canal</span>
            <span className="rounded border border-white/35 px-1.5 py-0.5 text-[10px] text-white/80">HD</span>
            {video.duracao && <span className="text-white/65">{video.duracao}</span>}
            <span className="text-white/65">{total} vídeos selecionados</span>
          </div>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">Ciência, treino e nutrição aplicados à vida real. Comece pelo conteúdo mais recente e continue pelas trilhas abaixo.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={aoAbrir} className="inline-flex items-center gap-3 rounded-md bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-white/80"><span className="text-lg">▶</span> Assistir agora</button>
            <a href="#trilhas" className="inline-flex items-center gap-2 rounded-md bg-white/15 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/25">ⓘ Explorar trilhas</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Cartão de vídeo
   ============================================================ */
function Cartao({ video, aoAbrir, novidade, episodio }: { video: Video; aoAbrir: () => void; novidade?: boolean; episodio?: number }) {
  return (
    <div className="w-60 shrink-0 sm:w-72 lg:w-80">
    <button
      type="button"
      onClick={aoAbrir}
      aria-label={`Ver: ${video.titulo}`}
      className="group min-w-0 flex-1 snap-start text-left"
    >
      <span className="relative block aspect-video overflow-hidden rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,.28)] ring-1 ring-white/10 transition-all duration-500 group-hover:z-10 group-hover:-translate-y-2 group-hover:scale-[1.025] group-hover:shadow-[0_28px_70px_rgba(0,0,0,.55)] group-hover:ring-ouro/45 group-focus-visible:scale-[1.025]">
        <Image
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt=""
          fill
          sizes="(max-width: 640px) 60vw, 320px"
          className="object-cover"
        />
        {video.duracao && (
          <span className="absolute right-2 top-2 rounded bg-black/80 px-1.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            {video.duracao}
          </span>
        )}
        {novidade && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[.14em] text-white backdrop-blur-md">
            Novo
          </span>
        )}

        {/* botão de play, no vermelho da marca */}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="absolute inset-0 bg-black/45" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/75 backdrop-blur-md">
            <svg viewBox="0 0 24 24" aria-hidden className="ml-1 h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </span>

      <span className="mt-3.5 block text-[0.85rem] font-medium leading-snug text-white/85 transition-colors group-hover:text-ouro">
        {video.titulo}
      </span>
      <span className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[.13em] text-white/50">
        <b className="font-medium text-emerald-400">{episodio ? `Episódio ${String(episodio).padStart(2, "0")}` : "Conteúdo CS"}</b>
        <span>HD</span>
      </span>
    </button>
    </div>
  );
}

/* ============================================================
   Faixa — carrossel horizontal
   ============================================================ */
function Faixa({
  trilha,
  aoAbrir,
}: {
  trilha: Trilha;
  aoAbrir: (v: Video) => void;
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

  return (
    <section className="mt-14 first:mt-0">
      <div className="pista flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            {trilha.nome}
          </h2>
          <p className="mt-1.5 text-sm text-white/60">{trilha.descricao}</p>
        </div>

        <div className="hidden shrink-0 gap-2 lg:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => deslizar(dir)}
              disabled={dir === -1 ? !pode.antes : !pode.depois}
              aria-label={dir === -1 ? `${trilha.nome}: voltar` : `${trilha.nome}: avançar`}
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
        {trilha.videos.map((v, i) => (
          <Cartao
            key={`${trilha.id}-${v.id}`}
            video={v}
            aoAbrir={() => aoAbrir(v)}
            novidade={trilha.id === "lancamentos" && i < 3}
            episodio={trilha.id !== "lancamentos" ? i + 1 : undefined}
          />
        ))}
        <span aria-hidden className="w-2 shrink-0 sm:w-4" />
      </div>
    </section>
  );
}

/* ============================================================
   Player — o iframe só nasce ao clicar, então a página carrega
   sem nenhum pedido ao YouTube.
   ============================================================ */
function Player({ video, aoFechar }: { video: Video | null; aoFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (video && !d.open) d.showModal();
    if (!video && d.open) d.close();
  }, [video]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className="m-auto w-[min(62rem,calc(100vw-2rem))] rounded-sm bg-black p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {video && (
        <div>
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          <div className="flex items-start justify-between gap-6 p-6">
            <div>
              <h3 className="font-display text-xl leading-tight">{video.titulo}</h3>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs uppercase tracking-[0.14em] text-[#E00513] transition-opacity hover:opacity-75"
              >
                Abrir no YouTube ↗
              </a>
            </div>
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ============================================================ */
export function CSFlix({ trilhas, total }: { trilhas: Trilha[]; total: number }) {
  const [aberto, setAberto] = useState<Video | null>(null);
  const destaque = trilhas[0]?.videos[0];

  return (
    <>
      {destaque && <Destaque video={destaque} total={total} aoAbrir={() => setAberto(destaque)} />}
      <div id="trilhas" className="relative z-10 -mt-28 pb-16 sm:-mt-32">
        {trilhas.map((t) => (
          <Faixa key={t.id} trilha={t} aoAbrir={setAberto} />
        ))}
      </div>
      <Player video={aberto} aoFechar={() => setAberto(null)} />
    </>
  );
}
