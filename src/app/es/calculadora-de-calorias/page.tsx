import {
  PaginaCalculadoraCalorias,
  metadataCalculadoraCalorias,
} from "@/components/paginas/CalculadoraCalorias";

export const metadata = metadataCalculadoraCalorias("es");

export default function Page() {
  return <PaginaCalculadoraCalorias idioma="es" />;
}
