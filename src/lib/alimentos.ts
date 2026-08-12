/**
 * Tabela de alimentos de restaurante brasileiro.
 *
 * Valores por 100 g (ou 100 ml, nas bebidas), com a TACO/UNICAMP e a TBCA/USP
 * como base. Onde o prato de restaurante difere do valor de tabela — porque
 * leva mais óleo, mais molho ou corte mais gordo do que a versão medida em
 * laboratório — o valor foi ajustado para cima. Isso está declarado aqui de
 * propósito: são estimativas de cardápio, não análise bromatológica.
 *
 * Cada alimento carrega a sua própria referência visual (`unidade` + `gramas`),
 * porque ninguém pesa comida no restaurante. A pessoa conta conchas, palmas e
 * colheres — e é isso que a interface pede.
 */

export type CategoriaId =
  | "base"
  | "proteina"
  | "acompanhamento"
  | "salada"
  | "extra"
  | "lanche"
  | "bebida"
  | "sobremesa";

export type Categoria = {
  id: CategoriaId;
  nome: string;
  nota: string;
  /**
   * Erro típico da estimativa visual nesta categoria, como fração.
   * Uma concha de arroz varia pouco; um prato refogado varia muito,
   * porque o óleo não aparece.
   */
  incerteza: number;
};

export const CATEGORIAS: Categoria[] = [
  {
    id: "base",
    nome: "Base",
    nota: "Arroz, massa, purê — o que ocupa metade do prato",
    incerteza: 0.2,
  },
  {
    id: "proteina",
    nome: "Proteína",
    nota: "Carne, frango, peixe, ovo",
    incerteza: 0.22,
  },
  {
    id: "acompanhamento",
    nome: "Acompanhamento",
    nota: "Feijão, farofa, batata, legumes",
    incerteza: 0.25,
  },
  {
    id: "salada",
    nome: "Salada",
    nota: "Cru e refogado — quase sempre subestimado no molho",
    incerteza: 0.25,
  },
  {
    id: "extra",
    nome: "Molhos e extras",
    nota: "Azeite, maionese, queijo — pouco volume, muita caloria",
    incerteza: 0.35,
  },
  {
    id: "lanche",
    nome: "Lanche e rua",
    nota: "Pizza, hambúrguer, salgado, açaí",
    incerteza: 0.25,
  },
  {
    id: "bebida",
    nome: "Bebida",
    nota: "O que mais passa despercebido na conta do dia",
    incerteza: 0.1,
  },
  {
    id: "sobremesa",
    nome: "Sobremesa",
    nota: "Se entrou, entra na conta",
    incerteza: 0.25,
  },
];

export type Alimento = {
  id: string;
  nome: string;
  categoria: CategoriaId;
  /** por 100 g — ou por 100 ml, nas bebidas */
  kcal: number;
  /** proteína, g */
  p: number;
  /** carboidrato, g */
  c: number;
  /** gordura, g */
  g: number;
  /**
   * Álcool, g. É o quarto macronutriente — 7 kcal/g — e sem ele a conta
   * não fecha: uma cerveja tem mais que o dobro das calorias que proteína,
   * carboidrato e gordura explicam. Some nas kcal e não aparece em lugar
   * nenhum é exatamente como a bebida escapa do controle das pessoas.
   */
  a?: number;
  /** a referência visual: "concha", "palma da mão", "unidade"… */
  unidade: string;
  /** quanto pesa uma dessas referências */
  gramas: number;
  /** sobrepõe a incerteza da categoria (fritura esconde óleo) */
  incerteza?: number;
  /** troca de menor densidade energética, para a sugestão do resultado */
  trocaPor?: string;
};

