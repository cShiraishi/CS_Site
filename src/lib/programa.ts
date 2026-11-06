/**
 * O Programa 90 Dias — o motor que transforma o funil em prescrição.
 *
 * Por que 90 dias, e não 21 ou 30:
 *
 *  · 21 dias vem de uma observação clínica de Maxwell Maltz nos anos 60,
 *    nunca de um estudo de hábito. Quando mediram, a mediana para um
 *    comportamento virar automático foi de 66 dias, com variação de 18 a
 *    254 (Lally et al., Eur J Soc Psychol, 2010). Prometer hábito em 21
 *    dias é vender o número errado.
 *  · 30 dias não mente, mas não entrega corpo: no primeiro mês a balança
 *    se move muito por glicogênio e água, e a composição quase não muda.
 *  · 90 dias cobrem as 12 semanas que a literatura de intervenção usa como
 *    padrão, comportam 5 a 10 % do peso corporal no ritmo seguro — a mesma
 *    faixa dos consensos de obesidade para benefício metabólico — e passam
 *    dos 66 dias do hábito.
 *
 * A duração é parâmetro, não constante embutida: trocar para 60 ou 120
 * dias não deve exigir tocar em nada além da chamada.
 */

import {
  ATIVIDADES,
  calcularTmb,
  distribuir,
  macros as calcularMacros,
  planejar,
  type Atividade,
  type Direcao,
  type Formula,
  type Macros,
  type Refeicao,
  type Sexo,
} from "./calorias";
import { conferir, nivel, pesoNoAlvo, type Leitura } from "./shapes";
import {
  diasValidos,
  montarSemana,
  volumeSemanal,
  type Experiencia,
  type Local,
  type SessaoMontada,
} from "./treino";

export const DURACAO_PADRAO = 90;
const DIAS_POR_BLOCO = 30;

/** ~7700 kcal por quilo de tecido adiposo — o mesmo número de `calorias.ts`. */
const KCAL_POR_KG = 7700;

/**
 * Número com vírgula decimal.
 *
 * Os avisos são texto corrido em português, e "8.4 kg" no meio de uma
 * frase em português é erro de acabamento — o resto do site já escreve
 * "15,5 %". Formatado à mão em vez de `toLocaleString` porque este módulo
 * roda no servidor e no cliente, e a formatação por locale pode divergir
 * entre os dois e quebrar a hidratação.
 */
function n1(valor: number): string {
  return String(valor).replace(".", ",");
}

export type Perfil = {
  sexo: Sexo;
  idade: number;
  /** quilogramas */
  peso: number;
  /** centímetros */
  altura: number;
  /** quilogramas — para onde ela quer ir */
  pesoAlvo: number;
  /** id na escala de `shapes.ts` — onde ela se vê hoje */
  shapeAtual: string;
  /** id na escala de `shapes.ts` — onde ela quer chegar */
  shapeAlvo: string;
  atividade: Atividade;
  local: Local;
  /** dias de treino por semana que ela diz ter */
  diasPedidos: number;
  experiencia: Experiencia;
  /** quantas refeições por dia ela consegue fazer */
  refeicoes: number;
};

/* ============================================================
   O MODO DO PROGRAMA
   ============================================================ */

/**
 * `recomposicao` é o caso que o funil cria e uma calculadora de calorias
 * não prevê: a pessoa aponta uma silhueta bem mais magra e, ao mesmo
 * tempo, um peso quase igual ao de hoje. Não é contradição — é o pedido
 * mais comum de quem já tem peso normal e não gosta do que vê.
 *
 * Tratar isso como manutenção seria devolver o gasto total em calorias e
 * nenhuma mudança: o programa entregaria exatamente o corpo que a pessoa
 * veio trocar. Recomposição tem prescrição própria — déficit pequeno,
 * proteína alta, treino de força — e, principalmente, outra régua: a
 * balança quase não mexe, e quem mede o resultado é a cintura e a foto.
 */
export type Modo = "perder" | "ganhar" | "manter" | "recomposicao";

/** Déficit da recomposição: pequeno o bastante para não custar massa magra. */
const DEFICIT_RECOMP = 0.1;

