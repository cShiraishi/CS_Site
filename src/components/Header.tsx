"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Assinatura } from "./Logo";
import { Container, buttonClass, Arrow } from "./ui";
import { nav, rotas } from "@/lib/content";

/**
 * `tone` acompanha o fundo da página: as páginas em grafite
 * (biblioteca) precisam do cabeçalho claro, ou o texto some.
 */
export function Header({ tone = "claro" }: { tone?: "claro" | "escuro" }) {
  const [scrolled, setScrolled] = useState(false);
  const [aberto, setAberto] = useState(false);
  const escuro = tone === "escuro";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const fundo = escuro
    ? "border-b border-porcelana/12 bg-grafite/85 backdrop-blur-xl"
    : "border-b border-linha bg-porcelana/85 backdrop-blur-xl";
  const painel = escuro
    ? "border-porcelana/12 bg-grafite"
    : "border-linha bg-porcelana";
  const traco = escuro ? "bg-porcelana" : "bg-grafite";
  const contorno = escuro ? "border-porcelana/25" : "border-linha";

  const superior = nav.filter((item) => item.topo);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || aberto ? fundo : "border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Início"
            onClick={() => setAberto(false)}
            className="shrink-0"
          >
            <Assinatura size={40} priority tone={escuro ? "porcelana" : "grafite"} />
          </Link>

          <nav className="hidden items-center gap-8 xl:flex" aria-label="Principal">
            {superior.map((item) => {
              const destacado = item.href === rotas.calculadora;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative whitespace-nowrap text-sm transition-colors ${
                    escuro
                      ? "text-porcelana/70 hover:text-porcelana"
                      : "text-grafite/75 hover:text-grafite"
                  } ${destacado ? "flex items-center gap-2" : ""}`}
                >
                  {destacado && (
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ouro" />
                  )}
                  {item.label}
                  <span className="rule-gold absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {/* O display responsivo fica no invólucro: `buttonClass` já traz
                `inline-flex`, que venceria um `hidden` no mesmo elemento. */}
            <div className="hidden sm:block">
              <Link
                href="/#contato"
                className={
                  escuro
                    ? "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ouro px-6 py-3 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-porcelana"
                    : buttonClass("solid")
                }
              >
                Solicitar avaliação
                <Arrow />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors xl:hidden ${contorno}`}
            >
              <span className="flex w-4 flex-col gap-[5px]">
                <span
                  className={`h-px w-full transition-transform duration-300 ${traco} ${
                    aberto ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full transition-transform duration-300 ${traco} ${
                    aberto ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* Progresso da leitura — scroll-timeline nativa, sem listener de scroll. */}
      <div
        aria-hidden
        className={`rule-gold barra-progresso h-px w-full transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Menu — no celular abre com rolagem própria, sem estourar a tela */}
      <div
        className={`overflow-hidden border-t transition-[max-height] duration-500 xl:hidden ${painel} ${
          aberto ? "max-h-[80svh]" : "max-h-0 border-transparent"
        }`}
      >
        <Container className="max-h-[80svh] overflow-y-auto py-2">
          <nav className="flex flex-col" aria-label="Menu">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className={`flex items-center gap-3 border-b py-4 font-display text-xl last:border-0 sm:text-2xl ${
                  escuro
                    ? "border-porcelana/12 text-porcelana"
                    : "border-linha text-grafite"
                }`}
              >
                {item.href === rotas.calculadora && (
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ouro" />
                )}
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contato"
              onClick={() => setAberto(false)}
              className={`${buttonClass("solid")} my-6 sm:hidden`}
            >
              Solicitar avaliação
              <Arrow />
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}
