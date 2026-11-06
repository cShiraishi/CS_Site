/**
 * O catálogo dos protocolos em PDF.
 *
 * Fonte única de verdade, consultada por três lados que de outra forma
 * divergiriam: o gerador (`scripts/protocolos/`) sabe por aqui o que tem
 * de produzir, a área de entrega sabe por aqui o que mostrar, e a rota
 * que serve os ficheiros sabe por aqui quais nomes existem.
 *
 * Esse último ponto é de segurança, não de arrumação. A rota recebe um
 * nome de ficheiro vindo do navegador; se ela o juntasse a um caminho em
 * disco, `../../.env.local` seria um nome de ficheiro válido. Aqui o nome
 * pedido é procurado nesta lista, e o caminho é construído a partir do
 * que a lista diz — nunca a partir do que o pedido trouxe.
 */

import type { Modo } from "./programa";
import type { Experiencia, Local } from "./treino";

export type Familia = "nutricao" | "treino" | "nucleo";

export const FAMILIAS: Record<Familia, { nome: string; nota: string }> = {
  nutricao: {
    nome: "Nutrição",
    nota: "A execução do seu alvo calórico em comida de verdade.",
  },
  treino: {
    nome: "Treino",
    nota: "A sua semana, exercício por exercício, nos três blocos.",
  },
  nucleo: {
    nome: "Núcleo",
    nota: "O que vale para todo mundo: medir, começar, ajustar.",
  },
};

export type Protocolo = {
  /** o código impresso na capa, ex. "N1" */
  codigo: string;
  familia: Familia;
  /** nome do ficheiro servido — a chave de acesso, e a única forma válida */
  arquivo: string;
  titulo: string;
  /** uma linha, para a lista da área de entrega */
  resumo: string;
  /** o subtítulo da capa */
  subtitulo: string;
  /** quando este protocolo se aplica, em linguagem de gente */
  quando: string;
  /** false enquanto o conteúdo não estiver escrito e revisto */
  pronto: boolean;
};

/* ============================================================
   NUTRIÇÃO — um por modo do programa
   ============================================================ */

const NUTRICAO: Protocolo[] = [
  {
    codigo: "N1",
    familia: "nutricao",
    arquivo: "n1-nutricao-deficit.pdf",
    titulo: "Nutrição em déficit",
    resumo: "Para quem vai perder peso: montar o prato, trocar alimentos e ajustar quando a balança para.",
    subtitulo:
      "O alvo calórico do seu plano, convertido em comida de restaurante brasileiro — sem balança e sem lista proibida.",
    quando: "Você pediu um peso menor que o de hoje.",
    pronto: true,
  },
  {
    codigo: "N2",
    familia: "nutricao",
    arquivo: "n2-nutricao-ganho.pdf",
    titulo: "Nutrição em ganho",
    resumo: "Para quem vai ganhar massa: comer o suficiente sem transformar o ganho em gordura.",
    subtitulo:
      "O superávit que constrói músculo e não só peso — e a aritmética que diz quando ele passou do ponto.",
    quando: "Você pediu um peso maior que o de hoje.",
    pronto: false,
  },
  {
    codigo: "N3",
    familia: "nutricao",
    arquivo: "n3-nutricao-recomposicao.pdf",
    titulo: "Nutrição em recomposição",
    resumo: "Mesmo peso, outro corpo: déficit pequeno, proteína alta e a régua que não é a balança.",
    subtitulo:
      "Para quem está no peso e não gosta do que vê. A balança quase não mexe de propósito.",
    quando: "Você pediu praticamente o mesmo peso e uma silhueta mais magra.",
    pronto: false,
  },
  {
    codigo: "N4",
    familia: "nutricao",
    arquivo: "n4-nutricao-manutencao.pdf",
    titulo: "Nutrição em manutenção",
    resumo: "O protocolo do dia 91: sustentar o resultado sem contar calorias para sempre.",
    subtitulo:
      "A parte que quase ninguém entrega, e a única que decide se o resultado dura mais de um verão.",
    quando: "Você chegou ao alvo, ou veio manter o que já tem.",
    pronto: false,
  },
];

/* ============================================================
   TREINO — local × experiência
   ============================================================ */

type Chave = `${Local}-${Experiencia}`;

const TREINO: (Protocolo & { chave: Chave })[] = [
  {
    chave: "casa-nunca",
    codigo: "T1",
    familia: "treino",
    arquivo: "t1-treino-casa-comecando.pdf",
    titulo: "Treino em casa · começando",
    resumo: "Peso do corpo e uma cadeira. Dois a três dias por semana, nos três blocos.",
    subtitulo: "O chão da sala é equipamento suficiente para os primeiros 90 dias.",
    quando: "Você treina em casa e nunca treinou antes.",
    pronto: false,
  },
  {
    chave: "casa-voltando",
    codigo: "T2",
    familia: "treino",
    arquivo: "t2-treino-casa-voltando.pdf",
    titulo: "Treino em casa · voltando",
    resumo: "Você já treinou. Três a quatro dias, com as regressões à mão para a semana ruim.",
    subtitulo: "O corpo lembra mais rápido do que aprendeu — e é por isso que se começa abaixo do que dá.",
    quando: "Você treina em casa e já treinou antes.",
    pronto: false,
  },
  {
    chave: "casa-constante",
    codigo: "T3",
    familia: "treino",
    arquivo: "t3-treino-casa-constante.pdf",
    titulo: "Treino em casa · constante",
    resumo: "Três a seis dias em casa, com progressão sem carga externa.",
    subtitulo: "Sem barra para adicionar peso, a progressão muda de moeda: alavanca, cadência e densidade.",
    quando: "Você treina em casa de forma constante.",
    pronto: false,
  },
  {
    chave: "academia-nunca",
    codigo: "T4",
    familia: "treino",
    arquivo: "t4-treino-academia-comecando.pdf",
    titulo: "Treino na academia · começando",
    resumo: "Dois a três dias de corpo inteiro, e o que fazer no primeiro dia sem saber onde ficam as coisas.",
    subtitulo: "Corpo inteiro, longe da falha, e técnica antes de carga. A pressa do mês 1 esvazia o mês 2.",
    quando: "Você treina na academia e nunca treinou antes.",
    pronto: false,
  },
  {
    chave: "academia-voltando",
    codigo: "T5",
    familia: "treino",
    arquivo: "t5-treino-academia-voltando.pdf",
    titulo: "Treino na academia · voltando",
    resumo: "Três a quatro dias, divisão superior e inferior, com retorno de carga controlado.",
    subtitulo: "A força volta antes do tecido aguentar. Este protocolo existe para essa diferença não virar lesão.",
    quando: "Você treina na academia e já treinou antes.",
    pronto: false,
  },
  {
    chave: "academia-constante",
    codigo: "T6",
    familia: "treino",
    arquivo: "t6-treino-academia-constante.pdf",
    titulo: "Treino na academia · constante",
    resumo: "Três a seis dias, até empurrar/puxar/pernas, com progressão por RIR.",
    subtitulo: "Volume na faixa útil, frequência duas vezes por grupo, e a carga guiada por repetições em reserva.",
    quando: "Você treina na academia de forma constante.",
    pronto: false,
  },
];

