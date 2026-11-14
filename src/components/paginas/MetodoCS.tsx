import type { Metadata } from "next";
import Image from "next/image";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { GaleriaTransformacoes } from "@/components/GaleriaTransformacoes";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Arrow, Button, Container, Eyebrow, Section, buttonClass } from "@/components/ui";
import { credenciais, duvidas, marca, metodo, resultados, rotas, sobre } from "@/lib/content";
import { PROGRAMA, TABELA_PRECOS, precoEmReais } from "@/lib/produto";

/**
 * Método CS (/metodocs) — página de vendas, só em português (fora de
 * TRADUZIDOS em rotas-idioma.ts).
 *
 * Ritmo de página de vendas: promessa e números → contraste com a dieta
 * genérica → três problemas → método → oferta (três planos, o do meio em
 * destaque) → comparativo → garantia → prova → autoridade → dúvidas →
 * fecho. Um CTA a cada duas dobras, mais o de WhatsApp para quem travou.
 */

export const ROTA_METODO_CS = rotas.metodoCS;

/* Sem checkout próprio para o Método CS: a compra começa pelo questionário
   da consultoria, com o plano marcado para a atribuição. */
const CTA = `${rotas.consultoria}?de=metodocs`;
const CTA_METODO = `${rotas.consultoria}?de=metodocs&plano=metodo-cs`;

const TITULO = "Método CS: dieta e treino com acompanhamento";
const DESCRICAO =
  "Método CS, de Carlos Seiti: dieta e treino montados para o seu corpo e a sua rotina, com suporte e ajuste a partir dos seus dados. Conheça os planos.";

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

/* ------------------------------------------------------------------
   Oferta. O plano do meio (R$ 300) é proposta nova: conteúdo e preço
   precisam do aval do Carlos antes de publicar.
   ------------------------------------------------------------------ */
const PRECO_METODO = "R$ 300";

type Plano = {
  id: string;
  nome: string;
  para: string;
  preco: string;
  ancora?: string;
  nota: string;
  itens: readonly string[];
  cta: { rotulo: string; href: string; tipo: "consultoria" | "solid" | "outline" };
  selo?: string;
};

const PLANOS: readonly Plano[] = [
  {
    id: "reset",
    nome: "Reset 21D",
    para: "Para começar sozinho, com direção",
    preco: precoEmReais(PROGRAMA.precoCentavos),
    ancora: PROGRAMA.precoAncora,
    nota: `pagamento único · ${TABELA_PRECOS.BRL.meiosPagamento}`,
    itens: ["Protocolo de 21 dias em 3 fases", "Plataforma CS Performance", "Guias práticos em PDF"],
    cta: { rotulo: "Quero o Reset", href: rotas.programa, tipo: "outline" },
  },
  {
    id: "metodo-cs",
    nome: "Método CS",
    para: "Dieta e treino feitos para você",
    preco: PRECO_METODO,
    nota: "pagamento único · 8 semanas",
    itens: [
      "Diagnóstico do seu histórico e rotina",
      "Plano alimentar individual, com substituições",
      "Treino para o seu nível e equipamento",
      "Revisão do protocolo na 4ª semana",
      "Suporte por mensagem durante as 8 semanas",
    ],
    cta: { rotulo: "Quero o Método CS", href: CTA_METODO, tipo: "consultoria" },
    selo: "Recomendado",
  },
  {
    id: "consultoria",
    nome: "Consultoria",
    para: "Acompanhamento contínuo, sem prazo",
    preco: "Sob avaliação",
    nota: "valor definido depois da análise do seu caso",
    itens: [
      "Tudo do Método CS",
      "Revisão quinzenal com os seus dados",
      "Canal direto na semana",
      "Suplementação, quando faz diferença",
    ],
    cta: { rotulo: "Quero a consultoria", href: CTA, tipo: "outline" },
  },
];

