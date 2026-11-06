/**
 * As porções, calculadas da mesma tabela que a Calculadora do Prato usa.
 *
 * Nenhum valor nutricional é escrito à mão aqui. Todos saem de
 * `src/lib/alimentos.ts`, que já tem TACO/TBCA como base e os ajustes de
 * prato de restaurante declarados. A razão é simples: se o PDF tivesse a
 * sua própria tabela, bastaria uma correção num dos lados para o produto
 * passar a dizer duas coisas diferentes sobre o mesmo prato de arroz — e
 * quem nota isso é exatamente o cliente que lê tudo.
 *
 * A medida de referência também vem de lá (`unidade` + `gramas`), porque
 * ninguém pesa comida. A pessoa conta conchas, palmas e colheres.
 */

import { POR_ID, type Alimento } from "../../src/lib/alimentos";

export type Porcao = {
  nome: string;
  /** "1 concha", "1 palma da mão" */
  medida: string;
  gramas: number;
  kcal: number;
  p: number;
  c: number;
  g: number;
};

function alimento(id: string): Alimento {
  const encontrado = POR_ID.get(id);
  /*
   * Falha em vez de inventar. Um id que deixou de existir na tabela
   * entraria no PDF como uma linha vazia — e um PDF com uma linha vazia
   * é enviado ao cliente sem ninguém perceber.
   */
  if (!encontrado) throw new Error(`alimento "${id}" não existe em alimentos.ts`);
  return encontrado;
}

/** Uma porção = uma medida de referência do alimento. */
export function porcao(id: string, quantidade = 1): Porcao {
  const a = alimento(id);
  const gramas = a.gramas * quantidade;
  const fator = gramas / 100;

  const unidade =
    quantidade === 1 ? a.unidade : `${plural(a.unidade)}`;
  const numero = quantidade === 1 ? "1" : String(quantidade).replace(".", ",");

  return {
    nome: a.nome,
    medida: `${numero} ${unidade}`,
    gramas: Math.round(gramas),
    kcal: Math.round(a.kcal * fator),
    p: Math.round(a.p * fator),
    c: Math.round(a.c * fator),
    g: Math.round(a.g * fator),
  };
}

/**
 * Plural das medidas de casa.
 *
 * Só a primeira palavra flexiona: "duas colheres de servir", não "duas
 * colheres de servires". As irregulares estão listadas; o resto leva "s".
 */
const IRREGULARES: Record<string, string> = {
  colher: "colheres",
  pegador: "pegadores",
};

function plural(unidade: string): string {
  const [primeira, ...resto] = unidade.split(" ");
  const flexionada =
    IRREGULARES[primeira] ??
    (primeira.endsWith("s") ? primeira : `${primeira}s`);
  return [flexionada, ...resto].join(" ");
}

/** Linhas de uma tabela de porções, na ordem dada. */
export function tabela(ids: string[]): Porcao[] {
  return ids.map((id) => porcao(id));
}

/**
 * Quantas porções deste alimento para fechar uma meta de proteína.
 *
 * Arredondado ao meio, porque meia palma de frango é uma instrução que se
 * cumpre e 1,37 palmas não é.
 */
export function porcoesPara(id: string, gramasDeProteina: number): number {
  const a = alimento(id);
  const porMedida = (a.p * a.gramas) / 100;
  if (porMedida <= 0) return 0;
  return Math.round((gramasDeProteina / porMedida) * 2) / 2;
}
