/**
 * O que está à venda — definido no servidor, de propósito.
 *
 * O preço vive aqui e em mais lugar nenhum. Em particular, não vive no
 * navegador: a página pode exibi-lo, mas quem o informa ao provedor de
 * pagamento é o servidor, lendo deste arquivo. Um checkout que aceita o
 * valor enviado pelo cliente aceita, por construção, o valor que o
 * cliente quiser enviar.
 */

export const PROGRAMA = {
  slug: "programa-90-dias",
  nome: "Programa 90 Dias",
  descricao:
    "Plano de treino e dieta para 90 dias, dividido em três blocos, com os protocolos em PDF.",
  /** Em centavos. R$ 47,00. */
  precoCentavos: 4700,
  moeda: "BRL",
} as const;

/** "R$ 47" — sem centavos quando são zero, que é como o preço é anunciado. */
export function precoEmReais(centavos = PROGRAMA.precoCentavos): string {
  const reais = centavos / 100;
  const texto = Number.isInteger(reais)
    ? String(reais)
    : reais.toFixed(2).replace(".", ",");
  return `R$ ${texto}`;
}
