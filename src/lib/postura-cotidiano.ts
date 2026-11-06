/**
 * Postura do dia a dia — as seis situações em que a população passa mais
 * horas parada, e o ajuste de cada uma.
 *
 * A posição de fundo é a da evidência, não a do senso comum: não existe
 * uma postura "certa" que previna dor, e a associação entre postura
 * estática e dor lombar ou cervical é fraca (Swain et al., 2020; Slater et
 * al., 2019). O que pesa é ficar muito tempo na mesma posição sem a
 * capacidade de sustentá-la. Por isso cada ajuste termina em variação e em
 * exercício, nunca numa pose para manter o dia inteiro.
 *
 * Os exercícios vêm da biblioteca do Raio-X (`postura.ts`) pelo número, e
 * aqui só entram os que servem a qualquer padrão: o 06, o 08 e o 09 ficam
 * de fora porque dependem de saber se a pelve está em anteversão ou em
 * retroversão — e isso só o teste da parede responde.
 */

import { EXERCICIOS, type Exercicio } from "@/lib/postura";

/* ── Figuras ───────────────────────────────────────────────────
   Bonecos de linha no traço das figuras do livro: grafite, juntas em
   ouro, prumo tracejado. viewBox 0 0 200 250, chão em y = 236. */

export type Pose = {
  /** traços do corpo (tronco, membros) */
  corpo: string[];
  cabeca: [number, number];
  /** juntas marcadas em ouro */
  juntas: [number, number][];
  /** objetos de cena que só existem nesta pose (ecrã alto, travesseiro…) */
  cena?: string[];
};

export type Figura = {
  /** cena comum às duas poses (cadeira, mesa, cama, chão) */
  cena: string[];
  errado: Pose;
  certo: Pose;
  /** onde a carga se concentra na pose habitual */
  tensao: [number, number][];
  /** prumo vertical tracejado, em x */
  prumo?: number;
};

/* ── Exercícios extra ──────────────────────────────────────────
   Dois movimentos que a biblioteca do livro não tem e que o cotidiano
   pede: pegar peso e carregar de um lado só. Neutros quanto ao padrão. */

const EXTRA: Exercicio[] = [
  {
    n: "C1",
    nome: "Dobradiça de quadril com bastão",
    dose: "3×10 · lento · diário",
    alvo: "Padrão de pegar peso do chão",
    como: "Bastão nas costas tocando cabeça, entre as escápulas e sacro. Joelhos levemente dobrados, leve o quadril para trás até sentir a parte de trás da coxa, sem perder nenhum dos três contatos. Volte empurrando o chão.",
    falha:
      "Se o bastão descola da cabeça ou do sacro, você dobrou a coluna em vez do quadril. Desça menos.",
    padroes: [],
  },
  {
    n: "C2",
    nome: "Carregamento unilateral (mala)",
    dose: "3×30 m por lado · carga moderada",
    alvo: "Estabilizadores laterais do tronco",
    como: "Um peso numa mão só, braço solto ao lado do corpo. Caminhe devagar com os ombros nivelados e o tronco sem inclinar para nenhum dos lados.",
    falha:
      "Se o ombro do lado do peso cai ou o tronco inclina para o lado oposto, a carga está alta demais. É exatamente a compensação que a bolsa no ombro ensina.",
    padroes: [],
  },
];

const TODOS = [...EXERCICIOS, ...EXTRA];

export function exercicio(n: string): Exercicio {
  const e = TODOS.find((x) => x.n === n);
  if (!e) throw new Error(`Exercício ${n} não existe`);
  return e;
}

/* ── Situações ─────────────────────────────────────────────── */

export type Situacao = {
  id: string;
  n: string;
  titulo: string;
  /** rótulo curto para a navegação em chips */
  curto: string;
  frase: string;
  /** onde as pessoas sentem */
  incomoda: string[];
  oQueAcontece: string;
  ajustes: { titulo: string; texto: string }[];
  /** a regra que vale mais que qualquer ajuste */
  regra: string;
  exercicios: string[];
  figura: Figura;
};