function decidirModo(
  perfil: Perfil,
  gorduraAtual: number | null,
  gorduraAlvo: number | null,
): Modo {
  const diferenca = perfil.pesoAlvo - perfil.peso;

  // "Quase o mesmo peso" é relativo: 2 kg em 60 kg é intenção de mudar,
  // 2 kg em 120 kg é ruído de balança.
  const limiar = Math.max(1, perfil.peso * 0.02);
  const mudaPeso = Math.abs(diferenca) >= limiar;

  const querMenosGordura =
    gorduraAtual !== null && gorduraAlvo !== null && gorduraAtual - gorduraAlvo >= 3;

  if (!mudaPeso && querMenosGordura) return "recomposicao";
  if (Math.abs(diferenca) < 0.5) return "manter";
  return diferenca < 0 ? "perder" : "ganhar";
}

/* ============================================================
   VIABILIDADE — a tela que protege a reputação
   ============================================================ */

export type Etapa = {
  bloco: 1 | 2 | 3;
  /** rótulo do intervalo, ex. "Dias 1 a 30" */
  intervalo: string;
  /** peso no início do bloco, em kg */
  pesoInicial: number;
  /** peso projetado no fim do bloco, em kg */
  pesoFinal: number;
  tmb: number;
  get: number;
  /** kcal/dia deste bloco */
  alvoKcal: number;
  /** negativo = déficit */
  ajuste: number;
  /** a direção usada para montar os macros deste bloco */
  direcao: Direcao;
  /** true quando o teto de segurança limitou o ritmo pedido */
  limitado: boolean;
  /** true quando este bloco já é manutenção porque o alvo foi atingido */
  manutencao: boolean;
};

export type Viabilidade = {
  modo: Modo;
  /** quilos entre o peso de hoje e o alvo pedido */
  pedido: number;
  /** quilos que o ritmo seguro entrega na duração do programa */
  entregue: number;
  /** peso projetado no último dia */
  pesoProjetado: number;
  /** o alvo cabe na duração do programa */
  cabe: boolean;
  /** quando não cabe: semanas a mais, depois do programa, para fechar o alvo */
  semanasExtra: number;
  /** quando cabe com folga: em que dia o alvo é atingido */
  diaDoAlvo: number | null;
  /** percentual do peso corporal que o programa move */
  percentualDoPeso: number;
};

function gastoNoPeso(
  perfil: Perfil,
  peso: number,
  formula: Formula,
): { tmb: number; get: number } | null {
  const tmb = calcularTmb(
    { sexo: perfil.sexo, idade: perfil.idade, peso, altura: perfil.altura },
    formula,
  );
  if (tmb === null) return null;

  const fator = ATIVIDADES.find((a) => a.id === perfil.atividade)?.fator ?? 1.2;
  return { tmb, get: tmb * fator };
}

type Dose = {
  alvoKcal: number;
  ajuste: number;
  direcao: Direcao;
  /** kg por semana que esta dose move na balança */
  ritmoSemanal: number;
  limitado: boolean;
  manutencao: boolean;
};

/**
 * A dose de um bloco.
 *
 * Perder, ganhar e manter delegam a `planejar()`, que já carrega os tetos
 * de segurança. Recomposição é calculada aqui porque não é um alvo de
 * peso: é um alvo de composição, e `planejar()` só sabe falar de peso.
 */
function doseDoBloco(
  modo: Modo,
  gasto: { tmb: number; get: number },
  peso: number,
  pesoAlvo: number,
): Dose | null {
  if (modo === "recomposicao") {
    const ajuste = -Math.round(gasto.get * DEFICIT_RECOMP);
    const alvo = Math.round((gasto.get + ajuste) / 10) * 10;

    /*
     * Metade do que o déficit daria sozinho. O resto é compensado por
     * massa magra ganha no mesmo período — é literalmente o objetivo da
     * recomposição, e é por isso que a balança desaponta quem só olha
     * para ela.
     */
    const ritmoSemanal = ((Math.abs(ajuste) * 7) / KCAL_POR_KG) * 0.5;

    return {
      alvoKcal: Math.max(alvo, Math.round(gasto.tmb)),
      ajuste,
      // Proteína de corte: é o que protege massa magra em déficit.
      direcao: "perder",
      ritmoSemanal,
      limitado: false,
      manutencao: false,
    };
  }

  const plano = planejar(gasto.get, gasto.tmb, peso, pesoAlvo);
  if (!plano) return null;

  return {
    alvoKcal: plano.alvo,
    ajuste: plano.ajuste,
    direcao: plano.direcao,
    ritmoSemanal: plano.ritmoSemanal,
    limitado: plano.limitado,
    // `planejar` devolve "manter" quando a distância até o alvo é menor
    // que meio quilo — ou seja, quando já chegou.
    manutencao: plano.direcao === "manter",
  };
}

