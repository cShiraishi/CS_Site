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
import { MOTOR, numeroIdioma } from "./i18n/programa-motor";
import type { Idioma } from "./rotas-idioma";

export const DURACAO_PADRAO = 21;
const BLOCOS_PADRAO = 3;

/** ~7700 kcal por quilo de tecido adiposo — o mesmo número de `calorias.ts`. */
const KCAL_POR_KG = 7700;

/**
 * Número com vírgula decimal (ponto em inglês) — ver `numeroIdioma`.
 *
 * Os avisos são texto corrido, e "8.4 kg" no meio de uma frase em
 * português é erro de acabamento. Formatado à mão em vez de
 * `toLocaleString` porque este módulo roda no servidor e no cliente.
 */
const n1 = numeroIdioma;

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
  idioma: Idioma = "pt",
): { etapas: Etapa[]; viabilidade: Viabilidade } | null {
  const diasPorBloco = Math.max(1, Math.round(duracao / BLOCOS_PADRAO));
  const blocos = Math.max(1, Math.round(duracao / diasPorBloco));
  const semanasPorBloco = diasPorBloco / 7;

  const etapas: Etapa[] = [];
  let peso = perfil.peso;
  let diaDoAlvo: number | null = null;
  let ultimoRitmo = 0;

  for (let i = 0; i < blocos; i++) {
    const gasto = gastoNoPeso(perfil, peso, formula);
    if (!gasto) return null;

    const dose = doseDoBloco(modo, gasto, peso, perfil.pesoAlvo);
    if (!dose) return null;

    const inicioDoBloco = i * diasPorBloco + 1;
    const fimDoBloco = (i + 1) * diasPorBloco;

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
        inicioDoBloco + Math.max(0, Math.ceil(fracao * diasPorBloco) - 1),
      );
    }

    etapas.push({
      bloco: (i + 1) as 1 | 2 | 3,
      intervalo: MOTOR[idioma].intervalo(inicioDoBloco, fimDoBloco),
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

/**
 * O bloco que vira manutenção precisa dizer isso.
 *
 * Quando o alvo é atingido no dia 60, o bloco 3 devolve o gasto total em
 * calorias — um salto de várias centenas de kcal em relação ao bloco
 * anterior. Chamar esse bloco de "Definição" e não explicar o salto é a
 * diferença entre um plano e um plano que parece quebrado.
 */
function rotular(bloco: 1 | 2 | 3, etapa: Etapa, modo: Modo, idioma: Idioma): Texto {
  const t = MOTOR[idioma];
  if (etapa.manutencao && modo !== "manter") {
    return t.manutencao;
  }

  if (modo === "recomposicao") {
    const base = t.blocos[bloco];
    return {
      ...base,
      marco: bloco === 1 ? t.recomposicaoMarco1 : base.marco,
    };
  }

  return t.blocos[bloco];
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
  /** idioma dos textos gerados; a área do aluno usa o padrão, português */
  idioma: Idioma = "pt",
): Programa | null {
  const atual = nivel(perfil.sexo, perfil.shapeAtual);
  const alvo = nivel(perfil.sexo, perfil.shapeAlvo);

  const gorduraAtual = atual?.gordura ?? null;
  const gorduraAlvo = alvo?.gordura ?? null;

  const modo = decidirModo(perfil, gorduraAtual, gorduraAlvo);
  const simulacao = simular(perfil, modo, duracao, formula, idioma);
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
    const treino = montarSemana(perfil.local, dias, perfil.experiencia, etapa.bloco, idioma);
    const texto = rotular(etapa.bloco, etapa, modo, idioma);

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
      idioma,
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
  idioma: Idioma;
}): string[] {
  const { perfil, modo, v, blocos, dias, leitura, duracao, pesoDaSilhueta, idioma } = ctx;
  const t = MOTOR[idioma].avisos;
  const n = (valor: number) => n1(valor, idioma);
  const avisos: string[] = [];

  if (modo === "recomposicao") {
    avisos.push(t.recomposicao);
  }

  if (!v.cabe && modo !== "manter" && modo !== "recomposicao") {
    const falta = Math.round((v.pedido - v.entregue) * 10) / 10;

    // O preço de acelerar é diferente nos dois sentidos (ver `naoCabe`):
    // no corte perde-se massa magra, no ganho acumula-se gordura.
    avisos.push(
      t.naoCabe({
        pedido: n(v.pedido),
        duracao,
        entregue: n(v.entregue),
        falta: n(falta),
        semanasExtra: v.semanasExtra,
        modo,
      }),
    );
  }

  if (v.diaDoAlvo !== null && v.diaDoAlvo < duracao) {
    avisos.push(t.diaDoAlvo(v.diaDoAlvo));
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
        t.massaMagra({
          pesoAlvo: n(perfil.pesoAlvo),
          precisa: n(precisa),
          porMes: n(porMes),
          meses: Math.ceil(precisa / porMes),
          duracao,
        }),
      );
    }
  } else if (
    pesoDaSilhueta !== null &&
    modo === "perder" &&
    Math.abs(pesoDaSilhueta - perfil.pesoAlvo) >= 3
  ) {
    avisos.push(
      t.silhueta({
        pesoDaSilhueta: n(pesoDaSilhueta),
        pesoAlvo: n(perfil.pesoAlvo),
        acima: pesoDaSilhueta > perfil.pesoAlvo,
      }),
    );
  }

  if (blocos.some((b) => b.etapa.limitado)) {
    avisos.push(t.limitado);
  }

  if (blocos.some((b) => b.macros.apertado)) {
    avisos.push(t.apertado);
  }

  if (dias !== perfil.diasPedidos) {
    avisos.push(t.diasAjustados({ pedidos: perfil.diasPedidos, dias, duracao }));
  }

  if (leitura === "severa") {
    avisos.push(t.severa);
  }

  if (modo === "ganhar" && blocos.some((b) => b.volume < 12)) {
    avisos.push(t.volumeBaixo);
  }

  return avisos;
}
