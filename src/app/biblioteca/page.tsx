import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Arrow, Container, Eyebrow } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { jsonLdBiblioteca } from "@/lib/jsonld";
import { bibliotecaOrdenada } from "@/lib/leituras";

const titulo = "Biblioteca — os livros que eu escrevi";

export const metadata: Metadata = {
  title: titulo,
  description:
    "Guias de nutrição, treino, postura e método escritos por Carlos Seiti. Leia online, sem download e sem cadastro.",
  alternates: { canonical: rotas.biblioteca },
  openGraph: {
    type: "article",
    url: `${marca.site}${rotas.biblioteca}`,
    title: `${titulo} | ${marca.nome}`,
    description:
      "Nutrição, treino, postura e método — para ler direto no navegador.",
  },
};

export default async function Page() {
  const livros = await bibliotecaOrdenada();
  const destaque = livros[0];
  const paginas = livros.reduce((soma, l) => soma + l.total, 0);

  return (
    <>
      <Header tone="escuro" />

      <main className="bg-grafite text-porcelana">
        {/* ── Destaque ──────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div
            aria-hidden
            className="diagonals pointer-events-none absolute -right-32 -top-20 h-[30rem] w-[30rem] opacity-[0.12] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_70%)]"
          />

          <Container className="relative">
            <nav aria-label="Você está em" className="pt-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-porcelana/50">
                <li>
                  <Link href="/" className="transition-colors hover:text-ouro">
                    Início
                  </Link>
                </li>
                <li aria-hidden className="text-porcelana/30">
                  /
                </li>
                <li aria-current="page" className="text-porcelana/80">
                  Biblioteca
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pb-24">
              <div className="rise">
                <Eyebrow tone="claro">
                  Biblioteca · {livros.length} livros · {paginas} páginas
                </Eyebrow>

                <h1 className="t-display mt-8 text-balance text-porcelana">
                  Escrevi para
                  <br />
                  você ler agora.
                </h1>

                <p className="t-sub mt-8 max-w-xl text-pretty text-porcelana/70">
                  Guias de nutrição, treino, postura e método — com referência
                  onde há evidência e o aviso onde não há. Abrem no navegador,
                  sem download e sem cadastro.
                </p>

                {destaque && (
                  <div className="mt-10 border-l border-ouro/40 pl-6">
                    <p className="t-eyebrow text-ouro">Comece por este</p>
                    <p className="mt-3 font-display text-2xl text-porcelana">
                      {destaque.titulo}
                    </p>
                    {destaque.subtitulo && (
                      <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-porcelana/65">
                        {destaque.subtitulo}
                      </p>
                    )}
                    <Link
                      href={`/leitura/${destaque.slug}`}
                      className="group mt-5 inline-flex items-center gap-2.5 rounded-full bg-ouro px-6 py-3 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-porcelana"
                    >
                      Ler as {destaque.total} páginas
                      <Arrow />
                    </Link>
                  </div>
                )}
              </div>

              {/* Capa do destaque */}
              {destaque && (
                <div className="rise mx-auto w-48 sm:w-60 lg:w-full lg:max-w-[19rem]">
                  <Link
                    href={`/leitura/${destaque.slug}`}
                    className="group block overflow-hidden rounded-sm shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] ring-1 ring-porcelana/12 transition-transform duration-500 hover:-translate-y-2"
                  >
                    <Image
                      src={`/leitura/${destaque.slug}/${destaque.paginas[0].arquivo}`}
                      alt={`Capa de ${destaque.titulo}`}
                      width={destaque.largura}
                      height={destaque.altura}
                      priority
                      sizes="(max-width: 1024px) 60vw, 300px"
                      className="h-auto w-full"
                    />
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* ── Todos os livros ───────────────────────────────── */}
        <Container className="pb-24 sm:pb-28">
          <div className="border-t border-porcelana/12 pt-12">
            <h2 className="t-eyebrow text-porcelana/50">Todos os títulos</h2>

            <ul className="stagger mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {livros.map((l) => (
                <li key={l.slug}>
                  <Link href={`/leitura/${l.slug}`} className="group block">
                    {/* Ao passar o rato, a capa abre e mostra o miolo —
                        o mesmo gesto do leitor, em miniatura. */}
                    <span className="capa-3d relative block">
                      <span
                        className="relative block overflow-hidden rounded-sm ring-1 ring-porcelana/12"
                        style={{ aspectRatio: `${l.proporcao}` }}
                      >
                        {l.paginas[1] && (
                          <Image
                            src={`/leitura/${l.slug}/${l.paginas[1].arquivo}`}
                            alt=""
                            width={l.largura}
                            height={l.altura}
                            sizes="(max-width: 640px) 90vw, 340px"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        )}

                        <span className="capa-folha absolute inset-0 origin-left overflow-hidden rounded-sm">
                          <Image
                            src={`/leitura/${l.slug}/${l.paginas[0].arquivo}`}
                            alt={`Capa de ${l.titulo}`}
                            width={l.largura}
                            height={l.altura}
                            sizes="(max-width: 640px) 90vw, 340px"
                            className="h-full w-full object-cover"
                          />
                          <span
                            aria-hidden
                            className="capa-vinco pointer-events-none absolute inset-y-0 left-0 w-1/4"
                          />
                        </span>
                      </span>
                    </span>

                    <span className="mt-5 block font-display text-xl text-porcelana transition-colors group-hover:text-ouro">
                      {l.titulo}
                    </span>
                    {l.subtitulo && (
                      <span className="mt-1.5 block text-sm leading-snug text-porcelana/55">
                        {l.subtitulo}
                      </span>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ouro">
                      Ler as {l.total} páginas
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>

        {/* ── Ponte ─────────────────────────────────────────── */}
        <Container className="pb-28">
          <div className="border-t border-porcelana/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-porcelana">
              Ler ajuda. Aplicar ao seu corpo é outra conversa.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-porcelana/65">
              Nenhum destes livros foi escrito para você em específico. É esse o
              vão que a consultoria preenche.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#contato"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ouro px-8 py-4 text-sm font-medium tracking-wide text-grafite transition-all duration-300 hover:bg-porcelana"
              >
                Solicitar avaliação
                <Arrow />
              </Link>
              <Link
                href={rotas.calculadora}
                className="group inline-flex items-center gap-2.5 rounded-full border border-porcelana/25 px-7 py-4 text-sm text-porcelana/80 transition-all duration-300 hover:border-ouro hover:text-ouro"
              >
                Calcular minhas calorias
                <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBiblioteca(livros)),
        }}
      />
    </>
  );
}
