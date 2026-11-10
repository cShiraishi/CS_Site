/**
 * Calculadora de gordura corporal — textos em PT, ES e EN.
 *
 * O português não é reescrito aqui: sai de `content.ts` (texto da página)
 * e de `gordura.ts` (classificações e degraus da escala), para que a versão
 * original continue idêntica. Espanhol neutro com "tú"; inglês americano.
 *
 * Classificações e degraus são indexados pelo `id` de `gordura.ts`: a
 * matemática continua num lugar só, e aqui vive apenas o que se lê.
 */

import type { Atividade, Sexo } from "@/lib/calorias";
import { ATIVIDADES } from "@/lib/calorias";
import { gordura as ptPagina } from "@/lib/content";
import { type Campo, NIVEIS, NOME_DO_CAMPO, faixasDe } from "@/lib/gordura";
import type { Idioma } from "@/lib/rotas-idioma";

type Texto = { nome: string; nota: string };

export type TextosGordura = {
  /* ── metadata ─────────────────────────────────────────── */
  seo: {
    titulo: string;
    descricao: string;
    ogTitulo: string;
    ogDescricao: string;
    ogAlt: string;
    keywords?: string[];
  };
  jsonld: {
    nome: string;
    sistema: string;
    descricao: string;
    recursos: string[];
    inicio: string;
  };

  /* ── hero ─────────────────────────────────────────────── */
  migalha: { aria: string; inicio: string; atual: string };
  eyebrow: string;
  tituloLinhas: [string, string];
  texto: string;
  destaques: readonly string[];

  /* ── conteúdo da calculadora (espelha content.ts) ──────── */
  metodos: readonly { id: "imc" | "fita"; titulo: string; nota: string }[];
  avisos: { fita: string; imc: string };
  comoMedir: { pescoco: string; cintura: string; quadril: string };
  alvo: { titulo: string; texto: string; nota: string };
  plano: {
    titulo: string;
    fecho: {
      eyebrow: string;
      titulo: string;
      texto: string;
      itens: readonly string[];
      cta: string;
      urgencia: string;
      nota: string;
      privacidade: string;
      prova: { alt: string; legenda: string };
    };
  };

  /* ── dados localizados por id ─────────────────────────── */
  sexos: Record<Sexo, string>;
  campos: Record<Campo, string>;
  /** une nomes de campo: "o peso e a idade" */
  e: string;
  categorias: Record<Sexo, Record<string, Texto>>;
  niveis: Record<string, { nome: string; descricao: string }>;
  atividades: Record<Atividade, Texto>;

  /* ── interface ────────────────────────────────────────── */
  ui: {
    formAria: string;
    passo1: string;
    sexo: string;
    sexoNota: string;
    metodo: string;
    rotulos: {
      idade: string;
      peso: string;
      altura: string;
      pescoco: string;
      cintura: string;
      quadril: string;
    };
    unidadeAnos: string;
    unidadeSr: (unidade: string) => string;
    erros: {
      idade: string;
      peso: string;
      altura: string;
      pescoco: string;
      cintura: string;
      quadril: string;
    };
    comFita: string;
    atividade: string;
    cinturaMenor: string;
    foraDaFaixa: (lista: string) => string;
    faltam: (lista: string, quantos: number) => string;

    resultadoEyebrow: string;
    faixaProvavel: string;
    faixaA: string;
    estimativaImc: string;
    reguaAria: (bf: string, min: string, max: string, categoria: string) => string;
    reguaLegenda: string;

    percentualDesejado: string;
    voceEstaAqui: string;
    faltaPlano: (lista: string, quantos: number) => string;
    voltarMedidas: string;

    manter: string;
    /** "De X para Y são" */
    planoDe: string;
    planoPara: string;
    planoSao: string;
    aPerder: string;
    aGanhar: string;
    chegandoA: string;
    massaPreservada: string;
    caloriasDia: string;
    gastoEstimado: (kcal: string) => string;
    ritmo: string;
    tempoEstimado: string;
    semanas: string;
    semRotina: string;
    kgPorSemana: (kg: string) => string;
    pesoAlvo: string;
    massaMantida: (kg: string) => string;
    macrosTitulo: string;
    proteina: string;
    carboidrato: string;
    gordura: string;
    pctCalorias: (pct: number) => string;

    palcoTitulo: (nome: string) => string;
    palcoTexto: string;
    limitadoTitulo: string;
    limitadoTexto: string;
    apertadoTitulo: string;
    apertadoTexto: string;

    fechoEntre: (alvo: string) => string;
    fechoE: string;
    fechoSemanas: (n: number) => string;
    fechoFim: string;

    metaDe: (pct: string) => string;
    quero: string;
  };
};

