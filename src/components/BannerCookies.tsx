"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CHAVE_CONSENTIMENTO, EVENTO_REABRIR, type Consentimento } from "@/lib/consentimento";
import { useIdioma } from "@/lib/useIdioma";
import { gravarArmazenado, useArmazenado } from "@/lib/useArmazenado";
import type { Idioma } from "@/lib/i18n";

/**
 * Banner de cookies, discreto, acima do dock. Aparece só enquanto não há
 * escolha salva; "Aceitar" e "Recusar" têm o mesmo peso (RGPD: recusar
 * tem de ser tão fácil quanto aceitar). A escolha vai para o Consent Mode
 * do Google na hora, e o link "Cookies" do rodapé reabre o banner.
 */

const TEXTOS: Record<Idioma, { texto: string; aceitar: string; recusar: string; rotulo: string }> = {
  pt: {
    texto: "Usamos cookies de análise e de anúncios só se você aceitar, para medir visitas e melhorar o site.",
    aceitar: "Aceitar",
    recusar: "Recusar",
    rotulo: "Preferências de cookies",
  },
  es: {
    texto: "Usamos cookies de análisis y de anuncios solo si aceptas, para medir visitas y mejorar el sitio.",
    aceitar: "Aceptar",
    recusar: "Rechazar",
    rotulo: "Preferencias de cookies",
  },
  en: {
    texto: "We use analytics and advertising cookies only if you accept, to measure visits and improve the site.",
    aceitar: "Accept",
    recusar: "Decline",
    rotulo: "Cookie preferences",
  },
};

type Gtag = (...args: unknown[]) => void;

const nada = () => () => {};

function aplicar(escolha: Consentimento) {
  const valor = escolha === "aceito" ? "granted" : "denied";
  const w = window as unknown as { gtag?: Gtag; dataLayer?: unknown[] };
  w.gtag?.("consent", "update", {
    ad_storage: valor,
    ad_user_data: valor,
    ad_personalization: valor,
    analytics_storage: valor,
  });
  w.dataLayer?.push({ event: "cs_consentimento", consentimento: escolha });
}

export function BannerCookies({ idioma: idiomaForcado }: { idioma?: Idioma }) {
  const idioma = useIdioma(idiomaForcado);
  const t = TEXTOS[idioma];
  const salvo = useArmazenado(CHAVE_CONSENTIMENTO);
  const [reaberto, setReaberto] = useState(false);

  useEffect(() => {
    const reabrir = () => setReaberto(true);
    window.addEventListener(EVENTO_REABRIR, reabrir);
    return () => window.removeEventListener(EVENTO_REABRIR, reabrir);
  }, []);

  // No servidor e na hidratação não se sabe a escolha: o banner só entra
  // no cliente, para não piscar para quem já escolheu.
  const noCliente = useSyncExternalStore(nada, () => true, () => false);
  const semEscolha = salvo !== "aceito" && salvo !== "recusado";
  const visivel = noCliente && (reaberto || semEscolha);

  if (!visivel) return null;

  function escolher(escolha: Consentimento) {
    gravarArmazenado(CHAVE_CONSENTIMENTO, escolha);
    aplicar(escolha);
    setReaberto(false);
  }

  return (
    <div
      role="region"
      aria-label={t.rotulo}
      className="fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-md rounded-2xl border border-white/12 bg-[#0b0a09]/95 p-4 text-[#f2ede5] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:bottom-28"
    >
      <p className="text-sm leading-relaxed text-[#f2ede5]/85">{t.texto}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => escolher("recusado")}
          className="h-10 rounded-full border border-white/25 text-sm font-semibold text-[#f2ede5] transition-colors hover:border-destaque hover:text-destaque"
        >
          {t.recusar}
        </button>
        <button
          type="button"
          onClick={() => escolher("aceito")}
          className="h-10 rounded-full bg-destaque text-sm font-semibold text-[#0b0a09] transition-opacity hover:opacity-90"
        >
          {t.aceitar}
        </button>
      </div>
    </div>
  );
}
