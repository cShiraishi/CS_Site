import type { Metadata } from "next";
import { PaginaLeitura, metadataLeitura, paramsLeitura } from "@/components/paginas/Leitura";

type Props = { params: Promise<{ slug: string }> };

/** Uma página estática por livro preparado. */
export async function generateStaticParams() {
  return paramsLeitura();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return metadataLeitura("pt", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PaginaLeitura idioma="pt" slug={slug} />;
}
