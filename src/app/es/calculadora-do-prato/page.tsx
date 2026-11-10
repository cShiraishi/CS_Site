import { PaginaCalculadoraPrato, metadataCalculadoraPrato } from "@/components/paginas/CalculadoraPrato";

export const metadata = metadataCalculadoraPrato("es");

export default function Page() {
  return <PaginaCalculadoraPrato idioma="es" />;
}
