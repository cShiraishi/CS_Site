import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { GaleriaTransformacoes } from "@/components/GaleriaTransformacoes";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Arrow, Button, Container, Eyebrow, Section, buttonClass } from "@/components/ui";
import {
  credenciais,
  duvidas,
  marca,
  metodo,
  paraQuem,
  programa,
  resultados,
  rotas,
  sobre,
} from "@/lib/content";
import { precoEmReais, PROGRAMA } from "@/lib/produto";

/**
 * Método CS (/metodocs) — página de apresentação da consultoria, só em
 * português (fora de TRADUZIDOS em rotas-idioma.ts).
 *
 * Ritmo: promessa → números → problema → método → o que recebe → prova →
 * quem é → planos → dúvidas → começar. Todo o texto de serviço vem de
 * content.ts; aqui só o que é próprio desta página.
 */

export const ROTA_METODO_CS = rotas.metodoCS;

const CTA = `${rotas.consultoria}?de=metodocs`;

const TITULO = "Método CS: consultoria de treino e dieta";
const DESCRICAO =
  "O Método CS é a consultoria online de Carlos Seiti: diagnóstico, protocolo de dieta e treino, suporte na semana e ajuste quinzenal, com base em evidência.";

export function metadataMetodoCS(): Metadata {
  const imagem = { url: "/brand/cs-mark.jpg", width: 1024, height: 1024, alt: `Método CS | ${marca.nome}` };
  return {
    title: TITULO,
    description: DESCRICAO,
    alternates: { canonical: ROTA_METODO_CS },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${marca.site}${ROTA_METODO_CS}`,
      siteName: marca.nome,
      title: `${TITULO} | ${marca.nome}`,
      description: DESCRICAO,
      images: [imagem],
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITULO} | ${marca.nome}`,
      description: DESCRICAO,
      images: [imagem.url],
    },
  };
}

/* As quatro etapas do método, com a letra que dá nome a cada uma. */
const LETRAS = ["D", "P", "E", "A"] as const;

const planos = [
  {
    nome: "Ferramentas",
    para: "Para entender o seu ponto de partida",
    preco: "Grátis",
    nota: "sem cadastro",
    itens: [
      "Calculadora de calorias e de % de gordura",
      "Estimador de prato e raio-X postural",
      "Receitas fit e aulas no CSFlix",
    ],
    cta: { rotulo: "Usar as ferramentas", href: rotas.gordura, nativo: false },
    destaque: false,
  },
  {
    nome: "Consultoria individual",
    para: "O Método CS completo, ajustado a você",
    preco: "Avaliação",
    nota: "valor definido depois da análise do seu caso",
    itens: [
      "Plano alimentar e treino individuais",
      "Suporte direto durante a semana",
      "Revisão quinzenal com os seus dados",
      "Suplementação, quando faz diferença",
    ],
    cta: { rotulo: "Começar consultoria", href: CTA, nativo: true },
    destaque: true,
  },
  {
    nome: "Reset Metabólico 21D",
    para: "Para começar sozinho, com direção",
    preco: precoEmReais(PROGRAMA.precoCentavos),
    nota: "pagamento único",
    itens: [
      "Protocolo de 21 dias em 3 fases",
      "Plataforma CS Performance",
      "Guias práticos em PDF",
    ],
    cta: { rotulo: "Conhecer o Reset", href: rotas.programa, nativo: false },
    destaque: false,
  },
] as const;

const duvidasMetodo = [
  {
    p: "Qual a diferença entre a consultoria e o Reset 21D?",
    r: "O Reset é um protocolo de 21 dias que você segue por conta própria, com a plataforma e os guias. A consultoria é acompanhamento individual: o plano é montado para você e revisto a cada quinze dias com os seus dados.",
  },
  {
    p: "Como é o acompanhamento no dia a dia?",
    r: "Você tem canal direto durante a semana para dúvidas e ajustes rápidos. A cada quinze dias, revisamos carga, volume e calorias a partir do que você registrou.",
  },
  ...duvidas.itens,
] as const;

