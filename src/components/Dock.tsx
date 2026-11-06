"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { rotas } from "@/lib/content";

/**
 * Dock de navegação — porta do AppleDock do SmileRender para o site.
 *
 * Mesma mecânica: cada ícone cresce conforme a distância do cursor ao seu
 * centro (escala máxima 1,6 num raio de 200 px), crescendo para cima a
 * partir da base. O que mudou na porta:
 *
 *  · tamanho via `transform: scale` em vez de width/height — não reflui o
 *    layout a cada mousemove, e o vizinho é empurrado pela margem;
 *  · ícones em SVG próprio (o original usava Bootstrap Icons);
 *  · só magnifica com ponteiro fino. No toque, vira barra com rolagem
 *    horizontal e rótulo visível, porque não existe hover para revelar.
 */

type Item = { href: string; label: string; icone: ReactNode; cta?: boolean };

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ITENS: Item[] = [
  {
    href: "/",
    label: "Início",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M4 11 12 4l8 7" />
        <path d="M6 10v10h12V10" />
      </svg>
    ),
  },
  {
    href: rotas.programa,
    label: "90 Dias",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M9 3v4M15 3v4" />
      </svg>
    ),
  },
  {
    href: rotas.calculadora,
    label: "Calorias",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M12 3c3 4 6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 10 9 8 9 5c1.5 1 3 2.5 3 5" />
      </svg>
    ),
  },
  {
    href: rotas.gordura,
    label: "% Gordura",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12 17 7" />
        <path d="M12 4v2M20 12h-2M4 12h2" />
      </svg>
    ),
  },
  {
    href: rotas.prato,
    label: "Prato",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="13" r="7" />
        <circle cx="12" cy="13" r="3.5" />
        <path d="M3 4v6M21 4v16" />
      </svg>
    ),
  },
  {
    href: rotas.raioX,
    label: "Raio-X",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="4.5" r="2" />
        <path d="M12 7v7M8 10h8M12 14l-3 6M12 14l3 6" />
        <path d="M3 3v4M3 3h4M21 21v-4M21 21h-4" />
      </svg>
    ),
  },
  {
    href: rotas.postura,
    label: "Postura",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M12 2v20" strokeDasharray="2 2.5" opacity={0.5} />
        <circle cx="13" cy="5" r="2" />
        <path d="M13 7c-1.5 3-1.5 6 0 9l-1 5M11 10l-3 3M13 16l3 5" />
      </svg>
    ),
  },
  {
    href: rotas.biblioteca,
    label: "Biblioteca",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M5 4h4v16H5zM10 4h4v16h-4z" />
        <path d="m15 5 3.5-1 3 15.5-3.5 1z" />
      </svg>
    ),
  },
  {
    href: rotas.csflix,
    label: "CSFlix",
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m10 9 5 3-5 3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: `${rotas.consultoria}?de=dock`,
    label: "Começar consultoria",
    cta: true,
    icone: (
      <svg viewBox="0 0 24 24" {...s} strokeWidth={2.2}>
        <path d="M5 19 19 5M9 5h10v10" />
      </svg>
    ),
  },
];

/* Home enxuta (nov/2026): o dock deixou de ser um cardápio de dez portas.
   Ficam três ícones e o botão verde; as ferramentas gratuitas moram atrás
   de "Ferramentas", que abre a lista por cima do dock. */
const INICIO = ITENS.find((i) => i.href === "/")!;
const CTA = ITENS.find((i) => i.cta)!;
const FERRAMENTAS = ITENS.filter((i) => i.href !== "/" && !i.cta);

const RESULTADOS: Item = {
  href: "/#resultados",
  label: "Resultados",
  icone: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
};

