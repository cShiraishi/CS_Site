import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container, Eyebrow } from "@/components/ui";
import { rotas } from "@/lib/content";
import { PROGRAMA } from "@/lib/produto";
import { criarSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Pagamento | Reset Metabólico 21 Dias",
  /* Página de passagem, e com o estado de uma compra: não entra em busca. */
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Retorno do checkout.
 *
 * Esta página não dá acesso a nada — ela conta o que aconteceu. A
 * diferença importa: o Mercado Pago devolve a pessoa com `status` na
 * query, e essa query é texto que qualquer um pode escrever na barra de
 * endereço. Quem decide se o pedido está pago é o webhook, que escreveu
 * na base de dados; o que fazemos aqui é LER o que ele escreveu.
 *
 * Por isso a consulta usa a referência (um uuid opaco que só quem passou
 * pelo checkout tem) e devolve apenas o estado — nunca o e-mail, o valor
 * ou o plano de quem comprou.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ler = (chave: string) => {
    const bruto = params[chave];
    return Array.isArray(bruto) ? bruto[0] : bruto;
  };

  const referencia = ler("external_reference");
  let estado: string | null = null;

  if (referencia) {
    const supabase = criarSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from("pedidos")
        .select("status")
        .eq("referencia", referencia)
        .maybeSingle();
      estado = data?.status ?? null;
    }
  }

  /*
   * O Pix leva segundos e o cartão pode levar minutos; o webhook pode
   * ainda não ter chegado quando a pessoa volta. "Pendente" aqui não quer
   * dizer que falhou — quer dizer que ainda não confirmámos, que é a
   * verdade e é o que se deve escrever.
   */
  const pago = estado === "pago";
  const recusado = estado === "recusado" || ler("estado") === "falhou";

  return (
    <>
      <Header />

      <main>
        <section className="bg-porcelana pb-24 pt-32 sm:pb-32 sm:pt-40">
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>{PROGRAMA.nome}</Eyebrow>

              {pago ? (
                <>
                  <h1 className="t-display mt-6 text-balance">
                    Pagamento confirmado. Bem-vindo.
                  </h1>
                  <p className="mt-7 leading-relaxed text-grafite sm:text-lg">
                    Seu programa está liberado. Para abrir, entre com o mesmo e-mail que você
                    usou na compra — a plataforma do Reset 21D abre na hora, e o acesso fica na sua conta.
                  </p>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <Link
                      href={`/entrar?retorno=${rotas.programa}/area`}
                      className="inline-flex min-h-12 items-center rounded-full bg-grafite px-8 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-colors hover:bg-ouro-profundo"
                    >
                      Entrar e abrir meu programa
                    </Link>
                  </div>
                </>
              ) : recusado ? (
                <>
                  <h1 className="t-display mt-6 text-balance">O pagamento não passou.</h1>
                  <p className="mt-7 leading-relaxed text-grafite sm:text-lg">
                    Nada foi cobrado. Acontece com cartão internacional e com limite — o Pix
                    costuma resolver na hora.
                  </p>
                  <div className="mt-9">
                    <Link
                      href={rotas.programa}
                      className="inline-flex min-h-12 items-center rounded-full bg-grafite px-8 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-colors hover:bg-ouro-profundo"
                    >
                      Tentar de novo
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="t-display mt-6 text-balance">
                    Recebemos. Falta a confirmação.
                  </h1>
                  <p className="mt-7 leading-relaxed text-grafite sm:text-lg">
                    O Pix costuma confirmar em segundos; cartão e boleto podem levar mais. Assim
                    que o pagamento for aprovado, a plataforma do Reset 21D abre para você —
                    entre com o mesmo e-mail da compra.
                  </p>
                  <p className="mt-5 leading-relaxed text-grafite/80">
                    Pode fechar esta página sem perder nada. A confirmação não depende dela.
                  </p>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <Link
                      href={`/entrar?retorno=${rotas.programa}/area`}
                      className="inline-flex min-h-12 items-center rounded-full border border-linha px-8 py-3.5 text-sm font-medium tracking-wide text-grafite transition-colors hover:border-ouro hover:text-ouro-profundo"
                    >
                      Entrar na plataforma
                    </Link>
                  </div>
                </>
              )}

              <p className="mt-12 border-t border-linha pt-7 text-sm leading-relaxed text-grafite/80">
                Algum problema com o pagamento? Responda ao e-mail do Mercado Pago ou fale
                comigo pelo{" "}
                <Link
                  href={rotas.consultoria}
                  className="underline decoration-ouro underline-offset-4"
                >
                  contato do site
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