export function PaginaMetodoCS() {
  return (
    <>
      <Header idioma="pt" />
      <main>
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden bg-porcelana pt-28 sm:pt-40">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] opacity-[0.55] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_68%)]"
          />
          <Container className="relative">
            <div className="grid items-center gap-14 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-24">
              <div className="rise">
                <Eyebrow>Método CS · consultoria online</Eyebrow>
                <h1 className="t-display mt-8 text-balance">
                  Direção antes <span className="text-ouro">de esforço.</span>
                </h1>
                <p className="t-sub mt-8 max-w-xl text-pretty text-grafite">
                  Dieta e treino montados juntos, no seu gasto real e na sua rotina. Quatro etapas
                  pensadas para você não abandonar no meio.
                </p>
                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <Button nativo variant="consultoria" href={CTA}>
                    Quero o Método CS
                  </Button>
                  <a href="#metodo" className={buttonClass("outline")}>
                    Como funciona <span aria-hidden>↓</span>
                  </a>
                </div>
              </div>

              <figure className="rise relative mx-auto w-full max-w-sm lg:max-w-md" style={{ animationDelay: "160ms" }}>
                <span aria-hidden className="absolute -bottom-3 -right-3 h-full w-full rounded-[1.75rem] border border-linha-ouro" />
                <div className="relative overflow-hidden rounded-[1.75rem] bg-branco ring-1 ring-linha">
                  <Image
                    src="/sobre/carlos-seiti.png"
                    alt="Carlos Seiti, consultor de treino e dieta"
                    width={1087}
                    height={1448}
                    priority
                    sizes="(max-width: 1024px) 80vw, 420px"
                    className="h-auto w-full"
                  />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-porcelana/90 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <span>
                      <span className="block font-display text-2xl uppercase text-grafite">{marca.nome}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-grafite/70">
                        {marca.descritor}
                      </span>
                    </span>
                    <Logo size={40} />
                  </figcaption>
                </div>
              </figure>
            </div>

            {/* Números-chave */}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-linha bg-linha lg:grid-cols-4">
              {credenciais.map((c) => (
                <div key={c.rotulo} className="bg-porcelana p-6 sm:p-8">
                  <dt className="text-xs uppercase tracking-[0.16em] text-grafite/65">{c.rotulo}</dt>
                  <dd className="mt-2 font-display text-4xl text-ouro sm:text-5xl">{c.valor}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* ============ PROBLEMA ============ */}
        <Section tone="porcelana">
          <div className="max-w-2xl">
            <Eyebrow>{paraQuem.eyebrow}</Eyebrow>
            <h2 className="t-title mt-7 whitespace-pre-line text-balance">{paraQuem.titulo}</h2>
            <p className="t-sub mt-7 text-pretty text-grafite/85">{paraQuem.texto}</p>
          </div>
          <ol className="stagger mt-14 grid gap-5 sm:grid-cols-2">
            {paraQuem.itens.map((item, i) => (
              <li key={item} className="surface-card flex items-start gap-5 rounded-2xl p-6 sm:p-7">
                <span className="font-display text-3xl text-ouro">{String(i + 1).padStart(2, "0")}</span>
                <span className="pt-1.5 leading-relaxed text-grafite">{item}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* ============ MÉTODO ============ */}
        <Section id="metodo" tone="branco">
          <div className="max-w-2xl">
            <Eyebrow>O método</Eyebrow>
            <h2 className="t-title mt-7 text-balance">Quatro etapas. Um ciclo que se repete.</h2>
            <p className="t-sub mt-7 text-pretty text-grafite/85">{metodo.texto}</p>
          </div>
          <ol className="stagger mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {metodo.etapas.map((e, i) => (
              <li key={e.n} className="relative overflow-hidden rounded-2xl border border-linha bg-porcelana p-7">
                <span aria-hidden className="pointer-events-none absolute right-5 top-4 font-display text-[5.5rem] leading-none text-ouro/10">
                  {LETRAS[i]}
                </span>
                <p className="t-eyebrow text-ouro-profundo">Etapa {e.n}</p>
                <h3 className="mt-4 font-display text-3xl uppercase text-grafite">{e.titulo}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-grafite/85">{e.texto}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ============ O QUE VOCÊ RECEBE ============ */}
        <Section tone="porcelana">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow>O que você recebe</Eyebrow>
              <h2 className="t-title mt-7 text-balance">{programa.titulo}</h2>
              <p className="t-sub mt-7 text-pretty text-grafite/85">{programa.texto}</p>
            </div>
            <ul className="stagger grid gap-5 sm:grid-cols-2">
              {programa.itens.map((item) => (
                <li key={item.titulo} className="surface-card rounded-2xl p-6">
                  <span aria-hidden className="rule-gold block h-px w-10" />
                  <h3 className="mt-5 text-lg font-semibold text-grafite">{item.titulo}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-grafite/80">{item.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ============ DEPOIMENTOS / RESULTADOS ============ */}
        <Section id="depoimentos" tone="branco">
          <div className="max-w-2xl">
            <Eyebrow>Resultados</Eyebrow>
            <h2 className="t-title mt-7 text-balance">Quem passou pelo método.</h2>
            <p className="t-sub mt-7 text-pretty text-grafite/85">{resultados.texto}</p>
          </div>
          <GaleriaTransformacoes variante="ouro" idioma="pt" />
          <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
            <p className="text-xs text-grafite/60">{resultados.aviso}</p>
            <a href={marca.instagram} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost")}>
              {resultados.cta} <Arrow />
            </a>
          </div>
        </Section>

        {/* ============ QUEM CONDUZ ============ */}
        <Section tone="porcelana">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Quem conduz</Eyebrow>
            <blockquote className="mt-8 font-display text-3xl italic leading-snug text-grafite sm:text-4xl">
              “{sobre.citacao}”
            </blockquote>
            <p className="t-sub mx-auto mt-8 max-w-2xl text-pretty text-grafite/85">{sobre.curto}</p>
            <p className="mt-6 text-sm text-grafite/60">
              {marca.nome} · {marca.instagramHandle}
            </p>
          </div>
        </Section>

        {/* ============ PLANOS ============ */}
        <Section id="planos" tone="branco">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Planos</Eyebrow>
            </div>
            <h2 className="t-title mt-7 text-balance">Escolha por onde começar.</h2>
          </div>
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            {planos.map((p) => (
              <article
                key={p.nome}
                className={`relative flex flex-col rounded-2xl border p-7 sm:p-8 ${
                  p.destaque
                    ? "border-verde/60 bg-porcelana shadow-[0_24px_60px_-28px_color-mix(in_srgb,var(--color-verde)_45%,transparent)] lg:-my-4 lg:py-12"
                    : "border-linha bg-porcelana"
                }`}
              >
                {p.destaque && (
                  <span className="absolute -top-3 left-7 rounded-full bg-verde px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#06140b]">
                    Mais completo
                  </span>
                )}
                <h3 className="font-display text-3xl uppercase text-grafite">{p.nome}</h3>
                <p className="mt-2 text-sm text-grafite/70">{p.para}</p>
                <p className={`mt-7 font-display text-5xl ${p.destaque ? "text-verde" : "text-ouro"}`}>{p.preco}</p>
                <p className="mt-1 text-xs text-grafite/60">{p.nota}</p>
                <ul className="mt-7 flex-1 space-y-3 border-t border-linha pt-7">
                  {p.itens.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-[0.95rem] text-grafite/90">
                      <span aria-hidden className={`mt-2 size-1.5 shrink-0 rounded-full ${p.destaque ? "bg-verde" : "bg-ouro"}`} />
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {p.cta.nativo ? (
                    <Button nativo variant="consultoria" href={p.cta.href} className="w-full">
                      {p.cta.rotulo}
                    </Button>
                  ) : (
                    <Button variant="outline" href={p.cta.href} className="w-full">
                      {p.cta.rotulo}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* ============ FAQ ============ */}
        <Section id="duvidas" tone="porcelana">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow>{duvidas.eyebrow}</Eyebrow>
              <h2 className="t-title mt-7 text-balance">{duvidas.titulo}</h2>
            </div>
            <FAQ itens={duvidasMetodo} />
          </div>
        </Section>

        {/* ============ CTA FINAL ============ */}
        <section className="relative overflow-hidden bg-branco py-24 sm:py-32">
          <div aria-hidden className="diagonals pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_70%)]" />
          <Container className="relative text-center">
            <h2 className="t-title mx-auto max-w-3xl text-balance">
              Seu protocolo começa <span className="text-verde">pela conversa.</span>
            </h2>
            <p className="t-sub mx-auto mt-7 max-w-xl text-pretty text-grafite/85">
              Conte o seu contexto em cinco minutos. Eu leio tudo e respondo com o caminho
              recomendado, sem compromisso.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button nativo variant="consultoria" href={CTA}>
                Começar minha consultoria
              </Button>
              <Link href={rotas.programa} className={buttonClass("outline")}>
                Prefiro o Reset 21D <Arrow />
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
