import { redirect } from "next/navigation";

/*
 * A área de membros do Reset 21D agora é o app (projeto reset-metabolico-21d),
 * servido em /resetmetabolico/* pelo rewrite do next.config. Esta rota fica só
 * para os links antigos (e-mails, "minha conta", ?demo=1).
 */
export default async function Area({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;
  redirect(demo ? "/resetmetabolico/demo" : "/resetmetabolico/programa");
}
