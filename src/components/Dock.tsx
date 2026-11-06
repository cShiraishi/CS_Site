"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
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

const BASE = 46;
const ESCALA_MAX = 1.6;
const RAIO = 200;

export function Dock() {
  const ref = useRef<HTMLUListElement>(null);
  const caminho = usePathname();

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
          // centro sem a escala atual: a largura renderizada já vem escalada
          const centro = r.left + r.width / 2;
          const d = Math.abs(x - centro);
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

  const ativo = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href.split("?")[0]);

  return (
    <nav
      aria-label="Ferramentas"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-5"
    >
      <ul
        ref={ref}
        className="pointer-events-auto flex max-w-full items-end gap-1.5 overflow-x-auto rounded-[1.4rem] border border-white/10 bg-[#0b0a09]/75 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 [scrollbar-width:none] sm:gap-2 sm:overflow-visible sm:px-3"
      >
        {ITENS.map((item, i) => {
          const atual = ativo(item.href);
          return (
            <li
              key={item.href}
              className={`group relative flex shrink-0 flex-col items-center ${
                item.cta ? "ml-1 border-l border-white/10 pl-2.5 sm:ml-1.5 sm:pl-3" : ""
              }`}
            >
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={atual ? "page" : undefined}
                data-dock
                style={{ transformOrigin: "bottom center" }}
                className={`flex size-10 items-center justify-center rounded-[0.8rem] sm:size-[46px] transition-[transform,margin] duration-150 ease-out [&>svg]:size-5 sm:[&>svg]:size-[22px] ${
                  item.cta
                    ? "bg-verde text-[#06140b] shadow-[0_8px_22px_rgba(31,193,91,0.4)]"
                    : atual
                      ? "bg-[#f2ede5] text-[#0b0a09]"
                      : "bg-white/[0.06] text-[#f2ede5]/85 ring-1 ring-inset ring-white/10 hover:bg-white/[0.12] hover:text-[#f2ede5]"
                }`}
              >
                {item.icone}
              </Link>

              {/* Indicador da página atual — o pontinho do dock do macOS. */}
              <span
                aria-hidden
                className={`mt-1 size-1 rounded-full bg-ouro transition-opacity ${
                  atual ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Rótulo: tooltip no desktop; no toque, a lista de 10 itens
                  já rola na horizontal e o aria-label carrega o nome. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-white/10 bg-[#161412]/95 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#f2ede5] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                style={{ zIndex: 60 - i }}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
