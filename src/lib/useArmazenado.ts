"use client";

import { useSyncExternalStore } from "react";

/**
 * Texto guardado no localStorage, lido como store externo.
 *
 * Substitui o par `useEffect` + `setState` na montagem: o servidor e a
 * hidratação veem `null`, e o valor salvo entra logo depois, sem render
 * em cascata. Quem grava usa `gravarArmazenado`, que avisa os leitores
 * desta aba (o evento `storage` nativo só avisa as outras).
 */
const EVENTO = "cs:armazenado";

function assinar(callback: () => void) {
  window.addEventListener(EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO, callback);
    window.removeEventListener("storage", callback);
  };
}

export function lerArmazenado(chave: string): string | null {
  try {
    return window.localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravarArmazenado(chave: string, valor: string) {
  try {
    window.localStorage.setItem(chave, valor);
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

export function useArmazenado(chave: string): string | null {
  return useSyncExternalStore(
    assinar,
    () => lerArmazenado(chave),
    () => null,
  );
}

/** JSON salvo, ou `null` se não houver ou estiver corrompido. */
export function lerJson<T>(bruto: string | null): T | null {
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as T;
  } catch {
    return null;
  }
}
