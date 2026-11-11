/**
 * Receitas Fit — textos da interface e dos assuntos (pílulas/fileiras) nos
 * três idiomas. O português é idêntico ao original de
 * `src/lib/receitas.ts` e de `ReceitasFlix.tsx`.
 *
 * O conteúdo das receitas (ingredientes, preparo...) traduzido vive em
 * `./receitas-catalogo.ts`, que só o servidor importa.
 */

import type { Idioma } from "../rotas-idioma";
import {
  ASSUNTOS_INTERESSE,
  type AlimentoBase,
  type AssuntoInteresse,
  type InteresseId,
  type PilulaFiltroId,
} from "../receitas";

type TextoAssunto = Pick<AssuntoInteresse, "pilula" | "tituloTrilha" | "descricao">;

const ASSUNTOS_ES: Record<InteresseId, TextoAssunto> = {
  "menos-100-kcal": {
    pilula: "🍓 Postres < 100 kcal",
    tituloTrilha: "🍓 Postres con menos de 100 kcal",
    descricao:
      "Mousses, flanes, manzana en freidora de aire y helados de 68 a 95 kcal para comer dulce todos los días sin tocar el déficit.",
  },
  "vontade-de-doce": {
    pilula: "🍫 Calmar el Antojo de Dulce",
    tituloTrilha: "🍫 Para Calmar el Antojo de Dulce (Sin Salirte de la Dieta)",
    descricao:
      "Pasteles en taza, brownies, galletas y overnight oats que sustituyen el dulce calórico de la noche o de la tarde.",
  },
  "substitutos-do-pao": {
    pilula: "🥖 Sustitutos del Pan",
    tituloTrilha: "🥖 Sustitutos del Pan para el Desayuno",
    descricao:
      "Pan de queso de sartén, crepiocas y panqueques que aportan mucha más proteína y saciedad que el pan blanco.",
  },
  "mais-30g-proteina": {
    pilula: "💪 +30 g de Proteína",
    tituloTrilha: "💪 +30 g de Proteína en una Sola Comida",
    descricao:
      "Comidas y snacks dulces o salados que cumplen la meta de proteína de una vez, sin depender solo del pollo a la plancha.",
  },
  "ate-5-min": {
    pilula: "⚡ Listas en 5 min",
    tituloTrilha: "⚡ Listas en Hasta 5 Minutos (Rutina Apurada)",
    descricao:
      "Cero tiempo para cocinar: recetas de microondas, licuadora o una sola sartén.",
  },
  "com-aveia": {
    pilula: "🌾 Recetas con Avena",
    tituloTrilha: "🌾 Explorar Avena · Panqueques, Pasteles y Dulces Fit",
    descricao:
      "Cómo usar la fibra soluble (β-glucano) de la avena para tener saciedad prolongada en preparaciones dulces y panqueques.",
  },
  "com-tapioca": {
    pilula: "🫓 Tapioca y Crepioca",
    tituloTrilha: "🫓 Explorar Tapioca y Crepioca · Sin Gluten",
    descricao:
      "La combinación correcta de goma de tapioca con huevos y quesos magros para evitar el pico de glucosa.",
  },
};

const ASSUNTOS_EN: Record<InteresseId, TextoAssunto> = {
  "menos-100-kcal": {
    pilula: "🍓 Desserts < 100 kcal",
    tituloTrilha: "🍓 Desserts Under 100 kcal",
    descricao:
      "Mousses, flans, air fryer apples and ice creams from 68 to 95 kcal so you can eat something sweet every day without touching your deficit.",
  },
  "vontade-de-doce": {
    pilula: "🍫 Crush Sugar Cravings",
    tituloTrilha: "🍫 Crush Sugar Cravings (Without Breaking Your Diet)",
    descricao:
      "Mug cakes, brownies, cookies and overnight oats that replace the calorie-heavy evening or afternoon treat.",
  },
  "substitutos-do-pao": {
    pilula: "🥖 Bread Swaps",
    tituloTrilha: "🥖 Bread Swaps for Breakfast",
    descricao:
      "Skillet cheese bread, crepiocas and pancakes that deliver far more protein and fullness than a white bread roll.",
  },
  "mais-30g-proteina": {
    pilula: "💪 30g+ Protein",
    tituloTrilha: "💪 30g+ Protein in a Single Meal",
    descricao:
      "Sweet or savory meals and snacks that hit your protein target in one go, without relying only on grilled chicken.",
  },
  "ate-5-min": {
    pilula: "⚡ Ready in 5 min",
    tituloTrilha: "⚡ Ready in 5 Minutes or Less (Busy Days)",
    descricao:
      "Zero time to cook: microwave, blender or one-pan recipes.",
  },
  "com-aveia": {
    pilula: "🌾 Oat Recipes",
    tituloTrilha: "🌾 Explore Oats · Pancakes, Cakes & Fit Sweets",
    descricao:
      "How to use the soluble fiber (beta-glucan) in oats for longer-lasting fullness in sweet recipes and pancakes.",
  },
  "com-tapioca": {
    pilula: "🫓 Tapioca & Crepioca",
    tituloTrilha: "🫓 Explore Tapioca & Crepioca · Gluten-Free",
    descricao:
      "The right pairing of tapioca starch with eggs and lean cheeses to avoid a blood sugar spike.",
  },
};

