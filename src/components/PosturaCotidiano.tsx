"use client";

import { useState } from "react";
import type { Figura, Pose, Situacao } from "@/lib/postura-cotidiano";
import { UI_COTIDIANO, exercicioLocal, situacoes } from "@/lib/i18n/postura";
import type { Idioma } from "@/lib/rotas-idioma";

/* ── Figura animada ────────────────────────────────────────────
   As duas poses ficam sempre no SVG. Ao trocar, a pose habitual vira
   fantasma tracejado e a ajustada se desenha por cima (stroke-dashoffset
   com pathLength = 1). É a transição que o reel mostra. */

function Corpo({ pose, visivel, fantasma }: { pose: Pose; visivel: boolean; fantasma: boolean }) {
  return (
    <g
      className="transition-opacity duration-700"
      style={{ opacity: visivel ? 1 : fantasma ? 0.16 : 0 }}
    >
      {pose.cena?.map((d) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className="fill-none stroke-grafite/45 transition-[stroke-dashoffset] duration-[900ms] ease-out"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1}
          strokeDashoffset={visivel || fantasma ? 0 : 1}
        />
      ))}
      {pose.corpo.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className="fill-none stroke-grafite transition-[stroke-dashoffset] ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ transitionDuration: "1100ms", transitionDelay: visivel ? `${i * 90}ms` : "0ms" }}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={fantasma ? "0.02 0.025" : 1}
          strokeDashoffset={visivel || fantasma ? 0 : 1}
        />
      ))}
      <circle
        cx={pose.cabeca[0]}
        cy={pose.cabeca[1]}
        r={13}
        className="fill-porcelana stroke-grafite"
        strokeWidth={6}
      />
      {!fantasma &&
        pose.juntas.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} className="fill-ouro" />
        ))}
    </g>
  );
}

