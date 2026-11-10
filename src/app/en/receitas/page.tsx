import { PaginaReceitas, metadataReceitas } from "@/components/paginas/Receitas";

export const metadata = metadataReceitas("en");

export default function Page() {
  return <PaginaReceitas idioma="en" />;
}