/**
 * Simula o programa bloco a bloco.
 *
 * A simulação avança por blocos de 30 dias porque o gasto energético cai
 * junto com o peso: manter o mesmo déficit do dia 1 até o dia 90 é a
 * receita do platô do segundo mês. Cada bloco recalcula sobre o peso
 * projetado do bloco anterior.
 */
export function simular(
  perfil: Perfil,
  modo: Modo,
  duracao = DURACAO_PADRAO,
  formula: Formula = "mifflin",
): { etapas: Etapa[]; viabilidade: Viabilidade } | null {
  const blocos = Math.max(1, Math.round(duracao / DIAS_POR_BLOCO));
  const semanasPorBloco = DIAS_POR_BLOCO / 7;

  const etapas: Etapa[] = [];
  let peso = perfil.peso;
  let diaDoAlvo: number | null = null;
  let ultimoRitmo = 0;

  for (let i = 0; i < blocos; i++) {
    const gasto = gastoNoPeso(perfil, peso, formula);
    if (!gasto) return null;

    const dose = doseDoBloco(modo, gasto, peso, perfil.pesoAlvo);
    if (!dose) return null;

    const inicioDoBloco = i * DIAS_POR_BLOCO + 1;
    const fimDoBloco = (i + 1) * DIAS_POR_BLOCO;

    const movimentoBruto = dose.ritmoSemanal * semanasPorBloco;

    /*
     * Em recomposição não existe alvo de peso a respeitar: o peso deriva
     * da composição. Nos outros modos, o movimento do bloco nunca passa
     * do alvo — sem este corte, quem pede 3 kg receberia a projeção de
     * perder 9, e o plano seguiria cortando calorias depois de a meta já
     * ter sido atingida.
     */
    const falta =
      modo === "recomposicao" ? Infinity : Math.abs(perfil.pesoAlvo - peso);
    const movimento = Math.min(movimentoBruto, falta);

    const pesoFinal =
      modo === "ganhar"
        ? peso + movimento
        : modo === "manter"
          ? peso
          : peso - movimento;

    /*
     * O alvo foi atingido dentro deste bloco?
     *
     * A tolerância é a mesma meia-unidade que `planejar()` usa para
     * declarar "manter". Sem ela, um bloco que chega a 0,4 kg do alvo
     * nunca marcaria o dia, e a tela mostraria as calorias subindo no
     * bloco seguinte sem nada que explicasse por quê.
     */
    if (
      diaDoAlvo === null &&
      modo !== "manter" &&
      modo !== "recomposicao" &&
      movimentoBruto > 0 &&
      movimentoBruto >= falta - 0.5
    ) {
      const fracao = Math.min(1, falta / movimentoBruto);
      diaDoAlvo = Math.min(
        duracao,
        inicioDoBloco + Math.max(0, Math.ceil(fracao * DIAS_POR_BLOCO) - 1),
      );
    }

    etapas.push({
      bloco: (i + 1) as 1 | 2 | 3,
      intervalo: `Dias ${inicioDoBloco} a ${fimDoBloco}`,
      pesoInicial: Math.round(peso * 10) / 10,
      pesoFinal: Math.round(pesoFinal * 10) / 10,
      tmb: Math.round(gasto.tmb),
      get: Math.round(gasto.get),
      alvoKcal: dose.alvoKcal,
      ajuste: dose.ajuste,
      direcao: dose.direcao,
      limitado: dose.limitado,
      manutencao: dose.manutencao,
    });

    peso = pesoFinal;
    if (dose.ritmoSemanal > 0) ultimoRitmo = dose.ritmoSemanal;
  }

  const entregue = Math.abs(peso - perfil.peso);
  const pedido = Math.abs(perfil.pesoAlvo - perfil.peso);
  const resto = Math.max(0, pedido - entregue);

  return {
    etapas,
    viabilidade: {
      modo,
      pedido: Math.round(pedido * 10) / 10,
      entregue: Math.round(entregue * 10) / 10,
      pesoProjetado: Math.round(peso * 10) / 10,
      cabe: modo === "recomposicao" || modo === "manter" || resto < 0.5,
      semanasExtra: ultimoRitmo > 0 ? Math.ceil(resto / ultimoRitmo) : 0,
      diaDoAlvo,
      percentualDoPeso: Math.round((entregue / perfil.peso) * 1000) / 10,
    },
  };
}

