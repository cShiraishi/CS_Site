import {
  appsNav,
  contato,
  duvidas,
  hero,
  marca,
  metodo,
  nav,
  programa,
  resultados,
  rodape,
  sobre,
} from "./content";

export type Idioma = "pt" | "es" | "en";

export const IDIOMAS_DISPONIVEIS = [
  { codigo: "pt" as const, bandeira: "🇧🇷", sigla: "PT", nome: "Português", rotaHome: "/" },
  { codigo: "es" as const, bandeira: "🇪🇸", sigla: "ES", nome: "Español", rotaHome: "/es" },
  { codigo: "en" as const, bandeira: "🇬🇧", sigla: "EN", nome: "English", rotaHome: "/en" },
] as const;

export function detectarIdiomaPorCaminho(pathname: string | null): Idioma | null {
  if (!pathname) return null;
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/") return "pt";
  return null;
}

export interface ConteudoTraduzido {
  idioma: Idioma;
  rotaHome: string;
  marca: {
    assinatura: string;
    descritor: string;
  };
  ui: {
    escolherIdioma: string;
    idiomaAtual: string;
    escolherModo: string;
    modoEle: string;
    modoEla: string;
    modoElaEmBreve: string;
    emBreve: string;
    elaCiclo: string;
    elaTreinoCasa: string;
    elaGestacao: string;
    idiomaNativoNota: string;
    inicio: string;
    comecarConsultoria: string;
    comecarCurto: [string, string];
    abrirMenu: string;
    fecharMenu: string;
    pastaApps: string;
    fecharApps: string;
    abrirApps: string;
    ferramentasGratuitas: string;
    gratisCurto: string;
    ferramentasTooltip: string;
    novoBadge: string;
    voltar: string;
    pastaAppsTitulo: string;
    appsResumo: string;
    comoFuncionaEyebrow: string;
    inclusoLabel: string;
    quemVaiAcompanhar: string;
    navegacaoRodape: string;
    contatoRodape: string;
  };
  nav: ReadonlyArray<{ label: string; href: string; topo: boolean }>;
  appsNav: ReadonlyArray<{ label: string; href: string }>;
  dockConteudos: {
    biblioteca: string;
    resetMetabolico: string;
    csflix: string;
    receitas: string;
    resultados: string;
  };
  hero: {
    eyebrow: string;
    titulo: string;
    texto: string;
    cta: string;
    ctaSecundario: string;
    nota: string;
    altMonograma: string;
  };
  metodo: {
    eyebrow: string;
    titulo: string;
    texto: string;
    etapas: ReadonlyArray<{ n: string; titulo: string; texto: string }>;
  };
  programa: {
    eyebrow: string;
    titulo: string;
    texto: string;
    itens: ReadonlyArray<{ titulo: string; texto: string }>;
  };
  resultados: {
    eyebrow: string;
    titulo: string;
    texto: string;
    cta: string;
    aviso: string;
    verNoInstagram: (handle: string) => string;
  };
  sobre: {
    eyebrow: string;
    titulo: string;
    citacao: string;
    curto: string;
    altFoto: string;
  };
  contato: {
    eyebrow: string;
    titulo: string;
    texto: string;
    nota: string;
    cta: string;
    passos: ReadonlyArray<{ numero: string; titulo: string; nota: string }>;
  };
  duvidas: {
    eyebrow: string;
    titulo: string;
    itens: ReadonlyArray<{ p: string; r: string }>;
  };
  rodape: {
    disclaimer: string;
  };
}

