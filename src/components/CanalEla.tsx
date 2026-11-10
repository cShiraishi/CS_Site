"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TrilhaEla } from "@/lib/canal-ela";

/**
 * Trilhas do Canal Ela: uma fileira de vídeos por tema; o clique abre o
 * player do YouTube (youtube-nocookie) num <dialog>, com a trilha ao lado
 * para seguir em sequência. Só carrega o iframe quando alguém dá play.
 */
type Selecao = { trilha: TrilhaEla; indice: number };

export function CanalEla({
  trilhas,
  ui,
}: {
  trilhas: TrilhaEla[];
  ui: { assistir: string; fechar: string; videos: string };
}) {
  const [selecao, setSelecao] = useState<Selecao | null>(null);

  return (
    <>
      <div className="space-y-14 sm:space-y-16">
        {trilhas.map((trilha) => (
          <section key={trilha.id} aria-labelledby={`trilha-${trilha.id}`}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
              <div>
                <h2
                  id={`trilha-${trilha.id}`}
                  className="font-display text-2xl uppercase leading-none text-grafite sm:text-3xl"
                >
                  {trilha.nome}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-grafite/65">
                  {trilha.descricao}
                </p>
              </div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-destaque">
                {trilha.videos.length} {ui.videos}
              </span>
            </div>

            {/* Fileira com rolagem lateral no celular, grade no desktop. */}
            <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {trilha.videos.map((video, i) => (
                <li key={video.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelecao({ trilha, indice: i })}
                    aria-label={`${ui.assistir}: ${video.titulo} — ${video.canal}`}
                    className="group block w-full text-left"
                  >
                    <span className="relative block aspect-video overflow-hidden rounded-xl border border-linha bg-papel">
                      <Image
                        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 78vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                      />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-destaque/90 text-[#0b0a09] opacity-90 shadow-lg transition-transform duration-300 group-hover:scale-110"
                      >
                        <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor">
                          <path d="M8 5.5v13l11-6.5z" />
                        </svg>
                      </span>
                      <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[0.68rem] font-semibold tabular-nums text-white">
                        {video.duracao}
                      </span>
                    </span>
                    <span className="mt-3 block text-sm font-semibold leading-snug text-grafite transition-colors group-hover:text-destaque">
                      {video.titulo}
                    </span>
                    <span className="mt-1 block text-xs text-grafite/55">{video.canal}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Player selecao={selecao} ui={ui} aoTrocar={setSelecao} aoFechar={() => setSelecao(null)} />
    </>
  );
}

function Player({
  selecao,
  ui,
  aoTrocar,
  aoFechar,
}: {
  selecao: Selecao | null;
  ui: { fechar: string };
  aoTrocar: (s: Selecao) => void;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (selecao && !d.open) d.showModal();
    if (!selecao && d.open) d.close();
  }, [selecao]);

  const video = selecao ? selecao.trilha.videos[selecao.indice] : null;

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className="m-auto max-h-[92vh] w-[min(64rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0a09] p-0 text-[#f2ede5] shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md"
    >
      {selecao && video && (
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
            <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-destaque">
              {selecao.trilha.nome}
            </p>
            <button
              type="button"
              onClick={aoFechar}
              aria-label={ui.fechar}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="relative aspect-video w-full bg-black">
            <iframe
              key={video.id}
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold leading-snug">{video.titulo}</h3>
            <p className="mt-1 text-sm text-white/55">{video.canal}</p>

            {selecao.trilha.videos.length > 1 && (
              <ol className="mt-5 grid gap-1.5 sm:grid-cols-2">
                {selecao.trilha.videos.map((outro, i) => {
                  const atual = i === selecao.indice;
                  return (
                    <li key={outro.id}>
                      <button
                        type="button"
                        onClick={() => aoTrocar({ trilha: selecao.trilha, indice: i })}
                        aria-current={atual ? "true" : undefined}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          atual
                            ? "bg-destaque/15 text-destaque ring-1 ring-inset ring-destaque/50"
                            : "text-white/75 hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className="w-5 shrink-0 text-xs tabular-nums opacity-60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 truncate">{outro.titulo}</span>
                        <span className="shrink-0 text-xs tabular-nums opacity-60">{outro.duracao}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