/* ============================================================
   O PROGRAMA MONTADO
   ============================================================ */

export type Bloco = {
  etapa: Etapa;
  /** o nome que a pessoa vê — o bloco tem uma promessa, não só um número */
  titulo: string;
  foco: string;
  macros: Macros;
  refeicoes: Refeicao[];
  treino: SessaoMontada[];
  /** séries semanais totais */
  volume: number;
  /** o que se mede no último dia do bloco */
  marco: string;
};

type Texto = { titulo: string; foco: string; marco: string };

const TITULOS: Record<1 | 2 | 3, Texto> = {
  1: {
    titulo: "Fundação",
    foco:
      "Construir a frequência e aprender os padrões de movimento. A carga é secundária: o que se instala aqui é a presença.",
    marco: "Peso, foto de frente e de lado, e as sessões cumpridas de 30.",
  },
  2: {
    titulo: "Carga",
    foco:
      "A técnica já existe, então o peso sobe. É o bloco onde a composição corporal começa a mudar de forma visível.",
    marco: "Peso, fotos, circunferência de cintura e as cargas do dia 31 contra as de hoje.",
  },
  3: {
    titulo: "Definição",
    foco:
      "Intensidade mais perto da falha e calorias recalculadas sobre o peso novo — é isso que evita o platô do fim.",
    marco: "Peso, fotos, cintura e o protocolo de manutenção para o dia 91.",
  },
};

/**
 * O bloco que vira manutenção precisa dizer isso.
 *
 * Quando o alvo é atingido no dia 60, o bloco 3 devolve o gasto total em
 * calorias — um salto de várias centenas de kcal em relação ao bloco
 * anterior. Chamar esse bloco de "Definição" e não explicar o salto é a
 * diferença entre um plano e um plano que parece quebrado.
 */
function rotular(bloco: 1 | 2 | 3, etapa: Etapa, modo: Modo): Texto {
  if (etapa.manutencao && modo !== "manter") {
    return {
      titulo: "Manutenção",
      foco:
        "Você chega ao peso alvo antes do fim do programa, e este bloco existe para o resultado não ser temporário: " +
        "as calorias voltam ao seu gasto total e o treino segue igual. É aqui que o corpo aprende a sustentar o peso novo.",
      marco: "Peso estável por quatro semanas, fotos e cintura — e o seu gasto de manutenção, agora medido na prática.",
    };
  }

  if (modo === "recomposicao") {
    const base = TITULOS[bloco];
    return {
      ...base,
      marco:
        bloco === 1
          ? "Fotos de frente e de lado, cintura e as sessões cumpridas. O peso entra no registro, mas não é o que se avalia."
          : base.marco,
    };
  }

  return TITULOS[bloco];
}

export type Programa = {
  duracao: number;
  perfil: Perfil;
  modo: Modo;
  /** dias de treino por semana que o programa realmente usa */
  dias: number;
  /** avisado quando os dias pedidos não couberam na experiência */
  diasAjustados: boolean;
  gorduraAtual: number | null;
  gorduraAlvo: number | null;
  /** o peso que a silhueta escolhida implica, com massa magra constante */
  pesoDaSilhueta: number | null;
  leitura: Leitura;
  viabilidade: Viabilidade;
  blocos: Bloco[];
  avisos: string[];
};

