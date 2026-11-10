import {
  PaginaCalculadoraCalorias,
  metadataCalculadoraCalorias,
} from "@/components/paginas/CalculadoraCalorias";

export const metadata = metadataCalculadoraCalorias("en");

export default function Page() {
  return <PaginaCalculadoraCalorias idioma="en" />;
}
