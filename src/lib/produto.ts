/**
 * O que está à venda — definido no servidor, de propósito.
 *
 * Suporta exibição adaptativa por geolocalização/VPN:
 * - Brasil (BRL): R$ 47 (ancorado em R$ 197)
 * - Portugal / Europa (EUR): 19 € (ancorado em 67 €)
 */

export type Moeda = "BRL" | "EUR";

/**
 * O preço em euro só pode aparecer quando houver como cobrá-lo.
 *
 * O checkout é Mercado Pago Brasil e cobra sempre em reais. Mostrar "19 €"
 * e cobrar R$ 47 seria anunciar um preço e praticar outro. Enquanto não
 * existir um meio de pagamento em euro, todo mundo vê e paga em reais;
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
    precoCentavos: 4700,
    precoFormatado: "R$ 47",
    precoAncora: "R$ 197",
    stack: ["R$ 147", "R$ 67", "R$ 67", "R$ 47"],
    meiosPagamento: "Pix, cartão ou boleto",
    bandeira: "🇧🇷",
    rotuloPais: "Brasil (R$)",
  },
  EUR: {
    moeda: "EUR",
    precoCentavos: 1900,
    precoFormatado: "19 €",
    precoAncora: "67 €",
    stack: ["39 €", "19 €", "19 €", "15 €"],
    meiosPagamento: "Cartão, MB WAY ou Apple/Google Pay",
    bandeira: "🇵🇹",
    rotuloPais: "Europa (€)",
  },
};

export const PROGRAMA = {
  slug: "programa-90-dias",
  nome: "Reset Metabólico 21 Dias",
  descricao:
    "Protocolo científico de treino e dieta para 21 dias, dividido em 3 fases de 7 dias, com prescrição individual, plataforma CS Performance e guias práticos em PDF.",
  /** Em centavos. R$ 47,00 (padrão no checkout Mercado Pago Brasil). */
  precoCentavos: 4700,
  /** Valor de ancoragem em reais para exibição na página de vendas. */
  precoAncora: "R$ 197",
  moeda: "BRL",
} as const;

const PAISES_EUROPA = new Set([
  "PT", "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT",
  "FI", "GR", "CY", "MT", "SI", "SK", "EE", "LV", "LT", "HR",
  "CH", "GB", "UK", "NO", "SE", "DK", "PL", "CZ", "HU", "RO",
]);

/**
 * Detecta a moeda a partir do código ISO do país (vindo do header de IP/VPN
 * da Vercel `x-vercel-ip-country` ou Cloudflare `cf-ipcountry`).
 */
export function moedaPorPais(pais?: string | null): Moeda {
  if (!EUR_ATIVO || !pais) return "BRL";
  const iso = pais.trim().toUpperCase();
  if (iso === "BR") return "BRL";
  if (PAISES_EUROPA.has(iso)) return "EUR";
  return "BRL";
}

/** "R$ 47" ou "19 €" — sem centavos quando são zero, que é como o preço é anunciado. */
export function precoEmReais(
  centavos = PROGRAMA.precoCentavos,
  moeda: Moeda = "BRL",
): string {
  if (moeda === "EUR") {
    const euros = (centavos === PROGRAMA.precoCentavos ? TABELA_PRECOS.EUR.precoCentavos : centavos) / 100;
    const texto = Number.isInteger(euros)
      ? String(euros)
      : euros.toFixed(2).replace(".", ",");
    return `${texto} €`;
  }
  const reais = centavos / 100;
  const texto = Number.isInteger(reais)
    ? String(reais)
    : reais.toFixed(2).replace(".", ",");
  return `R$ ${texto}`;
}
