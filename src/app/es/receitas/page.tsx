import { PaginaReceitas, metadataReceitas } from "@/components/paginas/Receitas";

export const metadata = metadataReceitas("es");

export default function Page() {
  return <PaginaReceitas idioma="es" />;
}
