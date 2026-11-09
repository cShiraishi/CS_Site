/**
 * Receitas Fit — Arquitetura estilo Netflix orientada por
 * ASSUNTOS DE INTERESSE DO USUÁRIO.
 *
 * Na Netflix, um mesmo vídeo pode responder a várias dores/interesses
 * de quem abre o catálogo (ex.: "Substitutos do Pão", "+30g Proteína",
 * "Prontas em 5 Minutos", "Receitas com Aveia").
 *
 * Regras do catálogo:
 *  1. A 1ª fileira é sempre "Top Mais Assistidos" (ordenada por `views`).
 *  2. Cada pílula dourada no topo e cada fileira horizontal representa
 *     um assunto real de interesse de quem quer emagrecer sem dieta extrema.
 *  3. Dentro de qualquer assunto, os vídeos também aparecem ordenados
 *     do mais visto para o menos visto.
 */

export type MacrosReceita = {
  kcal: number;
  proteina: number;
  carbo: number;
  gordura: number;
  fibras: number;
};

export type IngredienteReceita = {
  item: string;
  medida: string;
};

export type AlimentoBase =
  | "aveia"
  | "tapioca"
  | "ovos-iogurte"
  | "frutas-gelatina";

export type InteresseId =
  | "menos-100-kcal"
  | "vontade-de-doce"
  | "substitutos-do-pao"
  | "mais-30g-proteina"
  | "ate-5-min"
  | "com-aveia"
  | "com-tapioca";

export type AssuntoInteresse = {
  id: InteresseId;
  pilula: string;
  tituloTrilha: string;
  descricao: string;
};

/**
 * Os assuntos de interesse do usuário: alimentam tanto as pílulas douradas
 * no topo quanto as fileiras horizontais da página (estilo Netflix).
 */
export const ASSUNTOS_INTERESSE: AssuntoInteresse[] = [
  {
    id: "menos-100-kcal",
    pilula: "🍓 Sobremesas < 100 kcal",
    tituloTrilha: "🍓 Sobremesas com menos de 100 kcal",
    descricao:
      "Mousses, pudins, maçã na Airfryer e sorvetes de 68 a 95 kcal para comer doce todos os dias sem mexer no déficit.",
  },
  {
    id: "vontade-de-doce",
    pilula: "🍫 Matar Vontade de Doce",
    tituloTrilha: "🍫 Para Matar a Vontade de Doce (Sem Sair da Dieta)",
    descricao:
      "Bolos de caneca, brownies, cookies e overnight oats que substituem o doce calórico da noite ou da tarde.",
  },
  {
    id: "substitutos-do-pao",
    pilula: "🥖 Substitutos do Pão",
    tituloTrilha: "🥖 Substitutos do Pão para o Café da Manhã",
    descricao:
      "Pão de queijo de frigideira, crepiocas e panquecas que entregam muito mais proteína e saciedade que o pão francês.",
  },
  {
    id: "mais-30g-proteina",
    pilula: "💪 +30g Proteína",
    tituloTrilha: "💪 +30g de Proteína na Mesma Refeição",
    descricao:
      "Refeições e lanches doces ou salgados que batem a meta proteica de uma vez sem depender só de frango grelhado.",
  },
  {
    id: "ate-5-min",
    pilula: "⚡ Prontas em 5 min",
    tituloTrilha: "⚡ Prontas em até 5 Minutos (Rotina Corrida)",
    descricao:
      "Zero tempo para cozinhar: receitas de micro-ondas, liquidificador ou 1 frigideira.",
  },
  {
    id: "com-aveia",
    pilula: "🌾 Receitas com Aveia",
    tituloTrilha: "🌾 Explorar Aveia · Panquecas, Bolos & Doces Fit",
    descricao:
      "Como usar a fibra solúvel (β-glucana) da aveia para ter saciedade prolongada em preparos doces e panquecas.",
  },
  {
    id: "com-tapioca",
    pilula: "🫓 Tapioca & Crepioca",
    tituloTrilha: "🫓 Explorar Tapioca & Crepioca · Sem Glúten",
    descricao:
      "A combinação certa de goma de tapioca com ovos e queijos magros para não dar pico glicêmico.",
  },
];

export const PILULAS_FILTRO: { id: "todas" | InteresseId; rotulo: string }[] = [
  { id: "todas", rotulo: "🔥 Top Mais Vistos" },
  ...ASSUNTOS_INTERESSE.map((a) => ({ id: a.id, rotulo: a.pilula })),
];

export type PilulaFiltroId = "todas" | InteresseId;

export type Receita = {
  id: string;
  titulo: string;
  subtitulo: string;
  alimento: AlimentoBase;
  interesses: InteresseId[];
  tempo: string;
  minutos: number;
  porcoes: string;
  momento: string;
  /** Número real de visualizações no YouTube para ordenação automática */
  views: number;
  destaque?: boolean;
  novidade?: boolean;
  /** ID do vídeo no YouTube (11 caracteres). */
  videoId: string;
  corAcento: string;
  macros: MacrosReceita;
  ingredientes: IngredienteReceita[];
  preparo: string[];
  /** Explicação rápida sob a ótica de Ciência de Alimentos. */
  ciencia: string;
};

export type TrilhaReceitas = {
  id: string;
  nome: string;
  descricao: string;
  ranking?: boolean;
  receitas: Receita[];
};

