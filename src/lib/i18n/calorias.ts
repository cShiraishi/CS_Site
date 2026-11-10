/**
 * Textos da Calculadora de calorias (/calculadora-de-calorias) nos três
 * idiomas: página, ferramenta (Calculadora.tsx) e captura (CapturaPlano.tsx).
 *
 * O português vem de `content.ts` e de `calorias.ts` sempre que o texto já
 * mora lá — assim a versão PT continua idêntica à de antes da tradução.
 * Sem "use client": serve a Server e Client Components.
 */
import type { Atividade, Direcao, Formula, Sexo } from "../calorias";
import { ATIVIDADES, FORMULAS } from "../calorias";
import { calculadora } from "../content";
import type { Idioma } from "../rotas-idioma";

export type TextosCalorias = {
  seo: {
    titulo: string;
    descricao: string;
    ogDescricao: string;
    ogAlt: string;
  };
  jsonld: {
    nome: string;
    sistema: string;
    descricao: string;
    recursos: string[];
    inicio: string;
    migalha: string;
  };
  pagina: {
    voceEsta: string;
    inicio: string;
    migalha: string;
    eyebrow: string;
    titulo: string;
    texto: string;
    selos: string[];
    previa: string;
    gastoDiario: string;
    seuAlvo: string;
    eixo: string[];
    comoLerEyebrow: string;
    comoLerTitulo: string;
    comoUsar: { titulo: string; texto: string }[];
    aviso: string;
  };
  calc: {
    etapasAria: string;
    etapas: string[];
    dadosAria: string;
    dadosEyebrow: string;
    sexoLegenda: string;
    sexos: Record<Sexo, string>;
    sexoNota: string;
    idade: string;
    anos: string;
    peso: string;
    altura: string;
    atividade: string;
    atividades: Record<Atividade, { nome: string; nota: string }>;
    formulaLegenda: string;
    formulaDica: string;
    recomendado: string;
    formulas: Record<Formula, string>;
    gordura: string;
    gorduraNota: string;
    objetivoAria: string;
    objetivoEyebrow: string;
    pesoAlvo: string;
    refeicoes: string;
    refeicoesNota: string;
    faltaGordura: string;
    vazio: string;
    planoEyebrow: string;
    borrao: string[];
    reservado: string;
    rumo: Record<Direcao, string>;
    tmb: string;
    explicaTmb: string;
    get: string;
    getNota: string;
    alvo: (rumo: string) => string;
    alvoManter: string;
    ajustePorDia: (ajuste: string) => string;
    diferenca: string;
    ritmo: string;
    porSemana: (kg: string) => string;
    prazo: string;
    semanas: (n: number) => string;
    limitado: string;
    macrosTitulo: string;
    proteina: string;
    gorduraMacro: string;
    carboidrato: string;
    apertado: string;
    distribuicao: (n: number) => string;
    refeicao: string;
    total: string;
    nomesRefeicoes: Record<number, string[]>;
    proteinaNota: string;
    pctCalorias: (pct: number, kcal: string) => string;
    ponte: string;
    comecar: string;
  };
  captura: {
    verificando: string;
    reconhecido: string;
    instante: string;
    vinculado: string;
    recebido: string;
    enviado: string;
    sucesso: string;
    semCopia: string;
    pronto: string;
    titulo: string;
    texto: string;
    itens: string[];
    empresa: string;
    nome: string;
    nomePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    telefone: string;
    telefonePlaceholder: string;
    consentimento: string;
    jaTem: string;
    entrar: string;
    preparando: string;
    liberar: string;
    erros: Record<"nome" | "email" | "whatsapp", string>;
    revisar: string;
    incompleto: string;
    falha: string;
  };
};

const formulasPt = Object.fromEntries(FORMULAS.map((f) => [f.id, f.nota])) as Record<Formula, string>;
const atividadesPt = Object.fromEntries(
  ATIVIDADES.map((a) => [a.id, { nome: a.nome, nota: a.nota }]),
) as Record<Atividade, { nome: string; nota: string }>;

