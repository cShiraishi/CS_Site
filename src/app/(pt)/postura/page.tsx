import { PaginaPostura, metadataPostura } from "@/components/paginas/Postura";

export const metadata = metadataPostura("pt");

export default function Page() {
  return <PaginaPostura idioma="pt" />;
}
