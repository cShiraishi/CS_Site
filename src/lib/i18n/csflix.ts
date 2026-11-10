import type { Idioma } from "@/lib/rotas-idioma";

/**
 * Textos do CSFlix em três idiomas. O catálogo PT continua em
 * `src/lib/csflix.ts` (SERIES_CSFLIX); aqui ficam a interface e as
 * traduções ES/EN de séries e episódios, aplicadas por `carregarTrilhas`.
 * Os vídeos em si são falados em português.
 */

export type TextosSerie = {
  temporada: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  promessaMaratona: string;
};

export type TextosEpisodio = { titulo: string; sinopse: string };

type TraducaoCatalogo = {
  series: Record<string, TextosSerie>;
  episodios: Record<string, TextosEpisodio>;
};

export const CATALOGO_CSFLIX: Record<"es" | "en", TraducaoCatalogo> = {
  es: {
    series: {
      "true-shape": {
        temporada: "TEMPORADA 1",
        nome: "Proyecto True Shape · El Reality de la Transformación",
        subtitulo: "9 episodios en orden cronológico",
        descricao:
          "Sigue del episodio 1 al 9 un cambio físico real: apuestas, evaluaciones de físico, errores en el camino y transformaciones de -20 kg.",
        promessaMaratona:
          "Empieza por el EP. 01 para entender las reglas del desafío y ver quién cambió de verdad su físico.",
      },
      "sessoes-brutas": {
        temporada: "TEMPORADA 2",
        nome: "Sesiones Brutas · De la Primera Serie a la Recuperación",
        subtitulo: "5 episodios de biomecánica y entrenamiento real",
        descricao:
          "Nada de entrenamiento coreografiado: mira la ejecución real en la jaula, la cadencia, el fallo mecánico y la liberación miofascial post-entreno.",
        promessaMaratona:
          "Míralos en orden para ver un microciclo completo de tren superior, tren inferior y recuperación.",
      },
      "nutricao-real": {
        temporada: "TEMPORADA 3",
        nome: "Nutrición en el Mundo Real · Etiquetas y Suplementos Sin Filtro",
        subtitulo: "3 episodios desenmascarando a la industria",
        descricao:
          "Un Máster y doctorando en Ciencia de los Alimentos dentro del supermercado y de las tiendas de suplementos analizando lo que realmente funciona.",
        promessaMaratona: "Descubre qué vale tu dinero y qué es puro marketing en la estantería.",
      },
      "ciencia-aplicada": {
        temporada: "TEMPORADA 4",
        nome: "Laboratorio PhD · Inteligencia Artificial, Moléculas y Datos",
        subtitulo: "5 episodios desde la mesa del laboratorio",
        descricao:
          "La base académica detrás de la precisión: mira cómo uso IA, Python, modelado molecular 3D y química de alimentos en el doctorado.",
        promessaMaratona: "La serie favorita de quien quiere ver el rigor científico real detrás del método.",
      },
      "mentes-fora-da-curva": {
        temporada: "TEMPORADA 5",
        nome: "Mentes Fuera de Serie · Historias de Disciplina y Tarima",
        subtitulo: "7 episodios de conversaciones profundas",
        descricao:
          "Entrevistas y documentales cortos con doctores, profesores internacionales, ex obesos que subieron a la tarima y atletas de élite.",
        promessaMaratona:
          "Historias reales para ver cuando necesites recalibrar tu dirección y tu disciplina.",
      },
    },
    episodios: {
      "rmzMP-LsuOQ": {
        titulo: "El Punto de Partida: Cómo Construir el Físico en 2026",
        sinopse:
          "EP. 01 — El plan maestro de la temporada: qué separa a quien cambia su cuerpo en 90 días de quien abandona en la tercera semana.",
      },
      "8u9vHL5cE0w": {
        titulo: "Del Renacuajo al Oso: ¿Quién Se Pone en Forma Primero?",
        sinopse:
          "EP. 02 — La disputa empieza en la práctica: puntos de partida opuestos, biotipos distintos y el mismo protocolo de precisión.",
      },
      "VI0eleGqumA": {
        titulo: "El Juicio de los Físicos: ¿Quién Se Lleva los 400 Euros?",
        sinopse:
          "EP. 03 — Hora de quitarse la camiseta y medir la evolución real: análisis técnico de línea, definición y porcentaje de grasa.",
      },
      "pLDvj0_EocQ": {
        titulo: "Nuevo Patrocinador y la Presión Sube en el Proyecto",
        sinopse:
          "EP. 04 — El proyecto crece, llegan nuevos recursos y la exigencia de adherencia a la dieta se vuelve aún más intensa.",
      },
      "uhww5Mzvy1I": {
        titulo: "Desafío de Resistencia: Quien Pierda en las Flexiones Paga el Precio",
        sinopse:
          "EP. 05 — Prueba mental y física hasta el fallo: cuando llega el cansancio, aparece quien de verdad tiene disciplina.",
      },
      "d2imA9F6UbI": {
        titulo: "Al Límite de la Apuesta: Las Consecuencias del Desafío True Shape",
        sinopse:
          "EP. 06 — El episodio más tenso y divertido de la temporada: nadie quiere perder la apuesta final.",
      },
      "ZFcpJenQdHo": {
        titulo: "Cómo Ganó +10 kg en 1 Mes: La Estrategia Revelada",
        sinopse:
          "EP. 07 — Superávit calórico limpio, progresión de carga y lo que cambió en la rutina para destrabar la ganancia de masa.",
      },
      "35AcZsw3U0M": {
        titulo: "Pesaba 99 kg y Ya Eliminó -8 kg Manteniendo Masa Magra",
        sinopse: "EP. 08 — Caso práctico de recomposición corporal sin dietas extremas.",
      },
      "r9oFfFtCgdE": {
        titulo: "Misión 180 kg: El Pedido de Auxilio de Daniel",
        sinopse:
          "EP. 09 — Un final de temporada emocionante: cómo empezar a recuperar la salud y la movilidad cuando el peso llegó al límite.",
      },
      "68Rxs5iP32A": {
        titulo: "Entreno de Hombros Brutal: Construyendo Anchura 3D",
        sinopse:
          "EP. 01 — Selección de ángulos, control excéntrico y volumen ideal para deltoides lateral y posterior.",
      },
      "p1LL2brbwe8": {
        titulo: "Leg Day Pesado: Un Brasileño, un Portugués y un Peruano",
        sinopse: "EP. 02 — Tres atletas empujando el límite en el entreno de piernas más pesado del canal.",
      },
      "DN8HMhT2Elw": {
        titulo: "Entreno de Pierna Rápido y Brutal (Alta Intensidad en Poco Tiempo)",
        sinopse:
          "EP. 03 — Cómo sacar el máximo estímulo de hipertrofia cuando tienes menos de 45 minutos en el gimnasio.",
      },
      "Xuat0DwvjR4": {
        titulo: "Post-Leg Day: Liberación Miofascial y Recuperación del Alumno",
        sinopse:
          "EP. 04 — Lo que pasa después de la última serie: soltura muscular y preparación para la próxima sesión.",
      },
      "p1XZPvSNm3g": {
        titulo: "Menstruación vs. Entrenamiento: Cómo Periodizar para Mujeres",
        sinopse:
          "EP. 05 — Fisiología hormonal femenina aplicada: cómo ajustar carga, volumen y dieta en cada fase del ciclo.",
      },
      "itJ06wOXEbM": {
        titulo: "Probando las Novedades Fitness con la Dra. Maromba: ¿Qué Vale la Pena?",
        sinopse:
          "EP. 01 — Degustación a ciegas + lectura crítica de la lista de ingredientes y de la densidad calórica.",
      },
      "-fUAu0CSUVA": {
        titulo: "Detrás de la Suplementación: Tendencias Reales en Brasil y Europa",
        sinopse:
          "EP. 02 — Lo que tiene evidencia nivel A (whey, creatina, cafeína) vs. lo que no necesitas comprar.",
      },
      "6Ty3OJYTwoY": {
        titulo: "Expedición Chile: Analizando una Tienda Entera Plant-Based",
        sinopse:
          "EP. 03 — No todo lo vegano o plant-based ayuda a adelgazar: análisis de proteínas vegetales y sustitutos.",
      },
      "mSSPYbPM2XY": {
        titulo: "Cómo Creé Mi Primer Modelo de IA para la Industria Farmacéutica",
        sinopse:
          "EP. 01 — De la base de datos molecular al algoritmo predictivo: cómo la Inteligencia Artificial acelera descubrimientos.",
      },
      "AnwFEVx-HEU": {
        titulo: "NEI 2025: Ciencia de los Alimentos e Innovación con el Dr. Márcio Carocho",
        sinopse:
          "EP. 02 — El formato Fondo Oscuro + Moléculas 3D explicando compuestos bioactivos y el futuro de la nutrición.",
      },
      "GVMcSQf7hxE": {
        titulo: "Explorando Datos Fisicoquímicos de Compuestos con Python",
        sinopse: "EP. 03 — Cómo analizar miles de moléculas en minutos usando programación aplicada a la ciencia.",
      },
      "1Zwr8UrtOEo": {
        titulo: "Virtual Screening y QSAR: Minando Datos en ChEMBL",
        sinopse: "EP. 04 — Paso a paso práctico de bioinformática y quimioinformática en el doctorado.",
      },
      "nCAufgJ4IWw": {
        titulo: "Modelado 3D de Proteínas: Destacando Aminoácidos en PyMOL",
        sinopse: "EP. 05 — Visualizando la estructura tridimensional de las proteínas a nivel atómico.",
      },
      "9oHT6bC-20k": {
        titulo: "De Ex Obesa a Culturista y Empresaria (@simonemkehl)",
        sinopse:
          "EP. 01 — Cómo cambiar el chip mental, vencer la obesidad y construir un físico de competición.",
      },
      "CryXN-5LhXs": {
        titulo: "De Alumno en Santos a Profesor en Barcelona (Dr. Ricardo Serafim)",
        sinopse:
          "EP. 02 — Detrás de una carrera científica internacional y lo que el doctorado enseña sobre resiliencia.",
      },
      "rtd8u5Cfies": {
        titulo: "¿Qué Es Realmente un Doctorado? (Charla con el Dr. Andreimar Soares)",
        sinopse: "EP. 03 — Una conversación franca sobre investigación de punta, carrera académica y propósito.",
      },
      "WQLA9id1s7E": {
        titulo: "Mentalidad de Campeón en el Alto Rendimiento (Weslley Bronzoli)",
        sinopse: "EP. 04 — Cómo piensa un atleta competitivo cuando nadie lo está mirando.",
      },
      "oOpriO5YJ8g": {
        titulo: "Mentalidad de Negocios, Carrera y Constancia",
        sinopse:
          "EP. 05 — Por qué la misma disciplina que construye un físico sólido construye una empresa fuerte.",
      },
      "-6oc99Gh5gg": {
        titulo: "Team Will: Lo Que el Boxeo Enseña Sobre Control Emocional",
        sinopse: "EP. 06 — El noble arte, preparación física y foco bajo presión.",
      },
      "ca57g0N0fT0": {
        titulo: "Detrás del Culturismo: Lívia y Tukalins",
        sinopse:
          "EP. 07 — La recta final de la preparación para la tarima y la estética del culturismo clásico.",
      },
    },
  },
  en: {
    series: {
      "true-shape": {
        temporada: "SEASON 1",
        nome: "Project True Shape · The Transformation Reality Show",
        subtitulo: "9 episodes in chronological order",
        descricao:
          "Follow a real physical transformation from episode 1 to 9: bets, physique assessments, mistakes along the way and -20 kg transformations.",
        promessaMaratona:
          "Start with EP. 01 to learn the rules of the challenge and see who actually changed their physique.",
      },
      "sessoes-brutas": {
        temporada: "SEASON 2",
        nome: "Raw Sessions · From the First Set to Recovery",
        subtitulo: "5 episodes of biomechanics and real training",
        descricao:
          "No choreographed workouts: see real execution in the rack, tempo, mechanical failure and post-workout myofascial release.",
        promessaMaratona:
          "Watch them in order to see a full microcycle of upper body, lower body and recovery.",
      },
      "nutricao-real": {
        temporada: "SEASON 3",
        nome: "Real-World Nutrition · Labels & Supplements, Unfiltered",
        subtitulo: "3 episodes exposing the industry",
        descricao:
          "An MSc and PhD candidate in Food Science inside the supermarket and supplement stores, breaking down what actually works.",
        promessaMaratona: "Find out what's worth your money and what's pure shelf marketing.",
      },
      "ciencia-aplicada": {
        temporada: "SEASON 4",
        nome: "PhD Lab · Artificial Intelligence, Molecules & Data",
        subtitulo: "5 episodes from the lab bench",
        descricao:
          "The academic foundation behind the precision: see how I use AI, Python, 3D molecular modeling and food chemistry in my PhD.",
        promessaMaratona: "The go-to series for anyone who wants to see the real scientific rigor behind the method.",
      },
      "mentes-fora-da-curva": {
        temporada: "SEASON 5",
        nome: "Outlier Minds · Stories of Discipline & the Stage",
        subtitulo: "7 episodes of deep conversations",
        descricao:
          "Interviews and short documentaries with PhDs, international professors, formerly obese people who made it to the stage, and elite athletes.",
        promessaMaratona: "Real stories to watch whenever you need to recalibrate your direction and discipline.",
      },
    },
    episodios: {
      "rmzMP-LsuOQ": {
        titulo: "The Starting Point: How to Build Your Physique in 2026",
        sinopse:
          "EP. 01 — The season's master plan: what separates people who change their body in 90 days from those who quit in week three.",
      },
      "8u9vHL5cE0w": {
        titulo: "From Tadpole to Bear: Who Gets in Shape First?",
        sinopse:
          "EP. 02 — The contest gets real: opposite starting points, different body types and the same precision protocol.",
      },
      "VI0eleGqumA": {
        titulo: "Physique Judging: Who Takes Home the 400 Euros?",
        sinopse:
          "EP. 03 — Shirts off to measure real progress: a technical look at lines, cuts and body fat percentage.",
      },
      "pLDvj0_EocQ": {
        titulo: "New Sponsor & the Pressure Rises on the Project",
        sinopse:
          "EP. 04 — The project grows, new resources come in and the demand for diet adherence gets even tougher.",
      },
      "uhww5Mzvy1I": {
        titulo: "Endurance Challenge: Whoever Loses at Push-Ups Pays the Price",
        sinopse:
          "EP. 05 — A mental and physical test to failure: when fatigue hits, you see who really has discipline.",
      },
      "d2imA9F6UbI": {
        titulo: "Pushing the Bet to the Limit: The Consequences of the True Shape Challenge",
        sinopse: "EP. 06 — The season's tensest and funniest episode: nobody wants to lose the final bet.",
      },
      "ZFcpJenQdHo": {
        titulo: "How He Gained +10 kg in 1 Month: The Strategy Revealed",
        sinopse:
          "EP. 07 — A clean calorie surplus, progressive overload and what changed in his routine to unlock muscle gain.",
      },
      "35AcZsw3U0M": {
        titulo: "He Was 99 kg and Has Already Lost 8 kg While Keeping Lean Mass",
        sinopse: "EP. 08 — A practical body recomposition case study with no extreme diets.",
      },
      "r9oFfFtCgdE": {
        titulo: "Mission 180 kg: Daniel's Call for Help",
        sinopse:
          "EP. 09 — An emotional season finale: how to start reclaiming health and mobility when weight has hit the limit.",
      },
      "68Rxs5iP32A": {
        titulo: "Brutal Shoulder Workout: Building 3D Width",
        sinopse:
          "EP. 01 — Angle selection, eccentric control and the ideal volume for lateral and rear delts.",
      },
      "p1LL2brbwe8": {
        titulo: "Heavy Leg Day: A Brazilian, a Portuguese and a Peruvian",
        sinopse: "EP. 02 — Three athletes pushing the limit in the heaviest leg workout on the channel.",
      },
      "DN8HMhT2Elw": {
        titulo: "Fast, Brutal Leg Workout (High Intensity in Little Time)",
        sinopse:
          "EP. 03 — How to get maximum hypertrophy stimulus when you have less than 45 minutes at the gym.",
      },
      "Xuat0DwvjR4": {
        titulo: "After Leg Day: Myofascial Release and Client Recovery",
        sinopse:
          "EP. 04 — What happens after the last set: loosening up the muscles and getting ready for the next session.",
      },
      "p1XZPvSNm3g": {
        titulo: "Menstruation vs. Training: How to Periodize for Women",
        sinopse:
          "EP. 05 — Applied female hormonal physiology: how to adjust load, volume and diet in each phase of the cycle.",
      },
      "itJ06wOXEbM": {
        titulo: "Trying New Fitness Products with Dra. Maromba: What's Any Good?",
        sinopse: "EP. 01 — Blind tasting + a critical read of the ingredient list and calorie density.",
      },
      "-fUAu0CSUVA": {
        titulo: "Behind the Scenes of Supplements: Real Trends in Brazil and Europe",
        sinopse:
          "EP. 02 — What has grade A evidence (whey, creatine, caffeine) vs. what you don't need to buy.",
      },
      "6Ty3OJYTwoY": {
        titulo: "Chile Expedition: Reviewing an Entire Plant-Based Store",
        sinopse:
          "EP. 03 — Not everything vegan or plant-based helps you lose weight: a look at plant proteins and substitutes.",
      },
      "mSSPYbPM2XY": {
        titulo: "How I Built My First AI Model for the Pharmaceutical Industry",
        sinopse:
          "EP. 01 — From molecular database to predictive algorithm: how Artificial Intelligence speeds up discovery.",
      },
      "AnwFEVx-HEU": {
        titulo: "NEI 2025: Food Science and Innovation with Dr. Márcio Carocho",
        sinopse:
          "EP. 02 — The Dark Background + 3D Molecules format explaining bioactive compounds and the future of nutrition.",
      },
      "GVMcSQf7hxE": {
        titulo: "Exploring Physicochemical Data of Compounds with Python",
        sinopse: "EP. 03 — How to analyze thousands of molecules in minutes using programming applied to science.",
      },
      "1Zwr8UrtOEo": {
        titulo: "Virtual Screening & QSAR: Mining Data in ChEMBL",
        sinopse: "EP. 04 — A practical step-by-step of bioinformatics and cheminformatics in a PhD.",
      },
      "nCAufgJ4IWw": {
        titulo: "3D Protein Modeling: Highlighting Amino Acids in PyMOL",
        sinopse: "EP. 05 — Visualizing the three-dimensional structure of proteins at the atomic level.",
      },
      "9oHT6bC-20k": {
        titulo: "From Formerly Obese to Bodybuilder and Entrepreneur (@simonemkehl)",
        sinopse:
          "EP. 01 — How to flip the mental switch, beat obesity and build a competition physique.",
      },
      "CryXN-5LhXs": {
        titulo: "From Student in Santos to Professor in Barcelona (Dr. Ricardo Serafim)",
        sinopse:
          "EP. 02 — Behind an international scientific career and what a PhD teaches about resilience.",
      },
      "rtd8u5Cfies": {
        titulo: "What Is a PhD, Really? (A Talk with Dr. Andreimar Soares)",
        sinopse: "EP. 03 — A frank conversation about cutting-edge research, academic careers and purpose.",
      },
      "WQLA9id1s7E": {
        titulo: "A Champion's Mindset in High Performance (Weslley Bronzoli)",
        sinopse: "EP. 04 — How a competitive athlete thinks when nobody is watching.",
      },
      "oOpriO5YJ8g": {
        titulo: "Business Mindset, Career and Consistency",
        sinopse:
          "EP. 05 — Why the same discipline that builds a solid physique builds a strong company.",
      },
      "-6oc99Gh5gg": {
        titulo: "Team Will: What Boxing Teaches About Emotional Control",
        sinopse: "EP. 06 — The noble art, physical conditioning and focus under pressure.",
      },
      "ca57g0N0fT0": {
        titulo: "Behind the Scenes of Bodybuilding: Lívia & Tukalins",
        sinopse: "EP. 07 — The final stretch of stage prep and the aesthetics of classic bodybuilding.",
      },
    },
  },
};