const pt: TextosCalorias = {
  seo: {
    titulo: "Calculadora de calorias basais (TMB e gasto diário)",
    descricao:
      "Calcule sua taxa metabólica basal e o gasto energético diário por Mifflin-St Jeor, Harris-Benedict ou Katch-McArdle. Gratuito, sem cadastro, com faixas de proteína.",
    ogDescricao:
      "Taxa metabólica basal, gasto total e alvos de emagrecimento, manutenção e ganho. Três equações validadas, sem cadastro.",
    ogAlt: "Calculadora de calorias",
  },
  jsonld: {
    nome: "Calculadora de calorias basais",
    sistema: "Todos — roda no navegador",
    descricao:
      "Calcula a taxa metabólica basal e o gasto energético diário por Mifflin-St Jeor, Harris-Benedict ou Katch-McArdle.",
    recursos: [
      "Taxa metabólica basal (TMB)",
      "Gasto energético total (GET)",
      "Alvos de emagrecimento, manutenção e ganho de massa",
      "Faixa diária de proteína",
    ],
    inicio: "Início",
    migalha: "Calculadora de calorias",
  },
  pagina: {
    voceEsta: "Você está em",
    inicio: "Início",
    migalha: "Calculadora de calorias",
    eyebrow: calculadora.eyebrow,
    titulo: calculadora.titulo,
    texto: calculadora.texto,
    selos: ["Sem cadastro", "Resultado imediato", "3 equações científicas"],
    previa: "Prévia do seu plano",
    gastoDiario: "Gasto diário",
    seuAlvo: "Seu alvo",
    eixo: ["Metabolismo", "Objetivo", "Progresso"],
    comoLerEyebrow: "Como ler o resultado",
    comoLerTitulo: "Três coisas que o número não diz.",
    comoUsar: calculadora.comoUsar.map((c) => ({ titulo: c.titulo, texto: c.texto })),
    aviso: calculadora.aviso,
  },
  calc: {
    etapasAria: "Etapas da calculadora",
    etapas: ["Seus dados", "Seu objetivo", "Seu plano"],
    dadosAria: "Seus dados",
    dadosEyebrow: "01 / Seus dados",
    sexoLegenda: "Sexo biológico",
    sexos: { masculino: "masculino", feminino: "feminino" },
    sexoNota:
      "As equações foram derivadas com esta variável — não é uma pergunta sobre identidade.",
    idade: "Idade",
    anos: "anos",
    peso: "Peso atual",
    altura: "Altura",
    atividade: "Nível de atividade",
    atividades: atividadesPt,
    formulaLegenda: "Como calcular seu metabolismo?",
    formulaDica: "Se estiver em dúvida, mantenha a opção recomendada.",
    recomendado: "Recomendado",
    formulas: formulasPt,
    gordura: "Gordura corporal",
    gorduraNota:
      "Use um valor medido (bioimpedância, adipômetro ou DEXA). Chute não melhora o resultado — piora.",
    objetivoAria: "Seu objetivo",
    objetivoEyebrow: "02 / Onde você quer chegar",
    pesoAlvo: "Peso desejado",
    refeicoes: "Refeições por dia",
    refeicoesNota:
      "O número de refeições não muda o resultado — muda a sua adesão. Escolha o que cabe na rotina.",
    faltaGordura: "Informe também o percentual de gordura para usar a Katch-McArdle.",
    vazio: "Preencha idade, peso e altura para ver o plano.",
    planoEyebrow: "03 / Seu plano",
    borrao: ["Metabolismo basal", "Seu alvo diário", "Macronutrientes"],
    reservado: "Resultado reservado para você",
    rumo: { perder: "Emagrecimento", ganhar: "Ganho de massa", manter: "Manutenção" },
    tmb: "Metabolismo basal",
    explicaTmb: calculadora.explicaTmb,
    get: "Gasto total no dia",
    getNota: "Basal multiplicado pelo seu nível de atividade.",
    alvo: (rumo) => `Alvo — ${rumo.toLowerCase()}`,
    alvoManter: "Peso estável no gasto atual.",
    ajustePorDia: (ajuste) => `${ajuste} kcal por dia.`,
    diferenca: "Diferença",
    ritmo: "Ritmo seguro",
    porSemana: (kg) => `${kg} kg por semana`,
    prazo: "Prazo estimado",
    semanas: (n) => `${n} semanas`,
    limitado:
      "O ritmo foi reduzido de propósito. Chegar mais rápido exigiria um déficit que cai abaixo do seu metabolismo basal — exatamente a dieta extrema que não se sustenta e que devolve o peso depois.",
    macrosTitulo: "Macronutrientes no alvo",
    proteina: "Proteína",
    gorduraMacro: "Gordura",
    carboidrato: "Carboidrato",
    apertado:
      "Sobrou pouco espaço para carboidrato. Num alvo assim, ou o déficit é agressivo demais, ou o gasto precisa subir — treinar mais rende melhor que comer menos.",
    distribuicao: (n) => `Distribuição em ${n} refeições`,
    refeicao: "Refeição",
    total: "Total",
    nomesRefeicoes: {
      2: ["Almoço", "Jantar"],
      3: ["Café da manhã", "Almoço", "Jantar"],
      4: ["Café da manhã", "Almoço", "Lanche", "Jantar"],
      5: ["Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar"],
      6: ["Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar", "Ceia"],
    },
    proteinaNota:
      "A proteína foi dividida por igual de propósito: o estímulo de síntese responde à dose por refeição, não ao total jogado de uma vez. Já os carboidratos você pode concentrar em volta do treino — é aí que rendem mais.",
    pctCalorias: (pct, kcal) => `${pct}% das calorias · ${kcal} kcal`,
    ponte: calculadora.ponte,
    comecar: "Começar consultoria",
  },
  captura: {
    verificando: "Reconhecendo seu perfil",
    reconhecido: "Perfil reconhecido",
    instante: "Só um instante…",
    vinculado: "Seus dados serão vinculados ao histórico da sua conta.",
    recebido: "Recebido.",
    enviado: "Enviado.",
    sucesso: calculadora.captura.sucesso,
    semCopia: "",
    pronto: "Seu plano está pronto",
    titulo: "Libere o resultado completo.",
    texto:
      "Informe apenas nome, e-mail e telefone para ver calorias, macros, refeições e receber uma cópia estruturada.",
    itens: ["✓ Meta calórica individual", "✓ Proteína, carboidrato e gordura", "✓ Distribuição por refeições"],
    empresa: "Empresa",
    nome: "Nome",
    nomePlaceholder: "Como você se chama",
    email: "E-mail",
    emailPlaceholder: "voce@email.com",
    telefone: "Telefone",
    telefonePlaceholder: "(00) 00000-0000",
    consentimento:
      "Ao continuar, você concorda em receber este resultado e um contato relacionado à sua avaliação. Sem spam.",
    jaTem: "Já possui cadastro?",
    entrar: "Entrar com código",
    preparando: "Preparando…",
    liberar: "Liberar meu plano",
    // Em PT a mensagem da action é mostrada como veio; estes campos só
    // existem para ES/EN, que não podem exibir o texto da action em português.
    erros: { nome: "", email: "", whatsapp: "" },
    revisar: "",
    incompleto: "",
    falha: "",
  },
};

