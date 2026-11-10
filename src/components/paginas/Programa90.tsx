import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Comprar } from "@/components/Comprar";
import { Footer } from "@/components/Footer";
import { GaleriaTransformacoes } from "@/components/GaleriaTransformacoes";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Programa } from "@/components/Programa";
import { PrecoDinamico, SeletorMoeda } from "@/components/SeletorMoeda";
import { Arrow, Container, Eyebrow, Section } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { TEXTO_PROGRAMA, type TextoPrograma } from "@/lib/i18n/programa";
import { moedaPorPais, type Moeda } from "@/lib/produto";
import { listarFigurasDeShape } from "@/lib/programa-figuras";
import { LOCALE_OG, metadataPagina, rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * Página de vendas do Reset Metabólico 21D, compartilhada por
 * /programa-90-dias, /es/programa-90-dias e /en/programa-90-dias.
 * As rotas só escolhem o idioma. A área do aluno e a página de obrigado
 * continuam só em português.
 */

export function metadataPrograma90(idioma: Idioma): Metadata {
  const m = TEXTO_PROGRAMA[idioma].meta;
  const url = rotaIdioma(idioma, rotas.programa);
  const imagem = {
    url: "/brand/reset-metabolico-21d.jpg",
    width: 1024,
    height: 512,
    alt: `${m.ogAlt} | ${marca.nome}`,
  };
  const base = metadataPagina({
    idioma,
    caminho: rotas.programa,
    titulo: m.titulo,
    descricao: m.descricao,
    imagem,
  });
  return {
    ...base,
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      url: `${marca.site}${url}`,
      title: `${m.ogTitulo} | ${marca.nome}`,
      description: m.ogDescricao,
      images: [imagem],
    },
  };
}

/** Lista alternada [texto, destaque, texto, ...]: índices ímpares em destaque. */
function Rico({ partes, destaque }: { partes: readonly string[]; destaque: (t: string) => ReactNode }) {
  return (
    <>
      {partes.map((p, i) =>
        <Fragment key={i}>{i % 2 === 1 ? destaque(p) : p}</Fragment>,
      )}
    </>
  );
}

const btnNeon =
  "group inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#00ff66] px-7 py-4 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[#041208] shadow-[0_0_35px_rgba(0,255,102,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4be283] hover:shadow-[0_0_50px_rgba(0,255,102,0.7)] text-center sm:whitespace-nowrap";

const btnOutlineNeon =
  "group inline-flex items-center justify-center gap-2.5 rounded-lg border border-[#00ff66]/55 bg-[#00ff66]/10 px-7 py-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#00ff66] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00ff66] hover:bg-[#00ff66]/20 text-center sm:whitespace-nowrap";

const PROGRESSO_FASE = ["33%", "66%", "100%"] as const;

/**
 * Hero de vendas de alto impacto visual com estética Verde Neon — aparece
 * antes de o usuário avançar para o passo 2 do simulador.
 */
