/**
 * Textos da Calculadora do Prato (/calculadora-do-prato) nos três idiomas:
 * página, ferramenta (EstimadorDePrato.tsx) e a tabela de alimentos.
 *
 * Os números (kcal, macros, gramas) continuam só em `alimentos.ts`; aqui
 * ficam apenas nomes, unidades e frases. O português é lido dos arquivos de
 * origem (`content.ts`, `alimentos.ts`, `prato.ts`) para não divergir.
 * Sem "use client": serve a Server e Client Components.
 */
import { ALIMENTOS, AVISO, CATEGORIAS, REFERENCIAS, type CategoriaId } from "../alimentos";
import { prato } from "../content";
import type { Leitura } from "../prato";
import type { Idioma } from "../rotas-idioma";

type Tom = Leitura["tom"];

export type TextosPrato = {
  seo: { titulo: string; descricao: string; ogTitulo: string; ogDescricao: string; ogAlt: string };
  jsonld: { nome: string; sistema: string; descricao: string; recursos: string[]; inicio: string };
  pagina: {
    voceEsta: string;
    inicio: string;
    migalha: string;
    eyebrow: string;
    titulo: [string, string];
    texto: string;
    destaques: string[];
    honestidade: string;
  };
  est: {
    guiaTitulo: string;
    guiaTexto: string;
    montarEyebrow: string;
    montarTitulo: string;
    montarTexto: string;
    contaEyebrow: string;
    vazio: string;
    tirar: (nome: string) => string;
    remover: string;
    estimativa: string;
    a: string;
    deComida: (g: string) => string;
    proteina: string;
    carboidrato: string;
    gordura: string;
    alcool: (min: number, max: number) => string;
    alcoolTexto: (kcal: number) => string;
    meta: string;
    kcalDia: string;
    naoSabe: string;
    barraAria: (min: number, max: number) => string;
    pctFaixa: (min: number, max: number) => string;
    daMeta: string;
    sobram: (kcal: number) => string;
    frases: Record<Tom, string>;
    ondeEstao: string;
    aliviar: string;
    economia: (kcal: number) => string;
    limpar: string;
    ponteTitulo: string;
    ponteTexto: string;
    comecar: string;
    calcular: string;
    itens: (n: number) => string;
    doDia: (min: number, max: number) => string;
  };
  categorias: Record<CategoriaId, { nome: string; nota: string }>;
  /** por id de alimento; sem entrada, vale o nome PT */
  alimentos: Record<string, string>;
  /** chave: a unidade PT de `alimentos.ts` */
  unidades: Record<string, string>;
  referencias: { gesto: string; equivale: string; nota: string }[];
  aviso: string;
};

