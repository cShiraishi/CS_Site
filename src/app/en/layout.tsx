import { RaizHtml, metadataRaiz, viewportRaiz } from "@/components/RaizHtml";

/* Root layout do idioma "en" — ver RaizHtml para o porquê de três raízes. */
export const metadata = metadataRaiz("en");
export const viewport = viewportRaiz;

export default function LayoutEn({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RaizHtml idioma="en">{children}</RaizHtml>;
}
