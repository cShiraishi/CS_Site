import { PaginaBiblioteca, metadataBiblioteca } from "@/components/paginas/Biblioteca";

export const metadata = metadataBiblioteca("pt");

export default function Page() {
  return <PaginaBiblioteca idioma="pt" />;
}