const pt: TextosPrato = {
  seo: {
    titulo: "Calculadora do Prato: calorias da refeição",
    descricao:
      "Monte o prato do restaurante e veja calorias, proteína, carboidrato e gordura. Medida pela mão, sem balança e sem cadastro. Alimentos brasileiros.",
    ogTitulo: "Calculadora do Prato",
    ogDescricao:
      "Calorias e macros do prato de restaurante, medidos em conchas e palmas — não em gramas.",
    ogAlt: "Calculadora do Prato",
  },
  jsonld: {
    nome: "Calculadora do Prato",
    sistema: "Todos — roda no navegador",
    descricao:
      "Monta o prato de restaurante com referências visuais de porção e estima calorias, proteína, carboidrato e gordura em faixa.",
    recursos: [
      "Tabela de alimentos de restaurante brasileiro",
      "Porção medida pela mão, sem balança",
      "Calorias e macros como faixa de estimativa",
      "Comparação com a meta diária de calorias",
      "Sugestão de trocas de menor densidade energética",
    ],
    inicio: "Início",
  },
  pagina: {
    voceEsta: "Você está em",
    inicio: "Início",
    migalha: "Calculadora do Prato",
    eyebrow: prato.eyebrow,
    titulo: ["Quanto pesa", "o prato de hoje."],
    texto: prato.texto,
    destaques: [...prato.destaques],
    honestidade:
      "Nenhuma foto, nenhum aplicativo adivinha o peso da sua comida. Aqui a quantidade vem de você — a ferramenta só faz a conta, e mostra a margem de erro que ela realmente tem.",
  },
  est: {
    guiaTitulo: "Como medir sem balança: o guia da mão",
    guiaTexto:
      "A mão acompanha o tamanho do corpo — quem é maior tem a mão maior, e precisa de porção maior. É por isso que ela funciona melhor como referência do que uma medida fixa em gramas.",
    montarEyebrow: "01 / Montar o prato",
    montarTitulo: "O que está na sua frente?",
    montarTexto:
      "Toque em tudo o que vai comer. Depois ajuste a quantidade — não em gramas, em conchas e palmas, que é como a comida realmente aparece.",
    contaEyebrow: "02 / A conta",
    vazio:
      "O prato está vazio. Escolha ao lado e a estimativa aparece aqui, atualizando a cada item.",
    tirar: (nome) => `Tirar ${nome} do prato`,
    remover: "remover",
    estimativa: "Estimativa da refeição",
    a: "a",
    deComida: (g) => `kcal · ${g} de comida`,
    proteina: "Proteína",
    carboidrato: "Carboidrato",
    gordura: "Gordura",
    alcool: (min, max) => `Álcool: ${min}–${max} g`,
    alcoolTexto: (kcal) =>
      `— cerca de ${kcal} kcal. O álcool tem 7 kcal por grama e não aparece em nenhum macronutriente, o que é justamente por que ele escapa da conta da maioria das pessoas.`,
    meta: "Sua meta do dia",
    kcalDia: "kcal por dia",
    naoSabe: "Não sabe? Calcule em um minuto",
    barraAria: (min, max) => `Entre ${min}% e ${max}% da meta do dia`,
    pctFaixa: (min, max) => `${min}% a ${max}%`,
    daMeta: "da meta do dia",
    sobram: (kcal) => `· sobram cerca de ${kcal} kcal`,
    // As frases PT moram em prato.ts (lerContraMeta); o componente usa
    // `leitura.frase` em português e este mapa só em ES/EN.
    frases: { folgado: "", dentro: "", apertado: "", estourou: "" },
    ondeEstao: "Onde estão as calorias",
    aliviar: "Se quiser aliviar sem comer menos",
    economia: (kcal) => `−${kcal} kcal na mesma quantidade de comida`,
    limpar: "Limpar o prato",
    ponteTitulo: "Saber a conta ajuda. Ter um plano que a dispense é melhor.",
    ponteTexto:
      "Esta ferramenta resolve o jantar de hoje. O que muda o corpo é a soma das semanas — e essa parte é montada com você, não estimada a olho.",
    comecar: "Começar consultoria",
    calcular: "Calcular minhas calorias",
    itens: (n) => `${n} ${n === 1 ? "item" : "itens"}`,
    doDia: (min, max) => ` · ${min}–${max}% do dia`,
  },
  categorias: Object.fromEntries(
    CATEGORIAS.map((c) => [c.id, { nome: c.nome, nota: c.nota }]),
  ) as Record<CategoriaId, { nome: string; nota: string }>,
  alimentos: Object.fromEntries(ALIMENTOS.map((a) => [a.id, a.nome])),
  unidades: Object.fromEntries(ALIMENTOS.map((a) => [a.unidade, a.unidade])),
  referencias: REFERENCIAS,
  aviso: AVISO,
};

