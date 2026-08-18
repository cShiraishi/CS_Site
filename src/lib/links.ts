/**
 * Link na bio — o que o Linktree fazia, agora dentro do site.
 *
 * Para mudar a página, edite só esta lista: a ordem aqui é a ordem na tela.
 * Um link novo entra com um objeto; um link morto sai apagando a linha.
 */
import { marca } from "./content";

/** Miniatura à esquerda do cartão — as mesmas do Linktree. */
export type IconeDoLink = "marca" | "youtube" | "zumub";

export type LinkDaBio = {
  /** Título tal como aparece no cartão. */
  titulo: string;
  href: string;
  icone: IconeDoLink;
};

/**
 * Atribuição: quem chega pela bio precisa aparecer como bio no CRM, não como
 * tráfego direto. `lib/campanha.ts` repassa o que a *visita* trouxe; aqui a
 * origem é conhecida de antemão — é sempre o link do perfil.
 */
function comOrigem(base: string, conteudo: string): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return base;
  }
  url.searchParams.set("utm_source", "bio");
  url.searchParams.set("utm_medium", "link-na-bio");
  url.searchParams.set("utm_campaign", "organico");
  url.searchParams.set("utm_content", conteudo);
  return url.toString();
}

/** Loja parceira — o cupom é o motivo do link existir. */
export const zumub = {
  loja: "https://www.zumub.com/PT",
  cupom: "CS15",
} as const;

export const linksDaBio: LinkDaBio[] = [
  {
    titulo: "CONSULTORIA ONLINE | CLICA AQUI!!",
    href: comOrigem(marca.formulario, "consultoria"),
    icone: "marca",
  },
  {
    titulo: "Website",
    href: "/",
    icone: "marca",
  },
  {
    titulo: "Canal do Youtube",
    href: marca.youtube,
    icone: "youtube",
  },
  {
    titulo: `Zumub | 🏷️ Cupom ${zumub.cupom}`,
    href: comOrigem(zumub.loja, "zumub"),
    icone: "zumub",
  },
];

/** Botão de baixo — onde o Linktree punha a chamada dele, aqui vai a nossa. */
export const chamadaFinal = {
  titulo: "Falar comigo no WhatsApp",
  href: marca.whatsapp,
} as const;