/* ============================================================
   PT — tudo derivado do texto atual
   ============================================================ */

const categoriasPt = (sexo: Sexo) =>
  Object.fromEntries(faixasDe(sexo).map((c) => [c.id, { nome: c.nome, nota: c.nota }]));

const niveisPt = Object.fromEntries(
  [...NIVEIS.masculino, ...NIVEIS.feminino].map((n) => [
    n.id,
    { nome: n.nome, descricao: n.descricao },
  ]),
);

const atividadesPt = Object.fromEntries(
  ATIVIDADES.map((a) => [a.id, { nome: a.nome, nota: a.nota }]),
) as Record<Atividade, Texto>;

const pt: TextosGordura = {
  seo: {
    titulo: "Calculadora de gordura corporal — com fita métrica, em 2 minutos",
    descricao:
      "Calcule seu percentual de gordura corporal com uma fita métrica, escolha onde quer chegar e receba as calorias, os macros e o prazo estimado. Grátis, sem cadastro.",
    ogTitulo: "Calculadora de gordura corporal",
    ogDescricao:
      "Seu percentual de gordura, o corpo que você quer e quantas semanas separam um do outro.",
    ogAlt: "Calculadora de gordura corporal",
  },
  jsonld: {
    nome: "Calculadora de gordura corporal",
    sistema: "Todos — roda no navegador",
    descricao:
      "Estima o percentual de gordura corporal por circunferências (método da Marinha dos EUA) e devolve calorias, macros e prazo até o percentual desejado.",
    recursos: [
      "Estimativa por fita métrica, sem bioimpedância",
      "Resultado em faixa, com o erro do método declarado",
      "Classificação nas faixas do American Council on Exercise",
      "Escala visual para escolher o percentual desejado",
      "Peso alvo com massa magra preservada",
      "Calorias, macros e prazo estimado em semanas",
    ],
    inicio: "Início",
  },
  migalha: { aria: "Você está em", inicio: "Início", atual: "Gordura corporal" },
  eyebrow: ptPagina.eyebrow,
  tituloLinhas: ["Quanta gordura", "você carrega hoje."],
  texto: ptPagina.texto,
  destaques: ptPagina.destaques,
  metodos: ptPagina.metodos,
  avisos: ptPagina.avisos,
  comoMedir: ptPagina.comoMedir,
  alvo: ptPagina.alvo,
  plano: {
    titulo: ptPagina.plano.titulo,
    fecho: {
      ...ptPagina.plano.fecho,
      prova: { alt: ptPagina.plano.fecho.prova.alt, legenda: ptPagina.plano.fecho.prova.legenda },
    },
  },
  sexos: { masculino: "masculino", feminino: "feminino" },
  campos: NOME_DO_CAMPO,
  e: "e",
  categorias: { masculino: categoriasPt("masculino"), feminino: categoriasPt("feminino") },
  niveis: niveisPt,
  atividades: atividadesPt,
  ui: {
    formAria: "Suas medidas",
    passo1: "01 / Suas medidas",
    sexo: "Sexo biológico",
    sexoNota: "As equações usam esta variável — não é sobre identidade.",
    metodo: "Como vamos medir",
    rotulos: {
      idade: "Idade",
      peso: "Peso",
      altura: "Altura",
      pescoco: "Pescoço",
      cintura: "Cintura",
      quadril: "Quadril",
    },
    unidadeAnos: "anos",
    unidadeSr: (u) => ` em ${u}`,
    erros: {
      idade: "Entre 14 e 100 anos.",
      peso: "Entre 30 e 300 kg.",
      altura: "Em centímetros: 176, não 1,76.",
      pescoco: "Entre 20 e 70 cm.",
      cintura: "Entre 40 e 200 cm.",
      quadril: "Entre 50 e 220 cm.",
    },
    comFita: "Com a fita métrica",
    atividade: "Nível de atividade",
    cinturaMenor:
      "A cintura ficou menor que o pescoço, e isso é sempre erro de medição. A cintura é na altura do umbigo, em pé e relaxado — sem prender a barriga.",
    foraDaFaixa: (l) =>
      `Confira ${l}: o valor está fora do que a equação consegue usar. Altura e circunferências vão em centímetros — 176, não 1,76.`,
    faltam: (l) => `Falta ${l} para ver o resultado.`,
    resultadoEyebrow: "Seu percentual estimado",
    faixaProvavel: "Faixa provável:",
    faixaA: "a",
    estimativaImc: " — estimativa fraca, pelo IMC",
    reguaAria: (bf, min, max, c) =>
      `${bf} de gordura corporal, faixa provável de ${min} a ${max}, classificado como ${c}.`,
    reguaLegenda: "A barra clara é a sua faixa provável; o traço, o valor central.",
    percentualDesejado: "Percentual desejado",
    voceEstaAqui: "Você está aqui",
    faltaPlano: (l) => `Falta ${l} para montar o plano — `,
    voltarMedidas: "voltar às medidas",
    manter:
      "Você já está onde escolheu estar. O plano aqui não é perder — é manter enquanto se treina para mudar a composição por dentro: mesma balança, outra proporção entre músculo e gordura.",
    planoDe: "De",
    planoPara: "para",
    planoSao: "são",
    aPerder: "a perder",
    aGanhar: "a ganhar",
    chegandoA: "chegando a",
    massaPreservada: "com a massa magra preservada.",
    caloriasDia: "Calorias por dia",
    gastoEstimado: (k) => `Gasto estimado: ${k} kcal`,
    ritmo: "Ritmo",
    tempoEstimado: "Tempo estimado",
    semanas: "semanas",
    semRotina: "Sem prazo: é rotina, não projeto",
    kgPorSemana: (k) => `${k} kg por semana`,
    pesoAlvo: "Peso alvo",
    massaMantida: (k) => `Massa magra mantida em ${k} kg`,
    macrosTitulo: "A distribuição dos macros",
    proteina: "Proteína",
    carboidrato: "Carboidrato",
    gordura: "Gordura",
    pctCalorias: (p) => `${p} % das calorias`,
    palcoTitulo: (n) => `${n} é condição de palco.`,
    palcoTexto:
      "Atletas chegam lá por algumas semanas, com acompanhamento, e saem depois. Como meta para o ano inteiro, cobra libido, humor, sono e treino. Se o objetivo é uma foto, faz sentido; se é viver assim, escolha um degrau acima.",
    limitadoTitulo: "O ritmo foi reduzido de propósito.",
    limitadoTexto:
      "O déficit que essa meta pediria passaria de 25 % do seu gasto, ou cairia abaixo do seu metabolismo basal. O prazo acima já é o caminho mais rápido que ainda protege massa magra.",
    apertadoTitulo: "Sobrou pouco carboidrato.",
    apertadoTexto:
      "Com proteína e gordura nos mínimos, o que resta de energia é pequeno — sinal de que a meta é agressiva para o seu gasto atual. Treinar pesado com esse valor é difícil.",
    fechoEntre: (a) => `Entre você e ${a} estão`,
    fechoE: "e",
    fechoSemanas: (n) => `${n} semanas`,
    fechoFim: ". O plano existe para que essas semanas não virem dois anos.",
    metaDe: (p) => `meta de ${p}`,
    quero: "Quero o plano",
  },
};

