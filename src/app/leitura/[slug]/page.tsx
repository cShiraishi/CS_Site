import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Leitor } from "@/components/Leitor";
import { Arrow, Container, Eyebrow } from "@/components/ui";
import { listarLeituras, lerLeitura } from "@/lib/leituras";
import { marca, rotas } from "@/lib/content";
import { jsonLdLeitura } from "@/lib/jsonld";

type Props = { params: Promise<{ slug: string }> };

/** Uma página estática por livro preparado. */
export async function generateStaticParams() {
  const slugs = await listarLeituras();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const livro = await lerLeitura(slug);
  if (!livro) return { title: "Leitura não encontrada" };

  const descricao = livro.subtitulo
    ? `${livro.subtitulo}. Leia online, ${livro.total} páginas, sem download obrigatório.`
    : `Leia ${livro.titulo} online — ${livro.total} páginas, direto no navegador.`;

  return {
    title: `${livro.titulo} — leitura online`,
    description: descricao,
    alternates: { canonical: `/leitura/${livro.slug}` },
    openGraph: {
      type: "article",
      url: `${marca.site}/leitura/${livro.slug}`,
      title: `${livro.titulo} | ${marca.nome}`,
      description: descricao,
      images: [
        {
          url: `/leitura/${livro.slug}/${livro.paginas[0].arquivo}`,
          width: livro.largura,
          height: livro.altura,
          alt: `Capa de ${livro.titulo}`,
        },
      ],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const livro = await lerLeitura(slug);
  if (!livro) notFound();

  return (
    <>
      <Header tone="escuro" />

      <main className="bg-grafite text-porcelana">
        <Container className="pt-32 sm:pt-40">
          <nav aria-label="Você está em" className="pt-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-porcelana/45">
              <li>
                <Link href="/" className="transition-colors hover:text-ouro">
                  Início
                </Link>
              </li>
              <li aria-hidden className="text-porcelana/25">
                /
              </li>
              <li>
                <Link
                  href={rotas.biblioteca}
                  className="transition-colors hover:text-ouro"
                >
                  Biblioteca
                </Link>
              </li>
              <li aria-hidden className="text-porcelana/25">
                /
              </li>
              <li aria-current="page" className="text-porcelana/75">
                {livro.titulo}
              </li>
            </ol>
          </nav>

          <div className="rise flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-10 pt-10">
            <div>
              <Eyebrow tone="claro">
                Leitura online · {livro.total} páginas
              </Eyebrow>
              <h1 className="t-title mt-6 text-balance text-porcelana">
                {livro.titulo}
              </h1>
              {livro.subtitulo && (
                <p className="mt-3 text-porcelana/55">{livro.subtitulo}</p>
              )}
            </div>
          </div>
        </Container>

        {/* O leitor sangra até a borda: a página fica o maior possível */}
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Leitor livro={livro} />
          </div>
        </div>

        <Container className="py-24 sm:py-28">
          <div className="border-t border-porcelana/12 pt-12">
            <h2 className="t-title max-w-xl text-balance text-porcelana">
              Leu até aqui?
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-porcelana/65">
              Se o assunto interessa, o próximo passo é aplicar ao seu caso.
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
                href={rotas.biblioteca}
                className="group inline-flex items-center gap-2.5 rounded-full border border-porcelana/25 px-7 py-4 text-sm text-porcelana/80 transition-all duration-300 hover:border-ouro hover:text-ouro"
              >
                Voltar à biblioteca
                <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLeitura(livro)) }}
      />
    </>
  );
}
