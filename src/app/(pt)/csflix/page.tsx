import { PaginaCSFlix, metadataCSFlix } from "@/components/paginas/PaginaCSFlix";

/** Vídeo novo aparece sozinho, sem deploy. */
export const revalidate = 3600;

export const metadata = metadataCSFlix("pt");

export default function Page() {
  return <PaginaCSFlix idioma="pt" />;
}
