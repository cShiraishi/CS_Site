/**
 * O que estÃ¡ Ã  venda â€” definido no servidor, de propÃ³sito.
 *
 * Suporta exibiÃ§Ã£o adaptativa por geolocalizaÃ§Ã£o/VPN:
 * - Brasil (BRL): R$ 297 (sem preço âncora)
 * - Portugal / Europa (EUR): 19 â‚¬ (ancorado em 67 â‚¬)
 */

export type Moeda = "BRL" | "EUR";

/**
 * O preÃ§o em euro sÃ³ pode aparecer quando houver como cobrÃ¡-lo.
 *
 * O checkout Ã© Mercado Pago Brasil e cobra sempre em reais. Mostrar "19 â‚¬"
 * e cobrar R$ 297 seria anunciar um preÃ§o e praticar outro. Enquanto nÃ£o
 * existir um meio de pagamento em euro, todo mundo vÃª e paga em reais;
 * ligar isto sem esse meio reabre o problema.
 */
export const EUR_ATIVO = false;

export const TABELA_PRECOS: Record<
  Moeda,
  {
    moeda: Moeda;
    precoCentavos: number;
    precoFormatado: string;
    precoAncora: string;
    stack: [string, string, string, string];
    meiosPagamento: string;
    bandeira: string;
    rotuloPais: string;
  }
> = {
  BRL: {
    moeda: "BRL",
    precoCentavos: 29700,
    precoFormatado: "R$ 297",
    precoAncora: "R$ 197",
    stack: ["R$ 147", "R$ 67", "R$ 67", "R$ 297"],
    meiosPagamento: "Pix, cartÃ£o ou boleto",
    bandeira: "ðŸ‡§ðŸ‡·",
    rotuloPais: "Brasil (R$)",
  },
  EUR: {
    moeda: "EUR",
    precoCentavos: 1900,
    precoFormatado: "19 â‚¬",
    precoAncora: "67 â‚¬",
    stack: ["39 â‚¬", "19 â‚¬", "19 â‚¬", "15 â‚¬"],
    meiosPagamento: "CartÃ£o, MB WAY ou Apple/Google Pay",
    bandeira: "ðŸ‡µðŸ‡¹",
    rotuloPais: "Europa (â‚¬)",
  },
};

export const PROGRAMA = {
  slug: "programa-90-dias",
  nome: "Reset MetabÃ³lico 21 Dias",
  descricao:
    "Protocolo cientÃ­fico de treino e dieta para 21 dias, dividido em 3 fases de 7 dias, com prescriÃ§Ã£o individual, plataforma CS Performance e guias prÃ¡ticos em PDF.",
  /** Em centavos. R$ 297,00 (padrÃ£o no checkout Mercado Pago Brasil). */
  precoCentavos: 29700,
  /** Valor de ancoragem em reais para exibiÃ§Ã£o na pÃ¡gina de vendas. */
  precoAncora: "R$ 197",
  moeda: "BRL",
} as const;

const PAISES_EUROPA = new Set([
  "PT", "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT",
  "FI", "GR", "CY", "MT", "SI", "SK", "EE", "LV", "LT", "HR",
  "CH", "GB", "UK", "NO", "SE", "DK", "PL", "CZ", "HU", "RO",
]);

/**
 * Detecta a moeda a partir do cÃ³digo ISO do paÃ­s (vindo do header de IP/VPN
 * da Vercel `x-vercel-ip-country` ou Cloudflare `cf-ipcountry`).
 */
export function moedaPorPais(pais?: string | null): Moeda {
  if (!EUR_ATIVO || !pais) return "BRL";
  const iso = pais.trim().toUpperCase();
  if (iso === "BR") return "BRL";
  if (PAISES_EUROPA.has(iso)) return "EUR";
  return "BRL";
}

/** "R$ 297" ou "19 â‚¬" â€” sem centavos quando sÃ£o zero, que Ã© como o preÃ§o Ã© anunciado. */
export function precoEmReais(
  centavos = PROGRAMA.precoCentavos,
  moeda: Moeda = "BRL",
): string {
  if (moeda === "EUR") {
    const euros = (centavos === PROGRAMA.precoCentavos ? TABELA_PRECOS.EUR.precoCentavos : centavos) / 100;
    const texto = Number.isInteger(euros)
      ? String(euros)
      : euros.toFixed(2).replace(".", ",");
    return `${texto} â‚¬`;
  }
  const reais = centavos / 100;
  const texto = Number.isInteger(reais)
    ? String(reais)
    : reais.toFixed(2).replace(".", ",");
  return `R$ ${texto}`;
}
