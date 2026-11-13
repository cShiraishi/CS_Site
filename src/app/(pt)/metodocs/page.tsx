import { PaginaMetodoCS, metadataMetodoCS } from "@/components/paginas/MetodoCS";

/** Página estática, só em português. */
export const dynamic = "force-static";

export const metadata = metadataMetodoCS();

export default function Page() {
  return <PaginaMetodoCS />;
}
