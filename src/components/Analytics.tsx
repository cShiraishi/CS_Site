import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * Analytics sem cookies — não exige banner de consentimento e não coleta
 * dado pessoal.
 *
 * Vercel Web Analytics vai sempre (é o que mede Reel → página → clique
 * desde já; os `utm_*` da visita aparecem no painel do projeto). Plausible
 * ou Umami entram só se a variável existir:
 *
 * Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN=carlosseiti.com
 * Umami:     NEXT_PUBLIC_UMAMI_ID + NEXT_PUBLIC_UMAMI_SRC
 */
export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  const umamiSrc =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";

  return (
    <>
      <VercelAnalytics />
      {plausible && (
        <Script
          defer
          strategy="afterInteractive"
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
        />
      )}
      {umamiId && (
        <Script
          defer
          strategy="afterInteractive"
          data-website-id={umamiId}
          src={umamiSrc}
        />
      )}
    </>
  );
}