const es: TextosCalorias = {
  seo: {
    titulo: "Calculadora de calorías basales (TMB y gasto diario)",
    descricao:
      "Calcula tu tasa metabólica basal y tu gasto energético diario con Mifflin-St Jeor, Harris-Benedict o Katch-McArdle. Gratis, sin registro, con rangos de proteína.",
    ogDescricao:
      "Tasa metabólica basal, gasto total y objetivos para adelgazar, mantener o ganar. Tres ecuaciones validadas, sin registro.",
    ogAlt: "Calculadora de calorías",
  },
  jsonld: {
    nome: "Calculadora de calorías basales",
    sistema: "Todos — funciona en el navegador",
    descricao:
      "Calcula la tasa metabólica basal y el gasto energético diario con Mifflin-St Jeor, Harris-Benedict o Katch-McArdle.",
    recursos: [
      "Tasa metabólica basal (TMB)",
      "Gasto energético total (GET)",
      "Objetivos para adelgazar, mantener y ganar masa",
      "Rango diario de proteína",
    ],
    inicio: "Inicio",
    migalha: "Calculadora de calorías",
  },
  pagina: {
    voceEsta: "Estás en",
    inicio: "Inicio",
    migalha: "Calculadora de calorías",
    eyebrow: "Herramienta gratuita",
    titulo: "Calculadora de\ncalorías basales.",
    texto:
      "Descubre cuánta energía gasta tu cuerpo en reposo y cuánta necesita al día. Es el número de partida de cualquier protocolo — y el primero que la mayoría de las dietas calcula mal.",
    selos: ["Sin registro", "Resultado inmediato", "3 ecuaciones científicas"],
    previa: "Vista previa de tu plan",
    gastoDiario: "Gasto diario",
    seuAlvo: "Tu objetivo",
    eixo: ["Metabolismo", "Objetivo", "Progreso"],
    comoLerEyebrow: "Cómo leer el resultado",
    comoLerTitulo: "Tres cosas que el número no dice.",
    comoUsar: [
      {
        titulo: "El basal es el piso",
        texto:
          "Comer por debajo de la tasa basal durante mucho tiempo cuesta masa magra, hormonas y adherencia. El déficit se hace con margen, no con hambre.",
      },
      {
        titulo: "El gasto total es el objetivo",
        texto:
          "Es el basal multiplicado por tu actividad real. Trabajar de pie y entrenar cinco veces por semana no es lo mismo.",
      },
      {
        titulo: "El número cambia",
        texto:
          "Baja a medida que adelgazas. Por eso el protocolo se revisa cada quince días, y no se calcula una sola vez.",
      },
    ],
    aviso:
      "Toda ecuación de metabolismo es una estimación poblacional, con un error individual del 10 al 15 %. Úsala como punto de partida y ajusta según lo que muestren la báscula y el espejo a lo largo de las semanas.",
  },
  calc: {
    etapasAria: "Pasos de la calculadora",
    etapas: ["Tus datos", "Tu objetivo", "Tu plan"],
    dadosAria: "Tus datos",
    dadosEyebrow: "01 / Tus datos",
    sexoLegenda: "Sexo biológico",
    sexos: { masculino: "masculino", feminino: "femenino" },
    sexoNota:
      "Las ecuaciones se derivaron con esta variable — no es una pregunta sobre identidad.",
    idade: "Edad",
    anos: "años",
    peso: "Peso actual",
    altura: "Altura",
    atividade: "Nivel de actividad",
    atividades: {
      sedentario: { nome: "Sedentario", nota: "Poco o ningún ejercicio" },
      leve: { nome: "Ligeramente activo", nota: "1 a 3 entrenamientos por semana" },
      moderado: { nome: "Moderadamente activo", nota: "3 a 5 entrenamientos por semana" },
      alto: { nome: "Muy activo", nota: "6 a 7 entrenamientos por semana" },
      atleta: { nome: "Extremadamente activo", nota: "Dos entrenamientos al día o trabajo físico" },
    },
    formulaLegenda: "¿Cómo calcular tu metabolismo?",
    formulaDica: "Si tienes dudas, mantén la opción recomendada.",
    recomendado: "Recomendado",
    formulas: {
      mifflin: "Usa esta si no sabes cuál elegir. Funciona bien para la mayoría de las personas.",
      harris: "Una estimación alternativa, basada en una ecuación más antigua.",
      katch: "Elígela solo si conoces tu porcentaje de grasa medido.",
    },
    gordura: "Grasa corporal",
    gorduraNota:
      "Usa un valor medido (bioimpedancia, plicómetro o DEXA). Adivinar no mejora el resultado — lo empeora.",
    objetivoAria: "Tu objetivo",
    objetivoEyebrow: "02 / A dónde quieres llegar",
    pesoAlvo: "Peso deseado",
    refeicoes: "Comidas al día",
    refeicoesNota:
      "El número de comidas no cambia el resultado — cambia tu adherencia. Elige lo que encaje en tu rutina.",
    faltaGordura: "Indica también el porcentaje de grasa para usar Katch-McArdle.",
    vazio: "Completa edad, peso y altura para ver el plan.",
    planoEyebrow: "03 / Tu plan",
    borrao: ["Metabolismo basal", "Tu objetivo diario", "Macronutrientes"],
    reservado: "Resultado reservado para ti",
    rumo: { perder: "Adelgazar", ganhar: "Ganar masa", manter: "Mantenimiento" },
    tmb: "Metabolismo basal",
    explicaTmb:
      "Es lo que tu cuerpo consume solo para existir: respirar, mantener la temperatura, alimentar el cerebro. Ninguna dieta debería quedar por debajo de esto.",
    get: "Gasto total del día",
    getNota: "El basal multiplicado por tu nivel de actividad.",
    alvo: (rumo) => `Objetivo — ${rumo.toLowerCase()}`,
    alvoManter: "Peso estable con el gasto actual.",
    ajustePorDia: (ajuste) => `${ajuste} kcal al día.`,
    diferenca: "Diferencia",
    ritmo: "Ritmo seguro",
    porSemana: (kg) => `${kg} kg por semana`,
    prazo: "Plazo estimado",
    semanas: (n) => `${n} ${n === 1 ? "semana" : "semanas"}`,
    limitado:
      "El ritmo se redujo a propósito. Llegar más rápido exigiría un déficit por debajo de tu metabolismo basal — justo la dieta extrema que no se sostiene y que después te devuelve el peso.",
    macrosTitulo: "Macronutrientes en el objetivo",
    proteina: "Proteína",
    gorduraMacro: "Grasa",
    carboidrato: "Carbohidratos",
    apertado:
      "Quedó poco espacio para los carbohidratos. Con un objetivo así, o el déficit es demasiado agresivo, o el gasto tiene que subir — entrenar más rinde más que comer menos.",
    distribuicao: (n) => `Distribución en ${n} comidas`,
    refeicao: "Comida",
    total: "Total",
    nomesRefeicoes: {
      2: ["Almuerzo", "Cena"],
      3: ["Desayuno", "Almuerzo", "Cena"],
      4: ["Desayuno", "Almuerzo", "Merienda", "Cena"],
      5: ["Desayuno", "Media mañana", "Almuerzo", "Merienda", "Cena"],
      6: ["Desayuno", "Media mañana", "Almuerzo", "Merienda", "Cena", "Recena"],
    },
    proteinaNota:
      "La proteína se dividió en partes iguales a propósito: el estímulo de síntesis responde a la dosis por comida, no al total de una sola vez. Los carbohidratos, en cambio, puedes concentrarlos alrededor del entrenamiento — ahí rinden más.",
    pctCalorias: (pct, kcal) => `${pct}% de las calorías · ${kcal} kcal`,
    ponte:
      "El número es el punto de partida, no el plan. Lo que cambia el resultado es cómo se distribuye en tu rutina — y el ajuste cuando el cuerpo responde.",
    comecar: "Empezar asesoría",
  },
  captura: {
    verificando: "Reconociendo tu perfil",
    reconhecido: "Perfil reconocido",
    instante: "Un momento…",
    vinculado: "Tus datos se vincularán al historial de tu cuenta.",
    recebido: "Recibido.",
    enviado: "Enviado.",
    sucesso: "Plan enviado. Revisa tu bandeja de entrada — y el spam, por si acaso.",
    semCopia:
      "Recibí tus datos y liberé el plan completo aquí abajo. La copia por correo no salió ahora — si quieres recibirla, escríbeme por WhatsApp.",
    pronto: "Tu plan está listo",
    titulo: "Desbloquea el resultado completo.",
    texto:
      "Indica solo nombre, correo y teléfono para ver calorías, macros, comidas y recibir una copia estructurada.",
    itens: ["✓ Meta calórica individual", "✓ Proteína, carbohidratos y grasa", "✓ Distribución por comidas"],
    empresa: "Empresa",
    nome: "Nombre",
    nomePlaceholder: "¿Cómo te llamas?",
    email: "Correo electrónico",
    emailPlaceholder: "tu@email.com",
    telefone: "Teléfono",
    telefonePlaceholder: "+34 600 000 000",
    consentimento:
      "Al continuar, aceptas recibir este resultado y un contacto relacionado con tu evaluación. Sin spam.",
    jaTem: "¿Ya tienes cuenta?",
    entrar: "Entrar con código",
    preparando: "Preparando…",
    liberar: "Desbloquear mi plan",
    erros: {
      nome: "Indica tu nombre.",
      email: "Indica un correo válido.",
      whatsapp: "Indica un WhatsApp con prefijo.",
    },
    revisar: "Revisa los campos marcados.",
    incompleto: "Los datos del plan no llegaron completos.",
    falha: "No pude enviarlo ahora. Inténtalo por WhatsApp.",
  },
};