/** Assuntos de interesse no idioma pedido (pt = a lista original). */
export function assuntosInteresse(idioma: Idioma): AssuntoInteresse[] {
  if (idioma === "pt") return ASSUNTOS_INTERESSE;
  const dic = idioma === "es" ? ASSUNTOS_ES : ASSUNTOS_EN;
  return ASSUNTOS_INTERESSE.map((a) => ({ ...a, ...dic[a.id] }));
}

export type TextosReceitas = {
  rotuloAlimento: Record<AlimentoBase, string>;
  pilulaTodas: string;
  trilhaTop: { nome: string; descricao: string };
  filtro: { sufixo: string; nomePadrao: string; descricaoPadrao: string };
  seloPagina: string;
  maisAssistido: string;
  proteina: string;
  videosCatalogados: (total: number) => string;
  assistirAgora: string;
  explorarCategorias: string;
  verReceita: (titulo: string) => string;
  soKcal: (kcal: number) => string;
  voltar: string;
  avancar: string;
  noYoutube: string;
  fechar: string;
  macros: { calorias: string; proteina: string; carbo: string; gordura: string; fibras: string };
  ingredientes: string;
  preparo: string;
  ciencia: string;
  /** Aviso discreto de que os vídeos são em português (só es/en). */
  notaVideos?: string;
  /** Bloco final da página. */
  cta: { titulo: string; texto: string; consultoria: string; calculadora: string };
  meta: { titulo: string; descricao: string; ogTitulo: string; ogDescricao: string; alt: string };
  jsonLd: { nome: string; descricao: (total: number) => string; inicio: string; receitas: string };
};