const es: TextosPrato = {
  seo: {
    titulo: "Calculadora del Plato: calorías de tu comida",
    descricao:
      "Arma el plato del restaurante y ve calorías, proteína, carbohidratos y grasa. Medido con la mano, sin báscula y sin registro. Comida de restaurante brasileño.",
    ogTitulo: "Calculadora del Plato",
    ogDescricao:
      "Calorías y macros del plato de restaurante, medidos en cucharones y palmas — no en gramos.",
    ogAlt: "Calculadora del Plato",
  },
  jsonld: {
    nome: "Calculadora del Plato",
    sistema: "Todos — funciona en el navegador",
    descricao:
      "Arma el plato de restaurante con referencias visuales de porción y estima calorías, proteína, carbohidratos y grasa en rango.",
    recursos: [
      "Tabla de alimentos de restaurante brasileño",
      "Porción medida con la mano, sin báscula",
      "Calorías y macros como rango de estimación",
      "Comparación con la meta diaria de calorías",
      "Sugerencias de cambios con menor densidad energética",
    ],
    inicio: "Inicio",
  },
  pagina: {
    voceEsta: "Estás en",
    inicio: "Inicio",
    migalha: "Calculadora del Plato",
    eyebrow: "Herramienta gratuita",
    titulo: ["Cuánto pesa", "el plato de hoy."],
    texto:
      "Vas a comer fuera y no tienes idea de lo que eso supone en tu día. Arma el plato aquí — en cucharones y palmas, no en gramos — y ve calorías y macros antes de sentarte a la mesa.",
    destaques: [
      "70 alimentos de restaurante brasileño",
      "Medido con la mano, sin báscula",
      "Resultado en rango, no en un número falso",
    ],
    honestidade:
      "Ninguna foto ni ninguna app adivina el peso de tu comida. Aquí la cantidad la pones tú — la herramienta solo hace la cuenta y muestra el margen de error que realmente tiene.",
  },
  est: {
    guiaTitulo: "Cómo medir sin báscula: la guía de la mano",
    guiaTexto:
      "La mano acompaña el tamaño del cuerpo — quien es más grande tiene la mano más grande y necesita una porción mayor. Por eso funciona mejor como referencia que una medida fija en gramos.",
    montarEyebrow: "01 / Armar el plato",
    montarTitulo: "¿Qué tienes delante?",
    montarTexto:
      "Toca todo lo que vas a comer. Después ajusta la cantidad — no en gramos, sino en cucharones y palmas, que es como la comida aparece de verdad.",
    contaEyebrow: "02 / La cuenta",
    vazio:
      "El plato está vacío. Elige al lado y la estimación aparece aquí, actualizándose con cada alimento.",
    tirar: (nome) => `Quitar ${nome} del plato`,
    remover: "quitar",
    estimativa: "Estimación de la comida",
    a: "a",
    deComida: (g) => `kcal · ${g} de comida`,
    proteina: "Proteína",
    carboidrato: "Carbohidratos",
    gordura: "Grasa",
    alcool: (min, max) => `Alcohol: ${min}–${max} g`,
    alcoolTexto: (kcal) =>
      `— unas ${kcal} kcal. El alcohol tiene 7 kcal por gramo y no aparece en ningún macronutriente, y justamente por eso se escapa de la cuenta de la mayoría de las personas.`,
    meta: "Tu meta del día",
    kcalDia: "kcal al día",
    naoSabe: "¿No la sabes? Calcúlala en un minuto",
    barraAria: (min, max) => `Entre el ${min}% y el ${max}% de la meta del día`,
    pctFaixa: (min, max) => `${min}% a ${max}%`,
    daMeta: "de la meta del día",
    sobram: (kcal) => `· quedan unas ${kcal} kcal`,
    frases: {
      folgado:
        "Cabe con holgura. Queda espacio para las demás comidas del día sin ningún ajuste.",
      dentro:
        "Es el peso normal de una comida principal. El día cierra sin necesidad de compensar nada.",
      apertado:
        "Supera lo que suele ocupar una comida. Puedes cerrar el día, pero las demás comidas quedan justas — conviene elegir proteína y verdura en ellas.",
      estourou:
        "Por sí sola, esta comida ya supera la meta del día. Pasa, y no borra el proceso: lo que cuenta es el promedio de la semana, no su peor día.",
    },
    ondeEstao: "Dónde están las calorías",
    aliviar: "Si quieres aligerar sin comer menos",
    economia: (kcal) => `−${kcal} kcal con la misma cantidad de comida`,
    limpar: "Vaciar el plato",
    ponteTitulo: "Saber la cuenta ayuda. Tener un plan que la haga innecesaria es mejor.",
    ponteTexto:
      "Esta herramienta resuelve la cena de hoy. Lo que cambia el cuerpo es la suma de las semanas — y esa parte se arma contigo, no se estima a ojo.",
    comecar: "Empezar asesoría",
    calcular: "Calcular mis calorías",
    itens: (n) => `${n} ${n === 1 ? "alimento" : "alimentos"}`,
    doDia: (min, max) => ` · ${min}–${max}% del día`,
  },
  categorias: {
    base: { nome: "Base", nota: "Arroz, pasta, puré — lo que ocupa la mitad del plato" },
    proteina: { nome: "Proteína", nota: "Carne, pollo, pescado, huevo" },
    acompanhamento: { nome: "Guarnición", nota: "Frijoles, farofa, papa, verduras" },
    salada: { nome: "Ensalada", nota: "Cruda y salteada — casi siempre se subestima el aliño" },
    extra: { nome: "Salsas y extras", nota: "Aceite de oliva, mayonesa, queso — poco volumen, muchas calorías" },
    lanche: { nome: "Snacks y comida callejera", nota: "Pizza, hamburguesa, empanadas, açaí" },
    bebida: { nome: "Bebida", nota: "Lo que más pasa desapercibido en la cuenta del día" },
    sobremesa: { nome: "Postre", nota: "Si entró, entra en la cuenta" },
  },
  alimentos: {
    "arroz-branco": "Arroz blanco",
    "arroz-integral": "Arroz integral",
    macarrao: "Pasta con salsa de tomate",
    "macarrao-branco": "Pasta con salsa blanca",
    pure: "Puré de papa",
    polenta: "Polenta cremosa",
    cuscuz: "Cuscús de maíz",
    "pao-frances": "Pan francés (pan de sal)",
    "frango-grelhado": "Pollo a la plancha (pechuga)",
    "frango-empanado": "Pollo empanizado / a la milanesa",
    "frango-parmegiana": "Pollo a la parmesana",
    "bife-grelhado": "Filete de res a la plancha",
    "bife-milanesa": "Milanesa de res",
    picanha: "Picaña a la parrilla",
    "carne-moida": "Carne molida salteada",
    estrogonofe: "Strogonoff de carne",
    "lombo-porco": "Lomo de cerdo asado",
    linguica: "Longaniza",
    "peixe-grelhado": "Pescado a la plancha",
    "peixe-frito": "Pescado frito",
    camarao: "Camarones salteados",
    "ovo-frito": "Huevo frito",
    "ovo-cozido": "Huevo cocido",
    omelete: "Tortilla francesa (omelette)",
    feijoada: "Feijoada",
    "feijao-carioca": "Frijoles pintos",
    "feijao-preto": "Frijoles negros",
    "feijao-tropeiro": "Feijão tropeiro (frijoles con harina y tocino)",
    farofa: "Farofa (harina de yuca tostada)",
    "batata-frita": "Papas fritas",
    "mandioca-frita": "Yuca frita",
    "mandioca-cozida": "Yuca cocida",
    "legumes-refogados": "Verduras salteadas",
    "legumes-vapor": "Verduras al vapor",
    couve: "Col rizada salteada",
    "salada-folhas": "Hojas y tomate (sin aliño)",
    "salada-maionese": "Ensalada de mayonesa (ensaladilla)",
    vinagrete: "Vinagreta (pico de gallo)",
    beterraba: "Remolacha cocida",
    azeite: "Aceite de oliva",
    maionese: "Mayonesa",
    "molho-tomate": "Salsa de tomate",
    "molho-branco": "Salsa blanca / 4 quesos",
    "queijo-mussarela": "Queso mozzarella",
    catupiry: "Queso crema (requeijão / catupiry)",
    "pizza-mussarela": "Pizza de mozzarella",
    "pizza-calabresa": "Pizza de longaniza (calabresa)",
    hamburguer: "Hamburguesa artesanal",
    "sanduiche-natural": "Sándwich natural",
    pastel: "Pastel frito (empanada)",
    coxinha: "Coxinha (croqueta de pollo)",
    esfiha: "Esfiha de carne",
    "pao-de-queijo": "Pan de queso",
    "tapioca-queijo": "Tapioca con queso",
    yakisoba: "Yakisoba",
    sushi: "Sushi / nigiri",
    acai: "Açaí con granola y plátano",
    agua: "Agua o té sin azúcar",
    refrigerante: "Refresco",
    "refrigerante-zero": "Refresco zero",
    "suco-natural": "Jugo natural de naranja",
    "suco-caixinha": "Jugo de caja / néctar",
    cerveja: "Cerveza",
    caipirinha: "Caipiriña",
    fruta: "Fruta",
    pudim: "Flan de leche",
    mousse: "Mousse de chocolate",
    sorvete: "Helado",
    "petit-gateau": "Coulant (petit gâteau) con helado",
    brigadeiro: "Brigadeiro (trufa de chocolate)",
  },
  unidades: {
    concha: "cucharón",
    escumadeira: "espumadera",
    "colher de servir": "cuchara de servir",
    fatia: "rebanada",
    unidade: "unidad",
    "palma da mão": "palma de la mano",
    gomo: "pieza",
    punhado: "puñado",
    pegador: "pinza de ensalada",
    "fio (colher de chá)": "chorrito (cucharadita)",
    "colher de sopa": "cucharada",
    "concha pequena": "cucharón pequeño",
    peça: "pieza",
    "copo de 300 ml": "vaso de 300 ml",
    "long neck (355 ml)": "botellín (355 ml)",
    "copo de 200 ml": "vaso de 200 ml",
    porção: "porción",
    taça: "copa",
    bola: "bola",
  },
  referencias: [
    {
      gesto: "Palma de la mano",
      equivale: "≈ 120 g de carne, pollo o pescado",
      nota: "Sin los dedos, y con el grosor de la propia palma.",
    },
    {
      gesto: "Puño cerrado",
      equivale: "≈ 1 cucharón lleno de arroz o pasta",
      nota: "Es también el volumen aproximado de una taza.",
    },
    {
      gesto: "Cucharón del restaurante",
      equivale: "≈ 100 g de arroz · 80 g de frijoles",
      nota: "El del bufé es más grande que el de casa. Ante la duda, suma medio.",
    },
    {
      gesto: "Pulgar entero",
      equivale: "≈ 1 cucharada de grasa",
      nota: "Vale para aceite, mayonesa, queso crema y mantequilla.",
    },
    {
      gesto: "Puño cerrado de hojas",
      equivale: "≈ 1 pinza de ensalada",
      nota: "La hoja cruda ocupa mucho volumen y pesa poco.",
    },
  ],
  aviso:
    "Esto es una estimación para decidir en el momento, no una medición. Los valores vienen de las tablas brasileñas TACO y TBCA, pero cada cocina usa más o menos aceite, cortes más o menos grasos y porciones mayores o menores que la media. El aceite de fritura y la salsa son la mayor fuente de error — y por eso el resultado aparece en rango, y no como un número exacto.",
};