/* ============================================================
   Interface (componente de cliente) e página
   ============================================================ */

const ep = (n: number) => String(n).padStart(2, "0");

export type UiCSFlix = {
  seloOriginal: string;
  /** Nota de idioma dos vídeos; vazia em PT. */
  notaVideosPt: string;
  relevancia: string;
  episodiosNaTemporada: (n: number) => string;
  noCatalogo: (n: number) => string;
  assistirEp01: string;
  continuarEp: (n: number) => string;
  verTemporadas: string;
  assistirEpisodioAria: (n: number, titulo: string) => string;
  visto: string;
  assistirNovamente: string;
  assistirEpisodio: (n: number) => string;
  segueParaEp: (n: number) => string;
  seasonFinale: string;
  vistosNaTemporada: (vistos: number, total: number) => string;
  comecarPeloEp01: string;
  voltar: (nome: string) => string;
  avancar: (nome: string) => string;
  episodioDe: (n: number, total: number) => string;
  fechar: string;
  abrirNoYoutube: string;
  voltarAoEp: (n: number) => string;
  proximoNaMaratona: (n: number) => string;
  assistirProximo: string;
  fimDaTemporada: string;
  aplicarMetodo: string;
  comecarMinhaConsultoria: string;
  todosEpisodiosDe: (temporada: string, nome: string) => string;
  reproduzindoAgora: string;
  assistido: string;
  todasTemporadas: (total: number) => string;
  abreviaturaTemporada: string;
  progresso: string;
  episodiosVistos: (vistos: number, total: number) => string;
};