export function formatarViews(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(".", ",")} mi views`;
  }
  if (views >= 1_000) {
    return `${Math.round(views / 1_000).toLocaleString("pt-BR")} mil views`;
  }
  return `${views} views`;
}

export const CATALOGO_RECEITAS: Receita[] = [
  /* ── SOBREMESAS COM MENOS DE 100 KCAL ─────────────────────────────── */
  {
    id: "mousse-limao-zero-85kcal",
    titulo: "Mousse Aerada de Limão Zero Açúcar (85 kcal por Taça)",
    subtitulo:
      "Quase 1,9 milhão de visualizações: 3 ingredientes, acidez que corta a vontade de doce na hora e menos de 90 kcal.",
    alimento: "ovos-iogurte",
    interesses: ["menos-100-kcal", "vontade-de-doce", "ate-5-min"],
    tempo: "4 min",
    minutos: 4,
    porcoes: "1 taça generosa (85 kcal)",
    momento: "Pós-almoço · Ceia leve",
    views: 1_898_675,
    videoId: "ruuuH9WnRSY",
    novidade: true,
    corAcento: "#a3d977",
    macros: {
      kcal: 85,
      proteina: 11,
      carbo: 6,
      gordura: 1,
      fibras: 1,
    },
    ingredientes: [
      { item: "Iogurte natural desnatado ou grego zero", medida: "120 g" },
      { item: "Suco de limão taiti espremido na hora", medida: "30 ml (1 limão)" },
      { item: "Gelatina zero sabor limão hidratada ou leite em pó desnatado", medida: "1 col. sopa" },
      { item: "Raspas de limão e gotas de adoçante", medida: "a gosto" },
    ],
    preparo: [
      "Bata o iogurte desnatado bem gelado com o suco de limão e a gelatina zero dissolvida em 2 colheres de água morna.",
      "Bata por 1 minuto no mixer ou liquidificador para incorporar ar e dobrar de volume.",
      "Leve à geladeira por 20 minutos e finalize com raspas da parte verde do limão.",
    ],
    ciencia:
      "O ácido cítrico do limão coagula parcialmente as caseínas do iogurte, engrossando o creme sem precisar de creme de leite ou leite condensado.",
  },
  {
    id: "maca-assada-airfryer-canela-95kcal",
    titulo: "Maçã Caramelizada na Airfryer com Canela (95 kcal)",
    subtitulo:
      "Mais de 1,8 milhão de views: cheiro de torta de maçã saída do forno, quentinha e com menos de 100 calorias.",
    alimento: "frutas-gelatina",
    interesses: ["menos-100-kcal", "vontade-de-doce"],
    tempo: "8 min",
    minutos: 8,
    porcoes: "1 maçã inteira assada (95 kcal)",
    momento: "Noite · Vontade de doce quente",
    views: 1_835_835,
    videoId: "ou_9vo548wg",
    novidade: true,
    corAcento: "#d49a54",
    macros: {
      kcal: 95,
      proteina: 1,
      carbo: 22,
      gordura: 0,
      fibras: 4,
    },
    ingredientes: [
      { item: "Maçã Fuji ou Gala média", medida: "1 unidade (150 g)" },
      { item: "Canela do Ceilão em pó", medida: "1 col. chá generosa" },
      { item: "Gotas de limão e eritritol/adoçante", medida: "a gosto" },
      { item: "Extrato de baunilha", medida: "3 gotas" },
    ],
    preparo: [
      "Corte a maçã ao meio ou em fatias grossas mantendo a casca (onde se concentra a pectina).",
      "Polvilhe canela, baunilha e gotas de limão.",
      "Asse na Airfryer a 180 °C por 7 a 8 minutos até a superfície caramelizar nos próprios açúcares da fruta.",
    ],
    ciencia:
      "O calor concentra a frutose natural na superfície da maçã e libera o cinamaldeído da canela, ativando receptores de dulçor com apenas 95 kcal.",
  },
  {
    id: "pudim-fit-zero-acucar-90kcal",
    titulo: "Pudim Fit Cremoso Sem Açúcar e Sem Leite Condensado (90 kcal)",
    subtitulo:
      "Mais de 1,5 milhão de visualizações: textura lisa de pudim tradicional com apenas 90 kcal por fatia.",
    alimento: "ovos-iogurte",
    interesses: ["menos-100-kcal", "vontade-de-doce", "ate-5-min"],
    tempo: "5 min (+ geladeira)",
    minutos: 5,
    porcoes: "1 fatia generosa (90 kcal)",
    momento: "Sobremesa de domingo · Cutting",
    views: 1_545_552,
    videoId: "Ka8hT39V3u4",
    corAcento: "#e0a958",
    macros: {
      kcal: 90,
      proteina: 9,
      carbo: 7,
      gordura: 3,
      fibras: 0,
    },
    ingredientes: [
      { item: "Ovos inteiros", medida: "2 unidades" },
      { item: "Leite desnatado", medida: "200 ml" },
      { item: "Leite em pó desnatado ou whey baunilha", medida: "2 col. sopa" },
      { item: "Essência de baunilha e adoçante culinário", medida: "1 col. sopa" },
    ],
    preparo: [
      "Bata todos os ingredientes no liquidificador por 2 minutos com a baunilha.",
      "Despeje em ramequins individuais e cozinhe no micro-ondas em potência média por 3 a 4 minutos (ou banho-maria).",
      "Leve para gelar até firmar completamente.",
    ],
    ciencia:
      "A albumina e a ovotransferrina do ovo formam uma rede tridimensional que retém o leite desnatado, dando corte de pudim sem uma gota de açúcar.",
  },
  {
    id: "brigadeiro-colher-cacau-92kcal",
    titulo: "Creme / Brigadeiro de Colher Zero Açúcar em 5 Minutos (92 kcal)",
    subtitulo:
      "Quase 950 mil views: feito com cacau 100% para quando você precisa de chocolate intenso gastando menos de 100 kcal.",
    alimento: "ovos-iogurte",
    interesses: ["menos-100-kcal", "vontade-de-doce", "ate-5-min"],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 porção de colher (92 kcal)",
    momento: "TPM · Vontade de chocolate",
    views: 945_626,
    videoId: "ejHI8v7rQ5U",
    corAcento: "#8c583a",
    macros: {
      kcal: 92,
      proteina: 10,
      carbo: 8,
      gordura: 2,
      fibras: 3,
    },
    ingredientes: [
      { item: "Cacau em pó 100% alcalino", medida: "10 g (1 col. sopa)" },
      { item: "Leite em pó desnatado ou whey chocolate", medida: "15 g (1 ½ col. sopa)" },
      { item: "Água fervente ou leite desnatado", medida: "40 ml" },
      { item: "Adoçante a gosto", medida: "gotas" },
    ],
    preparo: [
      "Misture o cacau 100%, o leite em pó desnatado e o adoçante.",
      "Adicione a água quente aos poucos, batendo vigorosamente com colher ou mini mixer até virar um creme brilhante.",
      "Leve ao congelador por 10 minutos para ganhar ponto de brigadeiro de colher.",
    ],
    ciencia:
      "A emulsão das proteínas do leite desnatado com as partículas finas do cacau alcalino cria viscosidade de ganache sem manteiga.",
  },
  {
    id: "mousse-morango-gelatina-75kcal",
    titulo: "Mousse de Morango de 3 Ingredientes (Só 75 kcal por Taça)",
    subtitulo:
      "Mais de 530 mil views: você pode comer uma taça grande inteira à noite por apenas 75 calorias e 12 g de proteína.",
    alimento: "frutas-gelatina",
    interesses: ["menos-100-kcal", "vontade-de-doce", "ate-5-min"],
    tempo: "4 min",
    minutos: 4,
    porcoes: "1 taça grande (75 kcal)",
    momento: "Ceia · Reta final de cutting",
    views: 531_946,
    videoId: "RXf-opZC7O0",
    novidade: true,
    corAcento: "#d16b7c",
    macros: {
      kcal: 75,
      proteina: 12,
      carbo: 5,
      gordura: 0,
      fibras: 1,
    },
    ingredientes: [
      { item: "Gelatina zero açúcar sabor morango ou framboesa", medida: "1 pacote" },
      { item: "Água fervente", medida: "100 ml" },
      { item: "Iogurte natural desnatado ou proteína isolada", medida: "100 g" },
      { item: "Morangos picados", medida: "40 g" },
    ],
    preparo: [
      "Dissolva a gelatina zero na água fervente.",
      "Bata no liquidificador com o iogurte desnatado bem gelado e pedras de gelo por 2 minutos.",
      "Distribua em taças com pedacinhos de morango e gele por 30 minutos.",
    ],
    ciencia:
      "O colágeno hidrolisado da gelatina zero aprisiona ar quando batido com gelo e iogurte, gerando 300 ml de volume gástrico com apenas 75 kcal.",
  },
  {
    id: "sorvete-fluff-morango-68kcal",
    titulo: "Sorvete Cremoso / Fluff Zero Açúcar e Zero Gordura (68 kcal)",
    subtitulo:
      "Pronto em 3 minutos com frutas congeladas: um pote cheio de sorvete cremoso com menos de 70 calorias.",
    alimento: "frutas-gelatina",
    interesses: ["menos-100-kcal", "vontade-de-doce", "ate-5-min"],
    tempo: "3 min",
    minutos: 3,
    porcoes: "1 bowl cheio (68 kcal)",
    momento: "Calor · Sobremesa livre",
    views: 311_202,
    videoId: "fIG44x5YD4s",
    corAcento: "#e06377",
    macros: {
      kcal: 68,
      proteina: 8,
      carbo: 9,
      gordura: 0,
      fibras: 2,
    },
    ingredientes: [
      { item: "Morangos congelados", medida: "120 g" },
      { item: "Clara de ovo pasteurizada ou 50 g de iogurte zero", medida: "50 g" },
      { item: "Gotas de limão e adoçante", medida: "a gosto" },
    ],
    preparo: [
      "Processe os morangos congelados com o iogurte zero (ou clara pasteurizada) e o adoçante.",
      "Bata por 2 a 3 minutos até incorporar ar e dobrar de tamanho na textura de sorvete italiano.",
    ],
    ciencia:
      "Os microcristais de gelo do morango congelado quebram as proteínas em espuma estável (overrun), entregando volume máximo por caloria.",
  },

  /* ── AVEIA · DOCES FIT ────────────────────────────────────────────── */
  {
    id: "overnight-oats-cheesecake-morango",
    titulo: "Overnight Oats Cremoso (Aveia Adormecida de Morango)",
    subtitulo:
      "Mais de 15 milhões de visualizações: você monta em 3 minutos à noite e acorda com uma sobremesa gelada e proteica pronta na geladeira.",
    alimento: "aveia",
    interesses: [
      "vontade-de-doce",
      "mais-30g-proteina",
      "ate-5-min",
      "com-aveia",
      "substitutos-do-pao",
    ],
    tempo: "3 min (+ geladeira)",
    minutos: 3,
    porcoes: "1 pote",
    momento: "Café da manhã · Lanche pronto",
    views: 15_687_489,
    videoId: "Lkl9_3-jX6c",
    destaque: true,
    novidade: true,
    corAcento: "#d16b7c",
    macros: {
      kcal: 350,
      proteina: 30,
      carbo: 41,
      gordura: 6,
      fibras: 7,
    },
    ingredientes: [
      { item: "Aveia em flocos finos", medida: "35 g (3 ½ col. sopa)" },
      { item: "Iogurte natural desnatado ou skyr", medida: "120 g" },
      { item: "Whey protein baunilha ou leite em pó", medida: "20 g" },
      { item: "Creme de ricota light (camada cheesecake)", medida: "25 g (1 col. sopa)" },
      { item: "Morangos picados", medida: "80 g" },
      { item: "Sementes de chia", medida: "5 g (1 col. chá)" },
    ],
    preparo: [
      "No fundo de um pote de vidro, misture a aveia, a chia, o whey e 80 g do iogurte.",
      "Bata o restante do iogurte (40 g) com o creme de ricota light e gotas de baunilha para fazer o creme branco do topo.",
      "Cubra com os morangos picados.",
      "Tampe e deixe na geladeira por pelo menos 4 horas (ou da noite para o dia).",
    ],
    ciencia:
      "Na hidratação a frio durante a noite, o amido da aveia e a mucilagem da chia absorvem o soro do iogurte e criam textura de pudim sem ir ao fogo.",
  },
  {
    id: "bolo-aveia-banana-4-ingredientes",
    titulo: "Bolo Rápido de Aveia com Banana e Canela (Sem Farinha e Sem Açúcar)",
    subtitulo:
      "Quase 10 milhões de visualizações: só 4 ingredientes base, úmido por dentro e perfeito para substituir o pão ou bolo tradicional.",
    alimento: "aveia",
    interesses: ["vontade-de-doce", "substitutos-do-pao", "com-aveia"],
    tempo: "10 min",
    minutos: 10,
    porcoes: "1 porção individual",
    momento: "Café da manhã · Café da tarde",
    views: 9_809_481,
    videoId: "7wJ0no6jIZ8",
    novidade: true,
    corAcento: "#c7a06a",
    macros: {
      kcal: 340,
      proteina: 24,
      carbo: 42,
      gordura: 8,
      fibras: 6,
    },
    ingredientes: [
      { item: "Aveia em flocos finos", medida: "35 g (3 ½ col. sopa)" },
      { item: "Banana nanica bem madura", medida: "1 unidade média (80 g)" },
      { item: "Ovos inteiros", medida: "2 unidades" },
      { item: "Canela em pó e fermento", medida: "1 col. café" },
      { item: "Whey protein baunilha (opcional p/ bater proteína)", medida: "15 g" },
    ],
    preparo: [
      "Amasse bem a banana madura com um garfo até virar um creme liso.",
      "Bata os ovos junto com a banana e incorpore a aveia, a canela e o whey.",
      "Adicione o fermento por último e leve ao micro-ondas por 2 minutos ou Airfryer a 180 °C por 8 minutos.",
    ],
    ciencia:
      "A banana madura converte amido em açúcares simples naturais, adoçando a massa sem sacarose enquanto a aveia estrutura o bolo sem glúten.",
  },
  {
    id: "brownie-fit-aveia-cacau",
    titulo: "Sobremesa Cremosa / Brownie de Aveia, Banana e Cacau 100%",
    subtitulo:
      "Mais de 7,6 milhões de views: textura densa de chocolate verdadeiro, sem farinha branca e sem açúcar refinado.",
    alimento: "aveia",
    interesses: ["vontade-de-doce", "com-aveia"],
    tempo: "10 min",
    minutos: 10,
    porcoes: "1 porção generosa",
    momento: "Vontade de doce · Pós-jantar",
    views: 7_650_348,
    videoId: "AFC52eKyidA",
    novidade: true,
    corAcento: "#8c583a",
    macros: {
      kcal: 355,
      proteina: 27,
      carbo: 39,
      gordura: 9,
      fibras: 7,
    },
    ingredientes: [
      { item: "Farinha ou flocos finos de aveia", medida: "30 g (3 col. sopa)" },
      { item: "Banana nanica bem madura", medida: "1 unidade média (75 g)" },
      { item: "Ovo inteiro", medida: "1 unidade" },
      { item: "Cacau em pó 100%", medida: "12 g (1 col. sopa cheia)" },
      { item: "Whey protein de chocolate", medida: "15 g (½ scoop)" },
      { item: "Gotas de chocolate 70% ou castanhas", medida: "8 g" },
    ],
    preparo: [
      "Misture a banana bem amassada com o ovo até ficar uniforme.",
      "Adicione o cacau 100%, a aveia e o whey (sem fermento, para manter a textura densa de brownie).",
      "Despeje em forminha pequena e leve à Airfryer a 170 °C por 8 minutos (ou micro-ondas por 90 segundos).",
    ],
    ciencia:
      "A pectina da banana madura junto à β-glucana da aveia segura a água na matriz da massa e garante o interior úmido estilo fudgy.",
  },
  {
    id: "cookie-aveia-banana-chocolate",
    titulo: "Cookies Crocantes de Aveia, Banana e Gotas de Chocolate 70%",
    subtitulo:
      "Mais de 2,1 milhões de visualizações: 4 ingredientes base e 8 minutos de preparo para ter doce limpo na semana.",
    alimento: "aveia",
    interesses: ["vontade-de-doce", "com-aveia"],
    tempo: "10 min",
    minutos: 10,
    porcoes: "3 cookies grandes",
    momento: "Café da tarde · Pré-treino",
    views: 2_143_423,
    videoId: "15oUot2k2kA",
    corAcento: "#b8824c",
    macros: {
      kcal: 340,
      proteina: 18,
      carbo: 44,
      gordura: 10,
      fibras: 6,
    },
    ingredientes: [
      { item: "Aveia em flocos grossos ou médios", medida: "40 g (4 col. sopa)" },
      { item: "Banana bem madura amassada", medida: "1 unidade média (80 g)" },
      { item: "Pasta de amendoim integral", medida: "10 g (1 col. chá cheia)" },
      { item: "Whey protein baunilha ou canela", medida: "15 g (½ scoop)" },
      { item: "Chocolate 70% picado", medida: "12 g" },
    ],
    preparo: [
      "Amasse a banana com a pasta de amendoim até formar um creme homogêneo.",
      "Incorpore a aveia em flocos e o whey protein — a massa deve ficar moldável com colher.",
      "Modele 3 discos e salpique o chocolate 70% por cima.",
      "Asse na Airfryer a 180 °C por 7 a 8 minutos até dourar as bordas.",
    ],
    ciencia:
      "Usar aveia em flocos inteiros cria resistência à mastigação e crocância nas bordas, aumentando o tempo de refeição e a sinalização de saciedade.",
  },
  {
    id: "mingau-proteico-bombom-aveia",
    titulo: "Mingau Proteico Cremoso de Aveia ('Proats' Sabor Chocolate)",
    subtitulo:
      "Alto volume no prato: um bowl inteiro quente e aveludado com 32 g de proteína que segura a fome por 4 horas.",
    alimento: "aveia",
    interesses: [
      "vontade-de-doce",
      "mais-30g-proteina",
      "ate-5-min",
      "com-aveia",
    ],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 bowl grande",
    momento: "Café da manhã · Ceia",
    views: 59_131,
    videoId: "-BiXDUrJ-kA",
    corAcento: "#9e6b43",
    macros: {
      kcal: 365,
      proteina: 32,
      carbo: 43,
      gordura: 7,
      fibras: 7,
    },
    ingredientes: [
      { item: "Aveia em flocos finos ou farelo", medida: "40 g (4 col. sopa)" },
      { item: "Leite desnatado ou bebida vegetal", medida: "200 ml" },
      { item: "Cacau em pó 100%", medida: "8 g (1 col. sobremesa)" },
      { item: "Whey protein chocolate", medida: "25 g" },
      { item: "Clara de ovo (truque de cremosidade)", medida: "1 unidade" },
    ],
    preparo: [
      "Leve a aveia, o leite e o cacau ao fogo baixo mexendo sempre até engrossar (3 minutos).",
      "Com o fogo no mínimo, adicione a clara de ovo e mexa vigorosamente por 40 segundos.",
      "Desligue o fogo, espere 1 minuto e misture o whey protein.",
    ],
    ciencia:
      "Adicionar o whey apenas com o fogo desligado impede que a proteína talhe acima de 75 °C, deixando o mingau com textura de ganache.",
  },
  {
    id: "petit-gateau-aveia-caneca",
    titulo: "Bolinho de Caneca de Aveia e Cacau no Micro-ondas",
    subtitulo:
      "Fica pronto em 90 segundos, mata a vontade de chocolate à noite e entrega 31 g de proteína.",
    alimento: "aveia",
    interesses: [
      "vontade-de-doce",
      "mais-30g-proteina",
      "ate-5-min",
      "com-aveia",
    ],
    tempo: "3 min",
    minutos: 3,
    porcoes: "1 caneca",
    momento: "Ceia · Vontade de doce",
    views: 46_980,
    videoId: "PlW6vnkMmtk",
    corAcento: "#c7a06a",
    macros: {
      kcal: 335,
      proteina: 31,
      carbo: 31,
      gordura: 9,
      fibras: 6,
    },
    ingredientes: [
      { item: "Farinha ou farelo de aveia", medida: "30 g (3 col. sopa)" },
      { item: "Ovo inteiro", medida: "1 unidade" },
      { item: "Cacau em pó 100%", medida: "10 g (1 col. sopa)" },
      { item: "Whey protein de chocolate", medida: "20 g" },
      { item: "Leite desnatado ou água", medida: "40 ml (3 col. sopa)" },
      { item: "Chocolate 70% (para o centro)", medida: "1 quadradinho (8 g)" },
    ],
    preparo: [
      "Na caneca, bata o ovo com o leite e misture a aveia, o cacau e o whey.",
      "Afunde o quadradinho de chocolate 70% no centro.",
      "Micro-ondas por 60 a 75 segundos — tire com o centro ainda úmido.",
    ],
    ciencia:
      "As fibras solúveis da aveia retêm a umidade dentro da caneca; parar o cozimento 15 segundos antes preserva o centro cremoso.",
  },

  /* ── AVEIA · PANQUECAS DO PROTOCOLO ───────────────────────────────── */
  {
    id: "panqueca-classica-banana-whey",
    titulo: "Panqueca Clássica Fit de Banana com Aveia",
    subtitulo:
      "Mais de 3,2 milhões de visualizações: a receita de panqueca de aveia mais assistida, macia e sem farinha branca.",
    alimento: "aveia",
    interesses: [
      "substitutos-do-pao",
      "mais-30g-proteina",
      "ate-5-min",
      "com-aveia",
    ],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 porção",
    momento: "Café da manhã · Pós-treino",
    views: 3_246_030,
    videoId: "8oQ0X8JvvGo",
    novidade: true,
    corAcento: "#c7a06a",
    macros: {
      kcal: 385,
      proteina: 34,
      carbo: 42,
      gordura: 8,
      fibras: 6,
    },
    ingredientes: [
      { item: "Aveia em flocos finos ou farinha de aveia", medida: "30 g (3 col. sopa)" },
      { item: "Banana prata ou nanica madura", medida: "1 unidade média (75 g)" },
      { item: "Ovo inteiro + 1 clara", medida: "1 ovo + 1 clara" },
      { item: "Whey protein (baunilha ou neutro)", medida: "15 g (½ scoop)" },
      { item: "Canela em pó", medida: "a gosto" },
    ],
    preparo: [
      "Amasse a banana com um garfo até virar um purê liso.",
      "Misture o ovo, a clara, a aveia e a canela e deixe hidratar por 2 minutos.",
      "Adicione o meio scoop de whey por último e grelhe em frigideira antiaderente tampada em fogo baixo.",
    ],
    ciencia:
      "Fogo baixo e meio scoop de whey na massa evitam a desnaturação brusca das proteínas do soro, mantendo a panqueca macia.",
  },
  {
    id: "panqueca-americana-fluffy-iogurte",
    titulo: "Panqueca Americana Fluffy de Aveia e Iogurte Natural",
    subtitulo:
      "Massa alta e aerada usando a acidez do iogurte natural para deixar a aveia fofa como panqueca americana.",
    alimento: "aveia",
    interesses: ["substitutos-do-pao", "com-aveia"],
    tempo: "8 min",
    minutos: 8,
    porcoes: "3 discos médios",
    momento: "Café da manhã",
    views: 10_543,
    videoId: "FnF-HVCDYc0",
    corAcento: "#dcb57c",
    macros: {
      kcal: 360,
      proteina: 29,
      carbo: 38,
      gordura: 9,
      fibras: 5,
    },
    ingredientes: [
      { item: "Farinha de aveia", medida: "35 g (3 ½ col. sopa)" },
      { item: "Iogurte natural desnatado", medida: "60 g (3 col. sopa cheias)" },
      { item: "Ovo inteiro", medida: "1 unidade" },
      { item: "Whey protein baunilha", medida: "15 g (½ scoop)" },
      { item: "Fermento químico em pó", medida: "1 col. café rasa" },
    ],
    preparo: [
      "Misture o ovo e o iogurte natural até ficar uniforme.",
      "Incorpore a farinha de aveia, o whey e por último o fermento.",
      "Forme 3 discos pequenos na frigideira em fogo mínimo com tampa.",
    ],
    ciencia:
      "O ácido lático do iogurte reage com o fermento químico e gera microbolhas de ar que deixam a massa alta e macia.",
  },
  {
    id: "panqueca-pasta-amendoim-canela",
    titulo: "Panqueca Energética de Aveia, Banana e Pasta de Amendoim",
    subtitulo:
      "Mais energia sustentada para pré-treino de pernas ou fase de ganho de massa limpa.",
    alimento: "aveia",
    interesses: ["substitutos-do-pao", "mais-30g-proteina", "com-aveia"],
    tempo: "7 min",
    minutos: 7,
    porcoes: "1 porção",
    momento: "Pré-treino · Ganho de massa",
    views: 12_784,
    videoId: "B6DBMl96asI",
    corAcento: "#b07d4b",
    macros: {
      kcal: 475,
      proteina: 35,
      carbo: 48,
      gordura: 16,
      fibras: 7,
    },
    ingredientes: [
      { item: "Aveia em flocos finos", medida: "40 g (4 col. sopa)" },
      { item: "Banana madura", medida: "1 unidade média (80 g)" },
      { item: "Ovo inteiro + 2 claras", medida: "1 ovo + 2 claras" },
      { item: "Whey protein", medida: "15 g (½ scoop)" },
      { item: "Pasta de amendoim integral", medida: "15 g (1 col. sopa rasa)" },
    ],
    preparo: [
      "Misture a banana amassada, o ovo, as claras, a aveia e o whey.",
      "Asse em frigideira antiaderente tampada em fogo baixo até dourar dos dois lados.",
      "Finalize com a pasta de amendoim sobre a panqueca ainda quente.",
    ],
    ciencia:
      "Carboidratos complexos da aveia combinados aos lipídios insaturados do amendoim garantem liberação constante de energia.",
  },
  {
    id: "panqueca-cacau-calda-whey",
    titulo: "Panqueca de Aveia com Calda Proteica de Whey e Pasta de Amendoim",
    subtitulo:
      "Cobertura cremosa de whey feita em 30 segundos para transformar a panqueca num doce proteico.",
    alimento: "aveia",
    interesses: [
      "vontade-de-doce",
      "substitutos-do-pao",
      "mais-30g-proteina",
      "com-aveia",
    ],
    tempo: "7 min",
    minutos: 7,
    porcoes: "1 porção",
    momento: "Lanche da tarde · Ceia",
    views: 1_424,
    videoId: "vp0A72CrSuo",
    corAcento: "#a47148",
    macros: {
      kcal: 370,
      proteina: 36,
      carbo: 35,
      gordura: 9,
      fibras: 7,
    },
    ingredientes: [
      { item: "Farelo ou farinha de aveia", medida: "30 g (3 col. sopa)" },
      { item: "Ovo inteiro + 2 claras", medida: "1 ovo + 2 claras" },
      { item: "Banana madura", medida: "1 unidade pequena" },
      { item: "Whey sabor chocolate (para a calda)", medida: "20 g" },
      { item: "Pasta de amendoim", medida: "10 g" },
    ],
    preparo: [
      "Bata o ovo, as claras, a banana e a aveia e grelhe em fogo baixo.",
      "Misture os 20 g de whey com gotas de água até formar uma calda espessa.",
      "Cubra a panqueca pronta com a calda de whey e um fio de pasta de amendoim.",
    ],
    ciencia:
      "Colocar a maior parte do whey na calda fria preserva a textura cremosa sem ressecar a massa na frigideira.",
  },

  /* ── TAPIOCA & CREPIOCA · SALGADAS E DOCES ────────────────────────── */
  {
    id: "pao-de-queijo-frigideira-tapioca",
    titulo: "Pãozinho de Tapioca / Pão de Queijo de Frigideira em Minutos",
    subtitulo:
      "Mais de 5,4 milhões de visualizações: casquinha dourada por fora, macio por dentro e pronto em 5 minutos na frigideira.",
    alimento: "tapioca",
    interesses: ["substitutos-do-pao", "ate-5-min", "com-tapioca"],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 porção",
    momento: "Café da manhã · Substituto do pão",
    views: 5_443_841,
    videoId: "MoUSuz3mlg0",
    novidade: true,
    corAcento: "#e0b36a",
    macros: {
      kcal: 310,
      proteina: 24,
      carbo: 28,
      gordura: 11,
      fibras: 2,
    },
    ingredientes: [
      { item: "Goma de tapioca hidratada", medida: "30 g (2 col. sopa)" },
      { item: "Ovo inteiro + 1 clara", medida: "1 ovo + 1 clara" },
      { item: "Requeijão light ou cottage", medida: "25 g (1 col. sopa)" },
      { item: "Muçarela light ralada ou parmesão", medida: "20 g" },
      { item: "Pitada de sal e orégano", medida: "a gosto" },
    ],
    preparo: [
      "Bata o ovo, a clara, o requeijão light, a tapioca e o queijo ralado com um garfo.",
      "Despeje em frigideira pequena antiaderente em fogo baixo e tampe.",
      "Vire quando inflar e dourar a base (cerca de 2 minutos de cada lado).",
    ],
    ciencia:
      "A amilopectina da fécula de mandioca gelatiniza rápido e aprisiona o vapor do ovo e do requeijão, criando elasticidade idêntica ao pão de queijo com metade das calorias.",
  },
  {
    id: "tapioca-recheada-metodo-crocante",
    titulo: "Tapioca Perfeita e Úmida com Ovos e Queijo (Sem Borracha)",
    subtitulo:
      "Mais de 5,3 milhões de views: o jeito certo de selar a tapioca com proteína para não ressecar nem derrubar a saciedade.",
    alimento: "tapioca",
    interesses: ["substitutos-do-pao", "ate-5-min", "com-tapioca"],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 porção",
    momento: "Café da manhã · Jantar rápido",
    views: 5_316_176,
    videoId: "Zpejs_HJweI",
    corAcento: "#d4a359",
    macros: {
      kcal: 325,
      proteina: 26,
      carbo: 30,
      gordura: 11,
      fibras: 2,
    },
    ingredientes: [
      { item: "Goma de tapioca peneirada", medida: "35 g (2 ½ col. sopa)" },
      { item: "Ovos mexidos ou na chapa", medida: "2 unidades" },
      { item: "Queijo minas padrão light ou cottage", medida: "30 g" },
      { item: "Sementes de chia na goma (truque glicêmico)", medida: "1 col. chá" },
    ],
    preparo: [
      "Misture 1 colher de chá de chia na goma de tapioca e espalhe na frigideira morna.",
      "Assim que os grãos se unirem (1 minuto), adicione os ovos e o queijo, dobre ao meio e desligue — não deixe secar demais.",
    ],
    ciencia:
      "A tapioca pura tem alto índice glicêmico; combinar com 2 ovos, queijo e chia reduz a velocidade de esvaziamento gástrico e mantém a saciedade alta.",
  },
  {
    id: "crepioca-classica-proteica",
    titulo: "Crepioca Clássica Simples e Rápida (Massa Leve de 3 Minutos)",
    subtitulo:
      "Mais de 4,1 milhões de visualizações: a proporção exata entre ovo e goma de tapioca para dobrar sem quebrar.",
    alimento: "tapioca",
    interesses: ["substitutos-do-pao", "ate-5-min", "com-tapioca"],
    tempo: "4 min",
    minutos: 4,
    porcoes: "1 porção",
    momento: "Café da manhã · Lanche proteico",
    views: 4_194_256,
    videoId: "ywv7Pwy4iJ8",
    novidade: true,
    corAcento: "#c7a06a",
    macros: {
      kcal: 290,
      proteina: 28,
      carbo: 22,
      gordura: 9,
      fibras: 1,
    },
    ingredientes: [
      { item: "Goma de tapioca", medida: "25 g (2 col. sopa rasas)" },
      { item: "Ovo inteiro + 2 claras", medida: "1 ovo + 2 claras" },
      { item: "Frango desfiado ou atum/queijo magro (recheio)", medida: "60 g" },
      { item: "Sal e cúrcuma", medida: "a gosto" },
    ],
    preparo: [
      "Bata bem o ovo e as claras com a goma de tapioca até não restar nenhum gruminho.",
      "Despeje na frigideira antiaderente aquecida em fogo médio-baixo.",
      "Quando soltar do fundo, vire por 30 segundos, recheie com a proteína escolhida e dobre.",
    ],
    ciencia:
      "Mais leve que o pão e sem glúten: 2 colheres rasas de tapioca com ovo + claras entregam 28 g de proteína em menos de 300 kcal.",
  },
  {
    id: "crepioca-doce-banana-chocolate",
    titulo: "Crepioca Doce de Cacau Recheada com Banana Quente",
    subtitulo:
      "Mais de 1,3 milhão de visualizações: versão doce com massa de tapioca + ovo para variar quando acabar a aveia.",
    alimento: "tapioca",
    interesses: ["vontade-de-doce", "ate-5-min", "com-tapioca"],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 porção",
    momento: "Lanche da tarde · Vontade de doce",
    views: 1_381_029,
    videoId: "FCBcqa4EeoY",
    corAcento: "#a47148",
    macros: {
      kcal: 330,
      proteina: 25,
      carbo: 38,
      gordura: 8,
      fibras: 4,
    },
    ingredientes: [
      { item: "Goma de tapioca", medida: "25 g (2 col. sopa)" },
      { item: "Ovo inteiro + 1 clara", medida: "1 ovo + 1 clara" },
      { item: "Cacau em pó 100%", medida: "1 col. sobremesa" },
      { item: "Banana em rodelas", medida: "1 unidade média" },
      { item: "Whey de chocolate (calda) ou canela", medida: "15 g" },
    ],
    preparo: [
      "Bata o ovo, a clara, a tapioca, o cacau e gotas de adoçante.",
      "Doure o disco na frigideira, disponha as rodelas de banana em metade da massa e feche com a calda de whey.",
    ],
    ciencia:
      "Excelente opção de baixo FODMAP e fácil digestão para pré-treino próximo do horário da academia.",
  },
  {
    id: "tapioca-invertida-crocante-ovo",
    titulo: "Tapioca Invertida com Crosta Crocante de Queijo e Ovo",
    subtitulo:
      "O queijo vai primeiro na frigideira, cria uma renda crocante dourada e abraça o ovo e a tapioca.",
    alimento: "tapioca",
    interesses: ["substitutos-do-pao", "ate-5-min", "com-tapioca"],
    tempo: "5 min",
    minutos: 5,
    porcoes: "1 porção",
    momento: "Café da manhã · Jantar rápido",
    views: 120_350,
    videoId: "PO-8dbHZObM",
    corAcento: "#dcb57c",
    macros: {
      kcal: 320,
      proteina: 25,
      carbo: 23,
      gordura: 13,
      fibras: 1,
    },
    ingredientes: [
      { item: "Muçarela light ou queijo minas meia-cura", medida: "25 g" },
      { item: "Ovos inteiros", medida: "2 unidades" },
      { item: "Goma de tapioca", medida: "25 g (2 col. sopa)" },
      { item: "Orégano e pimenta-do-reino", medida: "a gosto" },
    ],
    preparo: [
      "Espalhe o queijo no fundo da frigideira antiaderente fria, ligue em fogo baixo e quebre os ovos por cima.",
      "Tempere e salpique a goma de tapioca cobrindo os ovos.",
      "Quando o queijo formar crosta dourada, vire por 1 minuto e dobre ao meio.",
    ],
    ciencia:
      "A reação de Maillard nas proteínas do queijo na frigideira entrega crocância intensa e sabor umami sem adicionar óleo.",
  },
];

/**
 * Monta as fileiras no padrão da Netflix:
 *  1ª Fileira: Top Mais Assistidos — sempre ordenado por `views` decrescente!
 *  Demais fileiras: geradas automaticamente a partir de `ASSUNTOS_INTERESSE`,
 *  cada uma também ordenada por `views`.
 */
export function carregarTrilhasReceitas(): TrilhaReceitas[] {
  const porViews = (a: Receita, b: Receita) => b.views - a.views;

  const topPorViews = [...CATALOGO_RECEITAS].sort(porViews).slice(0, 10);

  const trilhasDeAssuntos: TrilhaReceitas[] = ASSUNTOS_INTERESSE.map((assunto) => ({
    id: assunto.id,
    nome: assunto.tituloTrilha,
    descricao: assunto.descricao,
    receitas: CATALOGO_RECEITAS.filter((r) =>
      r.interesses.includes(assunto.id),
    ).sort(porViews),
  })).filter((t) => t.receitas.length > 0);

  return [
    {
      id: "mais-assistidos",
      nome: "Top Mais Assistidos · Ordenado por Views",
      descricao:
        "Os vídeos de receitas fit mais vistos do catálogo — comece pelos campeões de audiência.",
      ranking: true,
      receitas: topPorViews,
    },
    ...trilhasDeAssuntos,
  ];
}

export function totalDeReceitas(): number {
  return CATALOGO_RECEITAS.length;
}
