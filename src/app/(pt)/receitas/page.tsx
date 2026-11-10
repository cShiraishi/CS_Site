import { PaginaReceitas, metadataReceitas } from "@/components/paginas/Receitas";

export const metadata = metadataReceitas("pt");

export default function Page() {
  return <PaginaReceitas idioma="pt" />;
}
