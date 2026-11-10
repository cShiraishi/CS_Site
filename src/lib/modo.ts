/**
 * Modo Ele / Modo Ela — constantes compartilhadas por servidor e cliente.
 * Sem "use client": o layout (Server Component) precisa do texto do
 * script, não de uma referência de cliente.
 */
export type Modo = "ele" | "ela";

export const CHAVE_MODO = "cs_modo";

/** Páginas do canal feminino forçam o Modo Ela, venha de onde vier. */
export function caminhoForcaEla(caminho: string) {
  return caminho === "/ela" || caminho.startsWith("/ela/");
}

/**
 * Roda no <head>, antes de qualquer pintura. ES5 e dentro de try/catch:
 * localStorage pode lançar em janela privada.
 */
export const SCRIPT_MODO = `(function(){try{var m=localStorage.getItem("${CHAVE_MODO}");var p=location.pathname;if(p==="/ela"||p.indexOf("/ela/")===0)m="ela";if(m==="ela")document.documentElement.setAttribute("data-modo","ela")}catch(e){}})()`;
