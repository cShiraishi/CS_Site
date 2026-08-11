import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";
import { FAQ } from "./FAQ";
import { Arrow, Button, Container, Eyebrow, Rule, Section, buttonClass } from "./ui";
import {
  calculadora,
  credenciais,
  duvidas,
  hero,
  marca,
  metodo,
  paraQuem,
  pilares,
  programa,
  resultados,
  sobre,
} from "@/lib/content";

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
              <Button href="#contato">{hero.cta}</Button>
              <Link href={calculadora.slug} className={buttonClass("outline")}>
                {hero.ctaSecundario}
                <Arrow />
              </Link>
            </div>

            <p className="mt-8 flex items-center gap-2.5 text-xs text-grafite">
              <span aria-hidden className="rule-gold h-px w-6" />
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

        {/* Faixa de credenciais */}
        <Rule />
        <dl className="stagger grid grid-cols-2 gap-y-10 py-12 sm:py-14 lg:grid-cols-4">
          {credenciais.map((c) => (
            <div key={c.rotulo} className="px-2 text-center lg:border-l lg:border-linha lg:first:border-l-0">
              <dt className="font-display text-4xl text-ouro-profundo sm:text-5xl">
                {c.valor}
              </dt>
              <dd className="mt-2.5 text-xs uppercase tracking-[0.14em] text-grafite">
                {c.rotulo}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ============================================================
   PILARES — 01 / essência da marca
   ============================================================ */
export function Pilares() {
  return (
    <Section tone="branco">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div>
          <Eyebrow>Essência</Eyebrow>
          <h2 className="t-title reveal mt-7 text-balance">
            Clareza que direciona.
            <br />
            <span className="italic text-ouro-profundo">Consistência</span> que
            transforma.
          </h2>
        </div>

        <div className="stagger grid gap-x-12 gap-y-11 sm:grid-cols-2">
          {pilares.map((p) => (
            <div key={p.titulo}>
              <span aria-hidden className="rule-gold draw-in block h-px w-10" />
              <h3 className="mt-5 text-sm uppercase tracking-[0.16em]">{p.titulo}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-grafite">
                {p.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   PARA QUEM É
   ============================================================ */
export function ParaQuem() {
  return (
    <Section>
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
    </Section>
  );
}

/* ============================================================
   MÉTODO — 4 etapas
   ============================================================ */
export function Metodo() {
  return (
    <Section id="metodo" tone="branco">
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
   PROGRAMA — o que está incluso
   ============================================================ */
export function Programa() {
  return (
    <Section id="programa">
      <div className="max-w-2xl">
        <Eyebrow>{programa.eyebrow}</Eyebrow>
        <h2 className="t-title reveal mt-7 text-balance">{programa.titulo}</h2>
        <p className="mt-7 text-pretty leading-relaxed text-grafite">
          {programa.texto}
        </p>
      </div>

      <div className="stagger mt-18 grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {programa.itens.map((item, i) => (
          <div key={item.titulo}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-sm text-ouro-profundo">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="rule-gold draw-in h-px flex-1" />
            </div>
            <h3 className="mt-5 font-display text-xl">{item.titulo}</h3>
            <p className="mt-3 text-[0.93rem] leading-relaxed text-grafite">
              {item.texto}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================
   RESULTADOS
   ============================================================ */
export function Resultados() {
  return (
    <Section id="resultados" tone="grafite">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-24">
        <div>
          <Eyebrow tone="claro">{resultados.eyebrow}</Eyebrow>
          <h2 className="t-title reveal mt-7 text-balance text-porcelana">
            {resultados.titulo}
          </h2>
        </div>
        <div>
          <p className="mt-7 max-w-md text-pretty leading-relaxed text-porcelana/65">
            {resultados.texto}
          </p>
          <Link
            href={marca.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-9 inline-flex items-center gap-2.5 border-b border-ouro/40 pb-1.5 text-sm text-ouro transition-colors hover:border-ouro"
          >
            {resultados.cta}
            <Arrow />
          </Link>
        </div>
      </div>

      <div className="stagger mt-16 grid items-start gap-5 sm:grid-cols-3">
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
            <div>
              <Link
                href={marca.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border-b border-linha-ouro pb-1.5 transition-colors hover:text-ouro-profundo"
              >
                {marca.instagramHandle}
                <Arrow />
              </Link>
            </div>
            <div>
              <Link
                href={marca.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border-b border-linha-ouro pb-1.5 transition-colors hover:text-ouro-profundo"
              >
                {marca.youtubeNome}
                <Arrow />
              </Link>
            </div>
            <div>
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
      </div>
    </Section>
  );
}

/* ============================================================
   DÚVIDAS
   ============================================================ */
export function Duvidas() {
  return (
    <Section id="duvidas">
      <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{duvidas.eyebrow}</Eyebrow>
          <h2 className="t-title mt-7 text-balance">{duvidas.titulo}</h2>
        </div>

        <FAQ itens={duvidas.itens} />
      </div>
    </Section>
  );
}

/* ============================================================
   FERRAMENTA — ponte da home para a calculadora
   ============================================================ */
export function Ferramenta() {
  return (
    <Section id="ferramenta" tone="grafite">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
        <div>
          <Eyebrow tone="claro">{calculadora.eyebrow}</Eyebrow>

          <h2 className="t-title reveal mt-7 text-balance text-porcelana">
            Comece pelo{" "}
            <span className="italic text-ouro">seu número</span>, não pelo meu
            método.
          </h2>

          <p className="mt-7 max-w-lg text-pretty leading-relaxed text-porcelana/70">
            Metabolismo basal, gasto do dia, alvo para o peso que você quer, os
            três macros e a distribuição nas suas refeições. Em trinta segundos,
            sem cadastro.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <Link
              href={calculadora.slug}
              className="group inline-flex items-center gap-2.5 rounded-full bg-ouro px-8 py-4 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-porcelana"
            >
              {calculadora.cta}
              <Arrow />
            </Link>
            <span className="text-xs text-porcelana/70">
              Gratuito · sem cadastro
            </span>
          </div>
        </div>

        {/* Prévia do que a ferramenta entrega */}
        <div className="stagger grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-porcelana/12">
          {[
            { n: "1.725", r: "Metabolismo basal", u: "kcal" },
            { n: "2.674", r: "Gasto no dia", u: "kcal" },
            { n: "2.030", r: "Alvo para emagrecer", u: "kcal" },
            { n: "156", r: "Proteína por dia", u: "g" },
          ].map((c) => (
            <div key={c.r} className="bg-grafite p-7">
              <p className="font-display text-3xl text-ouro sm:text-4xl">
                {c.n}
                <span className="ml-1.5 font-sans text-xs text-porcelana/70">
                  {c.u}
                </span>
              </p>
              <p className="mt-2.5 text-xs uppercase tracking-[0.13em] text-porcelana/70">
                {c.r}
              </p>
            </div>
          ))}
          <p className="col-span-2 bg-grafite px-7 pb-7 text-xs leading-relaxed text-porcelana/70">
            Exemplo — homem, 32 anos, 78 kg, 176 cm, treinando 4× por semana.
          </p>
        </div>
      </div>
    </Section>
  );
}