function Abertura({
  moedaServidor,
  idioma,
  t,
}: {
  moedaServidor?: Moeda;
  idioma: Idioma;
  t: TextoPrograma;
}) {
  const a = t.abertura;
  return (
    <section className="relative overflow-hidden bg-porcelana pb-12 pt-24 sm:pb-16 sm:pt-32">
      <div
        aria-hidden
        className="diagonals pointer-events-none absolute -right-24 top-10 size-[34rem] opacity-45 [mask-image:radial-gradient(circle,black,transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 size-[28rem] rounded-full bg-[#00ff66]/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-32 size-[24rem] rounded-full bg-[#00ff66]/10 blur-[120px]"
      />

      <Container className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <nav aria-label={a.breadcrumbAria}>
            <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/75">
              <li>
                <Link href={rotaIdioma(idioma, "/")} className="transition-colors hover:text-[#00ff66]">
                  {a.inicio}
                </Link>
              </li>
              <li aria-hidden>·</li>
              <li aria-current="page" className="font-semibold text-[#00ff66]">
                {a.atual}
              </li>
            </ol>
          </nav>

          {/* Seletor de Moeda Automático por Região / VPN */}
          <SeletorMoeda moedaServidor={moedaServidor} idioma={idioma} />
        </div>

        <div className="mt-7 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* Coluna Esquerda: Logo Oficial 21D + Promessa + Bullets + CTAs */}
          <div className="rise">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#39ff14]/55 bg-[#39ff14]/12 px-4 py-1.5 shadow-[0_0_25px_rgba(57,255,20,0.22)]">
              <span aria-hidden className="pulso size-2.5 rounded-full bg-[#39ff14] shadow-[0_0_12px_#39ff14]" />
              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#39ff14]">
                {a.selo}
              </span>
            </div>

            {/* Emblema Oficial Reset Metabólico 21D */}
            <div className="relative mt-6 max-w-xl overflow-hidden rounded-2xl border border-[#39ff14]/40 bg-[#030b05] p-2 shadow-[0_0_55px_rgba(57,255,20,0.22)]">
              <Image
                src="/brand/reset-metabolico-21d.jpg"
                alt={a.altEmblema}
                width={1024}
                height={512}
                priority
                sizes="(max-width: 1024px) 95vw, 560px"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>

            <h1 className="mt-6 font-display text-3xl uppercase leading-tight text-balance text-grafite sm:text-5xl">
              {a.h1}{" "}
              <span className="text-[#39ff14] drop-shadow-[0_0_24px_rgba(57,255,20,0.4)]">
                {a.h1Destaque}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-grafite sm:text-lg">
              <Rico
                partes={a.texto}
                destaque={(x) => <strong className="font-semibold text-[#39ff14]">{x}</strong>}
              />
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {a.selos.map((selo) => (
                <span
                  key={selo}
                  className="rounded-md border border-[#00ff66]/30 bg-[#0d1410] px-3 py-1.5 text-xs font-medium text-grafite"
                >
                  {selo}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#simulador" className={btnNeon}>
                {a.ctaSimular}
                <span aria-hidden>↓</span>
              </a>
              <a href="#oferta-direta" className={btnOutlineNeon}>
                {a.ctaDireto} <PrecoDinamico moedaServidor={moedaServidor} />
                <Arrow />
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-grafite/75">
              <span aria-hidden className="text-[#00ff66]">★</span>
              <Rico
                partes={a.autoria}
                destaque={(x) => <strong className="font-medium text-grafite">{x}</strong>}
              />
            </p>
          </div>

          {/* Coluna Direita: Painel Visual "Cronograma Fisiológico 21 Dias" */}
          <div className="rise relative overflow-hidden rounded-2xl border-2 border-[#00ff66]/55 bg-[#0c140f] shadow-[0_0_65px_rgba(0,255,102,0.16)]">
            <div className="h-1.5 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-4">
                <div>
                  <p className="t-eyebrow text-[#00ff66]">{a.painelEyebrow}</p>
                  <p className="mt-1 font-display text-2xl text-grafite">{a.painelTitulo}</p>
                </div>
                <span className="rounded-lg border border-[#00ff66]/50 bg-[#00ff66]/15 px-3.5 py-1.5 text-right shadow-[0_0_20px_rgba(0,255,102,0.2)]">
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-grafite/80">
                    {a.acessoUnico}
                  </span>
                  <span className="font-display text-xl text-[#00ff66]">
                    <PrecoDinamico moedaServidor={moedaServidor} />
                  </span>
                </span>
              </div>

              <ol className="mt-5 space-y-3.5">
                {t.semanas.map((s, idx) => (
                  <li
                    key={s.semana}
                    className="rounded-xl border border-[#00ff66]/25 bg-[#0b0a09]/85 p-4 transition-all hover:border-[#00ff66]/70"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#00ff66]">
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#00ff66] text-[0.68rem] font-extrabold text-[#041208]">
                          {idx + 1}
                        </span>
                        {s.semana} · {s.dias}
                      </span>
                      <span className="rounded-full bg-[#00ff66]/15 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-[#00ff66]">
                        {a.fase(idx + 1)}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-lg text-grafite">{s.titulo}</p>
                    <p className="mt-1 text-xs leading-relaxed text-grafite/75">{s.subtitulo}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-[#00ff66]/30 bg-[#0b0a09] p-3.5 text-center">
                <div>
                  <p className="font-display text-xl text-[#00ff66]">{a.resumo[0].valor}</p>
                  <p className="text-[0.68rem] text-grafite/75">{a.resumo[0].nota}</p>
                </div>
                <div className="border-x border-white/12">
                  <p className="font-display text-xl text-grafite">{a.resumo[1].valor}</p>
                  <p className="text-[0.68rem] text-grafite/75">{a.resumo[1].nota}</p>
                </div>
                <div>
                  <p className="font-display text-xl text-[#00ff66]">{a.resumo[2].valor}</p>
                  <p className="text-[0.68rem] text-grafite/75">{a.resumo[2].nota}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function EyebrowNeon({ children }: { children: ReactNode }) {
  return (
    <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
      <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
      {children}
    </p>
  );
}

function Check() {
  return (
    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-xs font-extrabold text-[#041208]">
      ✓
    </span>
  );
}

/**
 * Todas as seções persuasivas e visuais da página de vendas do Reset Metabólico 21 Dias.
 */
function PaginaDeVendas({
  vendaAberta,
  moedaServidor,
  idioma,
  t,
}: {
  vendaAberta: boolean;
  moedaServidor?: Moeda;
  idioma: Idioma;
  t: TextoPrograma;
}) {
  const v = t.vendas;
  return (
    <>
      {/* ============================================================
         1. DIAGNÓSTICO DE SINTOMAS — PARA QUEM É O RESET
         ============================================================ */}
      <Section tone="porcelana" denso className="border-t border-linha">
        <div className="max-w-2xl">
          <EyebrowNeon>{v.sintomasEyebrow}</EyebrowNeon>
          <h2 className="t-title mt-5 text-balance">{v.sintomasTitulo}</h2>
          <p className="mt-5 text-pretty leading-relaxed text-grafite/80">
            <Rico
              partes={v.sintomasTexto}
              destaque={(x) => <strong className="text-[#00ff66]">{x}</strong>}
            />
          </p>
        </div>

        <div className="stagger mt-12 grid gap-5 sm:grid-cols-2">
          {t.sintomas.map((item, i) => (
            <div
              key={i}
              className="surface-card group relative overflow-hidden rounded-xl border border-linha p-6 transition-all duration-300 hover:border-[#00ff66]/60 hover:shadow-[0_0_35px_rgba(0,255,102,0.1)] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-[#00ff66]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-[#00ff66]/40 bg-[#00ff66]/10 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-[#00ff66]">
                  {v.sinalAlerta}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-grafite">{item.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-grafite/80">{item.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================
         2. CRONOGRAMA CIENTÍFICO — AS 3 SEMANAS DO RESET
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <EyebrowNeon>{v.cronoEyebrow}</EyebrowNeon>
            <h2 className="t-title mt-5 text-balance">{v.cronoTitulo}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-grafite/75">{v.cronoTexto}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {t.semanas.map((fase, i) => (
            <article
              key={fase.semana}
              className="surface-elevated relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#00ff66]/30 bg-porcelana p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#00ff66] hover:shadow-[0_0_40px_rgba(0,255,102,0.14)]"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="t-eyebrow text-[#00ff66]">
                    {fase.semana} · {fase.dias}
                  </span>
                  <span className="font-display text-3xl text-[#00ff66]/45">0{i + 1}</span>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-branco">
                  <div
                    className="h-full bg-linear-to-r from-[#00ff66] to-[#4be283] shadow-[0_0_12px_#00ff66]"
                    style={{ width: PROGRESSO_FASE[i] }}
                  />
                </div>

                <h3 className="mt-6 font-display text-2xl text-grafite">{fase.titulo}</h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#00ff66]">
                  {fase.subtitulo}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-grafite/80">{fase.mecanismo}</p>
              </div>

              <div className="mt-7 rounded-lg border border-[#00ff66]/35 bg-[#00ff66]/10 p-4">
                <p className="text-xs leading-relaxed text-grafite">
                  <strong className="block font-extrabold uppercase tracking-wider text-[#00ff66]">
                    {v.resultadoEsperado}
                  </strong>
                  <span className="mt-1 block">{fase.entregavel}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ============================================================
         3. POR DENTRO DA PLATAFORMA INTERATIVA CS PERFORMANCE 21D
         ============================================================ */}
      <Section tone="porcelana" denso className="border-t border-linha">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <EyebrowNeon>{v.plataformaEyebrow}</EyebrowNeon>
            <h2 className="t-title mt-5 text-balance">{v.plataformaTitulo}</h2>
            <p className="mt-4 leading-relaxed text-grafite/80">
              <Rico
                partes={v.plataformaTexto}
                destaque={(x) => <strong className="text-[#00ff66]">{x}</strong>}
              />
            </p>

            <ul className="mt-6 space-y-3.5 text-sm text-grafite">
              {v.plataformaItens.map((item) => (
                <li key={item.titulo} className="flex items-start gap-3">
                  <Check />
                  <span>
                    <strong>{item.titulo}</strong> {item.texto}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* A área do aluno só existe em português. */}
              <Link href={`${rotas.programa}/area?demo=1`} className={btnNeon}>
                {v.testarPlataforma}
              </Link>
              <a href="#oferta-direta" className={btnOutlineNeon}>
                {v.garantirAcesso} <PrecoDinamico moedaServidor={moedaServidor} />
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-[#00ff66]/55 bg-[#070b09] p-2.5 shadow-[0_0_70px_rgba(0,255,102,0.2)]">
            <Image
              src="/brand/plataforma-reset-21d.jpg"
              alt={v.altPlataforma}
              width={935}
              height={1024}
              sizes="(max-width: 1024px) 95vw, 540px"
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </Section>

      {/* ============================================================
         4. COMPARATIVO VISUAL — DESAFIOS COMUNS VS. RESET METABÓLICO CS
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <EyebrowNeon>{v.difEyebrow}</EyebrowNeon>
          </div>
          <h2 className="t-title mt-5 text-balance">{v.difTitulo}</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Coluna Negativa */}
          <div className="rounded-xl border border-linha bg-porcelana/70 p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-grafite/60">
              {v.mercadoEyebrow}
            </p>
            <h3 className="mt-3 font-display text-2xl text-grafite/80">{v.mercadoTitulo}</h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-grafite/75">
              {v.mercadoItens.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 font-bold text-grafite/50">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna Positiva em Verde Neon */}
          <div className="relative overflow-hidden rounded-xl border-2 border-[#00ff66]/65 bg-[#0c140f] p-7 shadow-[0_0_50px_rgba(0,255,102,0.14)] sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#00ff66]">
              {v.metodoEyebrow}
            </p>
            <h3 className="mt-3 font-display text-2xl text-grafite">{v.metodoTitulo}</h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-grafite">
              {v.metodoItens.map((item) => (
                <li key={item.titulo} className="flex items-start gap-3">
                  <span className="mt-0.5 font-extrabold text-[#00ff66]">✓</span>
                  <span>
                    <strong>{item.titulo}</strong> {item.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ============================================================
         5. O QUE VOCÊ RECEBE — VITRINE DE ENTREGÁVEIS
         ============================================================ */}
      <Section tone="porcelana" denso className="border-t border-linha">
        <div className="max-w-2xl">
          <EyebrowNeon>{v.entregaveisEyebrow}</EyebrowNeon>
          <h2 className="t-title mt-5 text-balance">{v.entregaveisTitulo}</h2>
          <p className="mt-4 text-pretty leading-relaxed text-grafite/80">{v.entregaveisTexto}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {t.entregaveis.map((item) => (
            <div
              key={item.codigo}
              className="surface-card flex flex-col justify-between rounded-xl border border-linha p-7 transition-all duration-300 hover:border-[#00ff66]/55 hover:shadow-[0_0_35px_rgba(0,255,102,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="t-eyebrow text-[#00ff66]">{item.codigo}</span>
                  <span className="rounded-full border border-[#00ff66]/35 bg-[#00ff66]/12 px-3 py-1 text-[0.68rem] font-bold text-[#00ff66]">
                    {item.destaque}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl text-grafite">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grafite/80">{item.descricao}</p>
              </div>
              <div className="mt-6 border-t border-linha pt-4 text-xs font-bold text-[#00ff66]">
                {v.inclusoNoAcesso} <PrecoDinamico moedaServidor={moedaServidor} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================
         6. PROVA SOCIAL + AUTORIDADE CIENTÍFICA CARLOS SEITI
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <EyebrowNeon>{v.provaEyebrow}</EyebrowNeon>
            <h2 className="t-title mt-5 text-balance">{v.provaTitulo}</h2>
          </div>
          <Link
            href={marca.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2.5 border-b border-[#00ff66]/50 pb-1.5 text-sm font-semibold text-[#00ff66] transition-colors hover:border-[#00ff66]"
          >
            {v.provaCta}
            <Arrow />
          </Link>
        </div>

        <GaleriaTransformacoes variante="neon" idioma={idioma} />

        {/* Bloco de Autoridade Carlos Seiti */}
        <div className="mt-16 rounded-2xl border border-[#00ff66]/30 bg-porcelana p-7 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
            <div className="relative mx-auto w-56 overflow-hidden rounded-xl border border-[#00ff66]/40 lg:mx-0 lg:w-full">
              <Image
                src="/sobre/carlos-seiti.png"
                alt={v.altCarlos}
                width={1087}
                height={1448}
                sizes="(max-width: 1024px) 14rem, 16rem"
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                <p className="font-display text-lg text-[#f2ede5]">{marca.nome}</p>
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[#00ff66]">
                  {v.seloCarlos}
                </p>
              </div>
            </div>

            <div>
              <Eyebrow>{v.autorEyebrow}</Eyebrow>
              <h3 className="t-title mt-4 text-balance">{v.autorTitulo}</h3>
              <p className="mt-5 leading-relaxed text-grafite/85">{v.autorParagrafos[0]}</p>
              <p className="mt-4 leading-relaxed text-grafite/80">{v.autorParagrafos[1]}</p>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-linha pt-6 sm:grid-cols-4">
                {v.credenciais.map((c) => (
                  <div key={c.rotulo}>
                    <dt className="font-display text-3xl text-[#00ff66]">{c.valor}</dt>
                    <dd className="mt-1 text-xs text-grafite/75">{c.rotulo}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================
         7. OFERTA DIRETA + STACK DE VALOR + GARANTIA DE 7 DIAS (VERDE NEON)
         ============================================================ */}
      <Section id="oferta-direta" tone="porcelana" denso className="relative overflow-hidden border-t border-linha">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ff66]/10 blur-[150px]"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border-2 border-[#00ff66]/70 bg-[#0c140f] text-grafite shadow-[0_0_80px_rgba(0,255,102,0.22)]">
            <div className="h-2 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />

            <div className="p-7 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff66]/50 bg-[#00ff66]/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00ff66]">
                  <span aria-hidden className="pulso size-2 rounded-full bg-[#00ff66]" />
                  {v.ofertaSelo}
                </span>
                <SeletorMoeda moedaServidor={moedaServidor} idioma={idioma} />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-md overflow-hidden rounded-xl border border-[#39ff14]/35 bg-[#030b05] p-1.5 shadow-[0_0_35px_rgba(57,255,20,0.18)]">
                  <Image
                    src="/brand/reset-metabolico-21d.jpg"
                    alt={v.altOferta}
                    width={1024}
                    height={512}
                    sizes="(max-width: 640px) 90vw, 420px"
                    className="h-auto w-full rounded-lg object-cover"
                  />
                </div>
                <Logo size={44} className="hidden ring-[#00ff66]/35 sm:inline-flex" />
              </div>

              <h2 className="mt-6 font-display text-3xl leading-tight text-balance text-grafite sm:text-5xl">
                <Rico
                  partes={v.ofertaTitulo}
                  destaque={(x) => (
                    <span className="text-[#00ff66] drop-shadow-[0_0_24px_rgba(0,255,102,0.3)]">{x}</span>
                  )}
                />
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-grafite/80 sm:text-base">
                {v.ofertaTexto}
              </p>

              {/* Stack de Valor Ancorado */}
              <div className="mt-8 rounded-xl border border-[#00ff66]/30 bg-[#0b0a09]/90 p-5 sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00ff66]">
                  {v.resumoTitulo}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-grafite">
                  {v.resumoItens.map((item, i) => (
                    <li
                      key={item}
                      className={`flex items-center justify-between gap-4 ${
                        i < v.resumoItens.length - 1 ? "border-b border-white/10 pb-2.5" : ""
                      }`}
                    >
                      <span>{item}</span>
                      <span className="shrink-0 text-xs font-semibold text-[#00ff66]">{v.incluso}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-white/12 pt-5">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-grafite/70">
                      {v.de}{" "}
                      <span className="line-through">
                        <PrecoDinamico moedaServidor={moedaServidor} tipo="ancora" />
                      </span>{" "}
                      {v.porApenas}
                    </span>
                    <p className="font-display text-4xl text-[#00ff66] drop-shadow-[0_0_20px_rgba(0,255,102,0.3)] sm:text-5xl">
                      <PrecoDinamico moedaServidor={moedaServidor} />{" "}
                      <span className="font-sans text-sm font-normal text-grafite/80">
                        {v.pagamentoUnico}
                      </span>
                    </p>
                  </div>
                  <a
                    href="#simulador"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#00ff66] underline decoration-[#00ff66] underline-offset-4 hover:text-[#4be283]"
                  >
                    {v.subirSimulador}
                  </a>
                </div>
              </div>

              {/* Checkout ou Consultoria */}
              <div className="mt-8">
                {vendaAberta ? (
                  <Comprar moedaServidor={moedaServidor} rotulo={v.rotuloComprar} idioma={idioma} />
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <a href="/consultoria?de=reset-21-dias-oferta" className={btnNeon}>
                      {v.aplicarConsultoria} <PrecoDinamico moedaServidor={moedaServidor} />
                      <Arrow />
                    </a>
                    <Link href={`${rotas.programa}/area?demo=1`} className={btnOutlineNeon}>
                      {v.verPreview}
                    </Link>
                  </div>
                )}
              </div>

              {/* Selo de Garantia de 7 Dias */}
              <div className="mt-8 flex flex-col gap-4 rounded-xl border border-[#00ff66]/30 bg-[#0b0a09]/80 p-5 sm:flex-row sm:items-center">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#00ff66]/60 bg-[#00ff66]/15 font-display text-xl text-[#00ff66]">
                  7D
                </div>
                <div>
                  <p className="font-display text-lg text-[#00ff66]">{v.garantiaTitulo}</p>
                  <p className="mt-1 text-xs leading-relaxed text-grafite/80">{v.garantiaTexto}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================
         8. PERGUNTAS FREQUENTES (FAQ)
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="mx-auto max-w-3xl">
          <EyebrowNeon>{v.faqEyebrow}</EyebrowNeon>
          <h2 className="t-title mt-5 text-balance">{v.faqTitulo}</h2>

          <div className="mt-10 divide-y divide-linha border-y border-linha">
            {t.perguntas.map((item) => (
              <details key={item.p} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-grafite transition-colors hover:text-[#00ff66]">
                  <span>{item.p}</span>
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#00ff66]/45 text-sm text-[#00ff66] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-grafite/80 sm:text-base">{item.r}</p>
              </details>
            ))}
          </div>

          <p className="mt-9 text-center text-sm text-grafite/75">
            {v.faqRodape[0]}
            <Link
              href={rotaIdioma(idioma, rotas.gordura)}
              className="underline decoration-[#00ff66] underline-offset-4 transition-colors hover:text-[#00ff66]"
            >
              {v.faqRodape[1]}
            </Link>
            {v.faqRodape[2]}
            <Link
              href={rotaIdioma(idioma, rotas.calculadora)}
              className="underline decoration-[#00ff66] underline-offset-4 transition-colors hover:text-[#00ff66]"
            >
              {v.faqRodape[3]}
            </Link>
            {v.faqRodape[4]}
          </p>
        </div>
      </Section>
    </>
  );
}

export async function PaginaPrograma90({ idioma }: { idioma: Idioma }) {
  const t = TEXTO_PROGRAMA[idioma];
  const figuras = await listarFigurasDeShape();

  /* Detecta o país pelo cabeçalho de IP (Vercel / Cloudflare / Proxy) quando
     presente; no cliente, o hook useMoeda também verifica fuso horário Europe/Lisbon
     e permite alternar em 1 clique. */
  const h = await headers();
  const paisIp =
    h.get("x-vercel-ip-country") ??
    h.get("cf-ipcountry") ??
    h.get("x-country") ??
    null;
  const moedaServidor: Moeda | undefined = paisIp ? moedaPorPais(paisIp) : undefined;

  /* A venda só abre com as três peças do checkout no ambiente. Faltando
     qualquer uma, o pagamento falharia (sem token, sem pedido) ou nunca
     seria confirmado (sem segredo, o webhook recusa tudo). */
  const vendaAberta = Boolean(
    process.env.MERCADOPAGO_ACCESS_TOKEN &&
      process.env.MERCADOPAGO_WEBHOOK_SECRET &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  return (
    <>
      <Header idioma={idioma} />

      <main>
        <Programa
          figuras={figuras}
          idioma={idioma}
          abertura={<Abertura moedaServidor={moedaServidor} idioma={idioma} t={t} />}
          rodape={
            <PaginaDeVendas
              vendaAberta={vendaAberta}
              moedaServidor={moedaServidor}
              idioma={idioma}
              t={t}
            />
          }
          vendaAberta={vendaAberta}
        />
      </main>

      <Footer idioma={idioma} />
    </>
  );
}
