"use client";

import { useSyncExternalStore } from "react";
import { EUR_ATIVO, TABELA_PRECOS, moedaPorPais, type Moeda } from "./produto";

const STORAGE_KEY = "cs_moeda_preferida";
const EVENTO_MOEDA = "cs:moeda-mudou";

/**
 * Detecta no navegador se o visitante está na Europa/Portugal (fuso Europe/*
 * ou query `?pais=PT` / `?moeda=EUR`) ou no Brasil (`BRL`), respeitando a
 * detecção de IP/VPN vinda do servidor (`moedaServidor`).
 */
export function detectarMoedaCliente(moedaServidor?: Moeda | null): Moeda {
  if (!EUR_ATIVO) return "BRL";
  if (typeof window === "undefined") return moedaServidor ?? "BRL";

  try {
    const params = new URLSearchParams(window.location.search);
    const qMoeda = params.get("moeda")?.toUpperCase();
    if (qMoeda === "EUR" || qMoeda === "BRL") {
      window.localStorage.setItem(STORAGE_KEY, qMoeda);
      return qMoeda;
    }

    const qPais = params.get("pais")?.toUpperCase();
    if (qPais) {
      const m = moedaPorPais(qPais);
      window.localStorage.setItem(STORAGE_KEY, m);
      return m;
    }

    const salva = window.localStorage.getItem(STORAGE_KEY);
    if (salva === "EUR" || salva === "BRL") {
      return salva;
    }
  } catch {}

  if (moedaServidor) return moedaServidor;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (
      tz.startsWith("Europe/") ||
      tz === "Atlantic/Azores" ||
      tz === "Atlantic/Madeira"
    ) {
      return "EUR";
    }
  } catch {}

  return "BRL";
}

export function alterarMoedaPreferida(nova: Moeda) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, nova);
    /* `?moeda=` e `?pais=` mandam na detecção; se ficassem na URL, o
       botão de trocar moeda não faria nada para quem chegou por esse link. */
    const url = new URL(window.location.href);
    if (url.searchParams.has("moeda") || url.searchParams.has("pais")) {
      url.searchParams.delete("moeda");
      url.searchParams.delete("pais");
      window.history.replaceState(window.history.state, "", url);
    }
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENTO_MOEDA, { detail: nova }));
}

function assinar(callback: () => void) {
  window.addEventListener(EVENTO_MOEDA, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO_MOEDA, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useMoeda(moedaServidor?: Moeda | null) {
  /* Store externo em vez de efeito + setState: o servidor e a hidratação
     usam a moeda do IP; a preferência salva e o fuso entram logo depois. */
  const moeda = useSyncExternalStore<Moeda>(
    assinar,
    () => detectarMoedaCliente(moedaServidor),
    () => (EUR_ATIVO ? moedaServidor ?? "BRL" : "BRL"),
  );

  return {
    moeda,
    info: TABELA_PRECOS[moeda],
    alternarMoeda: (nova: Moeda) => alterarMoedaPreferida(nova),
  };
}
