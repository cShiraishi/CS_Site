/**
 * Do prato montado aos macros — cálculo puro, sem interface.
 *
 * A decisão central deste arquivo é devolver **faixa, não número**. Quem
 * estima porção a olho erra, e a magnitude do erro é conhecida: está em
 * `incerteza`, por categoria e por alimento. Devolver "612 kcal" seria
 * fingir uma precisão que o método não tem.
 */

import {
  type Alimento,
  CATEGORIAS,
  POR_ID,
} from "./alimentos";

export type ItemPrato = {
  id: string;
  /** múltiplo da referência visual do alimento (0,5 · 1 · 1,5 · 2 · 3) */
  quantidade: number;
};

export type Faixa = { min: number; max: number; medio: number };

export type ItemCalculado = {
  alimento: Alimento;
  quantidade: number;
  gramas: number;
  kcal: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  alcool: number;
  /** desvio absoluto em kcal, para saber quem domina a incerteza */
  desvio: number;
};

export type Troca = {
  de: Alimento;
  para: Alimento;
  /** kcal poupadas na mesma quantidade de comida */
  economia: number;
};

export type Prato = {
  itens: ItemCalculado[];
  gramas: number;
  kcal: Faixa;
  proteina: Faixa;
  carboidrato: Faixa;
  gordura: Faixa;
  alcool: Faixa;
  /** os que mais pesam na conta, do maior para o menor */
  maiores: ItemCalculado[];
  trocas: Troca[];
};

/** Incerteza efetiva: a do alimento quando existe, senão a da categoria. */
function incertezaDe(a: Alimento): number {
  if (a.incerteza !== undefined) return a.incerteza;
  return CATEGORIAS.find((c) => c.id === a.categoria)?.incerteza ?? 0.25;
}

/**
 * Erros independentes não se somam — parcialmente se cancelam. Somar os
 * desvios direto daria uma faixa larga demais num prato de seis itens
 * (implicaria que a pessoa errou tudo para o mesmo lado). A soma em
 * quadratura é a forma correta de propagar, e devolve uma banda honesta.
 */
function faixa(valores: number[], desvios: number[], casas = 0): Faixa {
  const medio = valores.reduce((s, v) => s + v, 0);
  const sigma = Math.sqrt(desvios.reduce((s, d) => s + d * d, 0));
  const passo = 10 ** -casas;
  const arredonda = (n: number) => Math.max(0, Math.round(n / passo) * passo);

  return {
    min: arredonda(medio - sigma),
    max: arredonda(medio + sigma),
    medio: arredonda(medio),
  };
}

export function montarPrato(escolhas: ItemPrato[]): Prato {
  const itens: ItemCalculado[] = [];

  for (const escolha of escolhas) {
    const alimento = POR_ID.get(escolha.id);
    if (!alimento || !(escolha.quantidade > 0)) continue;

    const gramas = alimento.gramas * escolha.quantidade;
    const fator = gramas / 100;
    const kcal = alimento.kcal * fator;

    itens.push({
      alimento,
      quantidade: escolha.quantidade,
      gramas,
      kcal,
      proteina: alimento.p * fator,
      carboidrato: alimento.c * fator,
      gordura: alimento.g * fator,
      alcool: (alimento.a ?? 0) * fator,
      desvio: kcal * incertezaDe(alimento),
    });
  }

  const inc = (i: ItemCalculado) => incertezaDe(i.alimento);

  return {
    itens,
    gramas: Math.round(itens.reduce((s, i) => s + i.gramas, 0)),
    // kcal na dezena: o dígito das unidades é ruído numa estimativa visual
    kcal: faixa(itens.map((i) => i.kcal), itens.map((i) => i.desvio), -1),
    proteina: faixa(itens.map((i) => i.proteina), itens.map((i) => i.proteina * inc(i))),
    carboidrato: faixa(itens.map((i) => i.carboidrato), itens.map((i) => i.carboidrato * inc(i))),
    gordura: faixa(itens.map((i) => i.gordura), itens.map((i) => i.gordura * inc(i))),
    alcool: faixa(itens.map((i) => i.alcool), itens.map((i) => i.alcool * inc(i))),
    maiores: [...itens].sort((a, b) => b.kcal - a.kcal).slice(0, 3),
    trocas: sugerirTrocas(itens),
  };
}

/**
 * Trocas comparadas **na mesma quantidade de comida**, não na mesma
 * porção-referência: substituir batata frita por legumes no vapor só é
 * uma troca justa se o prato continuar igualmente cheio.
 *
 * O piso de 40 kcal existe para não sugerir troca que não muda nada —
 * conselho irrelevante corrói a confiança no que vem junto.
 */
function sugerirTrocas(itens: ItemCalculado[]): Troca[] {
  const trocas: Troca[] = [];

  for (const item of itens) {
    const alvo = item.alimento.trocaPor;
    if (!alvo) continue;

    const para = POR_ID.get(alvo);
    if (!para) continue;

    const economia = ((item.alimento.kcal - para.kcal) / 100) * item.gramas;
    if (economia < 40) continue;

    trocas.push({ de: item.alimento, para, economia: Math.round(economia / 5) * 5 });
  }

  return trocas.sort((a, b) => b.economia - a.economia).slice(0, 3);
}

/* ============================================================
   COMPARAÇÃO COM A META DO DIA
   ============================================================ */

export type Leitura = {
  /** fração da meta diária que esta refeição ocupa, no valor médio */
  fracao: number;
  pctMin: number;
  pctMax: number;
  /** o que sobra para o resto do dia, no valor médio */
  restante: number;
  tom: "folgado" | "dentro" | "apertado" | "estourou";
  frase: string;
};

/**
 * Uma refeição principal costuma valer entre 30 % e 40 % do dia. As faixas
 * abaixo partem daí — e o texto evita julgamento moral sobre a comida,
 * que é justamente o que faz as pessoas abandonarem o processo.
 */
export function lerContraMeta(kcal: Faixa, metaDiaria: number): Leitura | null {
  if (!(metaDiaria > 0) || kcal.medio <= 0) return null;

  const fracao = kcal.medio / metaDiaria;
  const restante = Math.round((metaDiaria - kcal.medio) / 10) * 10;
  const pct = (n: number) => Math.round((n / metaDiaria) * 100);

  const tom: Leitura["tom"] =
    fracao > 1 ? "estourou" : fracao > 0.55 ? "apertado" : fracao > 0.3 ? "dentro" : "folgado";

  const frase = {
    folgado:
      "Cabe com folga. Sobra espaço para as outras refeições do dia sem ajuste nenhum.",
    dentro:
      "É o peso normal de uma refeição principal. O dia fecha sem precisar compensar nada.",
    apertado:
      "Passa do que uma refeição costuma ocupar. Dá para fechar o dia, mas as outras refeições ficam enxutas — vale escolher proteína e vegetal nelas.",
    estourou:
      "Sozinha, esta refeição já ultrapassa a meta do dia. Isso acontece e não apaga o processo: o que conta é a média da semana, não o pior dia dela.",
  }[tom];

  return { fracao, pctMin: pct(kcal.min), pctMax: pct(kcal.max), restante, tom, frase };
}