/* ============================================================
   ES
   ============================================================ */

const es: TextosGordura = {
  seo: {
    titulo: "Calculadora de grasa corporal — con cinta métrica, en 2 minutos",
    descricao:
      "Calcula tu porcentaje de grasa corporal con una cinta métrica, elige a dónde quieres llegar y recibe las calorías, los macros y el plazo estimado. Gratis y sin registro.",
    ogTitulo: "Calculadora de grasa corporal",
    ogDescricao:
      "Tu porcentaje de grasa, el cuerpo que quieres y cuántas semanas hay entre uno y otro.",
    ogAlt: "Calculadora de grasa corporal",
    keywords: [
      "calculadora de grasa corporal",
      "porcentaje de grasa corporal",
      "calcular grasa corporal",
      "método de la Marina",
      "grasa corporal con cinta métrica",
    ],
  },
  jsonld: {
    nome: "Calculadora de grasa corporal",
    sistema: "Todos — funciona en el navegador",
    descricao:
      "Estima el porcentaje de grasa corporal por circunferencias (método de la Marina de EE. UU.) y devuelve calorías, macros y plazo hasta el porcentaje deseado.",
    recursos: [
      "Estimación con cinta métrica, sin bioimpedancia",
      "Resultado en rango, con el error del método declarado",
      "Clasificación según los rangos del American Council on Exercise",
      "Escala visual para elegir el porcentaje deseado",
      "Peso objetivo preservando la masa magra",
      "Calorías, macros y plazo estimado en semanas",
    ],
    inicio: "Inicio",
  },
  migalha: { aria: "Estás en", inicio: "Inicio", atual: "Grasa corporal" },
  eyebrow: "Herramienta gratuita",
  tituloLinhas: ["Cuánta grasa", "llevas hoy."],
  texto:
    "Dos minutos, sin equipo. Descubre cuánta grasa llevas y qué te separa del cuerpo que quieres.",
  destaques: [
    "Sin báscula de bioimpedancia",
    "Resultado en rango, no un número falso",
    "El plan sale junto con el resultado",
  ],
  metodos: [
    { id: "imc", titulo: "No tengo cinta", nota: "Estimación rápida, solo con peso y altura." },
    {
      id: "fita",
      titulo: "Tengo cinta métrica",
      nota: "Mucho más precisa. Pide cuello y cintura.",
    },
  ],
  avisos: {
    fita: "Error de 3 a 4 puntos hacia cada lado — por eso el resultado sale como rango.",
    imc: "Estimación débil: sin las circunferencias el error supera los 5 puntos. Si tienes una cinta, cambia arriba.",
  },
  comoMedir: {
    pescoco: "Justo debajo de la nuez, sin apretar.",
    cintura: "A la altura del ombligo, sin meter la barriga.",
    quadril: "En la parte más ancha de los glúteos.",
  },
  alvo: {
    titulo: "A dónde quieres llegar",
    texto: "Elige lo que puedes mantener, no lo que más impresiona.",
    nota: "Rangos del American Council on Exercise.",
  },
  plano: {
    titulo: "Lo que te separa de ese punto",
    fecho: {
      eyebrow: "El siguiente paso",
      titulo: "La cuenta es la parte fácil.",
      texto:
        "Lo que decide el resultado es lo que pasa entre hoy y ese día — y ahí es donde entro yo.",
      itens: [
        "Plan de alimentación armado con lo que ya comes",
        "Entrenamiento periodizado para tu frecuencia real",
        "Revisión cada quince días, con tus números sobre la mesa",
      ],
      cta: "Quiero este plan contigo",
      urgencia: "Plazas limitadas por grupo — el acompañamiento es individual.",
      nota: "Formulario de 2 minutos. Lo leo y respondo personalmente.",
      privacidade:
        "El cálculo se hace en tu navegador. Solo si haces clic en el botón, el resultado (% de grasa, meta y calorías) viaja al formulario — para no tener que preguntarte todo de nuevo.",
      prova: {
        alt: "Antes y después de una alumna acompañada por Carlos Seiti: a la izquierda, sin definición; a la derecha, abdomen y piernas marcados",
        legenda: "Acompañamiento individual, con ajustes cada quince días.",
      },
    },
  },
  sexos: { masculino: "masculino", feminino: "femenino" },
  campos: {
    idade: "la edad",
    peso: "el peso",
    altura: "la altura",
    pescoco: "el cuello",
    cintura: "la cintura",
    quadril: "la cadera",
  },
  e: "y",
  categorias: {
    masculino: {
      essencial: {
        nome: "Grasa esencial",
        nota: "Por debajo del mínimo fisiológico. No es una meta — es un estado de riesgo.",
      },
      atleta: { nome: "Atleta", nota: "El rango de quien entrena hace años con dieta controlada." },
      fitness: { nome: "En forma", nota: "Silueta definida, sostenible todo el año." },
      aceitavel: { nome: "Promedio saludable", nota: "Dentro de lo normal para la población adulta." },
      acima: { nome: "Por encima del rango", nota: "Asociado a un mayor riesgo cardiometabólico." },
    },
    feminino: {
      essencial: {
        nome: "Grasa esencial",
        nota: "Por debajo del mínimo fisiológico. Suele venir con pérdida del ciclo menstrual.",
      },
      atleta: { nome: "Atleta", nota: "El rango de quien entrena hace años con dieta controlada." },
      fitness: { nome: "En forma", nota: "Silueta definida, sostenible todo el año." },
      aceitavel: { nome: "Promedio saludable", nota: "Dentro de lo normal para la población adulta." },
      acima: { nome: "Por encima del rango", nota: "Asociado a un mayor riesgo cardiometabólico." },
    },
  },
  niveis: {
    "h-palco": {
      nome: "Escenario",
      descricao: "Abdomen completo y venas visibles. Condición de competición.",
    },
    "h-seco": { nome: "Muy seco", descricao: "Ocho cuadritos en reposo, sin retención." },
    "h-definido": {
      nome: "Definido",
      descricao: "Seis cuadritos sin contraer, con la V de la cadera.",
    },
    "h-atletico": { nome: "Atlético", descricao: "Abdomen visible con buena luz." },
    "h-forma": { nome: "En forma", descricao: "La parte de arriba del abdomen a la vista." },
    "h-plano": { nome: "Vientre plano", descricao: "Vientre liso, sin sobrante en la cintura." },
    "h-medio": { nome: "Promedio", descricao: "Acumulación al frente del abdomen." },
    "h-acima": { nome: "Por encima", descricao: "Cintura más ancha que el tórax." },
    "m-palco": {
      nome: "Escenario",
      descricao: "Abdomen marcado y cuádriceps separado. Condición de competición.",
    },
    "m-seca": { nome: "Muy seca", descricao: "Seis cuadritos en reposo, hombro dibujado." },
    "m-definida": {
      nome: "Definida",
      descricao: "Parte de arriba del abdomen y oblicuos a la vista.",
    },
    "m-atletica": { nome: "Atlética", descricao: "Línea central del abdomen, cintura marcada." },
    "m-forma": { nome: "En forma", descricao: "Vientre plano, definición solo al contraer." },
    "m-plana": { nome: "Vientre plano", descricao: "Silueta armónica, sin sobrante en la cintura." },
    "m-media": { nome: "Promedio", descricao: "Acumulación en cadera y muslos." },
    "m-acima": { nome: "Por encima", descricao: "Distribución más uniforme." },
  },
  atividades: {
    sedentario: { nome: "Sedentario", nota: "Poco o ningún ejercicio" },
    leve: { nome: "Ligeramente activo", nota: "1 a 3 entrenamientos por semana" },
    moderado: { nome: "Moderadamente activo", nota: "3 a 5 entrenamientos por semana" },
    alto: { nome: "Muy activo", nota: "6 a 7 entrenamientos por semana" },
    atleta: { nome: "Extremadamente activo", nota: "Dos entrenamientos al día o trabajo físico" },
  },
  ui: {
    formAria: "Tus medidas",
    passo1: "01 / Tus medidas",
    sexo: "Sexo biológico",
    sexoNota: "Las ecuaciones usan esta variable — no se trata de identidad.",
    metodo: "Cómo vamos a medir",
    rotulos: {
      idade: "Edad",
      peso: "Peso",
      altura: "Altura",
      pescoco: "Cuello",
      cintura: "Cintura",
      quadril: "Cadera",
    },
    unidadeAnos: "años",
    unidadeSr: (u) => ` en ${u}`,
    erros: {
      idade: "Entre 14 y 100 años.",
      peso: "Entre 30 y 300 kg.",
      altura: "En centímetros: 176, no 1,76.",
      pescoco: "Entre 20 y 70 cm.",
      cintura: "Entre 40 y 200 cm.",
      quadril: "Entre 50 y 220 cm.",
    },
    comFita: "Con la cinta métrica",
    atividade: "Nivel de actividad",
    cinturaMenor:
      "La cintura quedó menor que el cuello, y eso siempre es un error de medición. La cintura se mide a la altura del ombligo, de pie y relajado — sin meter la barriga.",
    foraDaFaixa: (l) =>
      `Revisa ${l}: el valor está fuera de lo que la ecuación puede usar. La altura y las circunferencias van en centímetros — 176, no 1,76.`,
    faltam: (l, n) => `Falta${n > 1 ? "n" : ""} ${l} para ver el resultado.`,
    resultadoEyebrow: "Tu porcentaje estimado",
    faixaProvavel: "Rango probable:",
    faixaA: "a",
    estimativaImc: " — estimación débil, por el IMC",
    reguaAria: (bf, min, max, c) =>
      `${bf} de grasa corporal, rango probable de ${min} a ${max}, clasificado como ${c}.`,
    reguaLegenda: "La barra clara es tu rango probable; la línea, el valor central.",
    percentualDesejado: "Porcentaje deseado",
    voceEstaAqui: "Estás aquí",
    faltaPlano: (l, n) => `Falta${n > 1 ? "n" : ""} ${l} para armar el plan — `,
    voltarMedidas: "volver a las medidas",
    manter:
      "Ya estás donde elegiste estar. El plan aquí no es perder — es mantener mientras entrenas para cambiar la composición por dentro: la misma báscula, otra proporción entre músculo y grasa.",
    planoDe: "De",
    planoPara: "a",
    planoSao: "hay",
    aPerder: "por perder",
    aGanhar: "por ganar",
    chegandoA: "hasta llegar a",
    massaPreservada: "con la masa magra preservada.",
    caloriasDia: "Calorías por día",
    gastoEstimado: (k) => `Gasto estimado: ${k} kcal`,
    ritmo: "Ritmo",
    tempoEstimado: "Tiempo estimado",
    semanas: "semanas",
    semRotina: "Sin plazo: es rutina, no proyecto",
    kgPorSemana: (k) => `${k} kg por semana`,
    pesoAlvo: "Peso objetivo",
    massaMantida: (k) => `Masa magra mantenida en ${k} kg`,
    macrosTitulo: "La distribución de los macros",
    proteina: "Proteína",
    carboidrato: "Carbohidratos",
    gordura: "Grasa",
    pctCalorias: (p) => `${p} % de las calorías`,
    palcoTitulo: (n) => `${n} es una condición de competición.`,
    palcoTexto:
      "Los atletas llegan ahí por unas semanas, con acompañamiento, y luego salen. Como meta para todo el año, le pasa factura a la libido, el humor, el sueño y el entrenamiento. Si el objetivo es una foto, tiene sentido; si es vivir así, elige un escalón más arriba.",
    limitadoTitulo: "El ritmo se redujo a propósito.",
    limitadoTexto:
      "El déficit que pediría esta meta superaría el 25 % de tu gasto o caería por debajo de tu metabolismo basal. El plazo de arriba ya es el camino más rápido que todavía protege la masa magra.",
    apertadoTitulo: "Quedaron pocos carbohidratos.",
    apertadoTexto:
      "Con la proteína y la grasa en el mínimo, la energía que queda es poca — señal de que la meta es agresiva para tu gasto actual. Entrenar fuerte con ese valor es difícil.",
    fechoEntre: (a) => `Entre tú y el ${a} hay`,
    fechoE: "y",
    fechoSemanas: (n) => `${n} semanas`,
    fechoFim: ". El plan existe para que esas semanas no se conviertan en dos años.",
    metaDe: (p) => `meta de ${p}`,
    quero: "Quiero el plan",
  },
};

