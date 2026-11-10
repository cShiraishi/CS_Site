"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Assinatura } from "./Logo";
import { Container, buttonClass, Arrow } from "./ui";
import { LanguageSelector } from "./LanguageSelector";
import { SeletorModo } from "./SeletorModo";
import { Dock } from "./Dock";
import { rotas } from "@/lib/content";
import { obterConteudo, type Idioma } from "@/lib/i18n";
import { useIdioma } from "@/lib/useIdioma";
import { rotaIdioma } from "@/lib/rotas-idioma";

/**
 * `tone` acompanha o fundo da página: as páginas em grafite
 * (biblioteca) precisam do cabeçalho claro, ou o texto some.
 */
export function Header({
  tone = "claro",
  idioma: idiomaForcado,
}: {
  tone?: "claro" | "escuro";
  idioma?: Idioma;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [appsAberto, setAppsAberto] = useState(false);
  /* Desde o tema escuro (nov/2026), "porcelana" é o fundo quase preto e
     "grafite" é a tinta clara. As variantes `escuro` abaixo eram do tema
     claro: usadas hoje, pintavam nome, idioma e ☰ de preto sobre preto.
     O tom agora só escolhe o vidro do fundo; texto e traços ficam claros. */
  const vidroEscuro = tone === "escuro";
  const escuro = false;
  const idioma = useIdioma(idiomaForcado);
  const t = obterConteudo(idioma);

  /* Linha do Ele | Ela no celular: aparece no topo e ao rolar para cima,
     some ao rolar para baixo (não rouba tela de quem está lendo). */
  const [linhaModo, setLinhaModo] = useState(true);
  const ultimoY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (y < 16 || y < ultimoY.current - 4) setLinhaModo(true);
      else if (y > ultimoY.current + 4) setLinhaModo(false);
      ultimoY.current = y;
    };
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

  const fundo = vidroEscuro
    ? "glass-dark border-b"
    : "glass-light border-b";
  const painel = escuro
    ? "border-porcelana/12 bg-grafite"
    : "border-linha bg-porcelana";
  const traco = escuro ? "bg-porcelana" : "bg-grafite";
  const contorno = escuro ? "border-porcelana/25" : "border-linha";

  return (
    <>
      <Dock idioma={idioma} />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || aberto ? fundo : "border-b border-transparent"
        }`}
      >
        <Container>
          <div className="flex h-20 items-center justify-between gap-4">
            <Link
              href={t.rotaHome}
              aria-label={t.ui.inicio}
              onClick={() => setAberto(false)}
              className="shrink-0"
            >
              <Assinatura size={40} priority tone={escuro ? "porcelana" : "grafite"} idioma={idioma} />
            </Link>

            {/* A navegação entre ferramentas mora no Dock, preso ao rodapé da
                tela. No topo fica a marca, a chamada e o menu completo. */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              {/* Ele | Ela: troca acentos e apps, como um seletor de tema.
                  No celular não cabe ao lado do idioma: ganha uma linha
                  própria logo abaixo, de ponta a ponta. */}
              <div className="hidden sm:block">
                <SeletorModo escuro={escuro} idioma={idioma} />
              </div>

              {/* Visível também no celular: escondido no menu ☰, quem vinha
                  de fora não achava a troca de idioma. */}
              <LanguageSelector escuro={escuro} idioma={idioma} />

              {/* No celular o botão verde vive no dock, preso ao rodapé e ao
                  alcance do polegar; dois botões iguais na mesma tela só
                  dividiam a atenção. O invólucro carrega o `hidden` porque
                  `buttonClass` traz `inline-flex`, que o venceria. */}
              <div className="hidden sm:block">
                <a
                  href={`${rotas.consultoria}?de=topo`}
                  className={`${buttonClass("consultoria")} !px-6 !py-3`}
                >
                  {t.ui.comecarConsultoria}
                  <Arrow />
                </a>
              </div>

              <button
                type="button"
                onClick={() => setAberto((v) => !v)}
                aria-expanded={aberto}
                aria-label={aberto ? t.ui.fecharMenu : t.ui.abrirMenu}
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

          {/* Celular: Ele | Ela largo, à vista, como um seletor de tema. */}
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 sm:hidden ${
              linhaModo || aberto ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-3">
              <SeletorModo largo idioma={idioma} />
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
              {/* Pasta Apps no menu ☰ */}
              <div
                className={`border-b py-3 ${
                  escuro ? "border-porcelana/12" : "border-linha"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setAppsAberto((v) => !v)}
                  aria-expanded={appsAberto}
                  className={`flex w-full items-center justify-between py-1 font-display text-xl sm:text-2xl ${
                    escuro ? "text-porcelana" : "text-grafite"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-destaque" />
                    {t.ui.pastaApps}
                  </span>
                  <span className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-destaque">
                    {appsAberto ? t.ui.fecharApps : t.ui.abrirApps}
                  </span>
                </button>
                {appsAberto && (
                  <div className="mt-2 grid grid-cols-2 gap-2 pb-2 sm:grid-cols-5">
                    {t.appsNav.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        onClick={() => {
                          setAberto(false);
                          setAppsAberto(false);
                        }}
                        className="rounded-xl border border-destaque/30 bg-destaque/10 px-3.5 py-2.5 text-sm font-medium text-destaque transition-colors hover:bg-destaque/20"
                      >
                        {app.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {t.nav.map((item) => {
                const ehReceitas = item.href === rotaIdioma(idioma, rotas.receitas);
                const ehReset = item.href === rotaIdioma(idioma, rotas.programa);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAberto(false)}
                    className={`flex items-center justify-between gap-3 border-b py-4 font-display text-xl last:border-0 sm:text-2xl ${
                      ehReset
                        ? "border-[#00ff66]/35 text-[#00ff66]"
                        : ehReceitas
                        ? "border-[#ff6b35]/30 text-[#ff6b35]"
                        : escuro
                        ? "border-porcelana/12 text-porcelana"
                        : "border-linha text-grafite"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {ehReset && <span aria-hidden className="text-lg">⚡</span>}
                      {ehReceitas && <span aria-hidden className="text-lg">🔥</span>}
                      {item.label}
                    </span>
                    {ehReset && (
                      <span className="rounded-full bg-[#00ff66] px-2.5 py-0.5 font-sans text-[10px] font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_14px_rgba(0,255,102,0.5)]">
                        {idioma === "es" ? "21 Días" : idioma === "en" ? "21 Days" : "21 Dias"}
                      </span>
                    )}
                    {ehReceitas && (
                      <span className="rounded-full bg-[#ff5e3a] px-2.5 py-0.5 font-sans text-[10px] font-extrabold uppercase tracking-wider text-[#0b0a09]">
                        &lt; 100 kcal
                      </span>
                    )}
                  </Link>
                );
              })}
              <a
                href={`${rotas.consultoria}?de=menu`}
                onClick={() => setAberto(false)}
                className={`${buttonClass("consultoria")} my-6`}
              >
                {t.ui.comecarConsultoria}
                <Arrow />
              </a>
            </nav>
          </Container>
        </div>
      </header>
      {/* No celular o cabeçalho fixo tem a linha extra do Ele | Ela; este
          respiro empurra o começo da página para ela não cobrir nada. */}
      <div aria-hidden className="h-14 sm:hidden" />
    </>
  );
}