function Palco({ figura, certo }: { figura: Figura; certo: boolean }) {
  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" role="img" aria-hidden>
      {figura.prumo !== undefined && (
        <line
          x1={figura.prumo}
          x2={figura.prumo}
          y1={10}
          y2={240}
          className={`transition-colors duration-700 ${certo ? "stroke-ouro" : "stroke-grafite/20"}`}
          strokeWidth={1.2}
          strokeDasharray="4 5"
        />
      )}
      {figura.cena.map((d) => (
        <path
          key={d}
          d={d}
          className="fill-none stroke-grafite/30"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      <Corpo pose={figura.errado} visivel={!certo} fantasma={certo} />
      <Corpo pose={figura.certo} visivel={certo} fantasma={false} />

      {/* Pontos de carga: pulsam na pose habitual, somem na ajustada. */}
      <g className="transition-opacity duration-500" style={{ opacity: certo ? 0 : 1 }}>
        {figura.tensao.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={11} className="pulso fill-[#e2563b]/25" />
            <circle cx={x} cy={y} r={4} className="fill-[#e2563b]" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ── Cartão de uma situação ────────────────────────────────── */

function CartaoSituacao({ s, idioma }: { s: Situacao; idioma: Idioma }) {
  const [certo, setCerto] = useState(false);
  const ui = UI_COTIDIANO[idioma];

  return (
    <article
      id={s.id}
      className="relative scroll-mt-40 border-t border-linha py-16 sm:py-24"
    >
      {/* O número gigante em contorno — a assinatura agressiva da página. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[9rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(199,160,106,0.28)] sm:-top-10 sm:text-[15rem]"
      >
        {s.n}
      </span>

      <div className="relative grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        {/* Palco — 4:5, o enquadramento do feed. */}
        <div className="lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-linha bg-[radial-gradient(120%_80%_at_50%_0%,var(--color-papel-claro),var(--color-porcelana)_70%)]">
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
              <span className="t-eyebrow text-ouro-profundo">{s.n} · {s.curto}</span>
              <span
                className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
                  certo ? "bg-ouro text-[#0b0a09]" : "bg-[#e2563b]/15 text-[#ff8a70]"
                }`}
              >
                {certo ? ui.seloCerto : ui.seloErrado}
              </span>
            </div>
            <div className="absolute inset-0 px-3 pb-[4.5rem] pt-12">
              <Palco figura={s.figura} certo={certo} />
            </div>

            {/* Alternador — grande o bastante para tocar filmando. */}
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 rounded-xl border border-linha bg-porcelana/80 p-1 backdrop-blur">
              <span
                aria-hidden
                className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-grafite transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                  certo ? "translate-x-full" : ""
                }`}
              />
              {[
                { v: false, rotulo: ui.botaoErrado },
                { v: true, rotulo: ui.botaoCerto },
              ].map(({ v, rotulo }) => (
                <button
                  key={rotulo}
                  type="button"
                  aria-pressed={certo === v}
                  onClick={() => setCerto(v)}
                  className={`relative z-10 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    certo === v ? "text-porcelana" : "text-grafite/60 hover:text-grafite"
                  }`}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Texto */}
        <div>
          <h2 className="t-title text-balance">{s.titulo}</h2>
          <p className="mt-5 max-w-xl font-serif text-[1.35rem] italic leading-snug text-grafite/80">
            {s.frase}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {s.incomoda.map((x) => (
              <span
                key={x}
                className="flex items-center gap-2 rounded-full border border-[#e2563b]/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#ff8a70]"
              >
                <i aria-hidden className="size-1.5 rounded-full bg-[#e2563b]" />
                {x}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-xl text-[0.98rem] leading-relaxed text-grafite/75">
            {s.oQueAcontece}
          </p>

          <h3 className="t-eyebrow mt-12 text-ouro-profundo">{ui.comoArrumar}</h3>
          <ol className="mt-5 grid gap-px overflow-hidden rounded-xl border border-linha bg-linha">
            {s.ajustes.map((a, i) => (
              <li key={a.titulo} className="flex gap-5 bg-branco p-5 sm:p-6">
                <span className="font-display text-3xl leading-none text-ouro">{i + 1}</span>
                <div>
                  <p className="font-display text-xl uppercase leading-tight">{a.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-grafite/70">{a.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 border-l-2 border-ouro pl-5 font-display text-2xl uppercase leading-tight text-grafite">
            {s.regra}
          </p>

          <h3 className="t-eyebrow mt-12 text-ouro-profundo">{ui.exercicios}</h3>
          <ul className="mt-5 space-y-3">
            {s.exercicios.map((n) => {
              const e = exercicioLocal(n, idioma);
              return (
                <li key={n}>
                  <details className="group rounded-xl border border-linha bg-branco/60 open:border-ouro/50">
                    <summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ouro/12 font-display text-sm text-ouro">
                        {e.n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold leading-snug">{e.nome}</span>
                        <span className="mt-0.5 block text-xs uppercase tracking-[0.12em] text-grafite/55">
                          {e.dose}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="text-xl leading-none text-ouro transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="space-y-3 px-4 pb-5 text-sm leading-relaxed text-grafite/75 sm:px-5">
                      <p>{e.como}</p>
                      <p className="rounded-lg bg-[#e2563b]/10 p-3 text-[#ffb3a3]">
                        <strong className="font-semibold text-[#ff8a70]">{ui.ondeFalha}</strong>
                        {e.falha}
                      </p>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function PosturaCotidiano({ idioma = "pt" }: { idioma?: Idioma }) {
  const lista = situacoes(idioma);
  return (
    <>
      {/* Atalhos: no reel, cada chip é um corte. */}
      <nav
        aria-label={UI_COTIDIANO[idioma].navAria}
        className="sticky top-20 z-30 -mx-6 border-y border-linha bg-porcelana/85 px-6 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {lista.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="flex items-center gap-2 rounded-full border border-linha px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-grafite/75 transition-colors hover:border-ouro hover:text-grafite"
              >
                <span className="text-ouro">{s.n}</span>
                {s.curto}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {lista.map((s) => (
        <CartaoSituacao key={s.id} s={s} idioma={idioma} />
      ))}
    </>
  );
}
