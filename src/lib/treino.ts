/**
 * O treino do programa de 90 dias — cálculo puro, sem interface.
 *
 * A sessão é montada por PADRÃO DE MOVIMENTO, não por lista fixa de
 * exercícios. A razão é prática: o mesmo programa precisa rodar para quem
 * tem academia e para quem tem o chão da sala, e trocar supino por flexão
 * só funciona se a estrutura disser "empurrar horizontal" e deixar o
 * equipamento escolher o nome. Lista fixa obriga a manter dois programas,
 * que divergem no primeiro ajuste.
 *
 * Volume e intensidade seguem o consenso de treino de força:
 *  · 10 a 20 séries semanais por grupo muscular (Schoenfeld et al., 2017 —
 *    a resposta é dose-dependente até saturar nessa faixa).
 *  · Frequência de 2x por semana por grupo bate 1x no mesmo volume total
 *    (Schoenfeld, Ogborn e Krieger, 2016). É por isso que não existe aqui
 *    nenhuma divisão que treine um grupo uma vez só por semana.
 *  · Proximidade da falha por RIR (repetições em reserva), que é o que se
 *    consegue autorregular sem teste de 1RM — impossível em casa e
 *    inseguro para quem está voltando.
 */

export type Local = "casa" | "academia";
export type Experiencia = "nunca" | "voltando" | "constante";

export type Padrao =
  | "agachar"
  | "dobradica"
  | "empurrar-h"
  | "empurrar-v"
  | "puxar-h"
  | "puxar-v"
  | "core";

const NOME_PADRAO: Record<Padrao, string> = {
  agachar: "Agachar",
  dobradica: "Dobradiça de quadril",
  "empurrar-h": "Empurrar horizontal",
  "empurrar-v": "Empurrar vertical",
  "puxar-h": "Puxar horizontal",
  "puxar-v": "Puxar vertical",
  core: "Core",
};

/**
 * Para cada padrão, a escolha por local e uma regressão.
 *
 * A regressão não é enfeite: é o que mantém a pessoa no programa na
 * semana em que o exercício principal não sai. Sem ela, a sessão que não
 * dá para cumprir fica registrada como sessão perdida — e duas dessas
 * seguidas é onde o programa morre.
 */
type Vaga = {
  padrao: Padrao;
  academia: string;
  casa: string;
  /** mais fácil, mesma vaga — para a semana ruim ou o primeiro bloco */
  regressaoCasa: string;
};

const VAGAS: Record<Padrao, Vaga> = {
  agachar: {
    padrao: "agachar",
    academia: "Agachamento livre ou no hack",
    casa: "Agachamento búlgaro",
    regressaoCasa: "Agachamento no peso do corpo, até a cadeira",
  },
  dobradica: {
    padrao: "dobradica",
    academia: "Levantamento terra romeno",
    casa: "Elevação de quadril com uma perna",
    regressaoCasa: "Elevação de quadril com as duas pernas",
  },
  "empurrar-h": {
    padrao: "empurrar-h",
    academia: "Supino reto com halteres",
    casa: "Flexão de braço",
    regressaoCasa: "Flexão com as mãos elevadas",
  },
  "empurrar-v": {
    padrao: "empurrar-v",
    academia: "Desenvolvimento sentado",
    casa: "Flexão pique, com o quadril alto",
    regressaoCasa: "Elevação lateral com garrafa de água",
  },
  "puxar-h": {
    padrao: "puxar-h",
    academia: "Remada curvada",
    casa: "Remada invertida sob a mesa",
    regressaoCasa: "Remada com elástico",
  },
  "puxar-v": {
    padrao: "puxar-v",
    academia: "Puxada alta ou barra fixa",
    casa: "Barra fixa com apoio do pé",
    regressaoCasa: "Puxada com elástico preso na porta",
  },
  core: {
    padrao: "core",
    academia: "Prancha com peso",
    casa: "Prancha",
    regressaoCasa: "Prancha com os joelhos no chão",
  },
};

/* ============================================================
   DIVISÃO DA SEMANA
   ============================================================ */

export type Sessao = {
  nome: string;
  /** os padrões desta sessão, na ordem de execução */
  padroes: Padrao[];
};

/**
 * Corpo inteiro até três dias, divisão superior/inferior a partir de
 * quatro.
 *
 * Não é preferência: com dois ou três dias, qualquer divisão deixa algum
 * grupo com frequência semanal 1 — pior que corpo inteiro no mesmo
 * volume. A divisão só passa a valer quando há dias suficientes para cada
 * metade aparecer duas vezes.
 */
