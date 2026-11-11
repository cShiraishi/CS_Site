"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CapaCurso, IconeDoCurso, estiloTom } from "@/components/CapaCurso";
import { PrecoDinamico } from "@/components/SeletorMoeda";
import { marca } from "@/lib/content";
import { CURSOS, UI_CURSOS, type Curso } from "@/lib/cursos";
import { rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * A trilha de 5 cursos, estilo Netflix. Curso com página própria (o
 * Reset) abre /cursos/[slug]; curso ainda fechado abre um painel com os
 * detalhes e o "Avise-me".
 */
export function VitrineCursos({ idioma }: { idioma: Idioma }) {
  const t = UI_CURSOS[idioma];
  const [aberto, setAberto] = useState<Curso | null>(null);

  return (
    <>
      <ol className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 pt-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {CURSOS.map((c) => {
          const bloqueado = c.status !== "disponivel";
          const capa = (
            <CapaCurso
              tom={c.tom}
              icone={c.icone}
              selo={`${t.modulo} ${c.numero}`}
              titulo={c.titulo[idioma]}
              chip={c.duracao?.[idioma]}
              texto={c.resultado[idioma]}
              bloqueado={bloqueado}
              status={
                bloqueado ? (
                  t.emBreve
                ) : (
                  <>
                    {t.disponivel} · <PrecoDinamico />
                  </>
                )
              }
              acao={t.verDetalhes}
            />
          );
          return (
            <li key={c.slug} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-auto [&>*]:h-full">
              {c.modulos ? (
                <Link
                  href={rotaIdioma(idioma, `/cursos/${c.slug}`)}
                  className="group block h-full rounded-2xl outline-none"
                  aria-label={`${c.titulo[idioma]} — ${t.verDetalhes}`}
                >
                  {capa}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setAberto(c)}
                  className="group block h-full w-full rounded-2xl text-left outline-none"
                  aria-haspopup="dialog"
                  aria-label={`${c.titulo[idioma]} — ${t.verDetalhes}`}
                >
                  {capa}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {/* Linha do tempo sob os pôsteres (só no desktop, onde ficam alinhados). */}
      <div aria-hidden className="relative mt-4 hidden h-4 lg:block">
        <div className="absolute inset-x-[10%] top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-verde via-[color-mix(in_srgb,var(--color-verde)_50%,var(--color-ouro))] to-ouro opacity-70" />
        <div className="grid grid-cols-5">
          {CURSOS.map((c) => (
            <span
              key={c.slug}
              style={estiloTom(c.tom)}
              className="mx-auto size-4 rounded-full bg-(--tom) shadow-[0_0_14px_var(--tom)] ring-4 ring-(--tom)/25"
            />
          ))}
        </div>
      </div>

      {aberto && <Detalhes curso={aberto} idioma={idioma} onFechar={() => setAberto(null)} />}
    </>
  );
}

function Detalhes({
  curso,
  idioma,
  onFechar,
}: {
  curso: Curso;
  idioma: Idioma;
  onFechar: () => void;
}) {
  const t = UI_CURSOS[idioma];
  const fechar = useRef<HTMLButtonElement>(null);
  const reset = CURSOS[0];

  useEffect(() => {
    fechar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = overflow;
    };
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="curso-titulo"
        style={estiloTom(curso.tom)}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-(--tom)/45 bg-[#0b0a09] p-6 text-[#f2ede5] shadow-[0_0_60px_color-mix(in_srgb,var(--tom)_25%,transparent)] sm:rounded-3xl sm:p-8"
      >
        <button
          ref={fechar}
          type="button"
          onClick={onFechar}
          aria-label={t.fechar}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/8 text-[#f2ede5]/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <IconeDoCurso icone={curso.icone} className="size-14 shrink-0 text-(--tom)" />
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-(--tom)">
              {t.modulo} {curso.numero} · {t.emBreve}
            </p>
            <h2 id="curso-titulo" className="mt-1 font-display text-3xl uppercase leading-none">
              {curso.titulo[idioma]}
            </h2>
          </div>
        </div>

        <p className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
          {curso.duracao && (
            <span className="rounded-md border border-(--tom)/60 bg-(--tom)/15 px-2 py-1 text-(--tom)">
              {curso.duracao[idioma]}
            </span>
          )}
          <span className="rounded-md bg-white/8 px-2 py-1 text-[#f2ede5]/85">{curso.resultado[idioma]}</span>
        </p>

        <p className="mt-5 leading-relaxed text-[#f2ede5]/85">{curso.descricao[idioma]}</p>

        <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f2ede5]/55">{t.inclui}</p>
        <ul className="mt-3 space-y-2 text-sm">
          {curso.inclui[idioma].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-(--tom)" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-7 rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-[#f2ede5]/75">{t.avisarNota}</p>

        <div className="mt-5 flex flex-col gap-3">
          <a
            href={marca.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-xl bg-(--tom) px-6 text-sm font-extrabold uppercase tracking-wider text-[#0b0a09] transition-opacity hover:opacity-90"
          >
            {t.avisar}
          </a>
          <Link
            href={rotaIdioma(idioma, `/cursos/${reset.slug}`)}
            onClick={onFechar}
            className="flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-bold text-[#f2ede5]/85 transition-colors hover:border-white/40 hover:text-white"
          >
            {t.comecarPeloReset} →
          </Link>
        </div>
      </div>
    </div>
  );
}
