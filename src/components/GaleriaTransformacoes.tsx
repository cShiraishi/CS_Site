"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { resultados } from "@/lib/content";
import { Arrow } from "./ui";

type Transformacao = (typeof resultados.transformacoes)[number];

export function GaleriaTransformacoes({
  variante = "neon",
}: {
  variante?: "neon" | "ouro";
}) {
  const [selecionada, setSelecionada] = useState<Transformacao | null>(null);

  useEffect(() => {
    if (!selecionada) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelecionada(null);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [selecionada]);

  const isNeon = variante === "neon";

  return (
    <>
      <div className="mt-10 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {resultados.transformacoes.map((pessoa) => (
          <article
            key={pessoa.instagram}
            className={`group flex flex-col overflow-hidden rounded-2xl border bg-[#0e1310] transition-all duration-300 hover:-translate-y-1.5 ${
              isNeon
                ? "border-white/15 hover:border-[#00ff66]/70 hover:shadow-[0_0_40px_rgba(0,255,102,0.2)]"
                : "border-linha hover:border-ouro/65 hover:shadow-[0_24px_55px_-22px_rgba(200,164,92,0.28)]"
            }`}
          >
            {/* Imagem clicável para ampliar em tela cheia — proporção uniforme */}
            <button
              type="button"
              onClick={() => setSelecionada(pessoa)}
              aria-label={`Ampliar foto de antes e depois de ${pessoa.nome}`}
              className="relative block aspect-[10/18] w-full cursor-zoom-in overflow-hidden bg-[#080b09] text-left"
            >
              <Image
                src={pessoa.imagem}
                alt={pessoa.alt}
                fill
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 25vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* Selo superior discreto "Ampliar" */}
              <span
                className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider opacity-90 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 ${
                  isNeon
                    ? "border-[#00ff66]/55 bg-black/75 text-[#00ff66]"
                    : "border-ouro/55 bg-black/75 text-ouro"
                }`}
              >
                <span aria-hidden>🔍</span> Ampliar
              </span>
            </button>

            {/* Barra inferior dedicada (fora da foto, sem cobrir o corpo) */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#0b0f0d] px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate font-display text-xl uppercase leading-tight text-[#f2ede5]">
                  {pessoa.nome}
                </p>
                <a
                  href={pessoa.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-0.5 block truncate text-xs font-medium transition-colors ${
                    isNeon
                      ? "text-[#f2ede5]/75 hover:text-[#00ff66]"
                      : "text-[#f2ede5]/75 hover:text-ouro"
                  }`}
                >
                  {pessoa.instagram}
                </a>
              </div>

              <a
                href={pessoa.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir Instagram de ${pessoa.nome} (${pessoa.instagram})`}
                className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isNeon
                    ? "border-[#00ff66]/55 bg-[#00ff66]/15 text-[#00ff66] hover:bg-[#00ff66] hover:text-[#041208]"
                    : "border-ouro/55 bg-ouro/15 text-ouro hover:bg-ouro hover:text-[#0b0a09]"
                }`}
              >
                <Arrow />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Lightbox para ver o Antes e Depois em tamanho grande */}
      {selecionada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Transformação de ${selecionada.nome}`}
          onClick={() => setSelecionada(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#00ff66]/50 bg-[#0b100d] shadow-[0_0_80px_rgba(0,255,102,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-white/12 px-5 py-3.5">
              <div>
                <p className="font-display text-2xl uppercase text-white">
                  {selecionada.nome}
                </p>
                <p className="text-xs text-[#00ff66]">{selecionada.instagram}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href={selecionada.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#00ff66] px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider text-[#041208] hover:bg-[#4be283]"
                >
                  Ver Instagram <Arrow />
                </a>
                <button
                  type="button"
                  onClick={() => setSelecionada(null)}
                  aria-label="Fechar visualização ampliada"
                  className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-sm font-bold text-white hover:bg-white/15"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto bg-black p-3 sm:p-5">
              <Image
                src={selecionada.imagem}
                alt={selecionada.alt}
                width={selecionada.largura}
                height={selecionada.altura}
                className="mx-auto max-h-[76vh] w-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
