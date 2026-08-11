/**
 * Gasto energético — cálculo puro, sem interface.
 *
 * Referências das equações:
 *  · Mifflin-St Jeor (1990) — a de menor erro médio em adultos, e a
 *    recomendada pela Academy of Nutrition and Dietetics. Padrão aqui.
 *  · Harris-Benedict revisada por Roza & Shizgal (1984) — histórica,
 *    tende a superestimar em pessoas com sobrepeso.
 *  · Katch-McArdle — usa massa livre de gordura; só faz sentido quando
 *    existe uma medida de %GC confiável, e aí supera as outras duas.
 */

export type Sexo = "masculino" | "feminino";
export type Formula = "mifflin" | "harris" | "katch";

export type Entrada = {
  sexo: Sexo;
  idade: number;
  /** quilogramas */
  peso: number;
  /** centímetros */
  altura: number;
  /** percentual de gordura corporal — obrigatório só na Katch-McArdle */
  gordura?: number;
};

export const FORMULAS = [
  {
    id: "mifflin",
    nome: "Mifflin-St Jeor",
    nota: "Padrão atual. Menor erro médio em adultos.",
  },
  {
    id: "harris",
    nome: "Harris-Benedict",
    nota: "Revisada em 1984. Tende a superestimar com sobrepeso.",
  },
  {
    id: "katch",
    nome: "Katch-McArdle",
    nota: "A mais precisa — exige percentual de gordura medido.",
  },
] as const satisfies ReadonlyArray<{ id: Formula; nome: string; nota: string }>;

export const ATIVIDADES = [
  { id: "sedentario", fator: 1.2, nome: "Sedentário", nota: "Pouco ou nenhum exercício" },
  { id: "leve", fator: 1.375, nome: "Levemente ativo", nota: "1 a 3 treinos por semana" },
  { id: "moderado", fator: 1.55, nome: "Moderadamente ativo", nota: "3 a 5 treinos por semana" },
  { id: "alto", fator: 1.725, nome: "Muito ativo", nota: "6 a 7 treinos por semana" },
  { id: "atleta", fator: 1.9, nome: "Extremamente ativo", nota: "Dois treinos por dia ou trabalho físico" },
] as const;

export type Atividade = (typeof ATIVIDADES)[number]["id"];

/** Taxa metabólica basal, em kcal/dia. */
export function calcularTmb(e: Entrada, formula: Formula): number | null {
  const { sexo, idade, peso, altura, gordura } = e;

  if (!(peso > 0) || !(altura > 0) || !(idade > 0)) return null;

  switch (formula) {
    case "mifflin":
      return 10 * peso + 6.25 * altura - 5 * idade + (sexo === "masculino" ? 5 : -161);

    case "harris":
      return sexo === "masculino"
        ? 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade
        : 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * idade;

    case "katch": {
      if (gordura === undefined || !(gordura > 0) || gordura >= 70) return null;
      const massaMagra = peso * (1 - gordura / 100);
      return 370 + 21.6 * massaMagra;
    }
  }
}

/* ============================================================
   PLANEJAMENTO — do peso atual ao peso alvo
   ============================================================ */

/** ~7700 kcal por quilo de tecido adiposo. */
const KCAL_POR_KG = 7700;

/** Ritmo semanal, como fração do peso corporal. */
const RITMO = {
  /** Perda: 0,5 a 1 % por semana. Acima disso, o custo é massa magra. */
  perda: 0.0075,
  /** Ganho: mais devagar, para limitar o acúmulo de gordura. */
  ganho: 0.0035,
} as const;

/** Teto de segurança: nenhum déficit passa de 25 % do gasto total. */
const DEFICIT_MAXIMO = 0.25;

export type Direcao = "perder" | "ganhar" | "manter";

export type Plano = {
  direcao: Direcao;
  /** quilos a percorrer, sempre positivo */
  diferenca: number;
  /** kcal/dia — o alvo do plano */
  alvo: number;
  /** kcal/dia de diferença em relação ao gasto total (negativo = déficit) */
  ajuste: number;
  ritmoSemanal: number;
  semanas: number;
  /** true quando o ritmo pedido foi limitado pelo teto de segurança */
  limitado: boolean;
};

export function planejar(
  get: number,
  tmb: number,
  pesoAtual: number,
  pesoAlvo: number,
): Plano | null {
  if (!(get > 0) || !(pesoAtual > 0) || !(pesoAlvo > 0)) return null;

  const diferenca = Math.abs(pesoAlvo - pesoAtual);
  const direcao: Direcao =
    diferenca < 0.5 ? "manter" : pesoAlvo < pesoAtual ? "perder" : "ganhar";

  if (direcao === "manter") {
    return {
      direcao,
      diferenca: 0,
      alvo: Math.round(get / 10) * 10,
      ajuste: 0,
      ritmoSemanal: 0,
      semanas: 0,
      limitado: false,
    };
  }

  const perdendo = direcao === "perder";
  let ritmoSemanal = pesoAtual * (perdendo ? RITMO.perda : RITMO.ganho);
  let ajuste = ((ritmoSemanal * KCAL_POR_KG) / 7) * (perdendo ? -1 : 1);

  // Dois limites: o déficit não passa de 25 % do gasto, e o alvo
  // nunca fica abaixo do metabolismo basal.
  let limitado = false;
  if (perdendo) {
    const piso = Math.max(get * (1 - DEFICIT_MAXIMO), tmb);
    if (get + ajuste < piso) {
      ajuste = piso - get;
      ritmoSemanal = (Math.abs(ajuste) * 7) / KCAL_POR_KG;
      limitado = true;
    }
  }

  return {
    direcao,
    diferenca,
    alvo: Math.round((get + ajuste) / 10) * 10,
    ajuste: Math.round(ajuste),
    ritmoSemanal,
    semanas: Math.ceil(diferenca / ritmoSemanal),
    limitado,
  };
}

