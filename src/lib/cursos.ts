import { rotas } from "./content";
import type { Idioma } from "./rotas-idioma";

/**
 * Vitrine de cursos: a trilha de 5 módulos, do Reset Metabólico 21D ao
 * Nível A. Só o primeiro está à venda; os outros aparecem com cadeado e
 * "Avise-me" até existirem conteúdo e checkout. Para abrir um módulo
 * basta trocar `status` para "disponivel" e apontar `href` para a página
 * de venda.
 *
 * Sem "use client": serve a Server e Client Components.
 */

type Txt = Record<Idioma, string>;

export type IconeCurso =
  | "nutricao"
  | "halter"
  | "anilha"
  | "camadas"
  | "trofeu"
  | "play"
  | "talheres"
  | "calendario"
  | "tigela"
  | "grafico"
  | "montanha";

/** Módulo de dentro de um curso (as aulas do Reset, por exemplo). */
export type ModuloInterno = {
  tom: "verde" | "ouro";
  icone: IconeCurso;
  titulo: Txt;
  texto: Txt;
};

export type Curso = {
  slug: string;
  numero: number;
  /** verde nos módulos de base, ouro nos avançados (segue a arte da trilha) */
  tom: "verde" | "lima" | "ouro";
  icone: IconeCurso;
  status: "disponivel" | "em-breve";
  /** página de venda — só para os disponíveis */
  href?: string;
  /** produto em `pedidos` que libera o módulo na conta do aluno */
  produto?: string;
  titulo: Txt;
  duracao?: Txt;
  resultado: Txt;
  descricao: Txt;
  inclui: Record<Idioma, string[]>;
  /** com módulos, o curso ganha página própria em /cursos/[slug] */
  modulos?: ModuloInterno[];
  beneficios?: Record<Idioma, string[]>;
};

