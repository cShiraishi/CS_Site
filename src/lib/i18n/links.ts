import { marca } from "@/lib/content";
import { chamadaFinal, linksDaBio, zumub, type LinkDaBio } from "@/lib/links";
import { rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * Link na bio nos três idiomas. A lista (ordem, hrefs, ícones) continua em
 * `lib/links.ts`; aqui ficam só os textos de ES/EN. PT usa o título original.
 */

const TITULOS: Record<"es" | "en", Record<LinkDaBio["id"], string>> = {
  es: {
    consultoria: "ASESORÍA ONLINE | ¡HAZ CLIC AQUÍ!",
    site: "Sitio web",
    youtube: "Canal de YouTube",
    zumub: `Zumub | 🏷️ Cupón ${zumub.cupom}`,
  },
  en: {
    consultoria: "ONLINE COACHING | CLICK HERE!",
    site: "Website",
    youtube: "YouTube channel",
    zumub: `Zumub | 🏷️ Coupon ${zumub.cupom}`,
  },
};

export const TEXTOS_LINKS: Record<
  Idioma,
  { titulo: string; descricao: string; monograma: string; chamadaFinal: string }
> = {
  pt: {
    titulo: "Links",
    descricao:
      "Todos os links do @carlosseiti num só lugar: consultoria online, site, canal do YouTube e o cupom da Zumub.",
    monograma: `Monograma ${marca.monograma}`,
    chamadaFinal: chamadaFinal.titulo,
  },
  es: {
    titulo: "Links",
    descricao:
      "Todos los links de @carlosseiti en un solo lugar: asesoría online, sitio web, canal de YouTube y el cupón de Zumub.",
    monograma: `Monograma ${marca.monograma}`,
    chamadaFinal: "Háblame por WhatsApp",
  },
  en: {
    titulo: "Links",
    descricao:
      "All of @carlosseiti's links in one place: online coaching, website, YouTube channel, and the Zumub coupon.",
    monograma: `${marca.monograma} monogram`,
    chamadaFinal: "Message me on WhatsApp",
  },
};

/** A lista da bio com títulos e links internos no idioma pedido. */
export function linksDaBioNoIdioma(idioma: Idioma): LinkDaBio[] {
  if (idioma === "pt") return linksDaBio;
  return linksDaBio.map((l) => ({
    ...l,
    titulo: TITULOS[idioma][l.id],
    href: rotaIdioma(idioma, l.href),
  }));
}