/* Comparativo: true = incluso, false = não, string = como. */
const COMPARATIVO: readonly { linha: string; valores: readonly (boolean | string)[] }[] = [
  { linha: "Duração", valores: ["21 dias", "8 semanas", "Contínua"] },
  { linha: "Plano alimentar individual", valores: ["Por fases", true, true] },
  { linha: "Treino individual", valores: ["Por fases", true, true] },
  { linha: "Revisão com os seus dados", valores: [false, "1 revisão", "A cada 15 dias"] },
  { linha: "Suporte direto", valores: [false, "Por mensagem", "Canal na semana"] },
  { linha: "Plataforma e guias em PDF", valores: [true, false, false] },
  { linha: "Ideal para", valores: ["Dar o primeiro passo", "Mudar de vez", "Ir longe"] },
];

const CONTRASTE = {
  generico: [
    "Cardápio igual para todo mundo",
    "Corta grupos alimentares sem motivo",
    "Ninguém responde quando surge a dúvida",
    "Não muda quando o corpo para de responder",
  ],
  metodo: [
    "Montado com o que você já come",
    "Restrição só quando há motivo",
    "Suporte direto durante o protocolo",
    "Ajuste a partir dos seus dados reais",
  ],
};

const PROBLEMAS = [
  {
    titulo: "Plano genérico",
    texto: "Dieta copiada não conhece seu gasto, sua rotina nem seu histórico. Ela falha e você acha que a culpa é sua.",
    resposta: "No Método CS, tudo parte do seu diagnóstico.",
  },
  {
    titulo: "Ninguém do lado",
    texto: "A dúvida aparece na terça, a resposta não vem, e a semana inteira se perde na tentativa e erro.",
    resposta: "Aqui a dúvida é respondida enquanto ainda importa.",
  },
  {
    titulo: "Plano que não muda",
    texto: "O corpo se adapta. Se o protocolo fica igual, o resultado para e a motivação vai junto.",
    resposta: "O plano é revisto com os números que você trouxe.",
  },
] as const;

const DUVIDAS_VENDA = [
  {
    p: "Qual plano eu escolho?",
    r: "Se você nunca seguiu um protocolo e quer testar, comece pelo Reset 21D. Se quer dieta e treino feitos para você, com alguém acompanhando, o Método CS é o caminho. Se o objetivo é longo, como competir ou manter um resultado, a consultoria contínua faz mais sentido.",
  },
  {
    p: "Como funciona depois que eu escolho?",
    r: "Você responde um questionário curto sobre objetivo, rotina e histórico. Eu leio tudo, confirmo o plano com você e monto o protocolo. Do primeiro contato ao plano na mão, a ideia é levar poucos dias.",
  },
  {
    p: "E se eu não gostar?",
    r: "Você tem 7 dias de garantia. Se não fizer sentido para você, devolvemos o valor integral.",
  },
  ...duvidas.itens,
] as const;

function Celula({ valor, destaque }: { valor: boolean | string; destaque: boolean }) {
  if (valor === true)
    return (
      <span aria-label="Incluso" className={destaque ? "text-verde" : "text-ouro"}>
        ✓
      </span>
    );
  if (valor === false)
    return (
      <span aria-label="Não incluso" className="text-grafite/30">
        —
      </span>
    );
  return <span className="text-grafite/90">{valor}</span>;
}

function BotaoPlano({ cta }: { cta: Plano["cta"] }) {
  if (cta.tipo === "consultoria")
    return (
      <Button nativo variant="consultoria" href={cta.href} className="w-full">
        {cta.rotulo}
      </Button>
    );
  if (cta.href.startsWith(rotas.consultoria))
    return (
      <Button nativo variant={cta.tipo} href={cta.href} className="w-full">
        {cta.rotulo}
      </Button>
    );
  return (
    <Button variant={cta.tipo} href={cta.href} className="w-full">
      {cta.rotulo}
    </Button>
  );
}

/**
 * Faixa de antes e depois passando sozinha no hero. A lista vai duplicada
 * (a segunda cópia escondida do leitor de tela) para o loop não ter emenda;
 * para no hover e fica parada com movimento reduzido.
 */