export const CURSOS: Curso[] = [
  {
    slug: "reset-metabolico",
    numero: 1,
    tom: "verde",
    icone: "nutricao",
    status: "disponivel",
    href: rotas.programa,
    produto: "programa-90-dias",
    titulo: { pt: "Reset Metabólico", es: "Reset Metabólico", en: "Metabolic Reset" },
    duracao: { pt: "21 dias", es: "21 días", en: "21 days" },
    resultado: { pt: "−5 a 12 kg", es: "−5 a 12 kg", en: "−5 to 12 kg" },
    descricao: {
      pt: "A porta de entrada. Três semanas para desinchar, estabilizar a glicemia e destravar a queima de gordura sem cortar carboidratos.",
      es: "La puerta de entrada. Tres semanas para deshinchar, estabilizar la glucemia y desbloquear la quema de grasa sin eliminar carbohidratos.",
      en: "The starting point. Three weeks to beat the bloat, stabilize blood sugar and unlock fat loss without cutting carbs.",
    },
    inclui: {
      pt: [
        "Plano individual de dieta e treino",
        "3 fases de 7 dias",
        "Plataforma CS Performance",
        "Guias práticos em PDF",
      ],
      es: [
        "Plan individual de dieta y entrenamiento",
        "3 fases de 7 días",
        "Plataforma CS Performance",
        "Guías prácticas en PDF",
      ],
      en: [
        "Custom nutrition and training plan",
        "3 phases of 7 days",
        "CS Performance platform",
        "Practical PDF guides",
      ],
    },
    beneficios: {
      pt: ["Perda de gordura", "Mais energia", "Rotina saudável", "Hábitos duradouros", "Evolução real"],
      es: ["Pérdida de grasa", "Más energía", "Rutina saludable", "Hábitos duraderos", "Evolución real"],
      en: ["Fat loss", "More energy", "Healthy routine", "Lasting habits", "Real progress"],
    },
    modulos: [
      {
        tom: "verde",
        icone: "play",
        titulo: { pt: "Começa por aqui", es: "Empieza aquí", en: "Start here" },
        texto: {
          pt: "Boas-vindas, método, regras e avaliação inicial",
          es: "Bienvenida, método, reglas y evaluación inicial",
          en: "Welcome, method, rules and initial assessment",
        },
      },
      {
        tom: "verde",
        icone: "talheres",
        titulo: { pt: "Nutrição inteligente", es: "Nutrición inteligente", en: "Smart nutrition" },
        texto: {
          pt: "Estratégia alimentar, montagem de pratos e substituições",
          es: "Estrategia alimentaria, armado de platos y sustituciones",
          en: "Eating strategy, building your plate and swaps",
        },
      },
      {
        tom: "verde",
        icone: "halter",
        titulo: { pt: "Treinos Reset 21D", es: "Entrenos Reset 21D", en: "Reset 21D workouts" },
        texto: {
          pt: "Treinos em casa e na academia, mobilidade e recuperação",
          es: "Entrenos en casa y en el gimnasio, movilidad y recuperación",
          en: "Home and gym workouts, mobility and recovery",
        },
      },
      {
        tom: "verde",
        icone: "calendario",
        titulo: { pt: "Desafio 21 dias", es: "Desafío 21 días", en: "21-day challenge" },
        texto: {
          pt: "Calendário de hábitos, missões diárias e sistema de pontos",
          es: "Calendario de hábitos, misiones diarias y sistema de puntos",
          en: "Habit calendar, daily missions and a points system",
        },
      },
      {
        tom: "ouro",
        icone: "tigela",
        titulo: { pt: "Cozinha Reset", es: "Cocina Reset", en: "Reset kitchen" },
        texto: {
          pt: "20 receitas práticas, econômicas e opções < 100 kcal",
          es: "20 recetas prácticas, económicas y opciones < 100 kcal",
          en: "20 practical, budget recipes and options under 100 kcal",
        },
      },
      {
        tom: "ouro",
        icone: "grafico",
        titulo: { pt: "Diário de evolução", es: "Diario de evolución", en: "Progress journal" },
        texto: {
          pt: "Registro de medidas, check-ins e avaliação final",
          es: "Registro de medidas, check-ins y evaluación final",
          en: "Measurements log, check-ins and final assessment",
        },
      },
      {
        tom: "ouro",
        icone: "montanha",
        titulo: { pt: "O próximo nível", es: "El siguiente nivel", en: "The next level" },
        texto: {
          pt: "Como manter os resultados e plano de continuidade",
          es: "Cómo mantener los resultados y plan de continuidad",
          en: "How to keep your results and a continuity plan",
        },
      },
    ],
  },
  {
    slug: "inicio-de-intensidade",
    numero: 2,
    tom: "verde",
    icone: "halter",
    status: "em-breve",
    titulo: { pt: "Início de Intensidade", es: "Inicio de Intensidad", en: "Intensity Kickoff" },
    duracao: { pt: "2 meses", es: "2 meses", en: "2 months" },
    resultado: {
      pt: "−5 kg de gordura e ganho de massa",
      es: "−5 kg de grasa y ganancia muscular",
      en: "−5 kg of fat and muscle gain",
    },
    descricao: {
      pt: "Depois do Reset, o corpo está pronto para mais. Dois meses para seguir perdendo gordura enquanto o treino ganha volume e começa a construir massa.",
      es: "Después del Reset, el cuerpo está listo para más. Dos meses para seguir perdiendo grasa mientras el entrenamiento gana volumen y empieza a construir músculo.",
      en: "After the Reset, your body is ready for more. Two months to keep losing fat while training volume goes up and starts building muscle.",
    },
    inclui: {
      pt: ["Treino progressivo de 8 semanas", "Dieta ajustada à nova fase", "Metas de gordura e de força"],
      es: ["Entrenamiento progresivo de 8 semanas", "Dieta ajustada a la nueva fase", "Metas de grasa y de fuerza"],
      en: ["8-week progressive training", "Nutrition adjusted to the new phase", "Fat-loss and strength targets"],
    },
  },
  {
    slug: "nivel-c",
    numero: 3,
    tom: "lima",
    icone: "anilha",
    status: "em-breve",
    titulo: { pt: "Nível C", es: "Nivel C", en: "Level C" },
    resultado: {
      pt: "Início das cargas de verdade",
      es: "Empiezan las cargas de verdad",
      en: "Real loads begin",
    },
    descricao: {
      pt: "A base de força. Técnica nos movimentos principais e progressão de carga com método, para o corpo responder sem lesão.",
      es: "La base de fuerza. Técnica en los movimientos principales y progresión de carga con método, para que el cuerpo responda sin lesiones.",
      en: "The strength foundation. Technique on the main lifts and methodical load progression, so your body responds without injury.",
    },
    inclui: {
      pt: ["Técnica dos movimentos básicos", "Progressão de carga semanal", "Dieta para ganho de força"],
      es: ["Técnica de los movimientos básicos", "Progresión de carga semanal", "Dieta para ganar fuerza"],
      en: ["Technique on the basic lifts", "Weekly load progression", "Nutrition for strength gains"],
    },
  },
  {
    slug: "nivel-b",
    numero: 4,
    tom: "ouro",
    icone: "camadas",
    status: "em-breve",
    titulo: { pt: "Nível B", es: "Nivel B", en: "Level B" },
    resultado: { pt: "Aumento de densidade", es: "Más densidad muscular", en: "More muscle density" },
    descricao: {
      pt: "Mais músculo por centímetro. Técnicas de intensidade e ajustes finos de dieta para ganhar densidade e definição.",
      es: "Más músculo por centímetro. Técnicas de intensidad y ajustes finos de dieta para ganar densidad y definición.",
      en: "More muscle per inch. Intensity techniques and fine-tuned nutrition to build density and definition.",
    },
    inclui: {
      pt: ["Técnicas de intensidade", "Periodização do treino", "Ajuste fino de macros"],
      es: ["Técnicas de intensidad", "Periodización del entrenamiento", "Ajuste fino de macros"],
      en: ["Intensity techniques", "Training periodization", "Fine-tuned macros"],
    },
  },
  {
    slug: "nivel-a",
    numero: 5,
    tom: "ouro",
    icone: "trofeu",
    status: "em-breve",
    titulo: { pt: "Nível A", es: "Nivel A", en: "Level A" },
    resultado: { pt: "Shape de atleta", es: "Físico de atleta", en: "Athlete physique" },
    descricao: {
      pt: "O topo da trilha. Estratégias avançadas de treino e nutrição para chegar e se manter no shape de atleta.",
      es: "La cima del camino. Estrategias avanzadas de entrenamiento y nutrición para llegar y mantenerte en un físico de atleta.",
      en: "The top of the path. Advanced training and nutrition strategies to reach and keep an athlete physique.",
    },
    inclui: {
      pt: ["Estratégias avançadas de treino", "Nutrição de alta performance", "Manutenção do resultado"],
      es: ["Estrategias avanzadas de entrenamiento", "Nutrición de alto rendimiento", "Mantenimiento del resultado"],
      en: ["Advanced training strategies", "High-performance nutrition", "Keeping your results"],
    },
  },
];

