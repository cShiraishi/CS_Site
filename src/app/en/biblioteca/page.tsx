import { PaginaBiblioteca, metadataBiblioteca } from "@/components/paginas/Biblioteca";

export const metadata = metadataBiblioteca("en");

export default function Page() {
  return <PaginaBiblioteca idioma="en" />;
}
