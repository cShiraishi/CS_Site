import Script from "next/script";

/**
 * Analytics sem cookies (Plausible ou Umami) — não exige banner de consentimento
 * e não coleta dado pessoal. Só é renderizado se a variável existir;
 * sem configuração, nenhum script vai para a página.
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
