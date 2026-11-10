/**
 * Google Tag Manager + Consent Mode v2 — constantes compartilhadas por
 * servidor e cliente (sem "use client": o <head> precisa do texto).
 *
 * Regra (RGPD/LGPD): nada que use cookie de análise ou de anúncio liga
 * antes do "Aceitar". O GTM carrega sempre, mas com o consentimento
 * NEGADO por padrão; as tags do contêiner (GA4, Pixel…) respeitam o
 * Consent Mode e só gravam cookie depois do `consent update` concedido.
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PFH7F8FD";

export const CHAVE_CONSENTIMENTO = "cs_consentimento";
export type Consentimento = "aceito" | "recusado";

/** Evento local para reabrir o banner (link "Cookies" do rodapé). */
export const EVENTO_REABRIR = "cs:consentimento-reabrir";

/**
 * Roda no <head>, ANTES do GTM: define o padrão negado e, se a pessoa já
 * aceitou numa visita anterior, concede de imediato (sem esperar React).
 */
export const SCRIPT_CONSENTIMENTO = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"granted",security_storage:"granted",wait_for_update:500});try{if(localStorage.getItem("${CHAVE_CONSENTIMENTO}")==="aceito"){gtag("consent","update",{ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted",analytics_storage:"granted"})}}catch(e){}`;

/** Snippet oficial do GTM (carregado depois da hidratação). */
export const SCRIPT_GTM = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