export const ALIMENTOS: Alimento[] = [
  /* ── Base ──────────────────────────────────────────────── */
  { id: "arroz-branco", nome: "Arroz branco", categoria: "base", kcal: 128, p: 2.5, c: 28.1, g: 0.2, unidade: "concha", gramas: 100, trocaPor: "arroz-integral" },
  { id: "arroz-integral", nome: "Arroz integral", categoria: "base", kcal: 124, p: 2.6, c: 25.8, g: 1.0, unidade: "concha", gramas: 100 },
  { id: "macarrao", nome: "Macarrão ao sugo", categoria: "base", kcal: 158, p: 5.8, c: 30.9, g: 0.9, unidade: "escumadeira", gramas: 120 },
  { id: "macarrao-branco", nome: "Macarrão ao molho branco", categoria: "base", kcal: 215, p: 6.5, c: 28.0, g: 9.0, unidade: "escumadeira", gramas: 120, trocaPor: "macarrao" },
  { id: "pure", nome: "Purê de batata", categoria: "base", kcal: 118, p: 2.0, c: 17.0, g: 4.5, unidade: "colher de servir", gramas: 60 },
  { id: "polenta", nome: "Polenta cremosa", categoria: "base", kcal: 105, p: 2.2, c: 20.0, g: 1.8, unidade: "colher de servir", gramas: 60 },
  { id: "cuscuz", nome: "Cuscuz de milho", categoria: "base", kcal: 113, p: 2.2, c: 25.3, g: 0.5, unidade: "fatia", gramas: 80 },
  { id: "pao-frances", nome: "Pão francês", categoria: "base", kcal: 300, p: 8.0, c: 58.6, g: 3.1, unidade: "unidade", gramas: 50 },

  /* ── Proteína ──────────────────────────────────────────── */
  { id: "frango-grelhado", nome: "Frango grelhado (peito)", categoria: "proteina", kcal: 159, p: 32.0, c: 0, g: 2.5, unidade: "palma da mão", gramas: 120 },
  { id: "frango-empanado", nome: "Frango empanado / à milanesa", categoria: "proteina", kcal: 240, p: 22.0, c: 12.0, g: 12.0, unidade: "palma da mão", gramas: 120, incerteza: 0.35, trocaPor: "frango-grelhado" },
  { id: "frango-parmegiana", nome: "Frango à parmegiana", categoria: "proteina", kcal: 250, p: 18.0, c: 12.0, g: 15.0, unidade: "palma da mão", gramas: 150, incerteza: 0.35, trocaPor: "frango-grelhado" },
  { id: "bife-grelhado", nome: "Bife bovino grelhado", categoria: "proteina", kcal: 220, p: 32.0, c: 0, g: 9.5, unidade: "palma da mão", gramas: 120 },
  { id: "bife-milanesa", nome: "Bife à milanesa", categoria: "proteina", kcal: 270, p: 22.0, c: 14.0, g: 14.0, unidade: "palma da mão", gramas: 130, incerteza: 0.35, trocaPor: "bife-grelhado" },
  { id: "picanha", nome: "Picanha grelhada", categoria: "proteina", kcal: 289, p: 26.0, c: 0, g: 20.5, unidade: "palma da mão", gramas: 120, trocaPor: "bife-grelhado" },
  { id: "carne-moida", nome: "Carne moída refogada", categoria: "proteina", kcal: 212, p: 26.0, c: 1.0, g: 11.5, unidade: "colher de servir", gramas: 60 },
  { id: "estrogonofe", nome: "Estrogonofe de carne", categoria: "proteina", kcal: 180, p: 12.0, c: 5.0, g: 12.0, unidade: "concha", gramas: 110, incerteza: 0.3 },
  { id: "lombo-porco", nome: "Lombo de porco assado", categoria: "proteina", kcal: 210, p: 30.0, c: 0, g: 9.0, unidade: "palma da mão", gramas: 120 },
  { id: "linguica", nome: "Linguiça", categoria: "proteina", kcal: 296, p: 16.0, c: 1.5, g: 25.0, unidade: "gomo", gramas: 60, trocaPor: "frango-grelhado" },
  { id: "peixe-grelhado", nome: "Peixe grelhado", categoria: "proteina", kcal: 128, p: 26.0, c: 0, g: 2.4, unidade: "palma da mão", gramas: 120 },
  { id: "peixe-frito", nome: "Peixe frito", categoria: "proteina", kcal: 210, p: 22.0, c: 6.0, g: 11.0, unidade: "palma da mão", gramas: 120, incerteza: 0.35, trocaPor: "peixe-grelhado" },
  { id: "camarao", nome: "Camarão refogado", categoria: "proteina", kcal: 110, p: 19.0, c: 1.0, g: 3.5, unidade: "colher de servir", gramas: 60 },
  { id: "ovo-frito", nome: "Ovo frito", categoria: "proteina", kcal: 240, p: 13.6, c: 0.6, g: 20.0, unidade: "unidade", gramas: 50, trocaPor: "ovo-cozido" },
  { id: "ovo-cozido", nome: "Ovo cozido", categoria: "proteina", kcal: 146, p: 13.3, c: 0.6, g: 9.5, unidade: "unidade", gramas: 50 },
  { id: "omelete", nome: "Omelete", categoria: "proteina", kcal: 180, p: 13.0, c: 1.0, g: 14.0, unidade: "unidade", gramas: 120 },
  { id: "feijoada", nome: "Feijoada", categoria: "proteina", kcal: 150, p: 9.5, c: 9.0, g: 8.5, unidade: "concha", gramas: 140, incerteza: 0.3 },

  /* ── Acompanhamento ────────────────────────────────────── */
  { id: "feijao-carioca", nome: "Feijão carioca", categoria: "acompanhamento", kcal: 76, p: 4.8, c: 13.6, g: 0.5, unidade: "concha", gramas: 80 },
  { id: "feijao-preto", nome: "Feijão preto", categoria: "acompanhamento", kcal: 77, p: 4.5, c: 14.0, g: 0.5, unidade: "concha", gramas: 80 },
  { id: "feijao-tropeiro", nome: "Feijão tropeiro", categoria: "acompanhamento", kcal: 250, p: 10.0, c: 25.0, g: 12.0, unidade: "colher de servir", gramas: 70, incerteza: 0.3, trocaPor: "feijao-carioca" },
  { id: "farofa", nome: "Farofa", categoria: "acompanhamento", kcal: 405, p: 2.6, c: 78.8, g: 8.9, unidade: "colher de servir", gramas: 25 },
  { id: "batata-frita", nome: "Batata frita", categoria: "acompanhamento", kcal: 300, p: 3.8, c: 38.0, g: 15.0, unidade: "punhado", gramas: 80, incerteza: 0.35, trocaPor: "legumes-vapor" },
  { id: "mandioca-frita", nome: "Mandioca frita", categoria: "acompanhamento", kcal: 310, p: 1.5, c: 40.0, g: 16.0, unidade: "punhado", gramas: 80, incerteza: 0.35, trocaPor: "mandioca-cozida" },
  { id: "mandioca-cozida", nome: "Mandioca cozida", categoria: "acompanhamento", kcal: 125, p: 0.6, c: 30.1, g: 0.3, unidade: "colher de servir", gramas: 60 },
  { id: "legumes-refogados", nome: "Legumes refogados", categoria: "acompanhamento", kcal: 60, p: 1.8, c: 7.0, g: 3.0, unidade: "colher de servir", gramas: 60 },
  { id: "legumes-vapor", nome: "Legumes no vapor", categoria: "acompanhamento", kcal: 35, p: 1.8, c: 6.5, g: 0.3, unidade: "colher de servir", gramas: 60 },
  { id: "couve", nome: "Couve refogada", categoria: "acompanhamento", kcal: 65, p: 2.5, c: 6.0, g: 3.5, unidade: "colher de servir", gramas: 40 },

  /* ── Salada ────────────────────────────────────────────── */
  { id: "salada-folhas", nome: "Folhas e tomate (sem molho)", categoria: "salada", kcal: 20, p: 1.2, c: 3.5, g: 0.2, unidade: "pegador", gramas: 80 },
  { id: "salada-maionese", nome: "Salada de maionese", categoria: "salada", kcal: 195, p: 1.8, c: 12.0, g: 15.5, unidade: "colher de servir", gramas: 60, incerteza: 0.3, trocaPor: "salada-folhas" },
  { id: "vinagrete", nome: "Vinagrete", categoria: "salada", kcal: 40, p: 0.8, c: 5.0, g: 2.0, unidade: "colher de servir", gramas: 50 },
  { id: "beterraba", nome: "Beterraba cozida", categoria: "salada", kcal: 32, p: 1.3, c: 7.2, g: 0.1, unidade: "colher de servir", gramas: 50 },

  /* ── Molhos e extras ───────────────────────────────────── */
  { id: "azeite", nome: "Azeite", categoria: "extra", kcal: 884, p: 0, c: 0, g: 100, unidade: "fio (colher de chá)", gramas: 5 },
  { id: "maionese", nome: "Maionese", categoria: "extra", kcal: 680, p: 1.0, c: 2.0, g: 75.0, unidade: "colher de sopa", gramas: 15 },
  { id: "molho-tomate", nome: "Molho de tomate", categoria: "extra", kcal: 40, p: 1.5, c: 6.0, g: 1.0, unidade: "concha pequena", gramas: 50 },
  { id: "molho-branco", nome: "Molho branco / 4 queijos", categoria: "extra", kcal: 180, p: 6.0, c: 6.0, g: 15.0, unidade: "concha pequena", gramas: 50, trocaPor: "molho-tomate" },
  { id: "queijo-mussarela", nome: "Queijo mussarela", categoria: "extra", kcal: 330, p: 25.0, c: 3.0, g: 25.0, unidade: "fatia", gramas: 20 },
  { id: "catupiry", nome: "Requeijão / catupiry", categoria: "extra", kcal: 264, p: 9.6, c: 3.0, g: 23.0, unidade: "colher de sopa", gramas: 20 },

  /* ── Lanche e rua ──────────────────────────────────────── */
  { id: "pizza-mussarela", nome: "Pizza de mussarela", categoria: "lanche", kcal: 260, p: 12.0, c: 30.0, g: 10.0, unidade: "fatia", gramas: 100 },
  { id: "pizza-calabresa", nome: "Pizza de calabresa", categoria: "lanche", kcal: 290, p: 13.0, c: 29.0, g: 13.5, unidade: "fatia", gramas: 100, trocaPor: "pizza-mussarela" },
  { id: "hamburguer", nome: "Hambúrguer artesanal", categoria: "lanche", kcal: 260, p: 14.0, c: 22.0, g: 13.0, unidade: "unidade", gramas: 220, incerteza: 0.3 },
  { id: "sanduiche-natural", nome: "Sanduíche natural", categoria: "lanche", kcal: 200, p: 10.0, c: 25.0, g: 6.0, unidade: "unidade", gramas: 150 },
  { id: "pastel", nome: "Pastel frito", categoria: "lanche", kcal: 350, p: 9.0, c: 30.0, g: 21.0, unidade: "unidade", gramas: 90, incerteza: 0.35 },
  { id: "coxinha", nome: "Coxinha", categoria: "lanche", kcal: 290, p: 8.0, c: 30.0, g: 15.0, unidade: "unidade", gramas: 80, incerteza: 0.3 },
  { id: "esfiha", nome: "Esfiha de carne", categoria: "lanche", kcal: 250, p: 10.0, c: 30.0, g: 10.0, unidade: "unidade", gramas: 80 },
  { id: "pao-de-queijo", nome: "Pão de queijo", categoria: "lanche", kcal: 360, p: 6.0, c: 38.0, g: 20.0, unidade: "unidade", gramas: 30 },
  { id: "tapioca-queijo", nome: "Tapioca com queijo", categoria: "lanche", kcal: 240, p: 8.0, c: 34.0, g: 8.0, unidade: "unidade", gramas: 120 },
  { id: "yakisoba", nome: "Yakisoba", categoria: "lanche", kcal: 140, p: 7.0, c: 18.0, g: 4.5, unidade: "escumadeira", gramas: 150 },
  { id: "sushi", nome: "Sushi / niguiri", categoria: "lanche", kcal: 150, p: 5.0, c: 28.0, g: 1.5, unidade: "peça", gramas: 25 },
  { id: "acai", nome: "Açaí com granola e banana", categoria: "lanche", kcal: 130, p: 1.5, c: 22.0, g: 4.5, unidade: "copo de 300 ml", gramas: 300, incerteza: 0.3 },

  /* ── Bebida (por 100 ml) ───────────────────────────────── */
  { id: "agua", nome: "Água ou chá sem açúcar", categoria: "bebida", kcal: 0, p: 0, c: 0, g: 0, unidade: "copo de 300 ml", gramas: 300 },
  { id: "refrigerante", nome: "Refrigerante", categoria: "bebida", kcal: 42, p: 0, c: 10.6, g: 0, unidade: "copo de 300 ml", gramas: 300, trocaPor: "refrigerante-zero" },
  { id: "refrigerante-zero", nome: "Refrigerante zero", categoria: "bebida", kcal: 0, p: 0, c: 0, g: 0, unidade: "copo de 300 ml", gramas: 300 },
  { id: "suco-natural", nome: "Suco natural de laranja", categoria: "bebida", kcal: 45, p: 0.7, c: 10.4, g: 0.2, unidade: "copo de 300 ml", gramas: 300 },
  { id: "suco-caixinha", nome: "Suco de caixinha / néctar", categoria: "bebida", kcal: 50, p: 0.3, c: 12.0, g: 0, unidade: "copo de 300 ml", gramas: 300, trocaPor: "suco-natural" },
  { id: "cerveja", nome: "Cerveja", categoria: "bebida", kcal: 43, p: 0.5, c: 3.6, g: 0, a: 3.9, unidade: "long neck (355 ml)", gramas: 355 },
  { id: "caipirinha", nome: "Caipirinha", categoria: "bebida", kcal: 95, p: 0, c: 10.0, g: 0, a: 7.9, unidade: "copo de 200 ml", gramas: 200, incerteza: 0.3 },

  /* ── Sobremesa ─────────────────────────────────────────── */
  { id: "fruta", nome: "Fruta", categoria: "sobremesa", kcal: 55, p: 0.7, c: 13.0, g: 0.2, unidade: "porção", gramas: 120 },
  { id: "pudim", nome: "Pudim de leite", categoria: "sobremesa", kcal: 250, p: 6.0, c: 40.0, g: 8.0, unidade: "fatia", gramas: 100, trocaPor: "fruta" },
  { id: "mousse", nome: "Mousse de chocolate", categoria: "sobremesa", kcal: 250, p: 4.0, c: 30.0, g: 13.0, unidade: "taça", gramas: 100, trocaPor: "fruta" },
  { id: "sorvete", nome: "Sorvete", categoria: "sobremesa", kcal: 200, p: 3.5, c: 24.0, g: 10.0, unidade: "bola", gramas: 60, trocaPor: "fruta" },
  { id: "petit-gateau", nome: "Petit gateau com sorvete", categoria: "sobremesa", kcal: 400, p: 5.0, c: 45.0, g: 22.0, unidade: "porção", gramas: 150, incerteza: 0.3, trocaPor: "fruta" },
  { id: "brigadeiro", nome: "Brigadeiro", categoria: "sobremesa", kcal: 390, p: 4.5, c: 55.0, g: 17.0, unidade: "unidade", gramas: 25, trocaPor: "fruta" },
];

