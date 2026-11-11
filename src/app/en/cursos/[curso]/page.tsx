import { PaginaCurso, cursosComPagina, metadataCurso } from "@/components/paginas/Cursos";

type Props = { params: Promise<{ curso: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cursosComPagina().map((c) => ({ curso: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { curso } = await params;
  return metadataCurso("en", curso);
}

export default async function Page({ params }: Props) {
  const { curso } = await params;
  return <PaginaCurso idioma="en" slug={curso} />;
}