export const UI_CURSOS: Record<
  Idioma,
  {
    seoTitulo: string;
    seoDescricao: string;
    breadcrumbInicio: string;
    nome: string;
    eyebrow: string;
    titulo: string;
    texto: string;
    ctaComecar: string;
    ctaTrilha: string;
    pilares: [string, string, string, string];
    trilhaTitulo: string;
    trilhaTexto: string;
    modulo: string;
    disponivel: string;
    emBreve: string;
    verDetalhes: string;
    inclui: string;
    comprar: string;
    avisar: string;
    avisarNota: string;
    comecarPeloReset: string;
    fechar: string;
    alunoTitulo: string;
    alunoTexto: string;
    alunoEntrar: string;
    alunoPreview: string;
    dockTitulo: string;
    dockResumo: string;
    meusCursos: string;
    liberado: string;
    abrir: string;
    verNaVitrine: string;
    programaCompleto: (duracao: string) => string;
    modulosTitulo: (n: number) => string;
    modulosTexto: string;
    voltarCursos: string;
    garantir: string;
    meios: string;
  }
> = {
  pt: {
    seoTitulo: "Cursos: do Reset 21D ao shape de atleta",
    seoDescricao:
      "Programa completo de evolução em 5 módulos: Reset Metabólico 21 dias, Início de Intensidade e os níveis C, B e A. Nutrição estratégica e treino progressivo.",
    breadcrumbInicio: "Início",
    nome: "Cursos",
    eyebrow: "Cursos Carlos Seiti",
    titulo: "Programa completo de evolução",
    texto:
      "Cinco módulos em sequência, do Reset Metabólico ao shape de atleta. Comece pelo primeiro: os próximos abrem em breve.",
    ctaComecar: "Começar pelo Reset 21D",
    ctaTrilha: "Ver a trilha",
    pilares: ["Nutrição estratégica", "Treinos progressivos", "Acompanhamento de resultados", "Evolução em 5 níveis"],
    trilhaTitulo: "A trilha",
    trilhaTexto: "Cada módulo prepara o corpo para o próximo.",
    modulo: "Módulo",
    disponivel: "Disponível",
    emBreve: "Em breve",
    verDetalhes: "Ver detalhes",
    inclui: "O que inclui",
    comprar: "Quero começar",
    avisar: "Me avise no WhatsApp",
    avisarNota: "Este módulo ainda não abriu. Mande uma mensagem e você fica na lista de quem recebe primeiro.",
    comecarPeloReset: "Começar pelo Reset 21D",
    fechar: "Fechar",
    alunoTitulo: "Já é aluno?",
    alunoTexto: "Os cursos que você comprou ficam em Minha conta, liberados para assistir quando quiser.",
    alunoEntrar: "Entrar em Meus Cursos",
    alunoPreview: "Ver como é a plataforma",
    dockTitulo: "Cursos",
    dockResumo: "Reset 21D · Intensidade · Níveis C, B e A",
    meusCursos: "Meus cursos",
    liberado: "Liberado",
    abrir: "Abrir",
    verNaVitrine: "Ver na vitrine",
    programaCompleto: (d) => `Programa completo de ${d}`,
    modulosTitulo: (n) => `Os ${n} módulos`,
    modulosTexto: "Tudo o que você recebe ao entrar. Passe o mouse para explorar.",
    voltarCursos: "Todos os cursos",
    garantir: "Garantir meu acesso",
    meios: "Acesso imediato · Pix, cartão ou boleto",
  },
  es: {
    seoTitulo: "Cursos: del Reset 21D al físico de atleta",
    seoDescricao:
      "Programa completo de evolución en 5 módulos: Reset Metabólico 21 días, Inicio de Intensidad y los niveles C, B y A. Nutrición estratégica y entreno progresivo.",
    breadcrumbInicio: "Inicio",
    nome: "Cursos",
    eyebrow: "Cursos Carlos Seiti",
    titulo: "Programa completo de evolución",
    texto:
      "Cinco módulos en secuencia, del Reset Metabólico al físico de atleta. Empieza por el primero: los siguientes abren pronto.",
    ctaComecar: "Empezar por el Reset 21D",
    ctaTrilha: "Ver el camino",
    pilares: ["Nutrición estratégica", "Entrenos progresivos", "Seguimiento de resultados", "Evolución en 5 niveles"],
    trilhaTitulo: "El camino",
    trilhaTexto: "Cada módulo prepara el cuerpo para el siguiente.",
    modulo: "Módulo",
    disponivel: "Disponible",
    emBreve: "Próximamente",
    verDetalhes: "Ver detalles",
    inclui: "Qué incluye",
    comprar: "Quiero empezar",
    avisar: "Avísame por WhatsApp",
    avisarNota: "Este módulo todavía no abrió. Envía un mensaje y entras en la lista de quienes lo reciben primero.",
    comecarPeloReset: "Empezar por el Reset 21D",
    fechar: "Cerrar",
    alunoTitulo: "¿Ya eres alumno?",
    alunoTexto: "Los cursos que compraste están en Mi cuenta, listos para verlos cuando quieras.",
    alunoEntrar: "Entrar en Mis cursos",
    alunoPreview: "Ver cómo es la plataforma",
    dockTitulo: "Cursos",
    dockResumo: "Reset 21D · Intensidad · Niveles C, B y A",
    meusCursos: "Mis cursos",
    liberado: "Liberado",
    abrir: "Abrir",
    verNaVitrine: "Ver en la vitrina",
    programaCompleto: (d) => `Programa completo de ${d}`,
    modulosTitulo: (n) => `Los ${n} módulos`,
    modulosTexto: "Todo lo que recibes al entrar. Pasa el ratón para explorar.",
    voltarCursos: "Todos los cursos",
    garantir: "Asegurar mi acceso",
    meios: "Acceso inmediato",
  },
  en: {
    seoTitulo: "Courses: from the 21D Reset to athlete shape",
    seoDescricao:
      "A complete 5-module evolution program: 21-Day Metabolic Reset, Intensity Kickoff and Levels C, B and A. Strategic nutrition and progressive training.",
    breadcrumbInicio: "Home",
    nome: "Courses",
    eyebrow: "Carlos Seiti Courses",
    titulo: "Complete evolution program",
    texto:
      "Five modules in sequence, from the Metabolic Reset to an athlete physique. Start with the first one: the next ones open soon.",
    ctaComecar: "Start with the 21D Reset",
    ctaTrilha: "See the path",
    pilares: ["Strategic nutrition", "Progressive training", "Results tracking", "5-level progression"],
    trilhaTitulo: "The path",
    trilhaTexto: "Each module gets your body ready for the next.",
    modulo: "Module",
    disponivel: "Available",
    emBreve: "Coming soon",
    verDetalhes: "See details",
    inclui: "What's included",
    comprar: "I want to start",
    avisar: "Notify me on WhatsApp",
    avisarNota: "This module isn't open yet. Send a message and you'll be on the list to get it first.",
    comecarPeloReset: "Start with the 21D Reset",
    fechar: "Close",
    alunoTitulo: "Already a student?",
    alunoTexto: "The courses you bought live in My account, ready to watch whenever you want.",
    alunoEntrar: "Go to My courses",
    alunoPreview: "See the platform",
    dockTitulo: "Courses",
    dockResumo: "21D Reset · Intensity · Levels C, B and A",
    meusCursos: "My courses",
    liberado: "Unlocked",
    abrir: "Open",
    verNaVitrine: "See in the store",
    programaCompleto: (d) => `Complete ${d.replace(" days", "-day")} program`,
    modulosTitulo: (n) => `The ${n} modules`,
    modulosTexto: "Everything you get when you join. Hover to explore.",
    voltarCursos: "All courses",
    garantir: "Get instant access",
    meios: "Instant access",
  },
};