/* ============================================================
   EN
   ============================================================ */

const en: TextosGordura = {
  seo: {
    titulo: "Body Fat Calculator — with a tape measure, in 2 minutes",
    descricao:
      "Calculate your body fat percentage with a tape measure, pick where you want to get to and get your calories, macros and estimated timeline. Free, no sign-up.",
    ogTitulo: "Body Fat Calculator",
    ogDescricao:
      "Your body fat percentage, the body you want, and how many weeks stand between them.",
    ogAlt: "Body Fat Calculator",
    keywords: [
      "body fat calculator",
      "body fat percentage",
      "navy body fat calculator",
      "tape measure body fat",
      "calculate body fat",
    ],
  },
  jsonld: {
    nome: "Body Fat Calculator",
    sistema: "Any — runs in the browser",
    descricao:
      "Estimates body fat percentage from circumference measurements (U.S. Navy method) and returns calories, macros and a timeline to the target percentage.",
    recursos: [
      "Tape-measure estimate, no bioimpedance scale",
      "Result shown as a range, with the method's error stated",
      "Classification using American Council on Exercise ranges",
      "Visual scale to pick your target percentage",
      "Target weight with lean mass preserved",
      "Calories, macros and estimated timeline in weeks",
    ],
    inicio: "Home",
  },
  migalha: { aria: "You are here", inicio: "Home", atual: "Body fat" },
  eyebrow: "Free tool",
  tituloLinhas: ["How much fat", "you're carrying today."],
  texto:
    "Two minutes, no equipment. Find out how much fat you're carrying and what stands between you and the body you want.",
  destaques: [
    "No bioimpedance scale",
    "A range, not a fake-precise number",
    "Your plan comes with the result",
  ],
  metodos: [
    { id: "imc", titulo: "No tape measure", nota: "Quick estimate from weight and height only." },
    {
      id: "fita",
      titulo: "I have a tape measure",
      nota: "Far more accurate. Asks for neck and waist.",
    },
  ],
  avisos: {
    fita: "Error of 3 to 4 points either way — that's why the result comes as a range.",
    imc: "Weak estimate: without circumferences the error exceeds 5 points. If you have a tape measure, switch above.",
  },
  comoMedir: {
    pescoco: "Just below the Adam's apple, without squeezing.",
    cintura: "At belly-button level, without sucking in.",
    quadril: "Around the widest part of the glutes.",
  },
  alvo: {
    titulo: "Where you want to get to",
    texto: "Pick what you can maintain, not what looks most impressive.",
    nota: "American Council on Exercise ranges.",
  },
  plano: {
    titulo: "What stands between you and that point",
    fecho: {
      eyebrow: "The next step",
      titulo: "The math is the easy part.",
      texto:
        "What decides the result is what happens between today and then — and that's where I come in.",
      itens: [
        "A meal plan built around what you already eat",
        "Periodized training for how often you can really train",
        "A check-in every two weeks, with your numbers on the table",
      ],
      cta: "I want this plan with you",
      urgencia: "Limited spots per cohort — coaching is 1-on-1.",
      nota: "2-minute form. I read and reply personally.",
      privacidade:
        "The calculation runs in your browser. Only if you click the button does your result (body fat %, target and calories) go along to the form — so I don't have to ask you everything again.",
      prova: {
        alt: "Before and after of a client coached by Carlos Seiti: on the left, no definition; on the right, defined abs and legs",
        legenda: "1-on-1 coaching, adjusted every two weeks.",
      },
    },
  },
  sexos: { masculino: "male", feminino: "female" },
  campos: {
    idade: "your age",
    peso: "your weight",
    altura: "your height",
    pescoco: "your neck",
    cintura: "your waist",
    quadril: "your hips",
  },
  e: "and",
  categorias: {
    masculino: {
      essencial: {
        nome: "Essential fat",
        nota: "Below the physiological minimum. Not a goal — a state of risk.",
      },
      atleta: { nome: "Athlete", nota: "Where people land after years of training with a controlled diet." },
      fitness: { nome: "Fit", nota: "Defined physique, sustainable year-round." },
      aceitavel: { nome: "Healthy average", nota: "Within the normal range for adults." },
      acima: { nome: "Above range", nota: "Linked to increased cardiometabolic risk." },
    },
    feminino: {
      essencial: {
        nome: "Essential fat",
        nota: "Below the physiological minimum. Often comes with loss of the menstrual cycle.",
      },
      atleta: { nome: "Athlete", nota: "Where people land after years of training with a controlled diet." },
      fitness: { nome: "Fit", nota: "Defined physique, sustainable year-round." },
      aceitavel: { nome: "Healthy average", nota: "Within the normal range for adults." },
      acima: { nome: "Above range", nota: "Linked to increased cardiometabolic risk." },
    },
  },
  niveis: {
    "h-palco": { nome: "Stage", descricao: "Full six-pack and visible veins. Competition condition." },
    "h-seco": { nome: "Very lean", descricao: "Eight-pack at rest, no water retention." },
    "h-definido": { nome: "Shredded", descricao: "Six-pack without flexing, with the V-cut." },
    "h-atletico": { nome: "Athletic", descricao: "Abs visible in good lighting." },
    "h-forma": { nome: "Fit", descricao: "Upper abs showing." },
    "h-plano": { nome: "Flat stomach", descricao: "Flat stomach, nothing over the waistband." },
    "h-medio": { nome: "Average", descricao: "Fat stored at the front of the belly." },
    "h-acima": { nome: "Above", descricao: "Waist wider than the chest." },
    "m-palco": {
      nome: "Stage",
      descricao: "Defined abs and separated quads. Competition condition.",
    },
    "m-seca": { nome: "Very lean", descricao: "Six-pack at rest, sculpted shoulders." },
    "m-definida": { nome: "Shredded", descricao: "Upper abs and obliques showing." },
    "m-atletica": { nome: "Athletic", descricao: "Center ab line, defined waist." },
    "m-forma": { nome: "Fit", descricao: "Flat stomach, definition only when flexing." },
    "m-plana": { nome: "Flat stomach", descricao: "Balanced silhouette, nothing over the waistband." },
    "m-media": { nome: "Average", descricao: "Fat stored on hips and thighs." },
    "m-acima": { nome: "Above", descricao: "More evenly distributed fat." },
  },
  atividades: {
    sedentario: { nome: "Sedentary", nota: "Little or no exercise" },
    leve: { nome: "Lightly active", nota: "1 to 3 workouts per week" },
    moderado: { nome: "Moderately active", nota: "3 to 5 workouts per week" },
    alto: { nome: "Very active", nota: "6 to 7 workouts per week" },
    atleta: { nome: "Extremely active", nota: "Two workouts a day or physical job" },
  },
  ui: {
    formAria: "Your measurements",
    passo1: "01 / Your measurements",
    sexo: "Biological sex",
    sexoNota: "The equations use this variable — it's not about identity.",
    metodo: "How we'll measure",
    rotulos: {
      idade: "Age",
      peso: "Weight",
      altura: "Height",
      pescoco: "Neck",
      cintura: "Waist",
      quadril: "Hips",
    },
    unidadeAnos: "years",
    unidadeSr: (u) => ` in ${u}`,
    erros: {
      idade: "Between 14 and 100 years.",
      peso: "Between 30 and 300 kg.",
      altura: "In centimeters: 176, not 1.76.",
      pescoco: "Between 20 and 70 cm.",
      cintura: "Between 40 and 200 cm.",
      quadril: "Between 50 and 220 cm.",
    },
    comFita: "With the tape measure",
    atividade: "Activity level",
    cinturaMenor:
      "Your waist came out smaller than your neck, and that's always a measuring error. Measure the waist at belly-button level, standing and relaxed — without sucking in.",
    foraDaFaixa: (l) =>
      `Check ${l}: the value is outside what the equation can use. Height and circumferences go in centimeters — 176, not 1.76.`,
    faltam: (l) => `Add ${l} to see your result.`,
    resultadoEyebrow: "Your estimated body fat",
    faixaProvavel: "Likely range:",
    faixaA: "to",
    estimativaImc: " — weak estimate, based on BMI",
    reguaAria: (bf, min, max, c) =>
      `${bf} body fat, likely range ${min} to ${max}, classified as ${c}.`,
    reguaLegenda: "The light bar is your likely range; the line, the central value.",
    percentualDesejado: "Target percentage",
    voceEstaAqui: "You are here",
    faltaPlano: (l) => `Add ${l} to build your plan — `,
    voltarMedidas: "back to measurements",
    manter:
      "You're already where you chose to be. The plan here isn't losing — it's maintaining while you train to change your composition from the inside: same scale weight, a different ratio of muscle to fat.",
    planoDe: "From",
    planoPara: "to",
    planoSao: "is",
    aPerder: "to lose",
    aGanhar: "to gain",
    chegandoA: "reaching",
    massaPreservada: "with lean mass preserved.",
    caloriasDia: "Calories per day",
    gastoEstimado: (k) => `Estimated expenditure: ${k} kcal`,
    ritmo: "Pace",
    tempoEstimado: "Estimated time",
    semanas: "weeks",
    semRotina: "No deadline: it's a routine, not a project",
    kgPorSemana: (k) => `${k} kg per week`,
    pesoAlvo: "Target weight",
    massaMantida: (k) => `Lean mass kept at ${k} kg`,
    macrosTitulo: "Macro breakdown",
    proteina: "Protein",
    carboidrato: "Carbs",
    gordura: "Fat",
    pctCalorias: (p) => `${p}% of calories`,
    palcoTitulo: (n) => `${n} is a competition condition.`,
    palcoTexto:
      "Athletes get there for a few weeks, with coaching, and then come back up. As a year-round goal, it costs you libido, mood, sleep and training. If the goal is a photo, it makes sense; if it's living like that, pick one step up.",
    limitadoTitulo: "The pace was slowed on purpose.",
    limitadoTexto:
      "The deficit this goal would require would exceed 25% of your expenditure, or drop below your basal metabolic rate. The timeline above is already the fastest route that still protects lean mass.",
    apertadoTitulo: "Very few carbs left.",
    apertadoTexto:
      "With protein and fat at their minimums, there's little energy left — a sign the goal is aggressive for your current expenditure. Training hard on this number is tough.",
    fechoEntre: (a) => `Between you and ${a} stand`,
    fechoE: "and",
    fechoSemanas: (n) => `${n} weeks`,
    fechoFim: ". The plan exists so those weeks don't turn into two years.",
    metaDe: (p) => `${p} target`,
    quero: "Get the plan",
  },
};

