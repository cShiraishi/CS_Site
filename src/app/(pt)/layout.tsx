import { RaizHtml, metadataRaiz, viewportRaiz } from "@/components/RaizHtml";

/* Root layout do idioma "pt" — ver RaizHtml para o porquê de três raízes. */
export const metadata = metadataRaiz("pt");
export const viewport = viewportRaiz;

export default function LayoutPt({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RaizHtml idioma="pt">{children}</RaizHtml>;
}
