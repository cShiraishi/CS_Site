import { PaginaPostura, metadataPostura } from "@/components/paginas/Postura";

export const metadata = metadataPostura("en");

export default function Page() {
  return <PaginaPostura idioma="en" />;
}