/* ============================================================
   MACRONUTRIENTES
   ============================================================ */

export type Macros = {
  proteina: { g: number; kcal: number; pct: number };
  gordura: { g: number; kcal: number; pct: number };
  carboidrato: { g: number; kcal: number; pct: number };
  /** true se sobrou pouco ou nada para carboidrato */
  apertado: boolean;
};

/**
 * Proteína e gordura primeiro (são as que têm mínimo fisiológico),
 * carboidrato com o que sobra — é a divisão que a literatura de
 * nutrição esportiva usa.
 */
export function macros(alvoKcal: number, peso: number, direcao: Direcao): Macros {
  // Proteína mais alta no corte: protege massa magra e sacia mais.
  const gProteinaKg = direcao === "perder" ? 2.0 : 1.8;
  const proteinaG = Math.round(peso * gProteinaKg);

  // Gordura: 25 % das calorias, com piso de 0,6 g/kg (função hormonal).
  const gorduraG = Math.round(
    Math.max((alvoKcal * 0.25) / 9, peso * 0.6),
  );

  const kcalProteina = proteinaG * 4;
  const kcalGordura = gorduraG * 9;
  const restante = alvoKcal - kcalProteina - kcalGordura;
  const carboidratoG = Math.max(0, Math.round(restante / 4));
  const kcalCarbo = carboidratoG * 4;

  const total = kcalProteina + kcalGordura + kcalCarbo || 1;
  const pct = (n: number) => Math.round((n / total) * 100);

  return {
    proteina: { g: proteinaG, kcal: kcalProteina, pct: pct(kcalProteina) },
    gordura: { g: gorduraG, kcal: kcalGordura, pct: pct(kcalGordura) },
    carboidrato: { g: carboidratoG, kcal: kcalCarbo, pct: pct(kcalCarbo) },
    apertado: restante < alvoKcal * 0.15,
  };
}

/* ============================================================
   DISTRIBUIÇÃO POR REFEIÇÃO
   ============================================================ */

export type Refeicao = {
  nome: string;
  kcal: number;
  proteina: number;
  gordura: number;
  carboidrato: number;
};

const NOMES: Record<number, string[]> = {
  2: ["Almoço", "Jantar"],
  3: ["Café da manhã", "Almoço", "Jantar"],
  4: ["Café da manhã", "Almoço", "Lanche", "Jantar"],
  5: ["Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar"],
  6: ["Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar", "Ceia"],
};

/**
 * Divisão uniforme. Proteína distribuída por igual de propósito:
 * o estímulo de síntese proteica responde à dose por refeição,
 * não ao total jogado de uma vez.
 *
 * A última refeição absorve o arredondamento, para a soma bater
 * exatamente com o alvo.
 */
export function distribuir(
  alvoKcal: number,
  m: Macros,
  quantidade: number,
): Refeicao[] {
  const nomes = NOMES[quantidade] ?? NOMES[3];
  const n = nomes.length;

  const parte = (total: number, i: number) =>
    i === n - 1 ? total - Math.round(total / n) * (n - 1) : Math.round(total / n);

  return nomes.map((nome, i) => ({
    nome,
    kcal: parte(alvoKcal, i),
    proteina: parte(m.proteina.g, i),
    gordura: parte(m.gordura.g, i),
    carboidrato: parte(m.carboidrato.g, i),
  }));
}

export type Resultado = {
  tmb: number;
  /** gasto energético total = TMB × fator de atividade */
  get: number;
  alvos: { chave: string; rotulo: string; nota: string; kcal: number }[];
  proteina: { min: number; max: number };
  /** true quando o corte proposto cai abaixo do metabolismo basal */
  abaixoDoBasal: boolean;
};

/** Arredonda para a dezena mais próxima — precisão falsa não ajuda ninguém. */
const dezena = (n: number) => Math.round(n / 10) * 10;

export function calcular(
  entrada: Entrada,
  formula: Formula,
  atividade: Atividade,
): Resultado | null {
  const tmb = calcularTmb(entrada, formula);
  if (tmb === null) return null;

  const fator = ATIVIDADES.find((a) => a.id === atividade)?.fator ?? 1.2;
  const get = tmb * fator;

  const alvos = [
    {
      chave: "deficit",
      rotulo: "Emagrecimento",
      nota: "Déficit de 20%",
      kcal: dezena(get * 0.8),
    },
    {
      chave: "manutencao",
      rotulo: "Manutenção",
      nota: "Peso estável",
      kcal: dezena(get),
    },
    {
      chave: "superavit",
      rotulo: "Ganho de massa",
      nota: "Superávit de 10%",
      kcal: dezena(get * 1.1),
    },
  ];

  // 1,6 a 2,2 g/kg — faixa com respaldo para quem treina força (ISSN).
  const proteina = {
    min: Math.round(entrada.peso * 1.6),
    max: Math.round(entrada.peso * 2.2),
  };

  return {
    tmb: Math.round(tmb),
    get: Math.round(get),
    alvos,
    proteina,
    abaixoDoBasal: get * 0.8 < tmb,
  };
}