export const TEXTOS_GORDURA: Record<Idioma, TextosGordura> = { pt, es, en };

/* ============================================================
   Formatação
   ============================================================ */

const LOCALE: Record<Idioma, string> = { pt: "pt-BR", es: "es", en: "en-US" };

/** Número no padrão do idioma: 85,3 / 85.3. */
export function numIdioma(idioma: Idioma, n: number): string {
  return n.toLocaleString(LOCALE[idioma]);
}

/** Percentual: "23,4 %" em PT/ES (com espaço, como já era), "23.4%" em EN. */
export function pctIdioma(idioma: Idioma, n: number): string {
  const v = n.toLocaleString(LOCALE[idioma], { maximumFractionDigits: 1 });
  return idioma === "en" ? `${v}%` : `${v} %`;
}

/** "o peso", "o peso e a idade", "o peso, a idade e a altura". */
export function listarCampos(idioma: Idioma, campos: Campo[]): string {
  const t = TEXTOS_GORDURA[idioma];
  const nomes = campos.map((c) => t.campos[c]);
  if (nomes.length <= 1) return nomes[0] ?? "";
  const virgula = idioma === "en" && nomes.length > 2 ? "," : "";
  return `${nomes.slice(0, -1).join(", ")}${virgula} ${t.e} ${nomes[nomes.length - 1]}`;
}
