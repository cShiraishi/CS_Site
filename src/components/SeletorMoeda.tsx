"use client";

import type { Moeda } from "@/lib/produto";
import { useMoeda } from "@/lib/useMoeda";

export function SeletorMoeda({ moedaServidor }: { moedaServidor?: Moeda | null }) {
  const { moeda, alternarMoeda } = useMoeda(moedaServidor);

  return (
    <div
      role="group"
      aria-label="Moeda de exibição"
      className="inline-flex items-center gap-1 rounded-full border border-[#00ff66]/40 bg-[#0b0a09]/90 p-1 text-xs"
    >
      <button
        type="button"
        onClick={() => alternarMoeda("BRL")}
        aria-pressed={moeda === "BRL"}
        className={`cursor-pointer rounded-full px-3 py-1 font-bold transition-all ${
          moeda === "BRL"
            ? "bg-[#00ff66] text-[#041208] shadow-[0_0_14px_rgba(0,255,102,0.45)]"
            : "text-grafite/75 hover:text-grafite"
        }`}
      >
        🇧🇷 R$ 47
      </button>
      <button
        type="button"
        onClick={() => alternarMoeda("EUR")}
        aria-pressed={moeda === "EUR"}
        className={`cursor-pointer rounded-full px-3 py-1 font-bold transition-all ${
          moeda === "EUR"
            ? "bg-[#00ff66] text-[#041208] shadow-[0_0_14px_rgba(0,255,102,0.45)]"
            : "text-grafite/75 hover:text-grafite"
        }`}
      >
        🇵🇹 19 €
      </button>
    </div>
  );
}

export function PrecoDinamico({
  moedaServidor,
  tipo = "preco",
  indiceStack = 0,
}: {
  moedaServidor?: Moeda | null;
  tipo?: "preco" | "ancora" | "stack" | "meios";
  indiceStack?: 0 | 1 | 2 | 3;
}) {
  const { info } = useMoeda(moedaServidor);

  if (tipo === "ancora") return <>{info.precoAncora}</>;
  if (tipo === "stack") return <>{info.stack[indiceStack]}</>;
  if (tipo === "meios") return <>{info.meiosPagamento}</>;
  return <>{info.precoFormatado}</>;
}