const pt: ConteudoTraduzido = {
  idioma: "pt",
  rotaHome: "/",
  marca: {
    assinatura: marca.assinatura,
    descritor: marca.descritor,
  },
  ui: {
    escolherIdioma: "Escolher idioma",
    idiomaAtual: "Atual",
    escolherModo: "Modo do site",
    modoEle: "Ele",
    modoEla: "Ela",
    modoElaEmBreve: "Modo Ela · chegando",
    emBreve: "Em breve",
    elaCiclo: "Ciclo & TPM",
    elaTreinoCasa: "Treino em casa",
    elaGestacao: "Gestação",
    idiomaNativoNota: "Páginas nativas em Português, Español e English.",
    inicio: "Início",
    comecarConsultoria: "Começar consultoria",
    comecarCurto: ["Começar", "consultoria"],
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    pastaApps: "Apps",
    fecharApps: "Fechar −",
    abrirApps: "5 apps +",
    ferramentasGratuitas: "Ferramentas gratuitas",
    gratisCurto: "Grátis",
    ferramentasTooltip: "Ferramentas",
    novoBadge: "Novo",
    voltar: "Voltar",
    pastaAppsTitulo: "Pasta · Apps",
    appsResumo: "% Gordura · Postura · Raio-X · Calorias · Prato",
    comoFuncionaEyebrow: "Como funciona",
    inclusoLabel: "Incluso",
    quemVaiAcompanhar: "Quem vai te acompanhar",
    navegacaoRodape: "Navegação",
    contatoRodape: "Contato",
  },
  nav,
  appsNav,
  dockConteudos: {
    biblioteca: "Biblioteca",
    resetMetabolico: "Reset Metabólico",
    csflix: "CSFlix",
    receitas: "Receitas Fit",
    resultados: "Resultados",
  },
  hero: {
    ...hero,
    altMonograma: "Monograma CS — branco e ouro, com seta ascendente",
  },
  metodo,
  programa,
  resultados: {
    ...resultados,
    verNoInstagram: (handle: string) => `Ver ${handle} no Instagram`,
  },
  sobre: {
    eyebrow: sobre.eyebrow,
    titulo: sobre.titulo,
    citacao: sobre.citacao,
    curto: sobre.curto,
    altFoto: "Carlos Seiti em ambiente de treino",
  },
  contato: {
    eyebrow: contato.eyebrow,
    titulo: contato.titulo,
    texto: contato.texto,
    nota: contato.nota,
    cta: contato.cta,
    passos: contato.passos,
  },
  duvidas,
  rodape,
};

