"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Assinatura } from "./Logo";
import { Container, buttonClass, Arrow } from "./ui";
import { LanguageSelector } from "./LanguageSelector";
import { Dock } from "./Dock";
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
    ? "glass-dark border-b"
    : "glass-light border-b";
  const painel = escuro
    ? "border-porcelana/12 bg-grafite"
    : "border-linha bg-porcelana";
  const traco = escuro ? "bg-porcelana" : "bg-grafite";
  const contorno = escuro ? "border-porcelana/25" : "border-linha";

  return (
    <>
    <Dock />
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

          {/* A navegação entre ferramentas mora no Dock, preso ao rodapé da
              tela. No topo fica a marca, a chamada e o menu completo. */}

          <div className="flex shrink-0 items-center gap-3">
            {/* Visível também no celular: escondido no menu ☰, quem vinha
                de fora não achava a troca de idioma. */}
            <LanguageSelector escuro={escuro} />

            {/* No celular o botão verde vive no dock, preso ao rodapé e ao
                alcance do polegar; dois botões iguais na mesma tela só
                dividiam a atenção. O invólucro carrega o `hidden` porque
                `buttonClass` traz `inline-flex`, que o venceria. */}
            <div className="hidden sm:block">
              <a
                href={`${rotas.consultoria}?de=topo`}
                className={`${buttonClass("consultoria")} !px-6 !py-3`}
              >
                Começar consultoria
                <Arrow />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${contorno}`}
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
        className={`overflow-hidden border-t transition-[max-height] duration-500 ${painel} ${
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
            <a
              href={`${rotas.consultoria}?de=menu`}
              onClick={() => setAberto(false)}
              className={`${buttonClass("consultoria")} my-6`}
            >
              Começar consultoria
              <Arrow />
            </a>
          </nav>
        </Container>
      </div>
    </header>
    </>
  );
}
