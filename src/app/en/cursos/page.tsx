import { PaginaCursos, metadataCursos } from "@/components/paginas/Cursos";

export const metadata = metadataCursos("en");

export default function Page() {
  return <PaginaCursos idioma="en" />;
}