const DIVISOES: Record<number, Sessao[]> = {
  2: [
    { nome: "Corpo inteiro A", padroes: ["agachar", "empurrar-h", "puxar-v", "core"] },
    { nome: "Corpo inteiro B", padroes: ["dobradica", "empurrar-v", "puxar-h", "core"] },
  ],
  3: [
    { nome: "Corpo inteiro A", padroes: ["agachar", "empurrar-h", "puxar-v", "core"] },
    { nome: "Corpo inteiro B", padroes: ["dobradica", "empurrar-v", "puxar-h", "core"] },
    { nome: "Corpo inteiro C", padroes: ["agachar", "empurrar-h", "puxar-h", "core"] },
  ],
  4: [
    { nome: "Superior A", padroes: ["empurrar-h", "puxar-v", "empurrar-v", "core"] },
    { nome: "Inferior A", padroes: ["agachar", "dobradica", "core"] },
    { nome: "Superior B", padroes: ["empurrar-v", "puxar-h", "empurrar-h", "core"] },
    { nome: "Inferior B", padroes: ["dobradica", "agachar", "core"] },
  ],
  5: [
    { nome: "Superior A", padroes: ["empurrar-h", "puxar-v", "empurrar-v"] },
    { nome: "Inferior A", padroes: ["agachar", "dobradica", "core"] },
    { nome: "Superior B", padroes: ["empurrar-v", "puxar-h", "empurrar-h"] },
    { nome: "Inferior B", padroes: ["dobradica", "agachar", "core"] },
    { nome: "Pontos fracos", padroes: ["puxar-v", "puxar-h", "core"] },
  ],
  6: [
    { nome: "Empurrar A", padroes: ["empurrar-h", "empurrar-v", "core"] },
    { nome: "Puxar A", padroes: ["puxar-v", "puxar-h"] },
    { nome: "Pernas A", padroes: ["agachar", "dobradica", "core"] },
    { nome: "Empurrar B", padroes: ["empurrar-v", "empurrar-h", "core"] },
    { nome: "Puxar B", padroes: ["puxar-h", "puxar-v"] },
    { nome: "Pernas B", padroes: ["dobradica", "agachar", "core"] },
  ],
};

/**
 * Quantos dias por semana o programa aceita para cada experiência.
 *
 * O teto para quem nunca treinou não é falta de ambição — é que a dor
 * muscular da primeira semana em cinco dias seguidos é a causa número um
 * de abandono no dia 10. Quem nunca treinou cresce com três.
 */
export const DIAS_POSSIVEIS: Record<Experiencia, number[]> = {
  nunca: [2, 3],
  voltando: [3, 4],
  constante: [3, 4, 5, 6],
};

export function diasValidos(experiencia: Experiencia, pedidos: number): number {
  const possiveis = DIAS_POSSIVEIS[experiencia];
  if (possiveis.includes(pedidos)) return pedidos;

  /*
   * Prende ao mais próximo que a experiência comporta. O desempate vai
   * para baixo de propósito: errar para menos custa adaptação, errar para
   * mais custa a pessoa.
   */
  return possiveis.reduce((melhor, d) => {
    const dist = Math.abs(d - pedidos);
    const atual = Math.abs(melhor - pedidos);
    if (dist < atual) return d;
    if (dist === atual) return Math.min(melhor, d);
    return melhor;
  });
}

/* ============================================================
   PRESCRIÇÃO POR BLOCO
   ============================================================ */

export type Prescricao = {
  series: number;
  reps: string;
  /** repetições em reserva — quão perto da falha */
  rir: number;
  descanso: string;
};

/**
 * Os três blocos de 30 dias não repetem a mesma dose.
 *
 * O bloco 1 ensina o padrão e constrói a frequência, longe da falha de
 * propósito: a dor que incapacita no primeiro mês não acelera nada e
 * esvazia o segundo. O bloco 2 é onde a carga sobe. O bloco 3 aproxima a
 * falha, agora que existe técnica para suportar isso.
 */
export function prescrever(bloco: 1 | 2 | 3, experiencia: Experiencia): Prescricao {
  const novato = experiencia === "nunca";

  switch (bloco) {
    case 1:
      return { series: novato ? 2 : 3, reps: "8 a 12", rir: 4, descanso: "90 s" };
    case 2:
      return { series: 3, reps: novato ? "8 a 12" : "6 a 10", rir: 2, descanso: "2 min" };
    case 3:
      return { series: novato ? 3 : 4, reps: "6 a 12", rir: 1, descanso: "2 a 3 min" };
  }
}

export type Item = {
  padrao: string;
  exercicio: string;
  /** o mesmo padrão, mais fácil — null quando o principal já é a regressão */
  alternativa: string | null;
  series: number;
  reps: string;
  rir: number;
  descanso: string;
};

export type SessaoMontada = { nome: string; itens: Item[] };

export function montarSemana(
  local: Local,
  dias: number,
  experiencia: Experiencia,
  bloco: 1 | 2 | 3,
): SessaoMontada[] {
  const divisao = DIVISOES[dias] ?? DIVISOES[3];
  const dose = prescrever(bloco, experiencia);
  const emCasa = local === "casa";

  return divisao.map((sessao) => ({
    nome: sessao.nome,
    itens: sessao.padroes.map((p) => {
      const vaga = VAGAS[p];

      // No primeiro bloco em casa, quem nunca treinou começa pela
      // regressão: é o mesmo padrão com a chance de sair bem feito.
      const principal =
        emCasa && bloco === 1 && experiencia === "nunca"
          ? vaga.regressaoCasa
          : emCasa
            ? vaga.casa
            : vaga.academia;

      return {
        padrao: NOME_PADRAO[p],
        exercicio: principal,
        alternativa:
          emCasa && principal !== vaga.regressaoCasa ? vaga.regressaoCasa : null,
        series: dose.series,
        reps: dose.reps,
        rir: dose.rir,
        descanso: dose.descanso,
      };
    }),
  }));
}

/** Séries semanais totais — o número que diz se o volume está na faixa útil. */
export function volumeSemanal(semana: SessaoMontada[]): number {
  return semana.reduce(
    (total, s) => total + s.itens.reduce((t, i) => t + i.series, 0),
    0,
  );
}
