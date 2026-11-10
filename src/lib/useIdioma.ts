"use client";

import { usePathname } from "next/navigation";
import { detectarIdiomaPorCaminho, type Idioma } from "./i18n";

const CHAVE_STORAGE = "cs_idioma";
const EVENTO_IDIOMA = "cs:idioma-mudou";

/**
 * Guarda a última escolha do seletor. Hoje o idioma vem sempre do
 * endereço (/es, /en ou raiz em português); a preferência fica gravada
 * para um futuro redirecionamento da primeira visita.
 */
export function gravarPreferenciaIdioma(idioma: Idioma) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_STORAGE, idioma);
  } catch {}
  window.dispatchEvent(new Event(EVENTO_IDIOMA));
}

/** Idioma da página: o forçado pela rota, ou o do prefixo do caminho. */
export function useIdioma(idiomaForcado?: Idioma): Idioma {
  const pathname = usePathname();
  return idiomaForcado ?? detectarIdiomaPorCaminho(pathname);
}
