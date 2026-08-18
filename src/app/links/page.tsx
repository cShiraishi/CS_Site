import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { marca } from "@/lib/content";
import { chamadaFinal, linksDaBio } from "@/lib/links";
import { Compartilhar } from "./Compartilhar";
import { Miniatura } from "./Miniatura";

/** Página estática: nada aqui depende de requisição. */
export const dynamic = "force-static";

const descricao =
  "Todos os links do @carlosseiti num só lugar: consultoria online, site, canal do YouTube e o cupom da Zumub.";

export const metadata: Metadata = {
  title: "Links",
  description: descricao,
  alternates: { canonical: "/links" },
  openGraph: {
    type: "website",
    url: `${marca.site}/links`,
    title: `${marca.instagramHandle} | Links`,
    description: descricao,
    images: [
      { url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: `Monograma ${marca.monograma}` },
    ],
  },
};

/** Areia do render da marca — o mesmo fundo que a página do Linktree tinha. */
const AREIA = "#f0c58f";

function externo(href: string) {
  return href.startsWith("http");
}

export default function Page() {
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
            alt={`Monograma ${marca.monograma}`}
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
          {linksDaBio.map((link) => (
            <li
              key={link.titulo}
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
            {chamadaFinal.titulo}
          </Link>

          <p className="mt-5 text-[0.66rem] uppercase tracking-[0.16em] text-[#111]/45">
            {marca.nome} · {marca.assinatura}
          </p>
        </div>
      </div>
    </main>
  );
}