export const UI_CSFLIX: Record<Idioma, UiCSFlix> = {
  pt: {
    seloOriginal: "Série Original · 5 Temporadas",
    notaVideosPt: "",
    relevancia: "98% relevante para quem busca resultado",
    episodiosNaTemporada: (n) => `${n} Episódios nesta temporada`,
    noCatalogo: (n) => `· ${n} no catálogo`,
    assistirEp01: "Assistir Episódio 01",
    continuarEp: (n) => `Continuar EP. ${ep(n)}`,
    verTemporadas: "ⓘ Ver todas as temporadas",
    assistirEpisodioAria: (n, titulo) => `Assistir Episódio ${ep(n)}: ${titulo}`,
    visto: "✓ Visto",
    assistirNovamente: "Assistir novamente",
    assistirEpisodio: (n) => `Assistir Episódio ${ep(n)}`,
    segueParaEp: (n) => `Segue p/ EP. ${ep(n)} →`,
    seasonFinale: "Season Finale ★",
    vistosNaTemporada: (v, t) => `${v}/${t} vistos`,
    comecarPeloEp01: "▶ Começar pelo EP. 01",
    voltar: (nome) => `${nome}: voltar`,
    avancar: (nome) => `${nome}: avançar`,
    episodioDe: (n, t) => `Episódio ${ep(n)} de ${ep(t)}`,
    fechar: "Fechar",
    abrirNoYoutube: "Abrir no YouTube ↗",
    voltarAoEp: (n) => `← Voltar ao EP. ${ep(n)}`,
    proximoNaMaratona: (n) => `⏭ Próximo na Maratona · EP. ${ep(n)}`,
    assistirProximo: "▶ Assistir Próximo Episódio Agora",
    fimDaTemporada: "★ Você chegou ao fim desta temporada!",
    aplicarMetodo: "Quer aplicar esse método no seu corpo com acompanhamento individual?",
    comecarMinhaConsultoria: "Começar minha consultoria →",
    todosEpisodiosDe: (temporada, nome) => `Todos os episódios de ${temporada} · ${nome}`,
    reproduzindoAgora: "· Reproduzindo agora",
    assistido: "· ✓ Assistido",
    todasTemporadas: (t) => `🎬 Todas as 5 Temporadas (${t} EPs)`,
    abreviaturaTemporada: "T",
    progresso: "Progresso da sua maratona:",
    episodiosVistos: (v, t) => `${v}/${t} episódios vistos`,
  },
  es: {
    seloOriginal: "Serie Original · 5 Temporadas",
    notaVideosPt: "Los videos están en portugués.",
    relevancia: "98% relevante para quien busca resultados",
    episodiosNaTemporada: (n) => `${n} episodios en esta temporada`,
    noCatalogo: (n) => `· ${n} en el catálogo`,
    assistirEp01: "Ver Episodio 01",
    continuarEp: (n) => `Continuar EP. ${ep(n)}`,
    verTemporadas: "ⓘ Ver todas las temporadas",
    assistirEpisodioAria: (n, titulo) => `Ver Episodio ${ep(n)}: ${titulo}`,
    visto: "✓ Visto",
    assistirNovamente: "Ver de nuevo",
    assistirEpisodio: (n) => `Ver Episodio ${ep(n)}`,
    segueParaEp: (n) => `Sigue al EP. ${ep(n)} →`,
    seasonFinale: "Final de temporada ★",
    vistosNaTemporada: (v, t) => `${v}/${t} vistos`,
    comecarPeloEp01: "▶ Empezar por el EP. 01",
    voltar: (nome) => `${nome}: anterior`,
    avancar: (nome) => `${nome}: siguiente`,
    episodioDe: (n, t) => `Episodio ${ep(n)} de ${ep(t)}`,
    fechar: "Cerrar",
    abrirNoYoutube: "Abrir en YouTube ↗",
    voltarAoEp: (n) => `← Volver al EP. ${ep(n)}`,
    proximoNaMaratona: (n) => `⏭ Siguiente en el maratón · EP. ${ep(n)}`,
    assistirProximo: "▶ Ver el siguiente episodio ahora",
    fimDaTemporada: "★ ¡Llegaste al final de esta temporada!",
    aplicarMetodo: "¿Quieres aplicar este método en tu cuerpo con seguimiento individual?",
    comecarMinhaConsultoria: "Empezar mi asesoría →",
    todosEpisodiosDe: (temporada, nome) => `Todos los episodios de ${temporada} · ${nome}`,
    reproduzindoAgora: "· Reproduciendo ahora",
    assistido: "· ✓ Visto",
    todasTemporadas: (t) => `🎬 Las 5 temporadas (${t} EPs)`,
    abreviaturaTemporada: "T",
    progresso: "Progreso de tu maratón:",
    episodiosVistos: (v, t) => `${v}/${t} episodios vistos`,
  },
  en: {
    seloOriginal: "Original Series · 5 Seasons",
    notaVideosPt: "Videos are in Portuguese.",
    relevancia: "98% match for results-driven viewers",
    episodiosNaTemporada: (n) => `${n} episodes this season`,
    noCatalogo: (n) => `· ${n} in the catalog`,
    assistirEp01: "Watch Episode 01",
    continuarEp: (n) => `Continue EP. ${ep(n)}`,
    verTemporadas: "ⓘ See all seasons",
    assistirEpisodioAria: (n, titulo) => `Watch Episode ${ep(n)}: ${titulo}`,
    visto: "✓ Watched",
    assistirNovamente: "Watch again",
    assistirEpisodio: (n) => `Watch Episode ${ep(n)}`,
    segueParaEp: (n) => `Up next: EP. ${ep(n)} →`,
    seasonFinale: "Season Finale ★",
    vistosNaTemporada: (v, t) => `${v}/${t} watched`,
    comecarPeloEp01: "▶ Start with EP. 01",
    voltar: (nome) => `${nome}: previous`,
    avancar: (nome) => `${nome}: next`,
    episodioDe: (n, t) => `Episode ${ep(n)} of ${ep(t)}`,
    fechar: "Close",
    abrirNoYoutube: "Open on YouTube ↗",
    voltarAoEp: (n) => `← Back to EP. ${ep(n)}`,
    proximoNaMaratona: (n) => `⏭ Next in the binge · EP. ${ep(n)}`,
    assistirProximo: "▶ Watch next episode now",
    fimDaTemporada: "★ You've reached the end of this season!",
    aplicarMetodo: "Want to apply this method to your body with 1-on-1 coaching?",
    comecarMinhaConsultoria: "Start my coaching →",
    todosEpisodiosDe: (temporada, nome) => `All episodes of ${temporada} · ${nome}`,
    reproduzindoAgora: "· Now playing",
    assistido: "· ✓ Watched",
    todasTemporadas: (t) => `🎬 All 5 Seasons (${t} EPs)`,
    abreviaturaTemporada: "S",
    progresso: "Your binge progress:",
    episodiosVistos: (v, t) => `${v}/${t} episodes watched`,
  },
};

