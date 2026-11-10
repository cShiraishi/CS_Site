import {
  PaginaCalculadoraCalorias,
  metadataCalculadoraCalorias,
} from "@/components/paginas/CalculadoraCalorias";

export const metadata = metadataCalculadoraCalorias("pt");

export default function Page() {
  return <PaginaCalculadoraCalorias idioma="pt" />;
}
