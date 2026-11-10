"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { rotas } from "@/lib/content";
import { obterConteudo, type Idioma } from "@/lib/i18n";
import { useIdioma } from "@/lib/useIdioma";
import { useModo } from "@/lib/useModo";
import { SeletorModo } from "./SeletorModo";

/**
 * Dock de navegação — porta do AppleDock do SmileRender para o site.
 *
 * Mesma mecânica: cada ícone cresce conforme a distância do cursor ao seu
 * centro (escala máxima 1,6 num raio de 200 px), crescendo para cima a
 * partir da base.
 *
 * Em "Ferramentas gratuitas", os 5 aplicativos interativos (% Gordura,
 * Postura, Raio-X, Calorias e Prato) ficam agrupados dentro da pasta "Apps",
 * e "Receitas Fit" ganha cor própria e apelativa (Coral-Âmbar Gastronômico)
 * tanto no Dock principal quanto no painel de ferramentas.
 */

type Item = { href: string; label: string; icone: ReactNode; cta?: boolean };

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONE_FERRAMENTAS = (
  <svg viewBox="0 0 24 24" {...s}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

const ICONE_RECEITAS_FIT = (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M12 2.5c1.8 2.4 3.5 4.2 3.5 6.5a3.5 3.5 0 1 1-7 0c0-1.6.9-3 1.8-4.2.4 1.1 1.1 1.7 1.7 2.2 0-1.5 0-3 0-4.5Z" />
    <path d="M4.5 13.5h15a6.5 6.5 0 0 1-13 0h-2Z" />
    <path d="M8 21h8" />
  </svg>
);

const ICONE_CTA = (
  <svg viewBox="0 0 24 24" {...s} strokeWidth={2.2}>
    <path d="M5 19 19 5M9 5h10v10" />
  </svg>
);

const BASE = 46;
const ESCALA_MAX = 1.5;
const RAIO = 160;

const botaoIcone =
  "flex h-[54px] w-[4.1rem] flex-col items-center justify-center gap-1 rounded-[0.95rem] transition-[transform,margin,background-color] duration-150 ease-out sm:size-[46px] sm:gap-0 [&>svg]:size-[22px]";

function Nome({ texto }: { texto: string }) {
  return (
    <span className="text-[0.58rem] font-bold uppercase leading-none tracking-[0.03em] sm:hidden">
      {texto}
    </span>
  );
}
const inativo =
  "bg-white/[0.08] text-[#f2ede5] ring-1 ring-inset ring-white/15 hover:bg-white/[0.14]";
/* Ferramentas é a porta dos Reels: dourado para se separar dos outros. */
const dourado =
  "bg-destaque/15 text-destaque ring-1 ring-inset ring-destaque/60 hover:bg-destaque/25";
/* Receitas Fit: Coral-Laranja gastronômico apelativo, distinto do ouro e do verde da consultoria. */
const coralApelativo =
  "bg-gradient-to-br from-[#ff5e3a]/28 via-[#ff7a2f]/22 to-[#ff9f1c]/20 text-[#ff8c42] ring-1 ring-inset ring-[#ff6b35]/75 shadow-[0_0_20px_rgba(255,94,58,0.28)] hover:from-[#ff5e3a]/40 hover:to-[#ff9f1c]/30 hover:text-[#ffb074]";
const ativoCls = "bg-[#f2ede5] text-[#0b0a09]";

const nadaAssinar = () => () => {};

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

/** Ícone visual de pasta estilo iOS/macOS com prévia em grade 2x2 */
function IconePastaApps() {
  return (
    <span
      aria-hidden
      className="grid size-7 shrink-0 grid-cols-2 gap-0.5 rounded-lg border border-destaque/40 bg-destaque/15 p-1 text-destaque"
    >
      <span className=" rounded-[2px] bg-destaque/80" />
      <span className=" rounded-[2px] bg-destaque/55" />
      <span className=" rounded-[2px] bg-destaque/55" />
      <span className=" rounded-[2px] bg-destaque/80" />
    </span>
  );
}

export function Dock({ idioma: idiomaForcado }: { idioma?: Idioma } = {}) {
  const ref = useRef<HTMLUListElement>(null);
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  const [pastaAppsAberta, setPastaAppsAberta] = useState(false);
  const idioma = useIdioma(idiomaForcado);
  const t = obterConteudo(idioma);
  const modo = useModo();

  /* Modo Ela = tudo do Modo Ele + o canal feminino. Enquanto os apps
     não existem, aparecem como "em breve" (sem link quebrado). */
  const APPS_ELA: { label: string; icone: ReactNode }[] = [
    {
      label: t.ui.elaCiclo,
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor" opacity={0.25} />
          <circle cx="12" cy="4" r="1.4" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: t.ui.elaTreinoCasa,
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M4 11 12 4l8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M9 15h6M9 13.5v3M15 13.5v3" />
        </svg>
      ),
    },
    {
      label: t.ui.elaGestacao,
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M11 7.5c-1.5 1.5-2 4-1 6.5l-.5 7.5M12.5 8c2.5 1 4 3 3.5 5.5-.4 2-2.2 2.6-4 2l-.5 5.5" />
        </svg>
      ),
    },
  ];

  const APPS: Item[] = [
    {
      href: rotas.gordura,
      label: t.appsNav[0]?.label ?? "% Gordura",
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 12 17 7" />
          <path d="M12 4v2M20 12h-2M4 12h2" />
        </svg>
      ),
    },
    {
      href: rotas.postura,
      label: t.appsNav[1]?.label ?? "Postura",
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M12 2v20" strokeDasharray="2 2.5" opacity={0.5} />
          <circle cx="13" cy="5" r="2" />
          <path d="M13 7c-1.5 3-1.5 6 0 9l-1 5M11 10l-3 3M13 16l3 5" />
        </svg>
      ),
    },
    {
      href: rotas.raioX,
      label: t.appsNav[2]?.label ?? "Raio-X",
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M12 7v7M8 10h8M12 14l-3 6M12 14l3 6" />
          <path d="M3 3v4M3 3h4M21 21v-4M21 21h-4" />
        </svg>
      ),
    },
    {
      href: rotas.calculadora,
      label: t.appsNav[3]?.label ?? "Calorias",
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M12 3c3 4 6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 10 9 8 9 5c1.5 1 3 2.5 3 5" />
        </svg>
      ),
    },
    {
      href: rotas.prato,
      label: t.appsNav[4]?.label ?? "Prato",
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="13" r="7" />
          <circle cx="12" cy="13" r="3.5" />
          <path d="M3 4v6M21 4v16" />
        </svg>
      ),
    },
  ];

  const CONTEUDOS_GRATIS: Item[] = [
    {
      href: rotas.biblioteca,
      label: t.dockConteudos.biblioteca,
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M5 4h4v16H5zM10 4h4v16h-4z" />
          <path d="m15 5 3.5-1 3 15.5-3.5 1z" />
        </svg>
      ),
    },
    {
      href: rotas.programa,
      label: t.dockConteudos.resetMetabolico,
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M4 10h16M9 3v4M15 3v4" />
        </svg>
      ),
    },
    {
      href: rotas.csflix,
      label: t.dockConteudos.csflix,
      icone: (
        <svg viewBox="0 0 24 24" {...s}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m10 9 5 3-5 3z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  const RECEITAS_FIT_ITEM: Item = {
    href: rotas.receitas,
    label: t.dockConteudos.receitas,
    icone: ICONE_RECEITAS_FIT,
  };

  const INICIO: Item = {
    href: t.rotaHome,
    label: t.ui.inicio,
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M4 11 12 4l8 7" />
        <path d="M6 10v10h12V10" />
      </svg>
    ),
  };

  const RESULTADOS: Item = {
    href: `${t.rotaHome}#resultados`,
    label: t.dockConteudos.resultados,
    icone: (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
  };

  const FERRAMENTAS: Item[] = [...APPS, ...CONTEUDOS_GRATIS, RECEITAS_FIT_ITEM];

  const visto = useSyncExternalStore(
    nadaAssinar,
    () => {
      try {
        return localStorage.getItem("cs_dock_visto") === "1";
      } catch {
        return false;
      }
    },
    () => true,
  );
  const [abriu, setAbriu] = useState(false);
  const chamar = !visto && !abriu;

  const ehAtual = (href: string) =>
    href === "/" || href === "/es" || href === "/en"
      ? caminho === href
      : !href.includes("#") && caminho.startsWith(href.split("?")[0]);
  const appAtual = APPS.some((a) => ehAtual(a.href));
  const receitasAtual = ehAtual(rotas.receitas);
  const ferramentaAtual = FERRAMENTAS.some((f) => ehAtual(f.href));

  const alternar = () => {
    setAberto((v) => {
      const novo = !v;
      if (novo) {
        setPastaAppsAberta(appAtual);
      }
      return novo;
    });
    setAbriu(true);
    try {
      localStorage.setItem("cs_dock_visto", "1");
    } catch {}
  };

  // Fecha a lista com Esc.
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pastaAppsAberta) {
          setPastaAppsAberta(false);
        } else {
          setAberto(false);
        }
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto, pastaAppsAberta]);

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

  const subtituloReceitas =
    idioma === "es"
      ? "Postres < 100 kcal · +30g Proteína · Avena"
      : idioma === "en"
      ? "Desserts < 100 kcal · +30g Protein · Oats"
      : "Sobremesas < 100 kcal · +30g Proteína · Aveia";

  return (
    <nav
      aria-label="Navegação principal"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex flex-col items-center px-3 sm:bottom-5"
    >
      {/* Lista das ferramentas gratuitas, por cima do dock. */}
      <div
        id="dock-ferramentas"
        hidden={!aberto}
        className="pointer-events-auto mb-2 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0a09]/92 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      >
        {!pastaAppsAberta ? (
          <>
            <div className="flex items-center justify-between gap-2 pb-1.5 pl-2.5 pt-0.5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#f2ede5]/50">
                {t.ui.ferramentasGratuitas}
              </p>
              {/* Os apps mudam com o modo: a troca mora junto deles. */}
              <SeletorModo compacto idioma={idioma} />
            </div>

            {/* Card Apelativo RECEITAS FIT em destaque vibrante (Coral-Laranja) */}
            <Link
              href={RECEITAS_FIT_ITEM.href}
              onClick={() => setAberto(false)}
              aria-current={receitasAtual ? "page" : undefined}
              className={`mb-1.5 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ring-1 ring-inset transition-all duration-150 ${
                receitasAtual
                  ? "bg-[#ff6b35] text-[#0b0a09] ring-[#ff8c42]"
                  : "bg-gradient-to-r from-[#ff5e3a]/25 via-[#ff7a2f]/20 to-[#ff9f1c]/15 text-[#ff944d] ring-[#ff6b35]/65 shadow-[0_8px_24px_rgba(255,94,58,0.22)] hover:from-[#ff5e3a]/35 hover:to-[#ff9f1c]/25"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#ff6b35]/60 bg-[#ff5e3a]/25 text-sm"
                >
                  🔥
                </span>
                <span>
                  <span className="block text-sm font-bold leading-tight text-[#fff3eb]">
                    {RECEITAS_FIT_ITEM.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#ffcfb3]/85">
                    {subtituloReceitas}
                  </span>
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-[#ff5e3a] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                TOP VIEWS
              </span>
            </Link>

            {/* Pasta APPS */}
            <button
              type="button"
              onClick={() => setPastaAppsAberta(true)}
              aria-expanded={pastaAppsAberta}
              className={`mb-1.5 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ring-1 ring-inset transition-all duration-150 ${
                appAtual
                  ? "bg-destaque/20 text-destaque ring-destaque/60"
                  : "bg-white/[0.05] text-[#f2ede5] ring-white/12 hover:bg-destaque/15 hover:text-destaque hover:ring-destaque/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <IconePastaApps />
                <span>
                  <span className="block text-sm font-semibold leading-tight">
                    {t.ui.pastaApps}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#f2ede5]/60">
                    {t.ui.appsResumo}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-destaque/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destaque">
                5 apps
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="size-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </span>
            </button>

            <ul className="grid grid-cols-3 gap-1">
              {CONTEUDOS_GRATIS.map((f) => {
                const ehReset = f.href === rotas.programa;
                return (
                  <li key={f.href}>
                    <Link
                      href={f.href}
                      onClick={() => setAberto(false)}
                      aria-current={ehAtual(f.href) ? "page" : undefined}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-xs font-medium ring-1 ring-inset transition-all duration-150 [&>svg]:size-[18px] [&>svg]:shrink-0 ${
                        ehAtual(f.href)
                          ? ehReset
                            ? "bg-[#00ff66] text-[#041208] font-bold ring-transparent shadow-[0_0_20px_rgba(0,255,102,0.45)]"
                            : "bg-[#f2ede5] text-[#0b0a09] ring-transparent"
                          : ehReset
                          ? "bg-[#00ff66]/15 text-[#00ff66] font-bold ring-[#00ff66]/65 shadow-[0_0_18px_rgba(0,255,102,0.2)] hover:bg-[#00ff66]/25"
                          : "text-[#f2ede5]/85 ring-white/8 hover:bg-destaque/15 hover:text-destaque hover:ring-destaque/50"
                      }`}
                    >
                      {f.icone}
                      <span className="leading-tight">{f.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {modo === "ela" && (
              <div className="mt-2 border-t border-white/8 pt-2">
                <p className="px-2.5 pb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-destaque">
                  {t.ui.modoElaEmBreve}
                </p>
                <ul className="grid grid-cols-3 gap-1">
                  {APPS_ELA.map((app) => (
                    <li
                      key={app.label}
                      className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-xs font-medium text-[#f2ede5]/55 ring-1 ring-inset ring-destaque/25 [&>svg]:size-[18px] [&>svg]:shrink-0 [&>svg]:text-destaque/80"
                    >
                      {app.icone}
                      <span className="leading-tight">{app.label}</span>
                      <span className="absolute -top-1.5 right-1 rounded-full bg-destaque px-1.5 py-px text-[0.5rem] font-extrabold uppercase tracking-[0.06em] text-[#0b0a09]">
                        {t.ui.emBreve}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-1.5 flex items-center justify-between px-2 pt-1">
              <button
                type="button"
                onClick={() => setPastaAppsAberta(false)}
                className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-destaque transition-colors hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="size-3.5 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
                {t.ui.voltar}
              </button>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#f2ede5]/50">
                {t.ui.pastaAppsTitulo}
              </span>
            </div>

            <ul className="grid grid-cols-2 gap-1">
              {APPS.map((app) => (
                <li key={app.href}>
                  <Link
                    href={app.href}
                    onClick={() => {
                      setAberto(false);
                      setPastaAppsAberta(false);
                    }}
                    aria-current={ehAtual(app.href) ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm ring-1 ring-inset transition-all duration-150 [&>svg]:size-[18px] [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-150 ${
                      ehAtual(app.href)
                        ? "bg-[#f2ede5] text-[#0b0a09] ring-transparent"
                        : "text-[#f2ede5]/85 ring-transparent hover:translate-x-0.5 hover:bg-destaque/15 hover:text-destaque hover:ring-destaque/50 hover:[&>svg]:scale-115 focus-visible:bg-destaque/15 focus-visible:text-destaque focus-visible:ring-destaque/50"
                    }`}
                  >
                    {app.icone}
                    {app.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <ul
        ref={ref}
        className="dock-entra pointer-events-auto flex items-center gap-1.5 rounded-[1.4rem] sm:items-end sm:gap-2 border border-white/10 bg-[#0b0a09]/80 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 sm:px-3"
      >
        {[INICIO, RESULTADOS].map((item) => (
          <li
            key={item.href}
            className={`group relative ${
              item.href === "/" || item.href === "/es" || item.href === "/en"
                ? "hidden sm:block"
                : ""
            }`}
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

        {/* Botão dedicado RECEITAS FIT na barra principal do Dock com cor Coral-Laranja apelativa */}
        <li className="group relative">
          <Link
            href={RECEITAS_FIT_ITEM.href}
            onClick={() => setAberto(false)}
            aria-label={RECEITAS_FIT_ITEM.label}
            aria-current={receitasAtual ? "page" : undefined}
            data-dock
            style={{ transformOrigin: "bottom center" }}
            className={`${botaoIcone} ${receitasAtual ? ativoCls : coralApelativo}`}
          >
            {RECEITAS_FIT_ITEM.icone}
            <Nome texto="Receitas" />
          </Link>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff5e3a] px-1.5 py-0.5 text-[0.52rem] font-extrabold uppercase leading-none tracking-[0.06em] text-[#0b0a09] shadow-sm"
          >
            FIT
          </span>
          <Rotulo texto={`🔥 ${RECEITAS_FIT_ITEM.label}`} />
        </li>

        <li className="group relative">
          <button
            type="button"
            aria-label={t.ui.ferramentasGratuitas}
            aria-expanded={aberto}
            aria-controls="dock-ferramentas"
            onClick={alternar}
            data-dock
            style={{ transformOrigin: "bottom center" }}
            className={`${botaoIcone} ${aberto || (ferramentaAtual && !receitasAtual) ? ativoCls : dourado} ${chamar && !aberto ? "dock-chama" : ""}`}
          >
            {ICONE_FERRAMENTAS}
            <Nome texto={t.ui.gratisCurto} />
          </button>
          {chamar && !aberto && (
            <span
              aria-hidden
              className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-destaque px-1.5 py-0.5 text-[0.55rem] font-bold uppercase leading-none tracking-[0.06em] text-[#0b0a09] sm:hidden"
            >
              {t.ui.novoBadge}
            </span>
          )}
          <Rotulo texto={t.ui.ferramentasTooltip} />
        </li>

        {/* O botão verde não magnifica: é largo, tem texto e é o único
            elemento do dock que se entende sem tooltip. */}
        <li className="ml-0.5 border-l border-white/10 pl-2 sm:ml-1 sm:pl-2.5">
          <a
            href={`${rotas.consultoria}?de=dock`}
            className="flex h-[54px] items-center gap-2 whitespace-nowrap rounded-[0.95rem] bg-verde px-4 font-bold uppercase text-[#06140b] shadow-[0_8px_22px_rgba(31,193,91,0.4)] transition-colors hover:bg-verde-claro sm:h-[46px] sm:px-5 [&>svg]:size-4"
          >
            <span className="flex flex-col leading-[1.05] sm:flex-row sm:gap-[0.4em]">
              <span className="text-[0.66rem] tracking-[0.1em] sm:text-[0.78rem] sm:tracking-[0.12em]">
                {t.ui.comecarCurto[0]}
              </span>
              <span className="text-[0.86rem] tracking-[0.06em] sm:text-[0.78rem] sm:tracking-[0.12em]">
                {t.ui.comecarCurto[1]}
              </span>
            </span>
            {ICONE_CTA}
          </a>
        </li>
      </ul>
    </nav>
  );
}
