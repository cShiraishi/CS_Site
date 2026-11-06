import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";
import { Arrow, Button, Container, Eyebrow, Rule, Section, buttonClass } from "./ui";
import {
  rotas,
  contato,
  hero,
  marca,
  metodo,
  paraQuem,
  pilares,
  programa,
  resultados,
  sobre,
} from "@/lib/content";

/*
 * A home tem cinco seções, mais o fecho em `Aplicar`:
 *
 *   Hero → Para quem é → Método → Programa (com os resultados dentro) →
 *   Sobre → Aplicar
 *
 * O que saiu daqui não foi apagado do site: os pilares da marca viraram
 * uma faixa dentro de "Para quem é", a calculadora de gordura continua no
 * botão secundário do hero e no menu, o CSFlix vive na própria página e as
 * dúvidas passaram para o fecho, onde a objeção aparece no momento em que
 * ela de facto trava a decisão. Uma página longa não é mais completa: é
 * só mais longa.
 */

/* ============================================================
   HERO — um único foco visual, muita área de silêncio.
   ============================================================ */
export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden bg-porcelana pt-32 sm:pt-40">
      {/* 08 / diagonais: ângulos consistentes e direcionais, sempre discretas */}
      <div
        aria-hidden
        className="diagonals pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] opacity-[0.55] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_68%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-32">
          <div className="rise">
            <Eyebrow>{hero.eyebrow}</Eyebrow>

            <h1 className="t-display mt-8 whitespace-pre-line text-balance">
              {hero.titulo}
            </h1>

            <p className="t-sub mt-8 max-w-xl text-pretty text-grafite">
              {hero.texto}
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-4">
              <Button nativo variant="consultoria" href={`${rotas.consultoria}?de=hero`}>{hero.cta}</Button>
              {/* O segundo botão era a calculadora de gordura — uma porta
                  para fora do funil. Agora só desce até a prova. */}
              <a href="#resultados" className={buttonClass("outline")}>
                {hero.ctaSecundario}
                <span aria-hidden>↓</span>
              </a>
            </div>

            {/* Como começar, colado ao botão: quem sabe o que vem depois do
                clique não trava nele. Os mesmos três passos do fecho. */}
            <ol className="mt-9 grid max-w-xl gap-px overflow-hidden rounded-xl border border-verde/25 bg-verde/20 sm:grid-cols-3">
              {contato.passos.map((p, i) => (
                <li key={p.numero} className="flex items-start gap-3 bg-porcelana/95 p-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-verde text-[0.7rem] font-bold text-[#06140b]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold leading-tight text-grafite">
                      {p.titulo}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-grafite/60">
                      {p.nota}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 flex items-center gap-2.5 text-xs text-grafite/70">
              <span aria-hidden className="size-1.5 rounded-full bg-verde" />
              {hero.nota}
            </p>
          </div>

          {/* 03 / o símbolo como expressão principal, sobre fundo de baixa interferência */}
          <div className="rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "160ms" }}>
            <div className="paper drift relative aspect-square overflow-hidden rounded-[2rem] ring-1 ring-linha shadow-[0_28px_70px_-40px_rgba(29,27,25,0.5)]">
              <Image
                src="/brand/cs-mark.jpg"
                alt="Monograma CS — branco e ouro, com seta ascendente"
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-6 text-center font-display text-lg italic text-grafite">
              {marca.assinatura}
            </p>
          </div>
        </div>

      </Container>
    </section>
  );
}

/* ============================================================
   PARA QUEM É — com os quatro pilares da marca ao pé.

   Os pilares tinham seção própria, com título e tudo. Eles dizem como o
   trabalho é feito, e isso só interessa a quem acabou de se reconhecer na
   lista acima — por isso agora são uma linha de quatro, e não uma parada.
   ============================================================ */
export function ParaQuem() {
  return (
    <Section tone="branco">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{paraQuem.eyebrow}</Eyebrow>
          <h2 className="t-title reveal mt-7 whitespace-pre-line text-balance">
            {paraQuem.titulo}
          </h2>
          <p className="mt-7 max-w-md text-pretty leading-relaxed text-grafite">
            {paraQuem.texto}
          </p>
        </div>

        <div>
          <ul className="stagger space-y-0">
            {paraQuem.itens.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 border-b border-linha py-5 first:pt-0"
              >
                <Arrow className="mt-1.5 text-ouro-profundo" />
                <span className="text-[0.98rem] leading-relaxed text-grafite/85">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="t-eyebrow text-grafite">Não é para</p>
            <ul className="mt-4 space-y-2.5">
              {paraQuem.naoE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-grafite">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-grafite/35" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Os pilares, em uma linha: como o trabalho é feito. */}
      <Rule className="mt-20" />
      <dl className="stagger grid gap-x-12 gap-y-9 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {pilares.map((p) => (
          <div key={p.titulo}>
            <dt className="text-sm uppercase tracking-[0.16em]">{p.titulo}</dt>
            <dd className="mt-3 text-[0.93rem] leading-relaxed text-grafite">
              {p.texto}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* ============================================================
   MÉTODO — 4 etapas
   ============================================================ */
export function Metodo() {
  return (
    <Section id="metodo">
      <div className="max-w-2xl">
        <Eyebrow>{metodo.eyebrow}</Eyebrow>
        <h2 className="t-title reveal mt-7 text-balance">{metodo.titulo}</h2>
        <p className="mt-7 text-pretty leading-relaxed text-grafite">{metodo.texto}</p>
      </div>

      <ol className="stagger mt-20 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-2">
        {metodo.etapas.map((e) => (
          <li key={e.n} className="group relative bg-branco p-9 sm:p-11">
            <span
              aria-hidden
              className="rule-gold absolute left-0 top-0 h-px w-0 transition-all duration-500 group-hover:w-full"
            />
            <span aria-hidden className="font-display text-5xl text-ouro-profundo transition-colors duration-500 group-hover:text-grafite">
              {e.n}
            </span>
            <h3 className="mt-6 font-display text-2xl">{e.titulo}</h3>
            <p className="mt-3.5 text-[0.95rem] leading-relaxed text-grafite">
              {e.texto}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ============================================================
   PROGRAMA — o que está incluso, e o que isso produziu.

   As transformações eram uma seção à parte, depois do programa. A
   promessa e a prova agora estão no mesmo fundo: quem lê "ajuste
   quinzenal" vê, duas dobras abaixo, três pessoas que passaram por ele.
   A âncora #resultados continua a existir, para os links já partilhados.
   ============================================================ */
export function Programa() {
  return (
    <Section id="programa" tone="grafite">
      <div className="max-w-2xl">
        <Eyebrow tone="claro">{programa.eyebrow}</Eyebrow>
        <h2 className="t-title reveal mt-7 text-balance text-porcelana">
          {programa.titulo}
        </h2>
        <p className="mt-7 text-pretty leading-relaxed text-porcelana/70">
          {programa.texto}
        </p>
      </div>

      <div className="stagger mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-2">
        {programa.itens.map((item, i) => (
          <div key={item.titulo}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-sm text-ouro">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="rule-gold draw-in h-px flex-1" />
            </div>
            <h3 className="mt-5 font-display text-xl text-porcelana">{item.titulo}</h3>
            <p className="mt-3 text-[0.93rem] leading-relaxed text-porcelana/70">
              {item.texto}
            </p>
          </div>
        ))}
      </div>

      {/* A prova, no mesmo fundo da promessa. */}
      <div id="resultados" className="mt-24 scroll-mt-24 border-t border-porcelana/12 pt-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="t-title reveal max-w-md text-balance text-porcelana">
            {resultados.titulo}
          </h3>
          <Link
            href={marca.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2.5 border-b border-ouro/40 pb-1.5 text-sm text-ouro transition-colors hover:border-ouro"
          >
            {resultados.cta}
            <Arrow />
          </Link>
        </div>

        <p className="mt-6 max-w-md text-pretty leading-relaxed text-porcelana/65">
          {resultados.texto}
        </p>

        <div className="stagger mt-12 grid items-start gap-5 sm:grid-cols-3">
          {resultados.transformacoes.map((pessoa) => (
            <Link
              key={pessoa.instagram}
              href={pessoa.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${pessoa.instagram} no Instagram`}
              className="group relative isolate overflow-hidden border border-porcelana/12 bg-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-ouro/45 hover:shadow-[0_24px_60px_rgba(0,0,0,0.32)]"
            >
              <Image
                src={pessoa.imagem}
                alt={pessoa.alt}
                width={pessoa.largura}
                height={pessoa.altura}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-auto w-full opacity-90 transition-all duration-700 group-hover:scale-[1.025] group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-grafite via-grafite/55 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span>
                  <span className="block font-display text-xl text-porcelana">
                    {pessoa.nome}
                  </span>
                  <span className="mt-1 block text-xs tracking-wide text-porcelana/65">
                    {pessoa.instagram}
                  </span>
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-porcelana/25 bg-white/10 text-ouro backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  <Arrow />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-porcelana/70">
          {resultados.aviso}
        </p>
      </div>
    </Section>
  );
}

/* ============================================================
   SOBRE
   ============================================================ */
export function Sobre() {
  return (
    <Section id="sobre" tone="branco">
      <div className="max-w-2xl">
        <Eyebrow>{sobre.eyebrow}</Eyebrow>
        <h2 className="t-title reveal mt-7 whitespace-pre-line text-balance">
          {sobre.titulo}
        </h2>
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
        <figure className="group relative mx-auto w-full max-w-md lg:mx-0">
          <span
            aria-hidden
            className="absolute -bottom-3 -right-3 h-full w-full border border-linha-ouro transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
          />
          <div className="relative overflow-hidden bg-grafite shadow-[0_24px_70px_rgba(29,27,25,0.16)]">
            <Image
              src="/sobre/carlos-seiti.png"
              alt="Carlos Seiti em ambiente de treino"
              width={1087}
              height={1448}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.025]"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-grafite/75 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-porcelana">
              <span>
                <span className="block font-display text-2xl">{marca.nome}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-porcelana/70">
                  Ciência aplicada à vida real
                </span>
              </span>
              <Logo size={44} className="ring-porcelana/25" />
            </figcaption>
          </div>
        </figure>

        <div className="stagger space-y-6">
          <figure className="mb-10 border-l border-linha-ouro pl-7">
            <blockquote className="font-display text-2xl italic leading-snug text-grafite/85 sm:text-3xl">
              {sobre.citacao}
            </blockquote>
          </figure>

          {sobre.paragrafos.map((p) => (
            <p key={p.slice(0, 24)} className="text-pretty leading-[1.75] text-grafite">
              {p}
            </p>
          ))}

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-6 text-sm leading-relaxed text-grafite">
            <Link
              href={marca.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-linha-ouro pb-1.5 transition-colors hover:text-ouro-profundo"
            >
              {marca.instagramHandle}
              <Arrow />
            </Link>
            <Link
              href={marca.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-linha-ouro pb-1.5 transition-colors hover:text-ouro-profundo"
            >
              {marca.youtubeNome}
              <Arrow />
            </Link>
            <Link
              href={marca.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-linha-ouro pb-1.5 transition-colors hover:text-ouro-profundo"
            >
              LinkedIn
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   HOME ENXUTA (nov/2026) — uma página, um pedido.

   A home anterior explicava tudo antes de pedir o clique: para quem é,
   pilares, método, programa, sobre. Agora a ordem é a de quem chega do
   Instagram: promessa → prova → como funciona → quem é → começar. Cada
   bloco termina no mesmo botão verde.
   ============================================================ */

function BotaoComecar({ de }: { de: string }) {
  return (
    <a href={`${rotas.consultoria}?de=${de}`} className={buttonClass("consultoria")}>
      Começar consultoria
      <Arrow />
    </a>
  );
}

/** A prova logo depois da promessa. */
export function Resultados() {
  return (
    <Section id="resultados" denso className="border-t border-linha">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>{resultados.eyebrow}</Eyebrow>
          <h2 className="t-title reveal mt-6 text-balance">{resultados.titulo}</h2>
        </div>
        <Link
          href={marca.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-2.5 border-b border-ouro/40 pb-1.5 text-sm text-ouro transition-colors hover:border-ouro"
        >
          {resultados.cta}
          <Arrow />
        </Link>
      </div>

      <div className="stagger mt-10 grid items-start gap-4 sm:grid-cols-3">
        {resultados.transformacoes.map((pessoa) => (
          <Link
            key={pessoa.instagram}
            href={pessoa.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver ${pessoa.instagram} no Instagram`}
            className="group relative isolate overflow-hidden rounded-xl border border-linha bg-branco transition-all duration-500 hover:-translate-y-1.5 hover:border-ouro/45"
          >
            <Image
              src={pessoa.imagem}
              alt={pessoa.alt}
              width={pessoa.largura}
              height={pessoa.altura}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="h-auto w-full"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 to-transparent"
            />
            <span className="absolute inset-x-0 bottom-0 p-4">
              <span className="block font-display text-xl uppercase text-[#f2ede5]">
                {pessoa.nome}
              </span>
              <span className="block text-xs text-[#f2ede5]/70">{pessoa.instagram}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-grafite/55">{resultados.aviso}</p>
        <BotaoComecar de="resultados" />
      </div>
    </Section>
  );
}

/** Método e o que está incluso, num bloco só. */
export function ComoFunciona() {
  return (
    <Section id="metodo" tone="grafite" denso>
      <Eyebrow tone="claro">Como funciona</Eyebrow>
      <h2 className="t-title reveal mt-6 text-balance text-porcelana">{metodo.titulo}</h2>

      <ol className="stagger mt-10 grid gap-px overflow-hidden rounded-xl bg-porcelana/15 sm:grid-cols-2 lg:grid-cols-4">
        {metodo.etapas.map((e) => (
          <li key={e.n} className="bg-grafite p-6">
            <span className="font-display text-4xl leading-none text-[#8a6438]">{e.n}</span>
            <h3 className="mt-4 font-display text-2xl uppercase text-porcelana">{e.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-porcelana/70">{e.texto}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs font-bold uppercase tracking-[0.16em] text-porcelana/60">
          Incluso
        </span>
        {programa.itens.map((i) => (
          <span
            key={i.titulo}
            className="rounded-full border border-porcelana/20 px-3.5 py-1.5 text-sm text-porcelana"
          >
            ✓ {i.titulo}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <BotaoComecar de="como-funciona" />
      </div>
    </Section>
  );
}

/** Quem está do outro lado — foto e duas linhas. */
export function SobreCurto() {
  return (
    <Section id="sobre" denso>
      <div className="grid items-center gap-10 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-12">
        <div className="relative mx-auto w-48 overflow-hidden rounded-2xl border border-linha sm:mx-0 sm:w-full">
          <Image
            src="/sobre/carlos-seiti.png"
            alt="Carlos Seiti em ambiente de treino"
            width={1087}
            height={1448}
            sizes="14rem"
            className="h-auto w-full"
          />
        </div>
        <div>
          <Eyebrow>Quem vai te acompanhar</Eyebrow>
          <p className="t-title mt-5">{marca.nome}</p>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-grafite/75">
            {sobre.curto}
          </p>
          <p className="mt-5 font-serif text-xl italic text-ouro">{sobre.citacao}</p>
        </div>
      </div>
    </Section>
  );
}
