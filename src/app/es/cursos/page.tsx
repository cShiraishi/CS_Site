import { PaginaCursos, metadataCursos } from "@/components/paginas/Cursos";

export const metadata = metadataCursos("es");

export default function Page() {
  return <PaginaCursos idioma="es" />;
}
