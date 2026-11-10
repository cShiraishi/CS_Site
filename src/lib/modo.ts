/**
 * Modo Ele / Modo Ela — constantes compartilhadas por servidor e cliente.
 * Sem "use client": o layout (Server Component) precisa do texto do
 * script, não de uma referência de cliente.
 */
export type Modo = "ele" | "ela";

export const CHAVE_MODO = "cs_modo";

/** Páginas do canal feminino forçam o Modo Ela, venha de onde vier. */
export function caminhoForcaEla(caminho: string) {
  return /^(\/(es|en))?\/ela(\/|$)/.test(caminho);
}

/**
 * Roda no <head>, antes de qualquer pintura. ES5 e dentro de try/catch:
 * localStorage pode lançar em janela privada.
 */
export const SCRIPT_MODO = `(function(){try{var m=localStorage.getItem("${CHAVE_MODO}");var p=location.pathname;if(/^(\\/(es|en))?\\/ela(\\/|$)/.test(p))m="ela";if(m==="ela")document.documentElement.setAttribute("data-modo","ela");else if(m===null)document.documentElement.setAttribute("data-modo-novo","1")}catch(e){}})()`;

/** Endereço do Canal Ela (hub, ou um app com slug) no idioma pedido. */
export function rotaEla(idioma: "pt" | "es" | "en", slug?: string) {
  const base = idioma === "pt" ? "/ela" : `/${idioma}/ela`;
  return slug ? `${base}/${slug}` : base;
}
