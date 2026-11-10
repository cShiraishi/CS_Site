import { PaginaBiblioteca, metadataBiblioteca } from "@/components/paginas/Biblioteca";

export const metadata = metadataBiblioteca("es");

export default function Page() {
  return <PaginaBiblioteca idioma="es" />;
}