const en: TextosPrato = {
  seo: {
    titulo: "Plate Calorie Calculator for your meal",
    descricao:
      "Build your restaurant plate and see calories, protein, carbs and fat. Measured by hand, no scale and no sign-up. Brazilian restaurant foods.",
    ogTitulo: "Plate Calorie Calculator",
    ogDescricao:
      "Calories and macros for a restaurant plate, measured in ladles and palms — not grams.",
    ogAlt: "Plate Calorie Calculator",
  },
  jsonld: {
    nome: "Plate Calorie Calculator",
    sistema: "All — runs in the browser",
    descricao:
      "Builds a restaurant plate with visual portion references and estimates calories, protein, carbs and fat as a range.",
    recursos: [
      "Brazilian restaurant food table",
      "Portions measured by hand, no scale",
      "Calories and macros as an estimate range",
      "Comparison with your daily calorie target",
      "Lower-energy-density swap suggestions",
    ],
    inicio: "Home",
  },
  pagina: {
    voceEsta: "You are here",
    inicio: "Home",
    migalha: "Plate Calorie Calculator",
    eyebrow: "Free tool",
    titulo: ["What today's plate", "really weighs."],
    texto:
      "You're eating out and have no idea what it costs your day. Build the plate here — in ladles and palms, not grams — and see calories and macros before you sit down.",
    destaques: [
      "70 Brazilian restaurant foods",
      "Measured by hand, no scale",
      "Results as a range, not a fake number",
    ],
    honestidade:
      "No photo and no app can guess how much your food weighs. Here the amount comes from you — the tool just does the math, and shows the margin of error it really has.",
  },
  est: {
    guiaTitulo: "How to measure without a scale: the hand guide",
    guiaTexto:
      "Your hand scales with your body — bigger people have bigger hands and need bigger portions. That's why it works better as a reference than a fixed amount in grams.",
    montarEyebrow: "01 / Build the plate",
    montarTitulo: "What's in front of you?",
    montarTexto:
      "Tap everything you're going to eat. Then adjust the amount — not in grams, but in ladles and palms, which is how food actually shows up.",
    contaEyebrow: "02 / The math",
    vazio:
      "Your plate is empty. Pick from the list and the estimate shows up here, updating with each item.",
    tirar: (nome) => `Remove ${nome} from the plate`,
    remover: "remove",
    estimativa: "Meal estimate",
    a: "to",
    deComida: (g) => `kcal · ${g} of food`,
    proteina: "Protein",
    carboidrato: "Carbs",
    gordura: "Fat",
    alcool: (min, max) => `Alcohol: ${min}–${max} g`,
    alcoolTexto: (kcal) =>
      `— about ${kcal} kcal. Alcohol has 7 kcal per gram and doesn't show up in any macronutrient, which is exactly why it slips past most people's math.`,
    meta: "Your daily target",
    kcalDia: "kcal per day",
    naoSabe: "Don't know it? Calculate it in a minute",
    barraAria: (min, max) => `Between ${min}% and ${max}% of your daily target`,
    pctFaixa: (min, max) => `${min}% to ${max}%`,
    daMeta: "of your daily target",
    sobram: (kcal) => `· about ${kcal} kcal left`,
    frases: {
      folgado: "Fits easily. There's room for the rest of the day's meals with no adjustment at all.",
      dentro: "That's the normal weight of a main meal. The day adds up without having to make up for anything.",
      apertado:
        "It's more than a meal usually takes up. You can still close the day, but the other meals get lean — go for protein and vegetables in them.",
      estourou:
        "On its own, this meal already goes over your daily target. It happens, and it doesn't erase the process: what counts is the weekly average, not its worst day.",
    },
    ondeEstao: "Where the calories are",
    aliviar: "If you want to lighten it without eating less",
    economia: (kcal) => `−${kcal} kcal for the same amount of food`,
    limpar: "Clear the plate",
    ponteTitulo: "Knowing the math helps. Having a plan that makes it unnecessary is better.",
    ponteTexto:
      "This tool solves tonight's dinner. What changes your body is the sum of the weeks — and that part is built with you, not eyeballed.",
    comecar: "Start coaching",
    calcular: "Calculate my calories",
    itens: (n) => `${n} ${n === 1 ? "item" : "items"}`,
    doDia: (min, max) => ` · ${min}–${max}% of the day`,
  },
  categorias: {
    base: { nome: "Base", nota: "Rice, pasta, mashed potatoes — what fills half the plate" },
    proteina: { nome: "Protein", nota: "Beef, chicken, fish, eggs" },
    acompanhamento: { nome: "Sides", nota: "Beans, farofa, potatoes, vegetables" },
    salada: { nome: "Salad", nota: "Raw and sautéed — the dressing is almost always underestimated" },
    extra: { nome: "Sauces & extras", nota: "Olive oil, mayo, cheese — little volume, lots of calories" },
    lanche: { nome: "Snacks & street food", nota: "Pizza, burgers, savory pastries, açaí" },
    bebida: { nome: "Drinks", nota: "What most often goes unnoticed in the day's math" },
    sobremesa: { nome: "Dessert", nota: "If it went in, it goes in the count" },
  },
  alimentos: {
    "arroz-branco": "White rice",
    "arroz-integral": "Brown rice",
    macarrao: "Pasta with tomato sauce",
    "macarrao-branco": "Pasta with white sauce",
    pure: "Mashed potatoes",
    polenta: "Creamy polenta",
    cuscuz: "Corn couscous (cuscuz)",
    "pao-frances": "French roll",
    "frango-grelhado": "Grilled chicken breast",
    "frango-empanado": "Breaded chicken / chicken milanese",
    "frango-parmegiana": "Chicken parmigiana",
    "bife-grelhado": "Grilled beef steak",
    "bife-milanesa": "Breaded beef steak (milanese)",
    picanha: "Grilled picanha (top sirloin cap)",
    "carne-moida": "Sautéed ground beef",
    estrogonofe: "Beef stroganoff",
    "lombo-porco": "Roast pork loin",
    linguica: "Pork sausage (linguiça)",
    "peixe-grelhado": "Grilled fish",
    "peixe-frito": "Fried fish",
    camarao: "Sautéed shrimp",
    "ovo-frito": "Fried egg",
    "ovo-cozido": "Boiled egg",
    omelete: "Omelet",
    feijoada: "Feijoada (black bean and pork stew)",
    "feijao-carioca": "Pinto beans",
    "feijao-preto": "Black beans",
    "feijao-tropeiro": "Feijão tropeiro (beans with manioc flour and bacon)",
    farofa: "Farofa (toasted manioc flour)",
    "batata-frita": "French fries",
    "mandioca-frita": "Fried cassava",
    "mandioca-cozida": "Boiled cassava",
    "legumes-refogados": "Sautéed vegetables",
    "legumes-vapor": "Steamed vegetables",
    couve: "Sautéed collard greens",
    "salada-folhas": "Greens and tomato (no dressing)",
    "salada-maionese": "Potato mayo salad",
    vinagrete: "Vinaigrette salsa",
    beterraba: "Boiled beets",
    azeite: "Olive oil",
    maionese: "Mayonnaise",
    "molho-tomate": "Tomato sauce",
    "molho-branco": "White sauce / four-cheese sauce",
    "queijo-mussarela": "Mozzarella cheese",
    catupiry: "Cream cheese (requeijão / catupiry)",
    "pizza-mussarela": "Mozzarella pizza",
    "pizza-calabresa": "Calabresa sausage pizza",
    hamburguer: "Gourmet burger",
    "sanduiche-natural": "Light sandwich",
    pastel: "Fried pastel (Brazilian turnover)",
    coxinha: "Coxinha (chicken croquette)",
    esfiha: "Beef esfiha (open meat pie)",
    "pao-de-queijo": "Pão de queijo (cheese bread)",
    "tapioca-queijo": "Tapioca crepe with cheese",
    yakisoba: "Yakisoba",
    sushi: "Sushi / nigiri",
    acai: "Açaí bowl with granola and banana",
    agua: "Water or unsweetened tea",
    refrigerante: "Soda",
    "refrigerante-zero": "Diet soda",
    "suco-natural": "Fresh orange juice",
    "suco-caixinha": "Boxed juice / nectar",
    cerveja: "Beer",
    caipirinha: "Caipirinha",
    fruta: "Fruit",
    pudim: "Flan (milk pudding)",
    mousse: "Chocolate mousse",
    sorvete: "Ice cream",
    "petit-gateau": "Lava cake with ice cream",
    brigadeiro: "Brigadeiro (chocolate truffle)",
  },
  unidades: {
    concha: "ladle",
    escumadeira: "slotted spoon",
    "colher de servir": "serving spoon",
    fatia: "slice",
    unidade: "piece",
    "palma da mão": "palm",
    gomo: "link",
    punhado: "handful",
    pegador: "salad tongs",
    "fio (colher de chá)": "drizzle (teaspoon)",
    "colher de sopa": "tablespoon",
    "concha pequena": "small ladle",
    peça: "piece",
    "copo de 300 ml": "300 ml glass",
    "long neck (355 ml)": "bottle (355 ml)",
    "copo de 200 ml": "200 ml glass",
    porção: "serving",
    taça: "bowl",
    bola: "scoop",
  },
  referencias: [
    {
      gesto: "Palm of your hand",
      equivale: "≈ 120 g of beef, chicken or fish",
      nota: "Without the fingers, and as thick as your own palm.",
    },
    {
      gesto: "Closed fist",
      equivale: "≈ 1 full ladle of rice or pasta",
      nota: "It's also roughly the volume of a cup.",
    },
    {
      gesto: "Restaurant ladle",
      equivale: "≈ 100 g of rice · 80 g of beans",
      nota: "The buffet one is bigger than the one at home. When in doubt, add half.",
    },
    {
      gesto: "Whole thumb",
      equivale: "≈ 1 tablespoon of fat",
      nota: "Applies to olive oil, mayo, cream cheese and butter.",
    },
    {
      gesto: "Closed fist of greens",
      equivale: "≈ 1 pair of salad tongs",
      nota: "Raw greens take up a lot of volume and weigh little.",
    },
  ],
  aviso:
    "This is an estimate for deciding on the spot, not a measurement. The values come from the Brazilian TACO and TBCA food tables, but every kitchen uses more or less oil, fattier or leaner cuts and bigger or smaller portions than average. Frying oil and sauce are the biggest source of error — which is why the result shows up as a range, not an exact number.",
};

export const TEXTOS_PRATO: Record<Idioma, TextosPrato> = { pt, es, en };
