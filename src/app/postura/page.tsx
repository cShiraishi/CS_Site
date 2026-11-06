import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PosturaCotidiano } from "@/components/PosturaCotidiano";
import { Button, Container, Eyebrow, buttonClass } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { AVISO, SINAIS_DE_ALERTA } from "@/lib/postura";
import { exercicio, PRINCIPIO, ROTINA, SITUACOES } from "@/lib/postura-cotidiano";

const titulo = "Postura do dia a dia — o ajuste de cada situação";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Computador, celular, em pé, bolsa, pegar peso e dormir: o que acontece com o corpo em cada situação, como ajustar e os exercícios que compensam.",
  alternates: { canonical: rotas.postura },
  openGraph: {
    type: "article",
    url: `${marca.site}${rotas.postura}`,
    title: `${titulo} | ${marca.nome}`,
    description:
      "Seis situações do cotidiano, o ajuste de cada uma e os exercícios para os desconfortos mais comuns.",
    // Declarar openGraph aqui substitui o do layout, images incluído:
    // sem esta linha o link mandado por DM sai sem imagem.
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: `Postura do dia a dia — ${marca.nome}`,
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden bg-porcelana pb-16 pt-28 sm:pt-32 lg:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 top-0 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(199,160,106,0.16),transparent_65%)]"
          />
          <Container className="relative">
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-grafite/55">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro-profundo">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-grafite/30">/</li>
                <li aria-current="page" className="text-grafite/80">Postura</li>
              </ol>
            </nav>

            <div className="rise pt-10">
              <Eyebrow>Guia visual · gratuito</Eyebrow>
              <h1 className="t-display mt-7">
                Postura
                <br />
                do dia <span className="text-ouro">a dia.</span>
              </h1>
              <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <p className="t-sub max-w-xl text-pretty text-grafite/75">
                  As seis situações em que você passa mais horas parado, o que
                  cada uma faz com o corpo e o ajuste que resolve. Toque em{" "}
                  <strong className="font-semibold text-grafite">Como arrumar</strong>{" "}
                  e veja a postura mudar.
                </p>
                <dl className="grid grid-cols-3 border-y border-linha">
                  {[
                    { n: SITUACOES.length, r: "Situações" },
                    { n: 5, r: "Min de pausa" },
                    { n: new Set(SITUACOES.flatMap((s) => s.exercicios)).size, r: "Exercícios" },
                  ].map((x, i) => (
                    <div key={x.r} className={`py-5 ${i ? "border-l border-linha pl-5" : ""}`}>
                      <dt className="sr-only">{x.r}</dt>
                      <dd>
                        <span className="block font-display text-5xl leading-none text-grafite">
                          {String(x.n).padStart(2, "0")}
                        </span>
                        <span className="mt-2 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-grafite/50">
                          {x.r}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* A tese da página, antes de qualquer ajuste. */}
            <div className="mt-16 rounded-2xl border border-linha-ouro bg-branco p-7 sm:p-10">
              <p className="font-display text-4xl uppercase leading-none text-ouro sm:text-5xl">
                {PRINCIPIO.titulo}
              </p>
              <p className="mt-5 max-w-3xl text-[0.98rem] leading-relaxed text-grafite/75">
                {PRINCIPIO.texto}
              </p>
            </div>
          </Container>
        </section>

        <section className="bg-porcelana pb-10">
          <Container>
            <PosturaCotidiano />
          </Container>
        </section>

        {/* Rotina — faixa clara, o contraste da página. */}
        <section className="bg-grafite py-20 text-porcelana sm:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="t-eyebrow flex items-center gap-3 text-[#8a6438]">
                  <span aria-hidden className="h-px w-8 bg-[#8a6438]" />
                  Para fazer hoje
                </p>
                <h2 className="t-title mt-6">{ROTINA.titulo}</h2>
                <p className="mt-6 max-w-md leading-relaxed text-porcelana/70">
                  {ROTINA.texto}
                </p>
              </div>
              <ol className="divide-y divide-porcelana/15 border-y border-porcelana/15">
                {ROTINA.passos.map((p, i) => {
                  const e = exercicio(p.exercicio);
                  return (
                    <li key={p.exercicio} className="flex items-center gap-5 py-5">
                      <span className="font-display text-4xl leading-none text-porcelana/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xl uppercase leading-tight">{e.nome}</p>
                        <p className="mt-1 text-sm text-porcelana/60">{e.alvo}</p>
                      </div>
                      <span className="rounded-md bg-porcelana px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-grafite">
                        {p.tempo}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Container>
        </section>

        {/* Ponte para o Raio-X e para a consultoria. */}
        <section className="bg-porcelana py-20 sm:py-28">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col justify-between rounded-2xl border border-linha bg-branco p-8 sm:p-10">
                <div>
                  <Eyebrow>Próximo passo</Eyebrow>
                  <h2 className="t-title mt-6">Qual é o seu padrão?</h2>
                  <p className="mt-5 max-w-md leading-relaxed text-grafite/70">
                    Os ajustes daqui servem a todo mundo. Os exercícios de pelve
                    dependem do seu padrão, e alguns são opostos entre si. O
                    teste da parede mostra qual é o seu em cinco minutos.
                  </p>
                </div>
                <div className="mt-8">
                  <Button href={rotas.raioX} variant="outline">Fazer o Raio-X Postural</Button>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-ouro p-8 text-[#0b0a09] sm:p-10">
                <div>
                  <p className="t-eyebrow">Consultoria</p>
                  <h2 className="t-title mt-6">Treino que corrige enquanto evolui.</h2>
                  <p className="mt-5 max-w-md leading-relaxed text-[#0b0a09]/75">
                    Os exercícios de postura entram no treino que você já faz,
                    como acessórios, e não como uma rotina a mais.
                  </p>
                </div>
                <a
                  href={`${rotas.consultoria}?de=postura`}
                  className={`mt-8 w-fit ${buttonClass("consultoria")}`}
                >
                  Começar consultoria ↗
                </a>
              </div>
            </div>

            <details className="mt-10 rounded-xl border border-[#e2563b]/30 p-5 sm:p-6">
              <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.14em] text-[#ff8a70]">
                Quando não é postura: sinais para procurar avaliação
              </summary>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-grafite/75">
                {SINAIS_DE_ALERTA.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span aria-hidden className="text-[#e2563b]">—</span>
                    {x}
                  </li>
                ))}
              </ul>
            </details>

            <p className="mt-8 border-l-2 border-ouro/50 pl-5 text-[0.86rem] leading-relaxed text-grafite/55">
              {AVISO}
            </p>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