export type PaginaTextosCSFlix = {
  seoTitulo: string;
  seoDescricao: string;
  ogTitulo: string;
  ogDescricao: string;
  erroAntes: string;
  erroLink: string;
  ctaTitulo: string;
  ctaTexto: string;
  ctaConsultoria: string;
  ctaBiblioteca: string;
  jsonLdDescricao: (total: number) => string;
  breadcrumbInicio: string;
};

export const PAGINA_CSFLIX: Record<Idioma, PaginaTextosCSFlix> = {
  pt: {
    seoTitulo: "CSFlix — As Séries e Temporadas do Canal Carlos Seiti TV",
    seoDescricao:
      "29 episódios em 5 temporadas sequenciais: Projeto True Shape, Sessões Brutas, Nutrição no Mundo Real, Laboratório PhD e Mentes Fora da Curva. Assista como uma série.",
    ogTitulo: "CSFlix — Séries & Temporadas",
    ogDescricao:
      "5 temporadas sequenciais de treino, preparação de palco, ciência de alimentos e inteligência artificial para maratonar.",
    erroAntes:
      "Não consegui alcançar o YouTube agora. Tente novamente daqui a pouco ou veja tudo direto",
    erroLink: "no canal",
    ctaTitulo: "Ver ajuda. Aplicar ao seu corpo é outra conversa.",
    ctaTexto: "O canal mostra como eu treino. A consultoria monta como você deveria.",
    ctaConsultoria: "Começar consultoria",
    ctaBiblioteca: "Ir para a biblioteca",
    jsonLdDescricao: (total) =>
      `Os vídeos do canal Carlos Seiti TV organizados por área: treino, culturismo de competição, nutrição e método. ${total} vídeos em exibição.`,
    breadcrumbInicio: "Início",
  },
  es: {
    seoTitulo: "CSFlix — Las Series y Temporadas del Canal Carlos Seiti TV",
    seoDescricao:
      "29 episodios en 5 temporadas secuenciales: Proyecto True Shape, Sesiones Brutas, Nutrición en el Mundo Real, Laboratorio PhD y Mentes Fuera de Serie. Míralo como una serie (videos en portugués).",
    ogTitulo: "CSFlix — Series y Temporadas",
    ogDescricao:
      "5 temporadas secuenciales de entrenamiento, preparación para tarima, ciencia de los alimentos e inteligencia artificial para maratonear.",
    erroAntes:
      "No pude conectar con YouTube ahora. Inténtalo de nuevo en un rato o mira todo directamente",
    erroLink: "en el canal",
    ctaTitulo: "Mirar ayuda. Aplicarlo a tu cuerpo es otra historia.",
    ctaTexto: "El canal muestra cómo entreno yo. La asesoría arma cómo deberías entrenar tú.",
    ctaConsultoria: "Empezar asesoría",
    ctaBiblioteca: "Ir a la biblioteca",
    jsonLdDescricao: (total) =>
      `Los videos del canal Carlos Seiti TV organizados por área: entrenamiento, culturismo de competición, nutrición y método. ${total} videos disponibles (en portugués).`,
    breadcrumbInicio: "Inicio",
  },
  en: {
    seoTitulo: "CSFlix — Series & Seasons from the Carlos Seiti TV Channel",
    seoDescricao:
      "29 episodes across 5 sequential seasons: Project True Shape, Raw Sessions, Real-World Nutrition, PhD Lab and Outlier Minds. Watch it like a series (videos in Portuguese).",
    ogTitulo: "CSFlix — Series & Seasons",
    ogDescricao:
      "5 sequential seasons of training, stage prep, food science and artificial intelligence to binge-watch.",
    erroAntes:
      "I couldn't reach YouTube right now. Try again in a moment or watch everything directly",
    erroLink: "on the channel",
    ctaTitulo: "Watching helps. Applying it to your body is another story.",
    ctaTexto: "The channel shows how I train. Coaching builds how you should.",
    ctaConsultoria: "Start coaching",
    ctaBiblioteca: "Go to the library",
    jsonLdDescricao: (total) =>
      `Videos from the Carlos Seiti TV channel organized by area: training, competitive bodybuilding, nutrition and method. ${total} videos available (in Portuguese).`,
    breadcrumbInicio: "Home",
  },
};