const es: ConteudoTraduzido = {
  idioma: "es",
  rotaHome: "/es",
  marca: {
    assinatura: "Evolución con propósito",
    descritor: "Nutrición Avanzada",
  },
  ui: {
    escolherIdioma: "Elegir idioma",
    idiomaAtual: "Actual",
    escolherModo: "Modo del sitio",
    modoEle: "Él",
    modoEla: "Ella",
    modoElaEmBreve: "Modo Ella · muy pronto",
    emBreve: "Pronto",
    elaCiclo: "Ciclo y SPM",
    elaTreinoCasa: "Entreno en casa",
    elaGestacao: "Embarazo",
    idiomaNativoNota: "Páginas nativas en Português, Español e English.",
    inicio: "Inicio",
    comecarConsultoria: "Empezar asesoría",
    comecarCurto: ["Empezar", "asesoría"],
    abrirMenu: "Abrir menú",
    fecharMenu: "Cerrar menú",
    pastaApps: "Apps",
    fecharApps: "Cerrar −",
    abrirApps: "5 apps +",
    ferramentasGratuitas: "Herramientas gratuitas",
    gratisCurto: "Gratis",
    ferramentasTooltip: "Herramientas",
    novoBadge: "Nuevo",
    voltar: "Volver",
    pastaAppsTitulo: "Carpeta · Apps",
    appsResumo: "% Grasa · Postura · Rayos-X · Calorías · Plato",
    comoFuncionaEyebrow: "Cómo funciona",
    inclusoLabel: "Incluye",
    quemVaiAcompanhar: "Quién te acompañará",
    navegacaoRodape: "Navegación",
    contatoRodape: "Contacto",
  },
  nav: [
    { label: "Cómo funciona", href: "/es#metodo", topo: true },
    { label: "Reset Metabólico", href: "/programa-90-dias", topo: true },
    { label: "Biblioteca", href: "/biblioteca", topo: true },
    { label: "CSFlix", href: "/csflix", topo: true },
    { label: "Recetas Fit", href: "/receitas", topo: true },
    { label: "Resultados", href: "/es#resultados", topo: false },
    { label: "Sobre mí", href: "/es#sobre", topo: false },
  ],
  appsNav: [
    { label: "% Grasa", href: "/calculadora-de-gordura-corporal" },
    { label: "Postura", href: "/postura" },
    { label: "Rayos-X", href: "/raio-x-postural" },
    { label: "Calorías", href: "/calculadora-de-calorias" },
    { label: "Plato", href: "/calculadora-do-prato" },
  ],
  dockConteudos: {
    biblioteca: "Biblioteca",
    resetMetabolico: "Reset Metabólico",
    csflix: "CSFlix",
    receitas: "Recetas Fit",
    resultados: "Resultados",
  },
  hero: {
    eyebrow: "Asesoría online de entrenamiento y dieta",
    titulo: "Pierde grasa sin\ndietas extremas.",
    texto:
      "Nutrición y entrenamiento basados en evidencia científica, adaptados a tu cuerpo y a tu rutina. Sin restricciones innecesarias. Sin promesas vacías.",
    cta: "Empezar asesoría online",
    ctaSecundario: "Ver resultados",
    nota: "Plazas limitadas por grupo — seguimiento individual.",
    altMonograma: "Monograma CS — blanco y oro, con flecha ascendente",
  },
  metodo: {
    eyebrow: "Método",
    titulo: "Dirección antes que esfuerzo.",
    texto:
      "Cuatro etapas diseñadas para reducir al mínimo la probabilidad de abandonar a mitad de camino.",
    etapas: [
      {
        n: "01",
        titulo: "Diagnóstico",
        texto:
          "Historial, analíticas, rutina y limitaciones. El punto de partida define el camino.",
      },
      {
        n: "02",
        titulo: "Protocolo",
        texto:
          "Dieta y entrenamiento diseñados juntos, según tu gasto energético real y lo que puedes sostener.",
      },
      {
        n: "03",
        titulo: "Ejecución",
        texto:
          "Soporte directo durante la semana. Duda resuelta en el día es adherencia preservada.",
      },
      {
        n: "04",
        titulo: "Ajuste",
        texto:
          "Revisión quincenal con tus datos reales. El plan se adapta a tu cuerpo, no al revés.",
      },
    ],
  },
  programa: {
    eyebrow: "Programa",
    titulo: "Qué está incluido.",
    texto: "Seguimiento individual, desde el diagnóstico hasta el ajuste.",
    itens: [
      {
        titulo: "Plan de alimentación individual",
        texto:
          "Creado con los alimentos que ya consumes, con opciones de sustitución para cada comida.",
      },
      {
        titulo: "Entrenamiento periodizado",
        texto:
          "Adaptado a tu nivel, al equipamiento disponible y a la frecuencia que cabe en tu semana.",
      },
      {
        titulo: "Ajuste quincenal",
        texto:
          "Carga, volumen y calorías revisados con tus datos — suplementación incluida cuando aporta valor real.",
      },
      {
        titulo: "Soporte directo",
        texto:
          "Canal abierto cada semana. Terminas sabiendo mantener tus resultados por tu cuenta: ese es el objetivo.",
      },
    ],
  },
  resultados: {
    eyebrow: "Resultados",
    titulo: "Progreso real, medido.",
    texto:
      "Personas reales, cada una con un punto de partida, rutina y ritmo diferentes.",
    cta: "Ver transformaciones en Instagram",
    aviso:
      "Los resultados varían según la adherencia, el punto de partida y la individualidad biológica.",
    verNoInstagram: (handle: string) => `Ver ${handle} en Instagram`,
  },
  sobre: {
    eyebrow: "Sobre mí",
    titulo: "Ciencia aplicada\na tu día a día.",
    citacao: "La evolución no es prisa. Es dirección.",
    curto:
      "Dos maestrías en Ciencia de los Alimentos, doctorado en curso y atleta de Classic Bodybuilding. Ningún plan mío depende de que seas perfecto.",
    altFoto: "Carlos Seiti en ambiente de entrenamiento",
  },
  contato: {
    eyebrow: "Siguiente paso",
    titulo: "El siguiente paso\nempieza ahora.",
    texto:
      "Cuéntame tu contexto. Respondo personalmente con el camino recomendado, sin compromiso.",
    nota: "Tus datos se utilizan únicamente para responder a esta consulta.",
    cta: "Empezar mi asesoría",
    passos: [
      {
        numero: "01",
        titulo: "Cuestionario breve",
        nota: "Objetivo, rutina e historial — cinco minutos",
      },
      {
        numero: "02",
        titulo: "Análisis de tu caso",
        nota: "Leo todo personalmente antes de responder",
      },
      {
        numero: "03",
        titulo: "Evaluación inicial",
        nota: "Te respondo con la ruta recomendada, sin compromiso",
      },
    ],
  },
  duvidas: {
    eyebrow: "Dudas frecuentes",
    titulo: "Antes de empezar.",
    itens: [
      {
        p: "¿Tendré que eliminar carbohidratos, gluten o lactosa?",
        r: "Solo si existe un motivo clínico o una preferencia personal tuya. La restricción sin justificación es la razón principal por la que la gente abandona la dieta.",
      },
      {
        p: "¿En cuánto tiempo veré resultados?",
        r: "Los primeros cambios de composición corporal suelen notarse entre la cuarta y la octava semana. El ritmo depende de tu punto de partida y adherencia. No trabajo con promesas de plazos irreales.",
      },
      {
        p: "¿Necesito ir a un gimnasio?",
        r: "No necesariamente. El entrenamiento se estructura con lo que tienes disponible, incluyendo opciones completas para entrenar en casa.",
      },
      {
        p: "¿Esto sustituye una consulta médica o clínica?",
        r: "No. La asesoría es un servicio de orientación en entrenamiento y nutrición deportiva y no sustituye el seguimiento médico o clínico. Si tienes una condición de salud diagnosticada, tomas medicación continua o estás embarazada, mantén también el control con tu médico.",
      },
    ],
  },
  rodape: {
    disclaimer:
      "Asesoría de orientación en entrenamiento y nutrición deportiva. No sustituye evaluación médica o nutricional clínica. Los resultados varían individualmente.",
  },
};

