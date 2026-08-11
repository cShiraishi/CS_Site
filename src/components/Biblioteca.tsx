"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Livro,
  TRILHAS,
  porTrilha,
  tomDaCapa,
} from "@/lib/biblioteca";
import { Arrow } from "./ui";

/* ============================================================
   Capa — arte real quando existe, tipográfica quando não existe.
   ============================================================ */
function Capa({ livro }: { livro: Livro }) {
  if (livro.capa) {
    return (
      <Image
        src={livro.capa}
        alt={`Capa de ${livro.titulo}`}
        width={400}
        height={600}
        sizes="(max-width: 640px) 45vw, 210px"
        className="h-full w-full object-cover"
      />
    );
  }

  const { fundo, claro } = tomDaCapa(livro.slug);

  return (
    <div
      className="flex h-full w-full flex-col justify-between p-5"
      style={{ backgroundImage: fundo }}
    >
      <span
        aria-hidden
        className="block h-px w-8 shrink-0"
        style={{ background: claro ? "#8C673F" : "#C7A06A" }}
      />
      <div>
        <p
          className="font-display text-[1.05rem] leading-tight"
          style={{ color: claro ? "#1D1B19" : "#F7F5F2" }}
        >
          {livro.titulo}
        </p>
        <p
          className="mt-2.5 text-[0.62rem] uppercase tracking-[0.16em]"
          style={{ color: claro ? "#8C673F" : "#C7A06A" }}
        >
          {livro.autor}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   Cartão
   ============================================================ */
function Cartao({ livro, aoAbrir }: { livro: Livro; aoAbrir: () => void }) {
  return (
    <button
      type="button"
      onClick={aoAbrir}
      aria-label={`${livro.titulo}, de ${livro.autor}`}
      className="group w-36 shrink-0 snap-start text-left sm:w-44 lg:w-52"
    >
      <span className="relative block aspect-2/3 overflow-hidden rounded-sm ring-1 ring-porcelana/12 transition-all duration-400 group-hover:-translate-y-1.5 group-hover:ring-ouro/60 group-focus-visible:-translate-y-1.5">
        <Capa livro={livro} />
        {/* véu que revela a chamada no hover — só onde há mouse */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-linear-to-t from-grafite via-grafite/85 to-transparent p-4 pt-10 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <span className="block text-[0.72rem] leading-snug text-porcelana/85">
            {livro.chamada}
          </span>
        </span>
      </span>

      <span className="mt-3 block text-[0.82rem] leading-snug text-porcelana/85 transition-colors group-hover:text-ouro">
        {livro.titulo}
      </span>
      <span className="mt-1 block text-[0.7rem] text-porcelana/70">
        {livro.autor}
      </span>
    </button>
  );
}

/* ============================================================
   Trilha — carrossel com scroll-snap
   ============================================================ */
function Trilha({
  nome,
  descricao,
  livros,
  aoAbrir,
}: {
  nome: string;
  descricao: string;
  livros: Livro[];
  aoAbrir: (l: Livro) => void;
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
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (livros.length === 0) return null;

  return (
    <section className="mt-16 first:mt-0">
      <div className="pista flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl text-porcelana sm:text-3xl">{nome}</h2>
          <p className="mt-1.5 text-sm text-porcelana/70">{descricao}</p>
        </div>

        {/* setas: só onde há espaço e ponteiro preciso */}
        <div className="hidden shrink-0 gap-2 lg:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => deslizar(dir)}
              disabled={dir === -1 ? !pode.antes : !pode.depois}
              aria-label={dir === -1 ? `${nome}: voltar` : `${nome}: avançar`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-porcelana/20 text-porcelana/70 transition-all duration-300 hover:border-ouro hover:text-ouro disabled:pointer-events-none disabled:opacity-25"
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
        className="pista mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {livros.map((l) => (
          <Cartao key={l.slug} livro={l} aoAbrir={() => aoAbrir(l)} />
        ))}
        {/* respiro no fim da pista */}
        <span aria-hidden className="w-2 shrink-0 sm:w-4" />
      </div>
    </section>
  );
}

/* ============================================================
   Painel de detalhe — <dialog> nativo
   ============================================================ */
function Detalhe({
  livro,
  aoFechar,
}: {
  livro: Livro | null;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (livro && !d.open) d.showModal();
    if (!livro && d.open) d.close();
  }, [livro]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        // clique no backdrop (fora do conteúdo) fecha
        if (e.target === ref.current) aoFechar();
      }}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-sm bg-porcelana p-0 text-grafite backdrop:bg-grafite/70 backdrop:backdrop-blur-sm"
    >
      {livro && (
        <div className="p-7 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="t-eyebrow text-ouro-profundo">{livro.nivel}</p>
              <h3 className="t-title mt-4 text-balance">{livro.titulo}</h3>
              <p className="mt-2.5 text-sm text-grafite">
                {livro.autor}
                {livro.ano ? ` · ${livro.ano}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-grafite transition-colors hover:bg-linha hover:text-grafite"
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

          <span aria-hidden className="rule-gold mt-7 block h-px w-16" />

          <p className="mt-7 leading-relaxed text-grafite">{livro.porque}</p>

          {livro.link && (
            <Link
              href={livro.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2.5 border-b border-linha-ouro pb-1.5 text-sm text-ouro-profundo"
            >
              Onde encontrar
              <Arrow />
            </Link>
          )}
        </div>
      )}
    </dialog>
  );
}

/* ============================================================ */
export function Biblioteca() {
  const [aberto, setAberto] = useState<Livro | null>(null);

  return (
    <>
      {TRILHAS.map((t) => (
        <Trilha
          key={t.id}
          nome={t.nome}
          descricao={t.descricao}
          livros={porTrilha(t.id)}
          aoAbrir={setAberto}
        />
      ))}

      <Detalhe livro={aberto} aoFechar={() => setAberto(null)} />
    </>
  );
}