/** Índice por id — a interface e o motor consultam isto o tempo todo. */
export const POR_ID = new Map(ALIMENTOS.map((a) => [a.id, a]));

/** Multiplicadores da referência visual. Ninguém serve 1,37 conchas. */
export const QUANTIDADES = [0.5, 1, 1.5, 2, 3] as const;

/**
 * O guia de porção. É a peça que substitui a balança — e, num restaurante,
 * é o que realmente determina a conta. A mão acompanha o tamanho do corpo,
 * o que é uma propriedade útil: quem é maior tem a mão maior.
 */
export const REFERENCIAS = [
  {
    gesto: "Palma da mão",
    equivale: "≈ 120 g de carne, frango ou peixe",
    nota: "Sem os dedos, e com a espessura da própria palma.",
  },
  {
    gesto: "Punho fechado",
    equivale: "≈ 1 concha cheia de arroz ou massa",
    nota: "É também o volume aproximado de uma xícara.",
  },
  {
    gesto: "Concha do restaurante",
    equivale: "≈ 100 g de arroz · 80 g de feijão",
    nota: "A do buffet é maior que a de casa. Na dúvida, some meia.",
  },
  {
    gesto: "Polegar inteiro",
    equivale: "≈ 1 colher de sopa de gordura",
    nota: "Vale para azeite, maionese, requeijão e manteiga.",
  },
  {
    gesto: "Punho fechado de folhas",
    equivale: "≈ 1 pegador de salada",
    nota: "Folha crua ocupa muito volume e pesa pouco.",
  },
];

/**
 * O que o método não alcança. Fica visível na página, não no rodapé:
 * a ferramenta serve para decidir na hora, e é honesto dizer onde erra.
 */
export const AVISO =
  "Isto é uma estimativa para decidir na hora, não uma medição. Os valores vêm da TACO e da TBCA, mas cada cozinha usa mais ou menos óleo, corte mais ou menos gordo e porção maior ou menor que a média. O óleo de fritura e o molho são a maior fonte de erro — e é por isso que o resultado aparece em faixa, e não como um número exato.";
