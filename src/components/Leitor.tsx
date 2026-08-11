"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Leitura } from "@/lib/leituras";
import { Arrow } from "./ui";

/** Quantas folhas em volta da atual carregam imagem de verdade. */
const JANELA = 3;

export function Leitor({ livro }: { livro: Leitura }) {
  const palco = useRef<HTMLDivElement>(null);
  const [estreito, setEstreito] = useState(false);
  const [cheia, setCheia] = useState(false);

  // Em tela estreita, página dupla vira ilegível: cai para página única.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const aplicar = () => setEstreito(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  useEffect(() => {
    const aoMudar = () => setCheia(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", aoMudar);
    return () => document.removeEventListener("fullscreenchange", aoMudar);
  }, []);

  const duplo = livro.modo === "duplo" && !estreito;
  const passos = duplo ? Math.ceil(livro.total / 2) : livro.total - 1;

  // Posição e folha em movimento vivem no mesmo estado: dois cliques
  // rápidos precisam enxergar o resultado um do outro, e estados
  // separados fariam o segundo ler o valor velho do render anterior.
  const [estado, setEstado] = useState({ pos: 0, movendo: null as number | null });

  // Girar o celular troca o modo e encurta a faixa. A posição válida é
  // derivada na renderização — sincronizar por efeito daria um quadro
  // intermediário com valor fora da faixa.
  const pos = Math.min(estado.pos, passos);
  const movendo = estado.movendo;

  const irPara = useCallback(
    (destino: number) =>
      setEstado((s) => {
        const atual = Math.min(s.pos, passos);
        const alvo = Math.min(passos, Math.max(0, destino));
        if (alvo === atual) return s;
        return { pos: alvo, movendo: alvo > atual ? atual : alvo };
      }),
    [passos],
  );

  const ir = useCallback(
    (delta: number) =>
      setEstado((s) => {
        const atual = Math.min(s.pos, passos);
        const alvo = Math.min(passos, Math.max(0, atual + delta));
        if (alvo === atual) return s;
        return { pos: alvo, movendo: delta > 0 ? atual : alvo };
      }),
    [passos],
  );

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo.tagName === "INPUT" || alvo.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") ir(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") ir(-1);
      else if (e.key === "Home") irPara(0);
      else if (e.key === "End") irPara(passos);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [ir, irPara, passos]);

  const telaCheia = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else palco.current?.requestFullscreen?.();
  };

  // Rótulo do que está à vista, para o leitor de tela e para o rodapé.
  const rotulo = duplo
    ? pos === 0
      ? `Capa — página 1 de ${livro.total}`
      : `Páginas ${Math.min(2 * pos, livro.total)}${
          2 * pos + 1 <= livro.total ? ` e ${2 * pos + 1}` : ""
        } de ${livro.total}`
    : `Página ${pos + 1} de ${livro.total}`;

  return (
    <div>
      <div
        ref={palco}
        style={
          { "--altura-livro": cheia ? "88svh" : "70svh" } as React.CSSProperties
        }
        className={`relative flex items-center justify-center bg-grafite ${
          cheia ? "h-screen w-screen px-4" : ""
        }`}
      >
        {/* Toque nas laterais vira navegação, como num livro de verdade */}
        <button
          type="button"
          onClick={() => ir(-1)}
          disabled={pos === 0}
          aria-label="Página anterior"
          className="absolute inset-y-0 left-0 z-30 w-1/5 cursor-w-resize disabled:cursor-default"
        />
        <button
          type="button"
          onClick={() => ir(1)}
          disabled={pos >= passos}
          aria-label="Próxima página"
          className="absolute inset-y-0 right-0 z-30 w-1/5 cursor-e-resize disabled:cursor-default"
        />

        {duplo ? (
          <LivroDuplo
            livro={livro}
            pos={pos}
            passos={passos}
            movendo={movendo}
            aoParar={() => setEstado((s) => (s.movendo === null ? s : { ...s, movendo: null }))}
          />
        ) : (
          <LivroUnico livro={livro} pos={pos} />
        )}
      </div>

      {/* Texto da página à vista: alimenta leitor de tela e Ctrl+F */}
      <p className="sr-only" aria-live="polite">
        {rotulo}. {textoVisivel(livro, pos, duplo)}
      </p>

      {/* ── Controles ─────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <div className="flex items-center gap-3">
          <Botao aoClicar={() => ir(-1)} desativado={pos === 0} rotulo="Página anterior">
            <Seta direcao="tras" />
          </Botao>
          <Botao aoClicar={() => ir(1)} desativado={pos >= passos} rotulo="Próxima página">
            <Seta direcao="frente" />
          </Botao>
          <span className="ml-2 text-sm text-porcelana/70 tabular-nums">{rotulo}</span>
        </div>

        <div className="flex items-center gap-5">
          <label className="flex min-w-40 flex-1 items-center gap-3">
            <span className="sr-only">Ir para a página</span>
            <input
              type="range"
              min={0}
              max={passos}
              value={pos}
              onChange={(e) => irPara(Number(e.target.value))}
              className="h-px w-full min-w-32 cursor-pointer appearance-none bg-porcelana/25 accent-ouro"
            />
          </label>

          <Botao aoClicar={telaCheia} rotulo={cheia ? "Sair da tela cheia" : "Tela cheia"}>
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {cheia ? (
                <path d="M6 2v4H2M10 14v-4h4" />
              ) : (
                <path d="M2 6V2h4M14 10v4h-4" />
              )}
            </svg>
          </Botao>

          {livro.pdf && (
            <Link
              href={`/leitura/${livro.slug}/${livro.pdf}`}
              download
              className="group inline-flex items-center gap-2 whitespace-nowrap border-b border-ouro/40 pb-1 text-sm text-ouro transition-colors hover:border-ouro"
            >
              Baixar o PDF
              <Arrow />
            </Link>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-porcelana/70">
        Use as setas do teclado, clique nas laterais da página ou arraste a barra.
      </p>
    </div>
  );
}

/* ============================================================
   Página dupla — folhas empilhadas girando na lombada
   ============================================================ */
function LivroDuplo({
  livro,
  pos,
  passos,
  movendo,
  aoParar,
}: {
  livro: Leitura;
  pos: number;
  passos: number;
  movendo: number | null;
  aoParar: () => void;
}) {
  return (
    // Largura: o menor entre a caixa disponível e o que a altura da janela
    // permite — assim o livro nunca estoura a tela nem distorce.
    //
    // Na capa só existe a metade direita, e no fim só a esquerda. Deslocar
    // meia página nesses dois extremos faz o livro abrir e fechar como um
    // livro de verdade, em vez de ficar torto na tela.
    <div
      className="livro relative my-10 transition-transform duration-700 ease-out"
      style={{
        aspectRatio: `${livro.proporcao * 2}`,
        width: `min(100%, calc(${livro.proporcao * 2} * var(--altura-livro)))`,
        transform:
          pos === 0
            ? "translateX(-25%)"
            : pos === passos
              ? "translateX(25%)"
              : undefined,
      }}
    >
      {/* lombada */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 z-40 w-px -translate-x-1/2 bg-grafite/60"
      />

      {Array.from({ length: passos }, (_, k) => {
        const virada = k < pos;
        const perto = Math.abs(k - pos) <= JANELA;

        return (
          <div
            key={k}
            onTransitionEnd={aoParar}
            className="folha absolute inset-y-0 left-1/2 w-1/2 origin-left"
            style={{
              transform: virada ? "rotateY(-180deg)" : "rotateY(0deg)",
              zIndex: movendo === k ? passos + 5 : virada ? k : passos - k,
              pointerEvents: "none",
            }}
          >
            <Face pagina={livro.paginas[2 * k]} livro={livro} carregar={perto} />
            <Face
              pagina={livro.paginas[2 * k + 1]}
              livro={livro}
              carregar={perto}
              verso
            />
          </div>
        );
      })}
    </div>
  );
}

function Face({
  pagina,
  livro,
  carregar,
  verso = false,
}: {
  pagina: { arquivo: string } | undefined;
  livro: Leitura;
  carregar: boolean;
  verso?: boolean;
}) {
  return (
    <div
      className="face absolute inset-0 overflow-hidden bg-porcelana shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)]"
      style={verso ? { transform: "rotateY(180deg)" } : undefined}
    >
      {pagina && carregar && (
        <Image
          src={`/leitura/${livro.slug}/${pagina.arquivo}`}
          alt=""
          width={livro.largura}
          height={livro.altura}
          sizes="(max-width: 900px) 100vw, 50vw"
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}

/* ============================================================
   Página única — a folha levanta e vira para a esquerda
   ============================================================ */
function LivroUnico({ livro, pos }: { livro: Leitura; pos: number }) {
  return (
    <div
      className="livro relative mx-auto my-8"
      style={{
        aspectRatio: `${livro.proporcao}`,
        width: `min(100%, calc(${livro.proporcao} * var(--altura-livro)))`,
      }}
    >
      {livro.paginas.map((pagina, i) => {
        if (Math.abs(i - pos) > JANELA) return null;
        const passada = i < pos;

        return (
          <div
            key={pagina.arquivo}
            className="folha absolute inset-0 origin-left overflow-hidden bg-porcelana shadow-[0_16px_50px_-22px_rgba(0,0,0,0.85)]"
            style={{
              transform: passada ? "rotateY(-180deg)" : "rotateY(0deg)",
              opacity: passada ? 0 : 1,
              zIndex: livro.total - i,
              pointerEvents: "none",
            }}
          >
            <Image
              src={`/leitura/${livro.slug}/${pagina.arquivo}`}
              alt=""
              width={livro.largura}
              height={livro.altura}
              sizes="(max-width: 900px) 100vw, 900px"
              priority={i === 0}
              className="h-full w-full object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}

/* ── peças ──────────────────────────────────────────────────── */

function Botao({
  children,
  aoClicar,
  desativado = false,
  rotulo,
}: {
  children: React.ReactNode;
  aoClicar: () => void;
  desativado?: boolean;
  rotulo: string;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={desativado}
      aria-label={rotulo}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-porcelana/20 text-porcelana/70 transition-all duration-300 hover:border-ouro hover:text-ouro disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}

function Seta({ direcao }: { direcao: "frente" | "tras" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`h-3.5 w-3.5 ${direcao === "tras" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function textoVisivel(livro: Leitura, pos: number, duplo: boolean) {
  if (!duplo) return livro.paginas[pos]?.texto ?? "";
  return [livro.paginas[2 * pos - 1], livro.paginas[2 * pos]]
    .filter(Boolean)
    .map((p) => p.texto)
    .join(" ");
}
