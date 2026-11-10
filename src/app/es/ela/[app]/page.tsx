import { PaginaAppEla, metadataAppEla, paramsAppsEla } from "@/components/PaginaEla";

type Props = { params: Promise<{ app: string }> };

export const dynamicParams = false;
export const generateStaticParams = paramsAppsEla;

export async function generateMetadata({ params }: Props) {
  const { app } = await params;
  return metadataAppEla("es", app);
}

export default async function Page({ params }: Props) {
  const { app } = await params;
  return <PaginaAppEla idioma="es" slug={app} />;
}