const en: ConteudoTraduzido = {
  idioma: "en",
  rotaHome: "/en",
  marca: {
    assinatura: "Evolution with purpose",
    descritor: "Advanced Nutrition",
  },
  ui: {
    escolherIdioma: "Choose language",
    idiomaAtual: "Current",
    escolherModo: "Site mode",
    modoEle: "Him",
    modoEla: "Her",
    modoElaEmBreve: "Her Mode · coming soon",
    emBreve: "Soon",
    elaCiclo: "Cycle & PMS",
    elaTreinoCasa: "Home workouts",
    elaGestacao: "Pregnancy",
    idiomaNativoNota: "Native pages in Português, Español, and English.",
    inicio: "Home",
    comecarConsultoria: "Start coaching",
    comecarCurto: ["Start", "coaching"],
    abrirMenu: "Open menu",
    fecharMenu: "Close menu",
    pastaApps: "Apps",
    fecharApps: "Close −",
    abrirApps: "5 apps +",
    ferramentasGratuitas: "Free tools",
    gratisCurto: "Free",
    ferramentasTooltip: "Free Tools",
    novoBadge: "New",
    voltar: "Back",
    pastaAppsTitulo: "Folder · Apps",
    appsResumo: "Body Fat % · Posture · X-Ray · Calories · Plate",
    comoFuncionaEyebrow: "How it works",
    inclusoLabel: "Included",
    quemVaiAcompanhar: "Who will guide you",
    navegacaoRodape: "Navigation",
    contatoRodape: "Contact",
  },
  nav: [
    { label: "How it works", href: "/en#metodo", topo: true },
    { label: "Metabolic Reset", href: "/programa-90-dias", topo: true },
    { label: "Library", href: "/biblioteca", topo: true },
    { label: "CSFlix", href: "/csflix", topo: true },
    { label: "Fit Recipes", href: "/receitas", topo: true },
    { label: "Results", href: "/en#resultados", topo: false },
    { label: "About", href: "/en#sobre", topo: false },
  ],
  appsNav: [
    { label: "Body Fat %", href: "/calculadora-de-gordura-corporal" },
    { label: "Posture", href: "/postura" },
    { label: "Posture X-Ray", href: "/raio-x-postural" },
    { label: "Calories", href: "/calculadora-de-calorias" },
    { label: "Plate Builder", href: "/calculadora-do-prato" },
  ],
  dockConteudos: {
    biblioteca: "Library",
    resetMetabolico: "Metabolic Reset",
    csflix: "CSFlix",
    receitas: "Fit Recipes",
    resultados: "Results",
  },
  hero: {
    eyebrow: "Online training & nutrition coaching",
    titulo: "Lose fat without\nextreme diets.",
    texto:
      "Evidence-based nutrition and training tailored to your body and daily routine. No unnecessary restrictions. No empty promises.",
    cta: "Start online coaching",
    ctaSecundario: "See results",
    nota: "Limited spots per cohort — 1-on-1 individualized coaching.",
    altMonograma: "CS Monogram — white and gold, with ascending arrow",
  },
  metodo: {
    eyebrow: "Method",
    titulo: "Direction before effort.",
    texto:
      "Four clear stages designed to eliminate guesswork and keep you consistent.",
    etapas: [
      {
        n: "01",
        titulo: "Assessment",
        texto:
          "History, lab work, schedule, and constraints. Your starting point defines the roadmap.",
      },
      {
        n: "02",
        titulo: "Protocol",
        texto:
          "Nutrition and training built together around your true energy expenditure and lifestyle.",
      },
      {
        n: "03",
        titulo: "Execution",
        texto:
          "Direct weekly support. Answering a question on the same day keeps adherence intact.",
      },
      {
        n: "04",
        titulo: "Adjustment",
        texto:
          "Bi-weekly review based on your data. The plan adapts to your body, not the other way around.",
      },
    ],
  },
  programa: {
    eyebrow: "Program",
    titulo: "What is included.",
    texto: "1-on-1 coaching from initial assessment to bi-weekly adjustments.",
    itens: [
      {
        titulo: "Custom nutrition plan",
        texto:
          "Built around the foods you already enjoy, with practical swaps for every meal.",
      },
      {
        titulo: "Periodized training",
        texto:
          "Tailored to your experience level, available equipment, and weekly schedule.",
      },
      {
        titulo: "Bi-weekly adjustments",
        texto:
          "Load, volume, and calories updated from your real progress — evidence-based supplementation included when useful.",
      },
      {
        titulo: "Direct support",
        texto:
          "Open channel throughout the week. You finish knowing how to sustain your results independently.",
      },
    ],
  },
  resultados: {
    eyebrow: "Results",
    titulo: "Real, measured progress.",
    texto:
      "Real people, each with a different starting point, schedule, and pace.",
    cta: "See transformations on Instagram",
    aviso:
      "Results vary according to adherence, starting point, and individual physiology.",
    verNoInstagram: (handle: string) => `View ${handle} on Instagram`,
  },
  sobre: {
    eyebrow: "About",
    titulo: "Science applied\nto your daily life.",
    citacao: "Evolution is not rush. It is direction.",
    curto:
      "Two Master's degrees in Food Science, PhD candidate, and Classic Bodybuilding athlete. None of my plans require you to be perfect.",
    altFoto: "Carlos Seiti in a training environment",
  },
  contato: {
    eyebrow: "Next step",
    titulo: "Your next step\nstarts now.",
    texto:
      "Share your context and goals. I personally review and reply with the recommended path, with no obligation.",
    nota: "Your information is used strictly to reply to your inquiry.",
    cta: "Start my coaching",
    passos: [
      {
        numero: "01",
        titulo: "Short questionnaire",
        nota: "Goals, routine, and history — takes five minutes",
      },
      {
        numero: "02",
        titulo: "Case review",
        nota: "I read everything personally before replying",
      },
      {
        numero: "03",
        titulo: "Initial roadmap",
        nota: "I reply with the recommended approach, no strings attached",
      },
    ],
  },
  duvidas: {
    eyebrow: "FAQ",
    titulo: "Before you start.",
    itens: [
      {
        p: "Will I have to cut carbs, gluten, or dairy?",
        r: "Only if there is a medical reason or your personal preference. Unjustified restriction is the number one reason people quit their diet.",
      },
      {
        p: "How soon will I see results?",
        r: "Initial body composition changes typically appear between weeks four and eight. The pace depends on your starting point and consistency. I don't make empty timeline promises.",
      },
      {
        p: "Do I need a gym membership?",
        r: "Not necessarily. Your training program is built around the equipment you have available, including complete home workout options.",
      },
      {
        p: "Does this replace a clinical dietitian or physician?",
        r: "No. This coaching provides sports nutrition and training guidance and does not replace clinical medical care. If you have a diagnosed health condition, take continuous medication, or are pregnant, please continue following up with your physician.",
      },
    ],
  },
  rodape: {
    disclaimer:
      "Online training and sports nutrition coaching. Does not replace medical or clinical nutritional evaluation. Individual results vary.",
  },
};

export const TRADUCOES: Record<Idioma, ConteudoTraduzido> = {
  pt,
  es,
  en,
};

export function obterConteudo(idioma: Idioma = "pt"): ConteudoTraduzido {
  return TRADUCOES[idioma] ?? pt;
}