/* ============================================================
   NÚCLEO — todo mundo recebe
   ============================================================ */

const NUCLEO: Protocolo[] = [
  {
    codigo: "G1",
    familia: "nucleo",
    arquivo: "g1-afericao.pdf",
    titulo: "Como medir",
    resumo: "Peso, cintura e fotos: o protocolo de aferição que faz o resto dos números valerem.",
    subtitulo: "Um plano de 90 dias decidido por medidas erradas é um plano de 90 dias perdido.",
    quando: "Antes do dia 1, e a cada 30 dias.",
    pronto: false,
  },
  {
    codigo: "G2",
    familia: "nucleo",
    arquivo: "g2-primeiros-7-dias.pdf",
    titulo: "Os primeiros 7 dias",
    resumo: "O que fazer em cada um dos sete primeiros dias — e o que deliberadamente não fazer.",
    subtitulo: "A primeira semana não é para acelerar. É para a segunda existir.",
    quando: "Dias 1 a 7.",
    pronto: false,
  },
  {
    codigo: "G3",
    familia: "nucleo",
    arquivo: "g3-substituicoes.pdf",
    titulo: "Tabela de substituições",
    resumo: "O que trocar por quê, em medidas de casa: concha, palma, colher, punhado.",
    subtitulo: "Ninguém pesa comida no restaurante. Esta tabela é feita para o mundo real.",
    quando: "Sempre que o alimento do plano não estiver disponível.",
    pronto: false,
  },
  {
    codigo: "G4",
    familia: "nucleo",
    arquivo: "g4-registro-de-cargas.pdf",
    titulo: "Registro de cargas",
    resumo: "As folhas de registro das 12 semanas, para imprimir e levar para o treino.",
    subtitulo: "Progressão que não é anotada não é progressão: é memória, e memória é otimista.",
    quando: "Toda sessão, nas 12 semanas.",
    pronto: false,
  },
  {
    codigo: "G5",
    familia: "nucleo",
    arquivo: "g5-plato.pdf",
    titulo: "Quando o peso para",
    resumo: "A escada de ajuste: o que conferir, nesta ordem, antes de cortar mais uma caloria.",
    subtitulo: "Quase todo platô de 90 dias é de medição ou de adesão. O metabolismo é a última suspeita, não a primeira.",
    quando: "Quando a média semanal não se mover por 14 dias.",
    pronto: false,
  },
];

/* `TREINO` entra inteiro: os seus elementos são `Protocolo` com um campo a
   mais, que é só o critério de escolha e não incomoda ninguém a jusante. */
export const PROTOCOLOS: Protocolo[] = [...NUTRICAO, ...TREINO, ...NUCLEO];

/** Procura pelo nome do ficheiro. Devolve `null` para qualquer outra coisa. */
export function porArquivo(arquivo: string): Protocolo | null {
  return PROTOCOLOS.find((p) => p.arquivo === arquivo) ?? null;
}

/* ============================================================
   QUEM RECEBE O QUÊ
   ============================================================ */

const POR_MODO: Record<Modo, string> = {
  perder: "N1",
  ganhar: "N2",
  recomposicao: "N3",
  manter: "N4",
};

/**
 * Os protocolos desta pessoa: um de nutrição, um de treino e o núcleo.
 *
 * São sete de quinze, e a escolha é por situação, não por pacote. Entregar
 * os quinze pareceria mais generoso e seria pior: quem corta não precisa
 * de ler o protocolo de ganho, e um PDF que não se aplica é um PDF que
 * ensina a pessoa a não abrir os outros.
 */
export function paraOPrograma(dados: {
  modo: Modo;
  local: Local;
  experiencia: Experiencia;
}): Protocolo[] {
  const nutricao = POR_MODO[dados.modo];
  const chave: Chave = `${dados.local}-${dados.experiencia}`;
  const treino = TREINO.find((t) => t.chave === chave)?.codigo;

  return PROTOCOLOS.filter(
    (p) =>
      p.familia === "nucleo" || p.codigo === nutricao || p.codigo === treino,
  );
}

/** Quantos já estão escritos, de quantos existem. Para a área de entrega. */
export function prontos(): { feitos: number; total: number } {
  return {
    feitos: PROTOCOLOS.filter((p) => p.pronto).length,
    total: PROTOCOLOS.length,
  };
}