function EsteiraResultados() {
  const fotos = resultados.transformacoes;
  /* Com 4 fotos, metade da esteira ficaria mais estreita que a área
     visível e abriria um buraco: a base vai repetida antes de duplicar. */
  const base = [...fotos, ...fotos];
  return (
    <div className="mt-9 max-w-xl">
      <p className="t-eyebrow text-grafite/60">Antes e depois de alunos</p>
      <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="esteira flex w-max gap-3">
          {[...base, ...base].map((p, i) => {
            const copia = i >= fotos.length;
            return (
              <li key={`${p.instagram}-${i}`} aria-hidden={copia || undefined} className="shrink-0">
                <a
                  href="#depoimentos"
                  tabIndex={copia ? -1 : undefined}
                  className="group relative block h-44 w-24 overflow-hidden rounded-xl border border-linha bg-branco transition-colors hover:border-ouro/60 sm:h-52 sm:w-28"
                >
                  <Image
                    src={p.imagem}
                    alt={copia ? "" : p.alt}
                    fill
                    sizes="112px"
                    className="object-cover object-center"
                  />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-5 text-[0.65rem] font-semibold text-[#f2ede5]">
                    {p.nome}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function CtaDuvida() {
  return (
    <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-2xl border border-linha bg-porcelana p-6 text-center sm:flex-row sm:p-8 sm:text-left">
      <div>
        <p className="font-display text-2xl uppercase text-grafite">Ficou em dúvida sobre o plano?</p>
        <p className="mt-2 text-sm text-grafite/70">Me chama no WhatsApp e eu te digo qual faz sentido para você.</p>
      </div>
      <a href={marca.whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClass("outline")}>
        Falar no WhatsApp <Arrow />
      </a>
    </div>
  );
}

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
              {/* min-w-0: sem ele a esteira (w-max) alarga a coluna da grid. */}
              <div className="rise min-w-0">
                <Eyebrow>Método CS · dieta e treino online</Eyebrow>
                <h1 className="t-display mt-8 text-balance">
                  Um plano <span className="text-ouro">só seu.</span>
                </h1>
                <p className="t-sub mt-8 max-w-xl text-pretty text-grafite">
                  Dieta e treino montados para o seu gasto, a sua rotina e o seu histórico, com alguém
                  acompanhando e ajustando até o resultado aparecer.
                </p>
                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <Button nativo variant="consultoria" href={CTA_METODO}>
                    Quero começar
                  </Button>
                  <a href="#planos" className={buttonClass("outline")}>
                    Ver planos <span aria-hidden>↓</span>
                  </a>
                </div>
                <p className="mt-6 flex items-center gap-2.5 text-xs text-grafite/70">
                  <span aria-hidden className="size-1.5 rounded-full bg-verde" />
                  Vagas limitadas por mês: cada plano é lido e montado por mim.
                </p>
                <EsteiraResultados />
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

        {/* ============ CONTRASTE ============ */}
        <Section tone="porcelana" denso>
          <div className="max-w-2xl">
            <Eyebrow>A diferença</Eyebrow>
            <h2 className="t-title mt-7 text-balance">Dieta da internet × Método CS.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-linha bg-branco p-7">
              <p className="t-eyebrow text-grafite/60">Dieta genérica</p>
              <ul className="mt-6 space-y-4">
                {CONTRASTE.generico.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-grafite/70">
                    <span aria-hidden className="mt-0.5 text-grafite/40">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-linha-ouro bg-branco p-7">
              <p className="t-eyebrow text-ouro-profundo">Método CS</p>
              <ul className="mt-6 space-y-4">
                {CONTRASTE.metodo.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-grafite">
                    <span aria-hidden className="mt-0.5 text-ouro">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ============ PROBLEMAS ============ */}
        <Section tone="branco">
          <div className="max-w-2xl">
            <Eyebrow>Por que não funcionou antes</Eyebrow>
            <h2 className="t-title mt-7 text-balance">Não foi falta de força de vontade.</h2>
            <p className="t-sub mt-7 text-pretty text-grafite/85">
              Quase sempre, o plano falha por um destes três motivos.
            </p>
          </div>
          <ol className="stagger mt-14 grid gap-5 lg:grid-cols-3">
            {PROBLEMAS.map((p, i) => (
              <li key={p.titulo} className="flex flex-col rounded-2xl border border-linha bg-porcelana p-7">
                <span className="font-display text-5xl text-ouro">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-display text-3xl uppercase text-grafite">{p.titulo}</h3>
                <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-grafite/80">{p.texto}</p>
                <p className="mt-6 border-t border-linha pt-5 text-sm font-semibold text-ouro-profundo">{p.resposta}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ============ MÉTODO ============ */}
        <Section id="metodo" tone="porcelana">
          <div className="max-w-2xl">
            <Eyebrow>Como funciona</Eyebrow>
            <h2 className="t-title mt-7 text-balance">Quatro etapas. Um ciclo que se repete.</h2>
            <p className="t-sub mt-7 text-pretty text-grafite/85">{metodo.texto}</p>
          </div>
          <ol className="stagger mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {metodo.etapas.map((e) => (
              <li key={e.n} className="relative overflow-hidden rounded-2xl border border-linha bg-branco p-7">
                <span aria-hidden className="pointer-events-none absolute right-5 top-4 font-display text-[5.5rem] leading-none text-ouro/10">
                  {e.n}
                </span>
                <p className="t-eyebrow text-ouro-profundo">Etapa {e.n}</p>
                <h3 className="mt-4 font-display text-3xl uppercase text-grafite">{e.titulo}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-grafite/85">{e.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <Button nativo variant="consultoria" href={CTA_METODO}>
              Quero começar pelo diagnóstico
            </Button>
          </div>
        </Section>

        {/* ============ PLANOS ============ */}
        <Section id="planos" tone="branco">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Planos</Eyebrow>
            </div>
            <h2 className="t-title mt-7 text-balance">Escolha o seu ponto de partida.</h2>
            <p className="t-sub mt-7 text-pretty text-grafite/85">Todos com 7 dias de garantia.</p>
          </div>
          <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
            {PLANOS.map((p) => {
              const destaque = Boolean(p.selo);
              return (
                <article
                  key={p.id}
                  className={`relative flex flex-col rounded-2xl border p-7 sm:p-8 ${
                    destaque
                      ? "border-verde/60 bg-porcelana shadow-[0_24px_60px_-28px_color-mix(in_srgb,var(--color-verde)_45%,transparent)] lg:-my-5 lg:py-12"
                      : "border-linha bg-porcelana"
                  }`}
                >
                  {p.selo && (
                    <span className="absolute -top-3 left-7 rounded-full bg-verde px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#06140b]">
                      {p.selo}
                    </span>
                  )}
                  <h3 className="font-display text-3xl uppercase text-grafite">{p.nome}</h3>
                  <p className="mt-2 text-sm text-grafite/70">{p.para}</p>
                  <div className="mt-7 flex items-baseline gap-3">
                    {p.ancora && <span className="text-lg text-grafite/45 line-through">{p.ancora}</span>}
                    <span className={`font-display ${p.preco.length > 8 ? "text-4xl" : "text-5xl"} ${destaque ? "text-verde" : "text-ouro"}`}>
                      {p.preco}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-grafite/60">{p.nota}</p>
                  <ul className="mt-7 flex-1 space-y-3 border-t border-linha pt-7">
                    {p.itens.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.95rem] text-grafite/90">
                        <span aria-hidden className={`mt-2 size-1.5 shrink-0 rounded-full ${destaque ? "bg-verde" : "bg-ouro"}`} />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <BotaoPlano cta={p.cta} />
                  </div>
                </article>
              );
            })}
          </div>

          {/* Comparativo */}
          <p className="mt-20 text-right text-xs text-grafite/55 lg:hidden">Deslize para comparar →</p>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-linha lg:mt-20">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <caption className="sr-only">Comparativo entre os planos</caption>
              <thead>
                <tr className="bg-porcelana">
                  <th scope="col" className="p-4 font-normal text-grafite/60 sm:p-5">Compare</th>
                  {PLANOS.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className={`p-4 font-display text-xl font-normal uppercase sm:p-5 ${p.selo ? "text-verde" : "text-grafite"}`}
                    >
                      {p.nome}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIVO.map((l) => (
                  <tr key={l.linha} className="border-t border-linha">
                    <th scope="row" className="p-4 font-normal text-grafite/80 sm:p-5">{l.linha}</th>
                    {l.valores.map((v, i) => (
                      <td key={i} className={`p-4 sm:p-5 ${PLANOS[i].selo ? "bg-verde/5" : ""}`}>
                        <Celula valor={v} destaque={Boolean(PLANOS[i].selo)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Garantia */}
          <div className="mt-14 grid items-center gap-6 rounded-2xl border border-linha-ouro bg-porcelana p-7 sm:grid-cols-[auto_1fr] sm:p-9">
            <span aria-hidden className="flex size-20 items-center justify-center rounded-full border border-linha-ouro font-display text-4xl text-ouro">
              7
            </span>
            <div>
              <h3 className="font-display text-3xl uppercase text-grafite">7 dias de garantia</h3>
              <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-grafite/80">
                Entre, veja o seu plano e comece. Se nos primeiros 7 dias não fizer sentido para você,
                devolvemos o valor integral, sem questionário.
              </p>
            </div>
          </div>

          <CtaDuvida />
        </Section>

        {/* ============ RESULTADOS ============ */}
        <Section id="depoimentos" tone="porcelana">
          <div className="max-w-2xl">
            <Eyebrow>Resultados</Eyebrow>
            <h2 className="t-title mt-7 text-balance">Gente real, ponto de partida real.</h2>
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

        {/* ============ AUTORIDADE ============ */}
        <Section tone="branco">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Eyebrow>Quem monta o seu plano</Eyebrow>
              <h2 className="t-title mt-7 whitespace-pre-line text-balance">{sobre.titulo}</h2>
              <blockquote className="mt-8 border-l border-linha-ouro pl-6 font-display text-2xl italic leading-snug text-grafite/85">
                {sobre.citacao}
              </blockquote>
            </div>
            <div className="space-y-6">
              {sobre.paragrafos.map((p) => (
                <p key={p.slice(0, 24)} className="text-pretty leading-[1.75] text-grafite/90">
                  {p}
                </p>
              ))}
              <ul className="grid gap-3 pt-2 sm:grid-cols-2">
                {["Dois mestrados em Ciência de Alimentos", "Doutorado em Alimentos em andamento", "Atleta de classic bodybuilding", "Atendimento 100% individual"].map((t) => (
                  <li key={t} className="flex items-center gap-3 rounded-xl border border-linha bg-porcelana px-4 py-3 text-sm text-grafite">
                    <span aria-hidden className="text-ouro">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ============ FAQ ============ */}
        <Section id="duvidas" tone="porcelana">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow>{duvidas.eyebrow}</Eyebrow>
              <h2 className="t-title mt-7 text-balance">Antes de você decidir.</h2>
            </div>
            <FAQ itens={DUVIDAS_VENDA} />
          </div>
        </Section>

        {/* ============ FECHO ============ */}
        <section className="relative overflow-hidden bg-branco py-24 sm:py-32">
          <div aria-hidden className="diagonals pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_70%)]" />
          <Container className="relative text-center">
            <h2 className="t-title mx-auto max-w-3xl text-balance">
              Daqui a 8 semanas, <span className="text-verde">você agradece.</span>
            </h2>
            <p className="t-sub mx-auto mt-7 max-w-xl text-pretty text-grafite/85">
              Responda o questionário em cinco minutos. Eu leio tudo e monto o seu plano.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button nativo variant="consultoria" href={CTA_METODO}>
                Quero o Método CS
              </Button>
              <a href="#planos" className={buttonClass("outline")}>
                Comparar planos <span aria-hidden>↑</span>
              </a>
            </div>
            <p className="mt-6 text-xs text-grafite/60">7 dias de garantia · vagas limitadas por mês</p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
