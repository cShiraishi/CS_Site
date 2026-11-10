/**
 * Gamificação do Reset 21D — pontos, nível, sequência e conquistas.
 *
 * Tudo é DERIVADO do diário (dias concluídos, missões marcadas, medidas).
 * Não há pontuação guardada à parte: desmarcar um dia tira os pontos dele,
 * e não existe estado que possa ficar fora de sincronia com o que a pessoa
 * realmente fez.
 */

export type DiarioParaJogo = {
  diasConcluidos: number[];
  missoesPorDia: Record<number, boolean[]>;
  pesoAtual: string;
  cinturaAtual: string;
};

export const XP_POR_DIA = 100;
export const XP_POR_MISSAO = 15;
export const XP_POR_MEDIDA = 50;

export const NIVEIS = [
  { nome: "Iniciante", minimo: 0 },
  { nome: "Constante", minimo: 400 },
  { nome: "Focado", minimo: 1000 },
  { nome: "Disciplinado", minimo: 1800 },
  { nome: "Imparável", minimo: 2600 },
] as const;

export type Conquista = {
  id: string;
  icone: string;
  nome: string;
  descricao: string;
  feita: boolean;
  /** progresso de 0 a 1, para a barra da conquista ainda não feita */
  progresso: number;
};

const dias = (de: number, ate: number) =>
  Array.from({ length: ate - de + 1 }, (_, i) => de + i);

/** Maior sequência de dias seguidos concluídos, e a que termina no último dia feito. */
export function sequencias(concluidos: number[]): { atual: number; melhor: number } {
  const feitos = [...new Set(concluidos)]
    .filter((d) => d >= 1 && d <= 21)
    .sort((a, b) => a - b);
  if (!feitos.length) return { atual: 0, melhor: 0 };

  let melhor = 1;
  let corrente = 1;
  for (let i = 1; i < feitos.length; i++) {
    corrente = feitos[i] === feitos[i - 1] + 1 ? corrente + 1 : 1;
    if (corrente > melhor) melhor = corrente;
  }
  return { atual: corrente, melhor };
}

export function calcularJogo(diario: DiarioParaJogo) {
  const feitos = [...new Set(diario.diasConcluidos)].filter((d) => d >= 1 && d <= 21);
  const missoes = Object.values(diario.missoesPorDia ?? {}).reduce(
    (soma, lista) => soma + (Array.isArray(lista) ? lista.filter(Boolean).length : 0),
    0,
  );
  const medidas = [diario.pesoAtual, diario.cinturaAtual].filter((v) => v?.trim()).length;

  const xp = feitos.length * XP_POR_DIA + missoes * XP_POR_MISSAO + medidas * XP_POR_MEDIDA;

  let indice = 0;
  NIVEIS.forEach((n, i) => {
    if (xp >= n.minimo) indice = i;
  });
  const nivel = NIVEIS[indice];
  const proximo = NIVEIS[indice + 1] ?? null;
  const progressoNivel = proximo
    ? (xp - nivel.minimo) / (proximo.minimo - nivel.minimo)
    : 1;

  const seq = sequencias(feitos);
  const fracao = (lista: number[]) =>
    lista.filter((d) => feitos.includes(d)).length / lista.length;

  const conquistas: Conquista[] = [
    {
      id: "primeiro-dia",
      icone: "🚀",
      nome: "Primeiro passo",
      descricao: "Concluir 1 dia",
      progresso: Math.min(1, feitos.length),
    },
    {
      id: "sequencia-3",
      icone: "🔥",
      nome: "Pegando ritmo",
      descricao: "3 dias seguidos",
      progresso: Math.min(1, seq.melhor / 3),
    },
    {
      id: "sequencia-7",
      icone: "⚡",
      nome: "Semana sem falhar",
      descricao: "7 dias seguidos",
      progresso: Math.min(1, seq.melhor / 7),
    },
    {
      id: "semana-1",
      icone: "🥉",
      nome: "Reset concluído",
      descricao: "Todos os dias da Semana 1",
      progresso: fracao(dias(1, 7)),
    },
    {
      id: "semana-2",
      icone: "🥈",
      nome: "Carga concluída",
      descricao: "Todos os dias da Semana 2",
      progresso: fracao(dias(8, 14)),
    },
    {
      id: "semana-3",
      icone: "🥇",
      nome: "Definição concluída",
      descricao: "Todos os dias da Semana 3",
      progresso: fracao(dias(15, 21)),
    },
    {
      id: "missoes-20",
      icone: "🎯",
      nome: "Missão dada",
      descricao: "20 missões marcadas",
      progresso: Math.min(1, missoes / 20),
    },
    {
      id: "medidas",
      icone: "📏",
      nome: "Quem mede, evolui",
      descricao: "Registrar peso e cintura",
      progresso: medidas / 2,
    },
    {
      id: "completo",
      icone: "🏆",
      nome: "Reset 21D completo",
      descricao: "Os 21 dias concluídos",
      progresso: feitos.length / 21,
    },
  ].map((c) => ({ ...c, feita: c.progresso >= 1 }));

  return {
    xp,
    nivel: { numero: indice + 1, nome: nivel.nome },
    proximo: proximo ? { nome: proximo.nome, falta: proximo.minimo - xp } : null,
    progressoNivel,
    sequencia: seq,
    missoes,
    conquistas,
    feitas: conquistas.filter((c) => c.feita).length,
  };
}
