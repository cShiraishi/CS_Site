"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { detectarIdiomaPorCaminho, type Idioma } from "./i18n";

const CHAVE_STORAGE = "cs_idioma";
const EVENTO_IDIOMA = "cs:idioma-mudou";

function assinar(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENTO_IDIOMA, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO_IDIOMA, callback);
    window.removeEventListener("storage", callback);
  };
}

function lerPreferencia(): Idioma {
  if (typeof window === "undefined") return "pt";
  try {
    const salvo = window.localStorage.getItem(CHAVE_STORAGE);
    if (salvo === "es" || salvo === "en" || salvo === "pt") {
      return salvo;
    }
  } catch {}
  return "pt";
}

export function gravarPreferenciaIdioma(idioma: Idioma) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_STORAGE, idioma);
    document.documentElement.lang = idioma === "pt" ? "pt-BR" : idioma;
  } catch {}
  window.dispatchEvent(new Event(EVENTO_IDIOMA));
}

export function useIdioma(idiomaForcado?: Idioma): Idioma {
  const pathname = usePathname();
  const salvo = useSyncExternalStore(assinar, lerPreferencia, () => "pt" as Idioma);

  if (idiomaForcado) return idiomaForcado;
  const doCaminho = detectarIdiomaPorCaminho(pathname);
  if (doCaminho) return doCaminho;
  return salvo;
}
