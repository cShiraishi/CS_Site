import { PaginaCursos, metadataCursos } from "@/components/paginas/Cursos";

export const metadata = metadataCursos("pt");

export default function Page() {
  return <PaginaCursos idioma="pt" />;
}
