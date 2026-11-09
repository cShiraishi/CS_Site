"use client";

import { useEffect, useState } from "react";
import { TABELA_PRECOS, moedaPorPais, type Moeda } from "./produto";

const STORAGE_KEY = "cs_moeda_preferida";
const EVENTO_MOEDA = "cs:moeda-mudou";

/**
 * Detecta no navegador se o visitante está na Europa/Portugal (fuso Europe/*
 * ou query `?pais=PT` / `?moeda=EUR`) ou no Brasil (`BRL`), respeitando a
 * detecção de IP/VPN vinda do servidor (`moedaServidor`).
 */
export function detectarMoedaCliente(moedaServidor?: Moeda | null): Moeda {
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
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENTO_MOEDA, { detail: nova }));
}

export function useMoeda(moedaServidor?: Moeda | null) {
  const [moeda, setMoeda] = useState<Moeda>(moedaServidor ?? "BRL");

  useEffect(() => {
    setMoeda(detectarMoedaCliente(moedaServidor));

    const atualizar = () => {
      setMoeda(detectarMoedaCliente(moedaServidor));
    };

    window.addEventListener(EVENTO_MOEDA, atualizar);
    window.addEventListener("storage", atualizar);
    return () => {
      window.removeEventListener(EVENTO_MOEDA, atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, [moedaServidor]);

  return {
    moeda,
    info: TABELA_PRECOS[moeda],
    alternarMoeda: (nova: Moeda) => alterarMoedaPreferida(nova),
  };
}
