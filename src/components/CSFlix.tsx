"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Trilha, Video } from "@/lib/csflix";

/* ============================================================
   Cartão de vídeo
   ============================================================ */
function Cartao({ video, aoAbrir }: { video: Video; aoAbrir: () => void }) {
  return (
    <button
      type="button"
      onClick={aoAbrir}
      aria-label={`Ver: ${video.titulo}`}
      className="group w-60 shrink-0 snap-start text-left sm:w-72 lg:w-80"
    >
      <span className="relative block aspect-video overflow-hidden rounded-sm bg-black/60 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-[1.04] group-hover:ring-[#E00513] group-focus-visible:scale-[1.04]">
        <Image
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt=""
          fill
          sizes="(max-width: 640px) 60vw, 320px"
          className="object-cover"
        />

        {/* botão de play, no vermelho da marca */}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="absolute inset-0 bg-black/45" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E00513]">
            <svg viewBox="0 0 24 24" aria-hidden className="ml-1 h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </span>

      <span className="mt-3 block text-[0.85rem] leading-snug text-white/85 transition-colors group-hover:text-white">
        {video.titulo}
      </span>
    </button>
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
          <p className="mt-1.5 text-sm text-white/45">{trilha.descricao}</p>
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
        {trilha.videos.map((v) => (
          <Cartao key={`${trilha.id}-${v.id}`} video={v} aoAbrir={() => aoAbrir(v)} />
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
export function CSFlix({ trilhas }: { trilhas: Trilha[] }) {
  const [aberto, setAberto] = useState<Video | null>(null);

  return (
    <>
      {trilhas.map((t) => (
        <Faixa key={t.id} trilha={t} aoAbrir={setAberto} />
      ))}
      <Player video={aberto} aoFechar={() => setAberto(null)} />
    </>
  );
}