export function montar(
  perfil: Perfil,
  duracao = DURACAO_PADRAO,
  formula: Formula = "mifflin",
): Programa | null {
  const atual = nivel(perfil.sexo, perfil.shapeAtual);
  const alvo = nivel(perfil.sexo, perfil.shapeAlvo);

  const gorduraAtual = atual?.gordura ?? null;
  const gorduraAlvo = alvo?.gordura ?? null;

  const modo = decidirModo(perfil, gorduraAtual, gorduraAlvo);
  const simulacao = simular(perfil, modo, duracao, formula);
  if (!simulacao) return null;

  const dias = diasValidos(perfil.experiencia, perfil.diasPedidos);
  const leitura = conferir(
    perfil.sexo,
    perfil.shapeAtual,
    perfil.peso,
    perfil.altura,
    perfil.idade,
  );

  const pesoDaSilhueta =
    gorduraAtual !== null && gorduraAlvo !== null
      ? pesoNoAlvo(perfil.peso, gorduraAtual, gorduraAlvo)
      : null;

  const blocos: Bloco[] = simulacao.etapas.map((etapa) => {
    const macros = calcularMacros(etapa.alvoKcal, etapa.pesoInicial, etapa.direcao);
    const treino = montarSemana(perfil.local, dias, perfil.experiencia, etapa.bloco);
    const texto = rotular(etapa.bloco, etapa, modo);

    return {
      etapa,
      titulo: texto.titulo,
      foco: texto.foco,
      macros,
      refeicoes: distribuir(etapa.alvoKcal, macros, perfil.refeicoes),
      treino,
      volume: volumeSemanal(treino),
      marco: texto.marco,
    };
  });

  return {
    duracao,
    perfil,
    modo,
    dias,
    diasAjustados: dias !== perfil.diasPedidos,
    gorduraAtual,
    gorduraAlvo,
    pesoDaSilhueta,
    leitura,
    viabilidade: simulacao.viabilidade,
    blocos,
    avisos: avisar({
      perfil,
      modo,
      v: simulacao.viabilidade,
      blocos,
      dias,
      leitura,
      duracao,
      pesoDaSilhueta,
      gorduraAtual,
      gorduraAlvo,
    }),
  };
}

/**
 * Os avisos.
 *
 * Ficam numa função só para que exista um lugar único onde se lê tudo que
 * o programa admite não poder entregar. Espalhados pela interface, eles se
 * perdem no primeiro redesenho da página.
 */
