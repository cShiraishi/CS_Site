import { PaginaCalculadoraPrato, metadataCalculadoraPrato } from "@/components/paginas/CalculadoraPrato";

export const metadata = metadataCalculadoraPrato("pt");

export default function Page() {
  return <PaginaCalculadoraPrato idioma="pt" />;
}