export const TEXTOS_RECEITAS: Record<Idioma, TextosReceitas> = {
  pt: {
    rotuloAlimento: {
      aveia: "🌾 Aveia",
      tapioca: "🫓 Tapioca",
      "ovos-iogurte": "🥚 Ovos & Iogurte",
      "frutas-gelatina": "🍓 < 100 kcal",
    },
    pilulaTodas: "🔥 Top Mais Vistos",
    trilhaTop: {
      nome: "Top Mais Assistidos · Ordenado por Views",
      descricao:
        "Os vídeos de receitas fit mais vistos do catálogo — comece pelos campeões de audiência.",
    },
    filtro: {
      sufixo: "Ordenado por Views",
      nomePadrao: "Receitas",
      descricaoPadrao: "Do vídeo mais assistido ao menos assistido dentro deste assunto.",
    },
    seloPagina: "Receitas Fitness",
    maisAssistido: "Mais assistido",
    proteina: "Proteína",
    videosCatalogados: (n) => `${n} vídeos catalogados`,
    assistirAgora: "Assistir agora",
    explorarCategorias: "Explorar categorias",
    verReceita: (t) => `Ver receita: ${t}`,
    soKcal: (k) => `🍓 Só ${k} kcal`,
    voltar: "voltar",
    avancar: "avançar",
    noYoutube: "no YouTube",
    fechar: "Fechar",
    macros: {
      calorias: "Calorias",
      proteina: "Proteína",
      carbo: "Carboidratos",
      gordura: "Gorduras",
      fibras: "Fibras",
    },
    ingredientes: "Ingredientes",
    preparo: "Modo de preparo",
    ciencia: "Por que funciona · Ciência de Alimentos",
    cta: {
      titulo: "A receita facilita. O protocolo encaixa no seu dia.",
      texto:
        "Comer bem sem enjoar é parte da adesão. Na consultoria, as quantidades e substituições já saem ajustadas para a sua meta.",
      consultoria: "Começar consultoria",
      calculadora: "Calcular minhas calorias",
    },
    meta: {
      titulo: "Receitas Fit com calorias e macros",
      descricao:
        "Receitas fit práticas com calorias, proteínas, carboidratos, gorduras e fibras calculadas — começando pela série de Panquecas de Aveia.",
      ogTitulo: "Receitas Fit",
      ogDescricao: "Receitas fit práticas com macros calculados e base em Ciência de Alimentos.",
      alt: "Receitas Fit",
    },
    jsonLd: {
      nome: "Receitas Fit — CSFlix",
      descricao: (n) =>
        `Receitas fit práticas com macros calculados e base em Ciência de Alimentos. ${n} receitas disponíveis.`,
      inicio: "Início",
      receitas: "Receitas",
    },
  },
  es: {
    rotuloAlimento: {
      aveia: "🌾 Avena",
      tapioca: "🫓 Tapioca",
      "ovos-iogurte": "🥚 Huevos y Yogur",
      "frutas-gelatina": "🍓 < 100 kcal",
    },
    pilulaTodas: "🔥 Top Más Vistos",
    trilhaTop: {
      nome: "Top Más Vistos · Ordenado por Vistas",
      descricao:
        "Los videos de recetas fit más vistos del catálogo: empieza por los campeones de audiencia.",
    },
    filtro: {
      sufixo: "Ordenado por Vistas",
      nomePadrao: "Recetas",
      descricaoPadrao: "Del video más visto al menos visto dentro de este tema.",
    },
    seloPagina: "Recetas Fitness",
    maisAssistido: "Más visto",
    proteina: "Proteína",
    videosCatalogados: (n) => `${n} videos en el catálogo`,
    assistirAgora: "Ver ahora",
    explorarCategorias: "Explorar categorías",
    verReceita: (t) => `Ver receta: ${t}`,
    soKcal: (k) => `🍓 Solo ${k} kcal`,
    voltar: "anterior",
    avancar: "siguiente",
    noYoutube: "en YouTube",
    fechar: "Cerrar",
    macros: {
      calorias: "Calorías",
      proteina: "Proteína",
      carbo: "Carbohidratos",
      gordura: "Grasas",
      fibras: "Fibra",
    },
    ingredientes: "Ingredientes",
    preparo: "Preparación",
    ciencia: "Por qué funciona · Ciencia de los Alimentos",
    notaVideos: "Los videos están en portugués; la receta completa está traducida debajo de cada uno.",
    cta: {
      titulo: "La receta lo facilita. El protocolo lo encaja en tu día.",
      texto:
        "Comer bien sin aburrirte es parte de la adherencia. En la asesoría, las cantidades y sustituciones ya vienen ajustadas a tu meta.",
      consultoria: "Empezar asesoría",
      calculadora: "Calcular mis calorías",
    },
    meta: {
      titulo: "Recetas Fit con calorías y macros",
      descricao:
        "Recetas fit prácticas con calorías, proteínas, carbohidratos, grasas y fibra calculadas, empezando por la serie de Panqueques de Avena.",
      ogTitulo: "Recetas Fit",
      ogDescricao: "Recetas fit prácticas con macros calculados y base en Ciencia de los Alimentos.",
      alt: "Recetas Fit",
    },
    jsonLd: {
      nome: "Recetas Fit — CSFlix",
      descricao: (n) =>
        `Recetas fit prácticas con macros calculados y base en Ciencia de los Alimentos. ${n} recetas disponibles.`,
      inicio: "Inicio",
      receitas: "Recetas",
    },
  },
  en: {
    rotuloAlimento: {
      aveia: "🌾 Oats",
      tapioca: "🫓 Tapioca",
      "ovos-iogurte": "🥚 Eggs & Yogurt",
      "frutas-gelatina": "🍓 < 100 kcal",
    },
    pilulaTodas: "🔥 Most Watched",
    trilhaTop: {
      nome: "Most Watched · Sorted by Views",
      descricao:
        "The most-viewed fit recipe videos in the catalog. Start with the audience favorites.",
    },
    filtro: {
      sufixo: "Sorted by Views",
      nomePadrao: "Recipes",
      descricaoPadrao: "From the most-watched to the least-watched video in this topic.",
    },
    seloPagina: "Fitness Recipes",
    maisAssistido: "Most watched",
    proteina: "Protein",
    videosCatalogados: (n) => `${n} videos in the catalog`,
    assistirAgora: "Watch now",
    explorarCategorias: "Browse categories",
    verReceita: (t) => `View recipe: ${t}`,
    soKcal: (k) => `🍓 Only ${k} kcal`,
    voltar: "previous",
    avancar: "next",
    noYoutube: "on YouTube",
    fechar: "Close",
    macros: {
      calorias: "Calories",
      proteina: "Protein",
      carbo: "Carbs",
      gordura: "Fat",
      fibras: "Fiber",
    },
    ingredientes: "Ingredients",
    preparo: "Directions",
    ciencia: "Why it works · Food Science",
    notaVideos: "Videos are in Portuguese; the full recipe is translated below each one.",
    cta: {
      titulo: "The recipe makes it easy. The protocol fits it into your day.",
      texto:
        "Eating well without getting bored is part of sticking with it. In coaching, portions and swaps come already adjusted to your goal.",
      consultoria: "Start coaching",
      calculadora: "Calculate my calories",
    },
    meta: {
      titulo: "Fit Recipes — Oat Pancakes and more | CSFlix",
      descricao:
        "Practical fit recipes with calculated calories, protein, carbs, fat and fiber, starting with the Oat Pancakes series.",
      ogTitulo: "Fit Recipes",
      ogDescricao: "Practical fit recipes with calculated macros, grounded in Food Science.",
      alt: "Fit Recipes",
    },
    jsonLd: {
      nome: "Fit Recipes — CSFlix",
      descricao: (n) =>
        `Practical fit recipes with calculated macros, grounded in Food Science. ${n} recipes available.`,
      inicio: "Home",
      receitas: "Recipes",
    },
  },
};

/** Pílulas de filtro no idioma pedido (pt = PILULAS_FILTRO original). */
export function pilulasFiltro(idioma: Idioma): { id: PilulaFiltroId; rotulo: string }[] {
  return [
    { id: "todas", rotulo: TEXTOS_RECEITAS[idioma].pilulaTodas },
    ...assuntosInteresse(idioma).map((a) => ({ id: a.id, rotulo: a.pilula })),
  ];
}