const ICONE_FERRAMENTAS = (
  <svg viewBox="0 0 24 24" {...s}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

const BASE = 46;
const ESCALA_MAX = 1.5;
const RAIO = 160;

/* No celular não existe hover para revelar o tooltip, e ícone sozinho não
   diz nada a quem chega de um Reel: lá cada botão leva o nome escrito por
   baixo, como uma tab bar. Do sm para cima volta a ser só o ícone. */
const botaoIcone =
  "flex h-[54px] w-[4.1rem] flex-col items-center justify-center gap-1 rounded-[0.95rem] transition-[transform,margin,background-color] duration-150 ease-out sm:size-[46px] sm:gap-0 [&>svg]:size-[22px]";

function Nome({ texto }: { texto: string }) {
  return (
    <span className="text-[0.6rem] font-bold uppercase leading-none tracking-[0.04em] sm:hidden">
      {texto}
    </span>
  );
}
const inativo =
  "bg-white/[0.08] text-[#f2ede5] ring-1 ring-inset ring-white/15 hover:bg-white/[0.14]";
/* Ferramentas é a porta dos Reels: dourado para se separar dos outros. */
const dourado =
  "bg-ouro/15 text-ouro ring-1 ring-inset ring-ouro/60 hover:bg-ouro/25";
const ativoCls = "bg-[#f2ede5] text-[#0b0a09]";

function Rotulo({ texto }: { texto: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-white/10 bg-[#161412]/95 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#f2ede5] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:block"
    >
      {texto}
    </span>
  );
}

export function Dock() {
  const ref = useRef<HTMLUListElement>(null);
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  // O anel dourado pulsa até a pessoa abrir as ferramentas uma vez.
  const [chamar, setChamar] = useState(false);

  useEffect(() => {
    try {
      setChamar(localStorage.getItem("cs_dock_visto") !== "1");
    } catch {
      setChamar(true);
    }
  }, []);

  const alternar = () => {
    setAberto((v) => !v);
    setChamar(false);
    try {
      localStorage.setItem("cs_dock_visto", "1");
    } catch {}
  };

  // Fecha a lista com Esc.
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  useEffect(() => {
    const dock = ref.current;
    if (!dock || !window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const itens = Array.from(dock.querySelectorAll<HTMLElement>("[data-dock]"));
    let quadro = 0;

    const aplicar = (x: number | null) => {
      for (const el of itens) {
        let escala = 1;
        if (x !== null) {
          const r = el.getBoundingClientRect();
          const d = Math.abs(x - (r.left + r.width / 2));
          if (d < RAIO) escala = ESCALA_MAX - (d / RAIO) * (ESCALA_MAX - 1);
        }
        el.style.transform = `scale(${escala})`;
        el.style.marginInline = `${((escala - 1) * BASE) / 2}px`;
      }
    };

    const mover = (e: MouseEvent) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => aplicar(e.clientX));
    };
    const sair = () => {
      cancelAnimationFrame(quadro);
      aplicar(null);
    };

    dock.addEventListener("mousemove", mover);
    dock.addEventListener("mouseleave", sair);
    return () => {
      cancelAnimationFrame(quadro);
      dock.removeEventListener("mousemove", mover);
      dock.removeEventListener("mouseleave", sair);
    };
  }, []);

  const ehAtual = (href: string) =>
    href === "/"
      ? caminho === "/"
      : !href.includes("#") && caminho.startsWith(href.split("?")[0]);
  const ferramentaAtual = FERRAMENTAS.some((f) => ehAtual(f.href));

  return (
    <nav
      aria-label="Navegação principal"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex flex-col items-center px-3 sm:bottom-5"
    >
      {/* Lista das ferramentas gratuitas, por cima do dock. */}
      <div
        id="dock-ferramentas"
        hidden={!aberto}
        className="pointer-events-auto mb-2 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0a09]/90 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      >
        <p className="px-3 pb-1 pt-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#f2ede5]/50">
          Ferramentas gratuitas
        </p>
        <ul className="grid grid-cols-2 gap-1">
          {FERRAMENTAS.map((f) => (
            <li key={f.href}>
              <Link
                href={f.href}
                onClick={() => setAberto(false)}
                aria-current={ehAtual(f.href) ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors [&>svg]:size-[18px] [&>svg]:shrink-0 ${
                  ehAtual(f.href)
                    ? "bg-[#f2ede5] text-[#0b0a09]"
                    : "text-[#f2ede5]/85 hover:bg-white/[0.08] hover:text-[#f2ede5]"
                }`}
              >
                {f.icone}
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul
        ref={ref}
        className="dock-entra pointer-events-auto flex items-center gap-1.5 rounded-[1.4rem] sm:items-end sm:gap-2 border border-white/10 bg-[#0b0a09]/80 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 sm:px-3"
      >
        {[INICIO, RESULTADOS].map((item) => (
          <li
            key={item.href}
            className={`group relative ${item.href === "/" ? "hidden sm:block" : ""}`}
          >
            <Link
              href={item.href}
              onClick={() => setAberto(false)}
              aria-label={item.label}
              aria-current={ehAtual(item.href) ? "page" : undefined}
              data-dock
              style={{ transformOrigin: "bottom center" }}
              className={`${botaoIcone} ${ehAtual(item.href) ? ativoCls : inativo}`}
            >
              {item.icone}
              <Nome texto={item.label} />
            </Link>
            <Rotulo texto={item.label} />
          </li>
        ))}

        <li className="group relative">
          <button
            type="button"
            aria-label="Ferramentas gratuitas"
            aria-expanded={aberto}
            aria-controls="dock-ferramentas"
            onClick={alternar}
            data-dock
            style={{ transformOrigin: "bottom center" }}
            className={`${botaoIcone} ${aberto || ferramentaAtual ? ativoCls : dourado} ${chamar && !aberto ? "dock-chama" : ""}`}
          >
            {ICONE_FERRAMENTAS}
            <Nome texto="Grátis" />
          </button>
          {chamar && !aberto && (
            <span
              aria-hidden
              className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ouro px-1.5 py-0.5 text-[0.55rem] font-bold uppercase leading-none tracking-[0.06em] text-[#0b0a09] sm:hidden"
            >
              Novo
            </span>
          )}
          <Rotulo texto="Ferramentas" />
        </li>

        {/* O botão verde não magnifica: é largo, tem texto e é o único
            elemento do dock que se entende sem tooltip. */}
        <li className="ml-0.5 border-l border-white/10 pl-2 sm:ml-1 sm:pl-2.5">
          <a
            href={CTA.href}
            className="flex h-[54px] items-center gap-2 whitespace-nowrap rounded-[0.95rem] bg-verde px-4 font-bold uppercase text-[#06140b] shadow-[0_8px_22px_rgba(31,193,91,0.4)] transition-colors hover:bg-verde-claro sm:h-[46px] sm:px-5 [&>svg]:size-4"
          >
            {/* No celular quebra em duas linhas: cabe ao lado dos botões com
                nome e lê maior do que numa linha espremida. */}
            <span className="flex flex-col leading-[1.05] sm:flex-row sm:gap-[0.4em]">
              <span className="text-[0.66rem] tracking-[0.1em] sm:text-[0.78rem] sm:tracking-[0.12em]">Começar</span>
              <span className="text-[0.86rem] tracking-[0.06em] sm:text-[0.78rem] sm:tracking-[0.12em]">consultoria</span>
            </span>
            {CTA.icone}
          </a>
        </li>
      </ul>
    </nav>
  );
}