function avisar(ctx: {
  perfil: Perfil;
  modo: Modo;
  v: Viabilidade;
  blocos: Bloco[];
  dias: number;
  leitura: Leitura;
  duracao: number;
  pesoDaSilhueta: number | null;
  gorduraAtual: number | null;
  gorduraAlvo: number | null;
}): string[] {
  const { perfil, modo, v, blocos, dias, leitura, duracao, pesoDaSilhueta } = ctx;
  const avisos: string[] = [];

  if (modo === "recomposicao") {
    avisos.push(
      `Você pediu praticamente o mesmo peso e uma silhueta bem mais magra. Isso tem nome — recomposição corporal — ` +
        `e é o pedido mais comum de quem já está no peso e não gosta do que vê. O plano usa um déficit pequeno, ` +
        `proteína alta e treino de força: a balança vai mexer pouco de propósito. ` +
        `Quem mede o seu resultado aqui é a cintura e a foto, não o peso.`,
    );
  }

  if (!v.cabe && modo !== "manter" && modo !== "recomposicao") {
    const falta = Math.round((v.pedido - v.entregue) * 10) / 10;

    // O preço de acelerar é diferente nos dois sentidos: no corte
    // perde-se massa magra, no ganho acumula-se gordura. Dizer "massa
    // magra" para quem está em bulk destruiria a credibilidade da frase.
    const preco =
      modo === "perder"
        ? "o preço é massa magra, e ela não volta sozinha"
        : "o preço é gordura, e aí o corte vem depois para desfazer o que se ganhou";

    avisos.push(
      `Os ${n1(v.pedido)} kg que você pediu não cabem em ${duracao} dias no ritmo seguro. ` +
        `O programa entrega ${n1(v.entregue)} kg — e os ${n1(falta)} kg que faltam levam cerca de ` +
        `${v.semanasExtra} semanas a mais, mantendo o mesmo método. ` +
        `Dá para ir mais rápido que isso; ${preco}.`,
    );
  }

  if (v.diaDoAlvo !== null && v.diaDoAlvo < duracao) {
    avisos.push(
      `Pelo cálculo, você chega ao peso alvo por volta do dia ${v.diaDoAlvo}. ` +
        `Os dias restantes não são sobra: são o bloco de manutenção, que é onde o resultado deixa de ser temporário.`,
    );
  }

  /*
   * Peso pedido contra peso que a silhueta implica.
   *
   * `pesoDaSilhueta` assume massa magra constante, o que vale no corte e
   * não vale em bulk — quem quer ganhar quer justamente mais massa magra.
   * Por isso os dois sentidos recebem avisos diferentes, e no ganho a
   * pergunta útil não é sobre peso, é sobre quantos quilos de músculo o
   * pedido exige.
   */
  if (modo === "ganhar" && ctx.gorduraAlvo !== null && ctx.gorduraAtual !== null) {
    const magraHoje = perfil.peso * (1 - ctx.gorduraAtual / 100);
    const magraNoAlvo = perfil.pesoAlvo * (1 - ctx.gorduraAlvo / 100);
    const precisa = Math.round((magraNoAlvo - magraHoje) * 10) / 10;

    // Ganho de massa magra realista: ~0,8 kg/mês para quem está começando
    // (a "janela do novato"), ~0,4 kg/mês para quem já treina há tempo.
    const porMes = perfil.experiencia === "constante" ? 0.4 : 0.8;

    if (precisa >= 2) {
      avisos.push(
        `Os ${n1(perfil.pesoAlvo)} kg com a silhueta que você escolheu exigem cerca de ${n1(precisa)} kg de massa magra a mais do que você tem hoje. ` +
          `Músculo natural vem a uns ${n1(porMes)} kg por mês no seu nível, então esse corpo é projeto de ${Math.ceil(precisa / porMes)} meses, não de ${duracao} dias. ` +
          `Os ${duracao} dias são o primeiro bloco dele — e o bloco que decide se os outros acontecem.`,
      );
    }
  } else if (
    pesoDaSilhueta !== null &&
    modo === "perder" &&
    Math.abs(pesoDaSilhueta - perfil.pesoAlvo) >= 3
  ) {
    const acima = pesoDaSilhueta > perfil.pesoAlvo;
    avisos.push(
      `A silhueta que você escolheu corresponde a cerca de ${n1(pesoDaSilhueta)} kg no seu caso, e você pediu ${n1(perfil.pesoAlvo)} kg. ` +
        (acima
          ? `Ou seja: o corpo que você quer pesa mais do que o número que você pediu — e com treino de força pesa mais ainda, porque músculo tem peso. Vale perseguir a silhueta, não a balança.`
          : `Ou seja: o número que você pediu ainda não é magro o bastante para a silhueta que você escolheu. O programa segue o peso pedido; chegando lá, a continuação é a mesma.`),
    );
  }

  if (blocos.some((b) => b.etapa.limitado)) {
    avisos.push(
      "O déficit foi limitado pelo teto de segurança: nenhum bloco corta mais de 25 % do seu gasto, nem fica abaixo do seu metabolismo basal.",
    );
  }

  if (blocos.some((b) => b.macros.apertado)) {
    avisos.push(
      "Com proteína e gordura nos mínimos, sobra pouco carboidrato em algum bloco. É sinal de que o alvo calórico está apertado para o seu peso — considere um prazo mais longo.",
    );
  }

  if (dias !== perfil.diasPedidos) {
    avisos.push(
      `Você pediu ${perfil.diasPedidos} dias de treino por semana e o programa montou ${dias}. ` +
        `Para o seu nível, é o número que você consegue sustentar por ${duracao} dias — e sustentar é o que faz diferença.`,
    );
  }

  if (leitura === "severa") {
    avisos.push(
      "A silhueta que você escolheu indica mais gordura do que o seu peso e altura sugerem. O plano foi feito sobre os números medidos, não sobre a autoimagem.",
    );
  }

  if (modo === "ganhar" && blocos.some((b) => b.volume < 12)) {
    avisos.push(
      "O volume semanal está no limite de baixo para ganho de massa. Com mais um dia de treino por semana, o programa rende bem mais.",
    );
  }

  return avisos;
}
