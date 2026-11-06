/**
 * Atribuição de campanha — da landing para o formulário de consultoria.
 *
 * Quem chega pelo anúncio traz na URL de onde veio. Se o link do
 * formulário for fixo, essa informação morre no caminho e todo lead passa
 * a parecer tráfego direto no CRM — o que inviabiliza saber qual criativo
 * paga a conta.
 *
 * A regra aqui é simples: **repassar o que a visita trouxe, nunca
 * inventar**. Os parâmetros de clique (`fbclid` e companhia) são do
 * visitante e só existem se ele veio mesmo de lá; cravá-los no código
 * atribuiria todo lead a um clique que não aconteceu.
 */

/** Onde o middleware guarda a atribuição da primeira visita. */
export const COOKIE_ATRIBUICAO = "cs_atrib";

/** O que se repassa tal como chegou. */
export const ATRIBUICAO = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
  "ttclid",
  "msclkid",
  "ref",
] as const;

/**
 * Usado só quando a visita não trouxe origem nenhuma (link na bio, digitado).
 *
 * O `medium` é parâmetro porque o site tem mais de uma porta para o mesmo
 * formulário — calculadora de BF, rota curta /consultoria, botão do topo.
 * Cravar "calculadora-bf" para todas faria o CRM atribuir à calculadora um
 * lead que nunca a abriu.
 */
const padraoDe = (medium: string) =>
  ({
    utm_source: "site",
    utm_medium: medium,
    utm_campaign: "organico",
  }) as const;

export type ContextoDoLead = {
  /** percentual estimado hoje */
  bf?: number;
  /** percentual escolhido como alvo */
  meta?: number;
  sexo?: string;
  /** kcal/dia do plano */
  kcal?: number;
  /** qual botão levou a pessoa até aqui */
  cta?: string;
  /** de que porta do site o clique saiu — vira `utm_medium` quando a visita
   *  não trouxe origem própria */
  medium?: string;
};

/**
 * @param entrada  query string da página atual (com ou sem "?")
 * @param contexto o que a pessoa calculou, para o lead não chegar vazio
 */
export function linkDoFormulario(
  base: string,
  entrada: string,
  contexto: ContextoDoLead = {},
): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return base;
  }

  const veio = new URLSearchParams(entrada);

  /*
   * Os padrões entram primeiro e o que a visita trouxe sobrescreve, chave a
   * chave. A ordem importa: um anúncio do Instagram sem UTM manual chega
   * como `?fbclid=…` e nada mais. Tratando "veio alguma coisa" como "veio
   * origem", o bloco de padrões seria pulado e o lead chegaria ao CRM sem
   * `utm_source` — exatamente o "parece tráfego direto" que este arquivo
   * existe para evitar.
   */
  const padrao = padraoDe(contexto.medium ?? "site");
  for (const [chave, valor] of Object.entries(padrao)) {
    url.searchParams.set(chave, valor);
  }

  for (const chave of ATRIBUICAO) {
    const valor = veio.get(chave);
    if (valor) url.searchParams.set(chave, valor);
  }

  // Prefixo próprio: não colide com nenhum parâmetro do LeadConnector nem
  // com os padrões de anúncio, e chega ao CRM junto do lead.
  const nosso: Record<string, unknown> = {
    cs_bf: contexto.bf,
    cs_meta: contexto.meta,
    cs_sexo: contexto.sexo,
    cs_kcal: contexto.kcal,
    cs_cta: contexto.cta,
  };

  for (const [chave, valor] of Object.entries(nosso)) {
    if (valor === undefined || valor === null || valor === "") continue;
    url.searchParams.set(chave, String(valor));
  }

  return url.toString();
}

/**
 * Href da rota curta, levando o que a página já calculou.
 *
 * As ferramentas do site não montam mais o link do CRM por conta própria:
 * passam por `/consultoria`, que é onde o cookie de atribuição existe. Uma
 * calculadora só vê a query da sua própria página — e quem chegou pelo
 * anúncio na home e navegou até ela traz essa query vazia.
 */
export function hrefConsultoria(
  de: string,
  contexto: Pick<ContextoDoLead, "bf" | "meta" | "sexo" | "kcal"> = {},
  busca = "",
): string {
  const q = new URLSearchParams(busca);
  q.set("de", de);

  for (const [chave, valor] of Object.entries(contexto)) {
    if (valor === undefined || valor === null || valor === "") continue;
    q.set(chave, String(valor));
  }

  return `/consultoria?${q.toString()}`;
}
