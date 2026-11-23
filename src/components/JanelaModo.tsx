"use client";

import type { Idioma } from "@/lib/i18n";
import { gravarModo, type Modo } from "@/lib/useModo";

const TEXTO: Record<Idioma, { pergunta: string; ele: string; ela: string; subEle: string; subEla: string; nota: string }> = {
  pt: {
    pergunta: "Como você quer entrar?",
    ele: "Modo Ele",
    ela: "Modo Ela",
    subEle: "Treino, dieta e resultados de homens",
    subEla: "Treino, dieta e resultados de mulheres",
    nota: "Dá para trocar quando quiser, no topo do site.",
  },
  es: {
    pergunta: "¿Cómo quieres entrar?",
    ele: "Modo Él",
    ela: "Modo Ella",
    subEle: "Entreno, dieta y resultados de hombres",
    subEla: "Entreno, dieta y resultados de mujeres",
    nota: "Puedes cambiarlo cuando quieras, arriba en el sitio.",
  },
  en: {
    pergunta: "How would you like to enter?",
    ele: "His mode",
    ela: "Her mode",
    subEle: "Training, diet and results from men",
    subEla: "Training, diet and results from women",
    nota: "You can switch anytime at the top of the site.",
  },
};

/** A área do aluno (mesma origem, /resetmetabolico/programa) lê as porções daqui. */
const CHAVE_SEXO_APP = "r21-sexo";

/**
 * Tela de entrada Ele / Ela, no espírito do "você tem mais de 18 anos?":
 * cobre o site inteiro até a pessoa escolher.
 *
 * Vem sempre no HTML, escondida; o CSS a mostra só com `data-modo-novo`
 * no <html>, que o script do <head> põe para quem nunca escolheu. Assim
 * ela aparece na primeira pintura, sem o site piscar por baixo, e quem já
 * escolheu nunca a vê. Escolher grava o modo (gravarModo tira o atributo).
 */
export function JanelaModo({ idioma = "pt" }: { idioma?: Idioma }) {
  const t = TEXTO[idioma];

  function escolher(m: Modo) {
    gravarModo(m);
    try {
      localStorage.setItem(CHAVE_SEXO_APP, m === "ela" ? "mulher" : "homem");
    } catch {}
  }

  const opcoes = [
    { m: "ele" as const, rotulo: t.ele, sub: t.subEle, cor: "#c7a06a" },
    { m: "ela" as const, rotulo: t.ela, sub: t.subEla, cor: "#e2a6aa" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="porta-modo-titulo"
      className="janela-modo fixed inset-0 z-[100] flex-col items-center justify-center overflow-y-auto bg-[#0b0a09] px-5 py-10 text-[#f2ede5]"
    >
      <p className="font-serif text-sm uppercase tracking-[0.42em] text-[#f2ede5]/80">Carlos Seiti</p>
      <span aria-hidden className="mt-4 block h-px w-12 bg-[#c7a06a]/60" />

      <h2 id="porta-modo-titulo" className="mt-8 text-balance text-center font-serif text-4xl leading-tight sm:text-5xl">
        {t.pergunta}
      </h2>

      <div className="mt-10 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
        {opcoes.map(({ m, rotulo, sub, cor }) => (
          <button
            key={m}
            type="button"
            onClick={() => escolher(m)}
            style={{ ["--cor" as string]: cor }}
            className="group flex flex-col items-center gap-3 border border-[var(--cor)]/45 px-6 py-9 text-center transition-colors duration-300 hover:border-[var(--cor)] hover:bg-[var(--cor)]/10 focus-visible:border-[var(--cor)] focus-visible:bg-[var(--cor)]/10 focus-visible:outline-none"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-7 text-[var(--cor)]" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
              {m === "ele" ? (
                <>
                  <circle cx="10" cy="14" r="6" />
                  <path d="M14.5 9.5 20 4M15 4h5v5" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="9" r="6" />
                  <path d="M12 15v7M9 19h6" />
                </>
              )}
            </svg>
            <span className="font-serif text-2xl uppercase tracking-[0.18em] text-[var(--cor)]">{rotulo}</span>
            <span className="text-sm text-[#f2ede5]/65">{sub}</span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-[#f2ede5]/50">{t.nota}</p>
    </div>
  );
}
