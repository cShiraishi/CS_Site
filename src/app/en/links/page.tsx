import { PaginaLinks, metadataLinks } from "@/components/paginas/Links";

/** Página estática: nada aqui depende de requisição. */
export const dynamic = "force-static";

export const metadata = metadataLinks("en");

export default function Page() {
  return <PaginaLinks idioma="en" />;
}
