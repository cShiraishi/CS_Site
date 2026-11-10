import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compartilhar } from "@/components/links/Compartilhar";
import { Miniatura } from "@/components/links/Miniatura";
import { marca } from "@/lib/content";
import { obterConteudo } from "@/lib/i18n";
import { TEXTOS_LINKS, linksDaBioNoIdioma } from "@/lib/i18n/links";
import { chamadaFinal } from "@/lib/links";
import { metadataPagina, type Idioma } from "@/lib/rotas-idioma";

/**
 * Link na bio — compartilhado por /links, /es/links e /en/links.
 */

export function metadataLinks(idioma: Idioma): Metadata {
  const t = TEXTOS_LINKS[idioma];
  const base = metadataPagina({
    idioma,
    caminho: "/links",
    titulo: t.titulo,
    descricao: t.descricao,
    imagem: { url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: t.monograma },
  });
  const tituloSocial = `${marca.instagramHandle} | ${t.titulo}`;
  return {
    ...base,
    openGraph: { ...base.openGraph, title: tituloSocial },
    twitter: { ...base.twitter, title: tituloSocial },
  };
}

/** Areia do render da marca — o mesmo fundo que a página do Linktree tinha. */
const AREIA = "#f0c58f";

function externo(href: string) {
  return href.startsWith("http");
}

export function PaginaLinks({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS_LINKS[idioma];
  const links = linksDaBioNoIdioma(idioma);

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: AREIA }}>
      <div className="mx-auto flex min-h-screen w-full max-w-[30rem] flex-col px-4 pb-10">
        {/*
          Capa: o monograma sangra na largura toda. O render nasceu sobre papel
          marfim, e o marfim recortado sobre a areia denunciaria a caixa da
          imagem — por isso a areia volta por cima, em degrade, ate encostar no
          logotipo. O tingido leve aproxima o papel do fundo.
        */}
        <div className="relative -mx-4 aspect-[1/0.78] overflow-hidden">
          <Image
            src="/brand/cs-mark.jpg"
            alt={t.monograma}
            fill
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="scale-[1.06] object-cover"
            style={{ filter: "sepia(0.18) saturate(1.15)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(118% 86% at 50% 34%, rgba(240,197,143,0) 34%, ${AREIA} 76%)`,
            }}
          />
        </div>

        <h1 className="relative z-10 -mt-9 text-center text-[2.05rem] font-bold leading-none tracking-[-0.02em] text-[#111]">
          {marca.instagramHandle}
        </h1>

        <ul className="mt-7 flex flex-col gap-3.5">
          {links.map((link) => (
            <li
              key={link.id}
              className="group relative flex min-h-[3.5rem] items-center rounded-xl border border-white/40 bg-white/30 p-1.5 transition-transform duration-200 hover:scale-[1.015] hover:bg-white/45"
            >
              {/* O cartão inteiro é a área de clique; o "⋮" fica por cima. */}
              <Link
                href={link.href}
                target={externo(link.href) ? "_blank" : undefined}
                rel={externo(link.href) ? "noopener noreferrer" : undefined}
                aria-label={link.titulo}
                className="absolute inset-0 z-0 rounded-xl"
              />

              <Miniatura nome={link.icone} />

              {/*
                O titulo centra no cartao inteiro, nao no espaco que sobra ao
                lado da miniatura — e assim que o Linktree o alinha, e e o que
                permite a chamada longa caber numa linha so.
              */}
              <span className="pointer-events-none absolute inset-x-12 text-center text-[0.7rem] font-medium leading-tight text-[#111]">
                {link.titulo}
              </span>

              <Compartilhar
                titulo={link.titulo}
                href={link.href}
                idioma={idioma}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
              />
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-14 text-center">
          <Link
            href={chamadaFinal.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[0.85rem] font-medium text-[#111] shadow-[0_2px_10px_rgba(29,27,25,0.10)] transition-transform duration-200 hover:scale-[1.02]"
          >
            {t.chamadaFinal}
          </Link>

          <p className="mt-5 text-[0.66rem] uppercase tracking-[0.16em] text-[#111]/45">
            {marca.nome} · {obterConteudo(idioma).marca.assinatura}
          </p>
        </div>
      </div>
    </main>
  );
}
