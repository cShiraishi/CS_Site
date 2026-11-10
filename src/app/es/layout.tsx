import { RaizHtml, metadataRaiz, viewportRaiz } from "@/components/RaizHtml";

/* Root layout do idioma "es" — ver RaizHtml para o porquê de três raízes. */
export const metadata = metadataRaiz("es");
export const viewport = viewportRaiz;

export default function LayoutEs({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RaizHtml idioma="es">{children}</RaizHtml>;
}
