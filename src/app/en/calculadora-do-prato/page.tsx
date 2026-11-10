import { PaginaCalculadoraPrato, metadataCalculadoraPrato } from "@/components/paginas/CalculadoraPrato";

export const metadata = metadataCalculadoraPrato("en");

export default function Page() {
  return <PaginaCalculadoraPrato idioma="en" />;
}