export const SITUACOES: Situacao[] = [
  {
    id: "computador",
    n: "01",
    titulo: "Sentado no computador",
    curto: "Computador",
    frase: "Oito horas de tela e a cabeça vai, centímetro a centímetro, ao encontro dela.",
    incomoda: ["Pescoço", "Entre as escápulas", "Lombar"],
    oQueAcontece:
      "Com a tela baixa, a cabeça avança e o tronco arredonda para alcançá-lo. A pelve escorrega para a frente do assento e a lombar perde o apoio do encosto. A posição em si não lesiona; o desconforto vem de sustentá-la por horas sem trocar.",
    ajustes: [
      {
        titulo: "Tela na altura dos olhos",
        texto: "O topo do monitor na linha dos olhos, a um braço de distância. No notebook, suporte e teclado separado.",
      },
      {
        titulo: "Quadril no fundo da cadeira",
        texto: "Sente com o quadril encostado no encosto, pés inteiros no chão e joelhos na altura do quadril ou pouco abaixo.",
      },
      {
        titulo: "Cotovelos perto do corpo",
        texto: "Antebraços apoiados na mesa, cotovelos perto de 90°. Ombros soltos, sem subir em direção às orelhas.",
      },
    ],
    regra: "Levante a cada 30 a 45 minutos. A melhor postura é a próxima.",
    exercicios: ["01", "02", "03"],
    figura: {
      prumo: undefined,
      cena: [
        // mesa
        "M128 150 H196",
        "M188 150 V236",
        // cadeira
        "M52 166 H112",
        "M84 166 V236",
        "M66 236 H102",
        "M54 166 L50 104",
      ],
      errado: {
        cena: ["M150 150 L176 146", "M176 146 L186 118"],
        cabeca: [138, 98],
        corpo: [
          "M98 160 C74 140 80 108 120 102",
          "M120 102 L128 102",
          "M114 104 L124 136 L156 146",
          "M98 160 L142 166 L142 232 L156 234",
        ],
        juntas: [
          [98, 160],
          [114, 104],
          [142, 166],
        ],
      },
      certo: {
        cena: ["M172 150 V112", "M164 112 L168 66", "M150 150 H178"],
        cabeca: [76, 70],
        corpo: [
          "M64 160 C58 138 60 110 70 88",
          "M70 88 L72 84",
          "M68 96 L74 134 L124 146",
          "M64 160 L116 164 L116 232 L130 234",
        ],
        juntas: [
          [64, 160],
          [68, 96],
          [116, 164],
        ],
      },
      tensao: [
        [122, 96],
        [96, 116],
        [90, 152],
      ],
    },
  },
  {
    id: "celular",
    n: "02",
    titulo: "Olhando o celular",
    curto: "Celular",
    frase: "A cabeça pesa uns cinco quilos. Inclinada para a tela, o pescoço sustenta bem mais que isso.",
    incomoda: ["Nuca", "Topo dos ombros", "Dor de cabeça"],
    oQueAcontece:
      "Olhar para baixo flexiona o pescoço e tira a cabeça da linha do tronco. Quanto maior o ângulo, maior a alavanca que os músculos da nuca seguram. Por minutos é irrelevante; por horas seguidas, todos os dias, é a origem mais comum da tensão na base do crânio.",
    ajustes: [
      {
        titulo: "Suba a tela, não desça a cabeça",
        texto: "Traga o celular para perto da altura dos olhos. Os olhos descem, o pescoço fica.",
      },
      {
        titulo: "Cotovelo apoiado",
        texto: "Encoste o cotovelo no tronco ou apoie o braço na outra mão. Sem apoio, o braço cansa e o celular volta a descer.",
      },
      {
        titulo: "Recue o queixo de vez em quando",
        texto: "Um chin tuck a cada tanto devolve a cabeça para cima dos ombros. Sem forçar, sem olhar para cima.",
      },
    ],
    regra: "Não é proibido olhar para baixo. É caro fazer isso por horas.",
    exercicios: ["01", "03", "11"],
    figura: {
      prumo: 100,
      cena: ["M40 236 H160"],
      errado: {
        cena: ["M124 132 L138 126"],
        cabeca: [124, 66],
        corpo: [
          "M100 134 C96 112 100 92 112 80",
          "M100 134 L102 184 L100 232 L116 234",
          "M108 86 L106 122 L130 130",
        ],
        juntas: [
          [100, 134],
          [108, 86],
          [102, 184],
        ],
      },
      certo: {
        cena: ["M124 64 L130 46"],
        cabeca: [101, 50],
        corpo: [
          "M100 134 C98 112 98 92 100 72",
          "M100 134 L102 184 L100 232 L116 234",
          "M100 80 L102 112 L126 60",
        ],
        juntas: [
          [100, 134],
          [100, 80],
          [102, 184],
        ],
      },
      tensao: [
        [110, 76],
        [104, 86],
      ],
    },
  },
  {
    id: "em-pe",
    n: "03",
    titulo: "Em pé por muito tempo",
    curto: "Em pé",
    frase: "Fila, balcão, cozinha: o corpo procura descanso pendurado num lado só.",
    incomoda: ["Lombar", "Lateral do quadril", "Pés"],
    oQueAcontece:
      "Para poupar energia, o peso vai todo para uma perna e o quadril do outro lado cai. A lombar inclina para compensar e os ligamentos seguram o que os músculos deixaram de segurar. Não é errado descansar numa perna — é ficar sempre na mesma.",
    ajustes: [
      {
        titulo: "Alterne a perna de apoio",
        texto: "Troque de lado com frequência. A assimetria só pesa quando é sempre a mesma.",
      },
      {
        titulo: "Um pé num degrau",
        texto: "Um apoio baixo, de 10 a 20 cm, alivia a lombar em quem fica muito tempo em pé. Troque o pé de tempos em tempos.",
      },
      {
        titulo: "Mexa-se no lugar",
        texto: "Pequenas transferências de peso, subir na ponta dos pés, dobrar os joelhos. Movimento barato e constante.",
      },
    ],
    regra: "Em pé ou sentado, o problema é o mesmo: tempo parado.",
    exercicios: ["07", "10"],
    figura: {
      prumo: 100,
      cena: ["M30 236 H170"],
      errado: {
        cabeca: [96, 38],
        corpo: [
          "M74 70 L120 62",
          "M98 66 C100 90 104 112 102 132",
          "M84 128 L120 140",
          "M118 139 L114 236",
          "M86 128 L76 182 L90 234",
          "M74 70 L68 130",
          "M120 62 L128 124",
        ],
        juntas: [
          [84, 128],
          [120, 140],
          [74, 70],
          [120, 62],
        ],
      },
      certo: {
        cena: ["M118 236 V212 H160 V236"],
        cabeca: [100, 38],
        corpo: [
          "M76 66 L124 66",
          "M100 66 L100 132",
          "M82 132 L118 132",
          "M84 132 L86 236",
          "M116 132 L132 178 L132 212",
          "M76 66 L70 128",
          "M124 66 L130 128",
        ],
        juntas: [
          [82, 132],
          [118, 132],
          [76, 66],
          [124, 66],
        ],
      },
      tensao: [
        [104, 112],
        [120, 140],
      ],
    },
  },
  {
    id: "bolsa",
    n: "04",
    titulo: "Bolsa num ombro só",
    curto: "Bolsa",
    frase: "O ombro sobe para segurar a alça. O tronco inclina para equilibrar o peso.",
    incomoda: ["Topo do ombro", "Pescoço", "Lado da cintura"],
    oQueAcontece:
      "Para a alça não escorregar, o trapézio superior eleva o ombro e fica contraído o trajeto inteiro. O tronco inclina para o lado oposto para equilibrar a carga. Com peso leve e de vez em quando, nada demais; com o notebook todo dia e sempre no mesmo ombro, vira padrão.",
    ajustes: [
      {
        titulo: "Mochila nos dois ombros",
        texto: "Alças ajustadas para a mochila ficar colada às costas, com o fundo na altura da cintura.",
      },
      {
        titulo: "Se for bolsa, alterne",
        texto: "Troque de ombro ou de mão a cada trecho. Alça transversal distribui melhor que alça curta num ombro.",
      },
      {
        titulo: "Carregue menos",
        texto: "Esvazie o que não precisa. Uma referência prática: até cerca de 10 % do peso corporal.",
      },
    ],
    regra: "Assimetria de vez em quando é treino. Todo dia do mesmo lado é hábito.",
    exercicios: ["C2", "10"],
    figura: {
      prumo: 100,
      cena: ["M30 236 H170"],
      errado: {
        cena: ["M76 60 L58 128", "M48 128 H72 L76 162 H44 Z"],
        cabeca: [104, 34],
        corpo: [
          "M76 60 L124 70",
          "M100 64 C98 90 96 112 98 132",
          "M80 132 L116 132",
          "M82 132 L82 236",
          "M114 132 L116 236",
          "M76 60 L64 124",
          "M124 70 L134 130",
        ],
        juntas: [
          [76, 60],
          [124, 70],
          [80, 132],
          [116, 132],
        ],
      },
      certo: {
        cena: ["M82 68 C86 92 88 108 90 126", "M118 68 C114 92 112 108 110 126"],
        cabeca: [100, 38],
        corpo: [
          "M76 66 L124 66",
          "M100 66 L100 132",
          "M82 132 L118 132",
          "M84 132 L84 236",
          "M116 132 L116 236",
          "M76 66 L70 128",
          "M124 66 L130 128",
        ],
        juntas: [
          [76, 66],
          [124, 66],
          [82, 132],
          [118, 132],
        ],
      },
      tensao: [
        [82, 54],
        [112, 100],
      ],
    },
  },
  {
    id: "pegar-peso",
    n: "05",
    titulo: "Pegando peso do chão",
    curto: "Pegar peso",
    frase: "A caixa longe, as pernas esticadas, a coluna fazendo o trabalho do quadril.",
    incomoda: ["Lombar", "Parte de trás da coxa"],
    oQueAcontece:
      "Com a carga longe dos pés e os joelhos travados, a alavanca sobre a lombar cresce e quem levanta é a coluna. Dobrar a coluna não é proibido — ela foi feita para isso. O risco aparece quando a carga é pesada, distante e chega sem aviso, num corpo que não treina esse movimento.",
    ajustes: [
      {
        titulo: "Traga a carga para perto",
        texto: "Aproxime-se até a caixa ficar entre os pés ou colada às canelas. Distância é alavanca.",
      },
      {
        titulo: "Dobre quadril e joelhos",
        texto: "Leve o quadril para trás e desça com os joelhos dobrados. O peito aponta para a frente, não para o chão.",
      },
      {
        titulo: "Não gire com peso",
        texto: "Levante primeiro, depois vire com os pés. Rodar o tronco carregado é a combinação que mais incomoda.",
      },
    ],
    regra: "A coluna aguenta muito. Aguenta mais quando o quadril também trabalha.",
    exercicios: ["C1", "10"],
    figura: {
      cena: ["M20 236 H190"],
      errado: {
        cena: ["M144 210 H178 V236 H144 Z"],
        cabeca: [140, 132],
        corpo: [
          "M72 120 C96 92 128 100 134 124",
          "M72 120 L74 178 L76 232 L92 234",
          "M126 112 L140 156 L150 208",
        ],
        juntas: [
          [72, 120],
          [126, 112],
          [74, 178],
        ],
      },
      certo: {
        cena: ["M104 210 H138 V236 H104 Z"],
        cabeca: [136, 108],
        corpo: [
          "M76 170 C90 152 106 134 122 122",
          "M76 170 L118 178 L102 232 L118 234",
          "M118 126 L122 168 L122 208",
        ],
        juntas: [
          [76, 170],
          [118, 126],
          [118, 178],
        ],
      },
      tensao: [
        [78, 112],
        [100, 100],
      ],
    },
  },
  {
    id: "dormir",
    n: "06",
    titulo: "Dormindo de lado",
    curto: "Dormir",
    frase: "Travesseiro baixo, cabeça caindo, joelho de cima puxando o quadril.",
    incomoda: ["Pescoço ao acordar", "Ombro de baixo", "Lombar"],
    oQueAcontece:
      "Com o travesseiro mais baixo que a largura do ombro, a cabeça pende e o pescoço passa a noite inclinado. O joelho de cima cai para a frente e roda a pelve sobre a lombar. Ninguém dorme imóvel, e não existe posição perfeita para dormir — mas esses dois detalhes acordam muita gente com dor.",
    ajustes: [
      {
        titulo: "Travesseiro na altura do ombro",
        texto: "A altura certa preenche o espaço entre a orelha e o colchão. A cabeça fica na linha do tronco, nem pendendo, nem empurrada para cima.",
      },
      {
        titulo: "Um travesseiro entre os joelhos",
        texto: "Mantém o joelho de cima alinhado com o quadril e tira a torção da pelve.",
      },
      {
        titulo: "De barriga para cima, um apoio sob os joelhos",
        texto: "Se dorme de costas, um travesseiro sob os joelhos relaxa a lombar.",
      },
    ],
    regra: "Durma na posição que te deixa dormir. Ajuste os apoios, não a pessoa.",
    exercicios: ["11", "05"],
    figura: {
      // Deitado de lado, visto de frente: a linha da coluna é horizontal.
      cena: ["M10 200 H194", "M10 200 V216", "M194 200 V216", "M10 216 H194"],
      errado: {
        cena: ["M14 199 C20 194 50 194 56 199"],
        cabeca: [32, 186],
        corpo: [
          "M44 190 C50 182 58 180 66 180 H128",
          "M128 186 L160 190 L188 193",
          "M128 180 L156 196 L184 186",
          "M66 182 L84 196 L104 195",
        ],
        juntas: [
          [66, 180],
          [128, 180],
          [156, 196],
        ],
      },
      certo: {
        cena: [
          "M12 199 C12 178 56 176 60 199",
          "M150 186 C150 180 166 180 166 186 C166 191 150 191 150 186",
        ],
        cabeca: [36, 177],
        corpo: [
          "M49 178 C54 180 60 180 66 180 H128",
          "M128 186 L160 192 L188 193",
          "M128 180 L160 180 L188 182",
          "M66 182 L84 196 L104 195",
        ],
        juntas: [
          [66, 180],
          [128, 180],
          [160, 180],
        ],
      },
      tensao: [
        [46, 186],
        [134, 186],
      ],
    },
  },
];

/* ── Rotina de 5 minutos ───────────────────────────────────── */

export const ROTINA = {
  titulo: "A pausa de cinco minutos",
  texto:
    "Uma sequência para fazer em pé ou no chão, entre um bloco de trabalho e outro. Não corrige nada sozinha; tira o corpo da posição em que estava, que é metade do trabalho.",
  passos: [
    { tempo: "1 min", exercicio: "01" },
    { tempo: "1 min", exercicio: "03" },
    { tempo: "1 min", exercicio: "11" },
    { tempo: "1 min", exercicio: "05" },
    { tempo: "1 min", exercicio: "10" },
  ],
} as const;

export const PRINCIPIO = {
  titulo: "A melhor postura é a próxima.",
  texto:
    "Não existe uma posição perfeita que proteja a coluna. Os estudos que comparam postura e dor encontram relação fraca. O que separa quem sente de quem não sente é passar horas na mesma posição sem força para sustentá-la. O ajuste ajuda; o movimento e o exercício resolvem.",
} as const;