const en: TextosCalorias = {
  seo: {
    titulo: "BMR & Calorie Calculator (basal metabolic rate and daily burn)",
    descricao:
      "Calculate your basal metabolic rate and total daily energy expenditure with Mifflin-St Jeor, Harris-Benedict or Katch-McArdle. Free, no sign-up, with protein ranges.",
    ogDescricao:
      "Basal metabolic rate, total daily burn, and targets to lose, maintain or gain. Three validated equations, no sign-up.",
    ogAlt: "Calorie calculator",
  },
  jsonld: {
    nome: "BMR & Calorie Calculator",
    sistema: "All — runs in the browser",
    descricao:
      "Calculates basal metabolic rate and total daily energy expenditure with Mifflin-St Jeor, Harris-Benedict or Katch-McArdle.",
    recursos: [
      "Basal metabolic rate (BMR)",
      "Total daily energy expenditure (TDEE)",
      "Targets for fat loss, maintenance and muscle gain",
      "Daily protein range",
    ],
    inicio: "Home",
    migalha: "Calorie calculator",
  },
  pagina: {
    voceEsta: "You are here",
    inicio: "Home",
    migalha: "Calorie calculator",
    eyebrow: "Free tool",
    titulo: "Basal calorie\ncalculator.",
    texto:
      "Find out how much energy your body burns at rest and how much it needs each day. It's the starting number of any protocol — and the first one most diets get wrong.",
    selos: ["No sign-up", "Instant result", "3 scientific equations"],
    previa: "Your plan preview",
    gastoDiario: "Daily burn",
    seuAlvo: "Your target",
    eixo: ["Metabolism", "Goal", "Progress"],
    comoLerEyebrow: "How to read the result",
    comoLerTitulo: "Three things the number doesn't tell you.",
    comoUsar: [
      {
        titulo: "Basal is the floor",
        texto:
          "Eating below your basal rate for long stretches costs lean mass, hormones and adherence. A deficit is built with margin, not hunger.",
      },
      {
        titulo: "Total burn is the target",
        texto:
          "It's your basal rate multiplied by your real activity. Working on your feet and training five times a week are not the same thing.",
      },
      {
        titulo: "The number changes",
        texto:
          "It drops as you lose weight. That's why the protocol is reviewed every two weeks, not calculated once.",
      },
    ],
    aviso:
      "Every metabolic equation is a population estimate, with an individual error of 10 to 15%. Use it as a starting point and adjust based on what the scale and the mirror show over the weeks.",
  },
  calc: {
    etapasAria: "Calculator steps",
    etapas: ["Your data", "Your goal", "Your plan"],
    dadosAria: "Your data",
    dadosEyebrow: "01 / Your data",
    sexoLegenda: "Biological sex",
    sexos: { masculino: "male", feminino: "female" },
    sexoNota: "The equations were derived using this variable — it's not a question about identity.",
    idade: "Age",
    anos: "years",
    peso: "Current weight",
    altura: "Height",
    atividade: "Activity level",
    atividades: {
      sedentario: { nome: "Sedentary", nota: "Little or no exercise" },
      leve: { nome: "Lightly active", nota: "1 to 3 workouts per week" },
      moderado: { nome: "Moderately active", nota: "3 to 5 workouts per week" },
      alto: { nome: "Very active", nota: "6 to 7 workouts per week" },
      atleta: { nome: "Extremely active", nota: "Two workouts a day or physical job" },
    },
    formulaLegenda: "How should we calculate your metabolism?",
    formulaDica: "If you're unsure, keep the recommended option.",
    recomendado: "Recommended",
    formulas: {
      mifflin: "Use this one if you don't know which to pick. It works well for most people.",
      harris: "An alternative estimate, based on an older equation.",
      katch: "Choose it only if you know your measured body fat percentage.",
    },
    gordura: "Body fat",
    gorduraNota:
      "Use a measured value (bioimpedance, calipers or DEXA). A guess doesn't improve the result — it makes it worse.",
    objetivoAria: "Your goal",
    objetivoEyebrow: "02 / Where you want to get",
    pesoAlvo: "Goal weight",
    refeicoes: "Meals per day",
    refeicoesNota:
      "The number of meals doesn't change the result — it changes your adherence. Pick what fits your routine.",
    faltaGordura: "Also enter your body fat percentage to use Katch-McArdle.",
    vazio: "Fill in age, weight and height to see the plan.",
    planoEyebrow: "03 / Your plan",
    borrao: ["Basal metabolism", "Your daily target", "Macronutrients"],
    reservado: "Result reserved for you",
    rumo: { perder: "Fat loss", ganhar: "Muscle gain", manter: "Maintenance" },
    tmb: "Basal metabolism",
    explicaTmb:
      "It's what your body uses just to exist: breathing, holding its temperature, fueling the brain. No diet should go below it.",
    get: "Total daily burn",
    getNota: "Basal rate multiplied by your activity level.",
    alvo: (rumo) => `Target — ${rumo.toLowerCase()}`,
    alvoManter: "Stable weight at your current burn.",
    ajustePorDia: (ajuste) => `${ajuste} kcal per day.`,
    diferenca: "Difference",
    ritmo: "Safe pace",
    porSemana: (kg) => `${kg} kg per week`,
    prazo: "Estimated time",
    semanas: (n) => `${n} ${n === 1 ? "week" : "weeks"}`,
    limitado:
      "The pace was reduced on purpose. Getting there faster would require a deficit below your basal metabolism — exactly the extreme diet that doesn't last and puts the weight back on later.",
    macrosTitulo: "Macronutrients at target",
    proteina: "Protein",
    gorduraMacro: "Fat",
    carboidrato: "Carbs",
    apertado:
      "There's little room left for carbs. With a target like this, either the deficit is too aggressive or your burn needs to go up — training more works better than eating less.",
    distribuicao: (n) => `Split across ${n} meals`,
    refeicao: "Meal",
    total: "Total",
    nomesRefeicoes: {
      2: ["Lunch", "Dinner"],
      3: ["Breakfast", "Lunch", "Dinner"],
      4: ["Breakfast", "Lunch", "Snack", "Dinner"],
      5: ["Breakfast", "Snack", "Lunch", "Snack", "Dinner"],
      6: ["Breakfast", "Snack", "Lunch", "Snack", "Dinner", "Evening snack"],
    },
    proteinaNota:
      "Protein was split evenly on purpose: the muscle-building signal responds to the dose per meal, not to the total eaten at once. Carbs, on the other hand, you can concentrate around your workout — that's where they pay off most.",
    pctCalorias: (pct, kcal) => `${pct}% of calories · ${kcal} kcal`,
    ponte:
      "The number is the starting point, not the plan. What changes the result is how it fits into your routine — and the adjustment when your body responds.",
    comecar: "Start coaching",
  },
  captura: {
    verificando: "Recognizing your profile",
    reconhecido: "Profile recognized",
    instante: "Just a moment…",
    vinculado: "Your data will be linked to your account history.",
    recebido: "Received.",
    enviado: "Sent.",
    sucesso: "Plan sent. Check your inbox — and your spam folder, just in case.",
    semCopia:
      "I got your details and unlocked the full plan below. The email copy didn't go out right now — if you'd like it, message me on WhatsApp.",
    pronto: "Your plan is ready",
    titulo: "Unlock the full result.",
    texto:
      "Just enter your name, email and phone to see calories, macros, meals and get a structured copy.",
    itens: ["✓ Individual calorie target", "✓ Protein, carbs and fat", "✓ Meal-by-meal split"],
    empresa: "Company",
    nome: "Name",
    nomePlaceholder: "What's your name?",
    email: "Email",
    emailPlaceholder: "you@email.com",
    telefone: "Phone",
    telefonePlaceholder: "+1 555 000 0000",
    consentimento:
      "By continuing, you agree to receive this result and a follow-up related to your assessment. No spam.",
    jaTem: "Already have an account?",
    entrar: "Sign in with a code",
    preparando: "Preparing…",
    liberar: "Unlock my plan",
    erros: {
      nome: "Enter your name.",
      email: "Enter a valid email.",
      whatsapp: "Enter a WhatsApp number with country/area code.",
    },
    revisar: "Please check the highlighted fields.",
    incompleto: "The plan data didn't come through complete.",
    falha: "I couldn't send it right now. Try WhatsApp.",
  },
};

export const TEXTOS_CALORIAS: Record<Idioma, TextosCalorias> = { pt, es, en };
