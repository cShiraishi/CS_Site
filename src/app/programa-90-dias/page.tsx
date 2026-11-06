import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Programa } from "@/components/Programa";
import { Container, Eyebrow, Section } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { listarFigurasDeShape } from "@/lib/programa-figuras";

const titulo = "Programa 90 Dias — o plano de treino e dieta para o corpo que você quer";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Escolha a silhueta que você tem hoje e a que você quer ter. Em sete passos, receba as calorias, os macros, as refeições e a semana de treino dos seus 90 dias — com o prazo real, calculado.",
  alternates: { canonical: rotas.programa },
  openGraph: {
    type: "website",
    url: `${marca.site}${rotas.programa}`,
    title: `Programa 90 Dias | ${marca.nome}`,
    description:
      "Onde você está, onde quer chegar, e os 90 dias entre as duas coisas — calculados, não prometidos.",
    /*
     * A imagem precisa ser repetida aqui: o metadata do Next mescla campo
     * a campo, e declarar `openGraph` na página substitui o objeto inteiro
     * do layout, `images` incluído. Sem esta linha o link sai como card
     * cinza no WhatsApp e no story — justamente por onde este tráfego vem.
     */
    images: [
      {
        url: "/brand/cs-mark.jpg",
        width: 1024,
        height: 1024,
        alt: `Programa 90 Dias — ${marca.nome}`,
      },
    ],
  },
};

/**
 * A apresentação e o texto de apoio são entregues AO funil, em vez de
 * ficarem à volta dele.
 *
 * Quem manda neles é o estado do funil: ambos só aparecem no primeiro
 * passo. Enquanto moravam na página, cada passo começava com o mesmo
 * título, os mesmos dois parágrafos e a mesma secção "Por que 90 dias"
 * por baixo — no telemóvel, a pessoa rolava tudo isso sete vezes para
 * chegar à pergunta seguinte.
 */
function Abertura() {
  return (
    <section className="relative overflow-hidden bg-porcelana pb-8 pt-24 sm:pb-12 sm:pt-32">
      <div
        aria-hidden
        className="diagonals pointer-events-none absolute -right-24 top-10 size-[30rem] opacity-40 [mask-image:radial-gradient(circle,black,transparent_68%)]"
      />
      <Container className="relative">
        <nav aria-label="Você está em" className="pt-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/80">
            <li>
              <Link href="/" className="transition-colors hover:text-ouro-profundo">
                Início
              </Link>
            </li>
            <li aria-hidden>·</li>
            <li aria-current="page" className="text-grafite">
              Programa 90 Dias
            </li>
          </ol>
        </nav>

        <div className="mt-8 max-w-3xl sm:mt-10">
          <Eyebrow>Programa de transformação · 90 dias</Eyebrow>
          <h1 className="t-display mt-5 text-balance sm:mt-6">
            Mostre onde você está. Escolha onde quer chegar.
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-grafite sm:mt-7 sm:text-lg">
            Sete toques, nenhum cadastro. No fim você recebe as calorias, os macros, as
            refeições e a semana de treino dos seus 90 dias — divididos em três blocos, com a
            data de cada aferição.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-grafite/80 sm:mt-5 sm:text-base">
            E se a meta que você pedir não couber em 90 dias, a tela diz isso, com o número.
            É a parte que ninguém mostra.
          </p>
        </div>
      </Container>
    </section>
  );
}

/*
 * Por que 90 dias.
 *
 * Está na página, e não só no código, porque é o argumento que sustenta o
 * preço e a reputação ao mesmo tempo: recusar o número fácil é o que
 * diferencia isto dos infoprodutos de 21 dias. Quem chega por busca lê
 * isto antes de decidir — e quem já está a responder não precisa de o ter
 * debaixo dos olhos.
 */
function PorQue() {
  return (
    <Section tone="porcelana">
      <div className="max-w-3xl">
        <Eyebrow>A pergunta que vem antes</Eyebrow>
        <h2 className="t-title mt-6 text-balance">Por que 90 dias, e não 21.</h2>

        <div className="mt-8 space-y-6 leading-relaxed text-grafite sm:mt-9 sm:space-y-7">
          <p>
            O número 21 vem de uma observação do cirurgião plástico Maxwell Maltz, nos anos
            60, sobre quanto tempo os pacientes levavam para se acostumar ao rosto novo.
            Nunca foi um estudo sobre hábito. Quando mediram de verdade, a mediana para um
            comportamento virar automático foi de{" "}
            <strong className="font-medium">66 dias</strong>, variando de 18 a 254 de pessoa
            para pessoa.
          </p>
          <p>
            Trinta dias não mentem, mas não entregam corpo: no primeiro mês a balança se move
            muito por glicogênio e água, e a composição corporal quase não muda. É por isso
            que a foto do dia 30 decepciona quem esperava a do dia 90.
          </p>
          <p>
            Noventa dias cobrem as doze semanas que a literatura de intervenção usa como
            padrão, comportam de 5 a 10 % do peso corporal no ritmo seguro — a mesma faixa
            com benefício metabólico documentado — e passam dos 66 dias do hábito. É o prazo
            mais curto em que a promessa é, ao mesmo tempo, grande e verdadeira.
          </p>
        </div>

        <p className="mt-9 text-sm text-grafite/80 sm:mt-10">
          Quer só os números antes de decidir? Use a{" "}
          <Link
            href={rotas.gordura}
            className="underline decoration-ouro underline-offset-4 transition-colors hover:text-ouro-profundo"
          >
            calculadora de gordura corporal
          </Link>{" "}
          ou a{" "}
          <Link
            href={rotas.calculadora}
            className="underline decoration-ouro underline-offset-4 transition-colors hover:text-ouro-profundo"
          >
            calculadora de calorias
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

export default async function Page() {
  const figuras = await listarFigurasDeShape();

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
      <Header />

      <main>
        <Programa
          figuras={figuras}
          abertura={<Abertura />}
          rodape={<PorQue />}
          vendaAberta={vendaAberta}
        />
      </main>

      <Footer />
    </>
  );
}
