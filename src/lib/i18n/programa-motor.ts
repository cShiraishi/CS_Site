/**
 * Textos gerados pelo motor do Reset 21D (`programa.ts`, `treino.ts`,
 * `shapes.ts`) nos três idiomas.
 *
 * O português é cópia literal do que o motor sempre escreveu — a área do
 * aluno (`PlataformaReset21D`) chama `montar()` sem idioma e tem de ler
 * exatamente o mesmo texto de antes. Espanhol e inglês só existem para a
 * página de vendas em /es e /en.
 *
 * Sem "use client": roda no servidor e no cliente.
 */

import type { Idioma } from "../rotas-idioma";

/**
 * Número com uma casa decimal no idioma. Português e espanhol usam vírgula;
 * inglês, ponto. À mão, não `toLocaleString`, pelo mesmo motivo de sempre:
 * servidor e cliente podem divergir de locale e quebrar a hidratação.
 */
export function numeroIdioma(valor: number, idioma: Idioma = "pt"): string {
  return idioma === "en" ? String(valor) : String(valor).replace(".", ",");
}

type TextoBloco = { titulo: string; foco: string; marco: string };

type ModoAviso = "perder" | "ganhar";

export type TextosMotor = {
  intervalo: (inicio: number, fim: number) => string;
  blocos: Record<1 | 2 | 3, TextoBloco>;
  manutencao: TextoBloco;
  recomposicaoMarco1: string;
  avisos: {
    recomposicao: string;
    naoCabe: (a: {
      pedido: string;
      duracao: number;
      entregue: string;
      falta: string;
      semanasExtra: number;
      modo: ModoAviso;
    }) => string;
    diaDoAlvo: (dia: number) => string;
    massaMagra: (a: {
      pesoAlvo: string;
      precisa: string;
      porMes: string;
      meses: number;
      duracao: number;
    }) => string;
    silhueta: (a: { pesoDaSilhueta: string; pesoAlvo: string; acima: boolean }) => string;
    limitado: string;
    apertado: string;
    diasAjustados: (a: { pedidos: number; dias: number; duracao: number }) => string;
    severa: string;
    volumeBaixo: string;
  };
};

export const MOTOR: Record<Idioma, TextosMotor> = {
  pt: {
    intervalo: (inicio, fim) => `Dias ${inicio} a ${fim}`,
    blocos: {
      1: {
        titulo: "Fundação",
        foco:
          "Descompressão glicêmica, ajuste da distribuição proteica e instalação da frequência de treino. Na primeira semana a retenção hídrica cede e os picos de fome à noite desaparecem.",
        marco: "Peso em jejum no Dia 7, cintura, fotos de frente e de lado e 100% das sessões cumpridas.",
      },
      2: {
        titulo: "Carga",
        foco:
          "Com a glicemia estável e a técnica ajustada, a sinalização mecânica sobe. É a semana onde a oxidação real de gordura acelera protegendo a massa muscular.",
        marco: "Peso no Dia 14, circunferência abdominal e progressão de carga ou repetições sobre a Semana 1.",
      },
      3: {
        titulo: "Definição",
        foco:
          "Intensidade mais perto da falha e calorias recalculadas sobre o peso novo — blindando o metabolismo contra platôs e entregando o protocolo do Dia 22 em diante.",
        marco: "Peso final do Dia 21, fotos comparativas (Dia 1 vs. Dia 21), cintura e transição para manutenção ou próximo ciclo.",
      },
    },
    manutencao: {
      titulo: "Manutenção",
      foco:
        "Você chega ao peso alvo antes do fim do programa, e este bloco existe para o resultado não ser temporário: " +
        "as calorias voltam ao seu gasto total e o treino segue igual. É aqui que o corpo aprende a sustentar o peso novo.",
      marco: "Peso estável por quatro semanas, fotos e cintura — e o seu gasto de manutenção, agora medido na prática.",
    },
    recomposicaoMarco1:
      "Fotos de frente e de lado, cintura e as sessões cumpridas. O peso entra no registro, mas não é o que se avalia.",
    avisos: {
      recomposicao:
        `Você pediu praticamente o mesmo peso e uma silhueta bem mais magra. Isso tem nome — recomposição corporal — ` +
        `e é o pedido mais comum de quem já está no peso e não gosta do que vê. O plano usa um déficit pequeno, ` +
        `proteína alta e treino de força: a balança vai mexer pouco de propósito. ` +
        `Quem mede o seu resultado aqui é a cintura e a foto, não o peso.`,
      naoCabe: ({ pedido, duracao, entregue, falta, semanasExtra, modo }) => {
        const preco =
          modo === "perder"
            ? "o preço é massa magra, e ela não volta sozinha"
            : "o preço é gordura, e aí o corte vem depois para desfazer o que se ganhou";
        return (
          `Os ${pedido} kg que você pediu não cabem em ${duracao} dias no ritmo seguro. ` +
          `O programa entrega ${entregue} kg — e os ${falta} kg que faltam levam cerca de ` +
          `${semanasExtra} semanas a mais, mantendo o mesmo método. ` +
          `Dá para ir mais rápido que isso; ${preco}.`
        );
      },
      diaDoAlvo: (dia) =>
        `Pelo cálculo, você chega ao peso alvo por volta do dia ${dia}. ` +
        `Os dias restantes não são sobra: são o bloco de manutenção, que é onde o resultado deixa de ser temporário.`,
      massaMagra: ({ pesoAlvo, precisa, porMes, meses, duracao }) =>
        `Os ${pesoAlvo} kg com a silhueta que você escolheu exigem cerca de ${precisa} kg de massa magra a mais do que você tem hoje. ` +
        `Músculo natural vem a uns ${porMes} kg por mês no seu nível, então esse corpo é projeto de ${meses} meses, não de ${duracao} dias. ` +
        `Os ${duracao} dias são o primeiro bloco dele — e o bloco que decide se os outros acontecem.`,
      silhueta: ({ pesoDaSilhueta, pesoAlvo, acima }) =>
        `A silhueta que você escolheu corresponde a cerca de ${pesoDaSilhueta} kg no seu caso, e você pediu ${pesoAlvo} kg. ` +
        (acima
          ? `Ou seja: o corpo que você quer pesa mais do que o número que você pediu — e com treino de força pesa mais ainda, porque músculo tem peso. Vale perseguir a silhueta, não a balança.`
          : `Ou seja: o número que você pediu ainda não é magro o bastante para a silhueta que você escolheu. O programa segue o peso pedido; chegando lá, a continuação é a mesma.`),
      limitado:
        "O déficit foi limitado pelo teto de segurança: nenhum bloco corta mais de 25 % do seu gasto, nem fica abaixo do seu metabolismo basal.",
      apertado:
        "Com proteína e gordura nos mínimos, sobra pouco carboidrato em algum bloco. É sinal de que o alvo calórico está apertado para o seu peso — considere um prazo mais longo.",
      diasAjustados: ({ pedidos, dias, duracao }) =>
        `Você pediu ${pedidos} dias de treino por semana e o programa montou ${dias}. ` +
        `Para o seu nível, é o número que você consegue sustentar por ${duracao} dias — e sustentar é o que faz diferença.`,
      severa:
        "A silhueta que você escolheu indica mais gordura do que o seu peso e altura sugerem. O plano foi feito sobre os números medidos, não sobre a autoimagem.",
      volumeBaixo:
        "O volume semanal está no limite de baixo para ganho de massa. Com mais um dia de treino por semana, o programa rende bem mais.",
    },
  },

  es: {
    intervalo: (inicio, fim) => `Días ${inicio} a ${fim}`,
    blocos: {
      1: {
        titulo: "Base",
        foco:
          "Descompresión glucémica, ajuste del reparto de proteína e instalación de la frecuencia de entrenamiento. En la primera semana cede la retención de líquidos y desaparecen los picos de hambre por la noche.",
        marco: "Peso en ayunas el Día 7, cintura, fotos de frente y de perfil y el 100 % de las sesiones cumplidas.",
      },
      2: {
        titulo: "Carga",
        foco:
          "Con la glucemia estable y la técnica ajustada, la señal mecánica sube. Es la semana en la que la oxidación real de grasa se acelera protegiendo la masa muscular.",
        marco: "Peso el Día 14, perímetro abdominal y progresión de carga o repeticiones respecto a la Semana 1.",
      },
      3: {
        titulo: "Definición",
        foco:
          "Intensidad más cerca del fallo y calorías recalculadas sobre el peso nuevo — blindando el metabolismo contra estancamientos y entregando el protocolo del Día 22 en adelante.",
        marco: "Peso final del Día 21, fotos comparativas (Día 1 vs. Día 21), cintura y transición a mantenimiento o al siguiente ciclo.",
      },
    },
    manutencao: {
      titulo: "Mantenimiento",
      foco:
        "Llegas al peso objetivo antes de terminar el programa, y este bloque existe para que el resultado no sea temporal: " +
        "las calorías vuelven a tu gasto total y el entrenamiento sigue igual. Aquí el cuerpo aprende a sostener el peso nuevo.",
      marco: "Peso estable durante cuatro semanas, fotos y cintura — y tu gasto de mantenimiento, ahora medido en la práctica.",
    },
    recomposicaoMarco1:
      "Fotos de frente y de perfil, cintura y las sesiones cumplidas. El peso se registra, pero no es lo que se evalúa.",
    avisos: {
      recomposicao:
        "Pediste prácticamente el mismo peso y una silueta bastante más delgada. Eso tiene nombre — recomposición corporal — " +
        "y es el pedido más común de quien ya está en su peso y no le gusta lo que ve. El plan usa un déficit pequeño, " +
        "proteína alta y entrenamiento de fuerza: la báscula se moverá poco a propósito. " +
        "Aquí tu resultado lo miden la cintura y la foto, no el peso.",
      naoCabe: ({ pedido, duracao, entregue, falta, semanasExtra, modo }) => {
        const precio =
          modo === "perder"
            ? "el precio es masa magra, y no vuelve sola"
            : "el precio es grasa, y luego toca una fase de definición para deshacer lo ganado";
        return (
          `Los ${pedido} kg que pediste no caben en ${duracao} días a un ritmo seguro. ` +
          `El programa entrega ${entregue} kg — y los ${falta} kg que faltan llevan unas ` +
          `${semanasExtra} semanas más, con el mismo método. ` +
          `Se puede ir más rápido; ${precio}.`
        );
      },
      diaDoAlvo: (dia) =>
        `Según el cálculo, llegas al peso objetivo hacia el día ${dia}. ` +
        "Los días restantes no sobran: son el bloque de mantenimiento, que es donde el resultado deja de ser temporal.",
      massaMagra: ({ pesoAlvo, precisa, porMes, meses, duracao }) =>
        `Los ${pesoAlvo} kg con la silueta que elegiste exigen unos ${precisa} kg de masa magra más de la que tienes hoy. ` +
        `El músculo natural llega a unos ${porMes} kg por mes en tu nivel, así que ese cuerpo es un proyecto de ${meses} meses, no de ${duracao} días. ` +
        `Los ${duracao} días son su primer bloque — y el bloque que decide si los demás ocurren.`,
      silhueta: ({ pesoDaSilhueta, pesoAlvo, acima }) =>
        `La silueta que elegiste corresponde a unos ${pesoDaSilhueta} kg en tu caso, y pediste ${pesoAlvo} kg. ` +
        (acima
          ? "Es decir: el cuerpo que quieres pesa más que el número que pediste — y con entrenamiento de fuerza pesa aún más, porque el músculo pesa. Vale la pena perseguir la silueta, no la báscula."
          : "Es decir: el número que pediste todavía no es lo bastante bajo para la silueta que elegiste. El programa sigue el peso pedido; al llegar, la continuación es la misma."),
      limitado:
        "El déficit quedó limitado por el techo de seguridad: ningún bloque recorta más del 25 % de tu gasto ni baja de tu metabolismo basal.",
      apertado:
        "Con proteína y grasa en sus mínimos, queda poco carbohidrato en algún bloque. Es señal de que el objetivo calórico está ajustado para tu peso — considera un plazo más largo.",
      diasAjustados: ({ pedidos, dias, duracao }) =>
        `Pediste ${pedidos} días de entrenamiento por semana y el programa armó ${dias}. ` +
        `Para tu nivel, es el número que puedes sostener durante ${duracao} días — y sostener es lo que marca la diferencia.`,
      severa:
        "La silueta que elegiste indica más grasa de la que sugieren tu peso y tu altura. El plan se hizo sobre los números medidos, no sobre la autoimagen.",
      volumeBaixo:
        "El volumen semanal está en el límite bajo para ganar masa. Con un día más de entrenamiento por semana, el programa rinde mucho más.",
    },
  },

  en: {
    intervalo: (inicio, fim) => `Days ${inicio}–${fim}`,
    blocos: {
      1: {
        titulo: "Foundation",
        foco:
          "Blood-sugar decompression, protein distribution dialed in and training frequency established. In the first week water retention eases and nighttime hunger spikes disappear.",
        marco: "Fasted weight on Day 7, waist, front and side photos and 100% of sessions completed.",
      },
      2: {
        titulo: "Load",
        foco:
          "With stable blood sugar and solid technique, the mechanical signal goes up. This is the week real fat oxidation speeds up while protecting muscle mass.",
        marco: "Weight on Day 14, waist circumference and load or rep progression over Week 1.",
      },
      3: {
        titulo: "Definition",
        foco:
          "Intensity closer to failure and calories recalculated for your new weight — shielding your metabolism against plateaus and handing you the protocol for Day 22 onward.",
        marco: "Final weight on Day 21, comparison photos (Day 1 vs. Day 21), waist and transition to maintenance or the next cycle.",
      },
    },
    manutencao: {
      titulo: "Maintenance",
      foco:
        "You reach your goal weight before the program ends, and this block exists so the result isn't temporary: " +
        "calories go back to your total expenditure and training stays the same. This is where your body learns to hold the new weight.",
      marco: "Stable weight for four weeks, photos and waist — and your maintenance calories, now measured in real life.",
    },
    recomposicaoMarco1:
      "Front and side photos, waist and sessions completed. Weight gets logged, but it's not what's being assessed.",
    avisos: {
      recomposicao:
        "You asked for practically the same weight and a much leaner physique. That has a name — body recomposition — " +
        "and it's the most common goal for people already at a normal weight who don't like what they see. The plan uses a small deficit, " +
        "high protein and strength training: the scale will barely move, on purpose. " +
        "Here your result is measured by your waist and photos, not your weight.",
      naoCabe: ({ pedido, duracao, entregue, falta, semanasExtra, modo }) => {
        const custo =
          modo === "perder"
            ? "the cost is lean mass, and it doesn't come back on its own"
            : "the cost is fat, and then you need a cut later to undo what you gained";
        return (
          `The ${pedido} kg you asked for don't fit into ${duracao} days at a safe pace. ` +
          `The program delivers ${entregue} kg — and the remaining ${falta} kg take about ` +
          `${semanasExtra} more weeks with the same method. ` +
          `You can go faster than that; ${custo}.`
        );
      },
      diaDoAlvo: (dia) =>
        `Based on the math, you reach your goal weight around day ${dia}. ` +
        "The remaining days aren't leftovers: they're the maintenance block, which is where the result stops being temporary.",
      massaMagra: ({ pesoAlvo, precisa, porMes, meses, duracao }) =>
        `${pesoAlvo} kg with the physique you chose requires about ${precisa} kg more lean mass than you have today. ` +
        `Natural muscle comes at roughly ${porMes} kg per month at your level, so that body is a ${meses}-month project, not a ${duracao}-day one. ` +
        `The ${duracao} days are its first block — and the block that decides whether the others happen.`,
      silhueta: ({ pesoDaSilhueta, pesoAlvo, acima }) =>
        `The physique you chose corresponds to about ${pesoDaSilhueta} kg in your case, and you asked for ${pesoAlvo} kg. ` +
        (acima
          ? "In other words: the body you want weighs more than the number you asked for — and with strength training it weighs even more, because muscle has weight. Chase the physique, not the scale."
          : "In other words: the number you asked for still isn't lean enough for the physique you chose. The program follows the requested weight; once you get there, the next step is the same."),
      limitado:
        "The deficit was capped by the safety ceiling: no block cuts more than 25% of your expenditure or drops below your basal metabolic rate.",
      apertado:
        "With protein and fat at their minimums, there's little carbohydrate left in some block. It means the calorie target is tight for your weight — consider a longer timeline.",
      diasAjustados: ({ pedidos, dias, duracao }) =>
        `You asked for ${pedidos} training days per week and the program built ${dias}. ` +
        `For your level, that's the number you can sustain for ${duracao} days — and sustaining is what makes the difference.`,
      severa:
        "The physique you chose suggests more body fat than your weight and height indicate. The plan was built on the measured numbers, not on self-image.",
      volumeBaixo:
        "Weekly volume is at the low end for muscle gain. With one more training day per week, the program delivers a lot more.",
    },
  },
};

/* ============================================================
   TREINO — nomes de sessões, padrões e exercícios (es/en)
   O português continua em `treino.ts`; aqui só a tradução.
   ============================================================ */

type Padrao =
  | "agachar"
  | "dobradica"
  | "empurrar-h"
  | "empurrar-v"
  | "puxar-h"
  | "puxar-v"
  | "core";

type TraducaoTreino = {
  padrao: Record<Padrao, string>;
  vagas: Record<Padrao, { academia: string; casa: string; regressaoCasa: string }>;
  /** nome PT da sessão → nome traduzido */
  sessoes: Record<string, string>;
  /** "8 a 12" → "8 a 12" / "8–12" */
  faixa: (texto: string) => string;
};

const faixaEn = (texto: string) => texto.replace(/(\d+) a (\d+)/g, "$1–$2");

export const TREINO_TRAD: Record<"es" | "en", TraducaoTreino> = {
  es: {
    padrao: {
      agachar: "Sentadilla",
      dobradica: "Bisagra de cadera",
      "empurrar-h": "Empuje horizontal",
      "empurrar-v": "Empuje vertical",
      "puxar-h": "Tirón horizontal",
      "puxar-v": "Tirón vertical",
      core: "Core",
    },
    vagas: {
      agachar: {
        academia: "Sentadilla libre o en hack",
        casa: "Sentadilla búlgara",
        regressaoCasa: "Sentadilla con peso corporal, hasta la silla",
      },
      dobradica: {
        academia: "Peso muerto rumano",
        casa: "Puente de glúteo a una pierna",
        regressaoCasa: "Puente de glúteo con las dos piernas",
      },
      "empurrar-h": {
        academia: "Press de banca con mancuernas",
        casa: "Flexiones",
        regressaoCasa: "Flexiones con las manos elevadas",
      },
      "empurrar-v": {
        academia: "Press militar sentado",
        casa: "Flexiones pike, con la cadera alta",
        regressaoCasa: "Elevaciones laterales con botella de agua",
      },
      "puxar-h": {
        academia: "Remo inclinado",
        casa: "Remo invertido bajo la mesa",
        regressaoCasa: "Remo con banda elástica",
      },
      "puxar-v": {
        academia: "Jalón al pecho o dominadas",
        casa: "Dominadas con apoyo de pie",
        regressaoCasa: "Jalón con banda elástica sujeta a la puerta",
      },
      core: {
        academia: "Plancha con peso",
        casa: "Plancha",
        regressaoCasa: "Plancha con las rodillas en el suelo",
      },
    },
    sessoes: {
      "Corpo inteiro A": "Cuerpo completo A",
      "Corpo inteiro B": "Cuerpo completo B",
      "Corpo inteiro C": "Cuerpo completo C",
      "Superior A": "Tren superior A",
      "Superior B": "Tren superior B",
      "Inferior A": "Tren inferior A",
      "Inferior B": "Tren inferior B",
      "Pontos fracos": "Puntos débiles",
      "Empurrar A": "Empuje A",
      "Empurrar B": "Empuje B",
      "Puxar A": "Tirón A",
      "Puxar B": "Tirón B",
      "Pernas A": "Piernas A",
      "Pernas B": "Piernas B",
    },
    faixa: (texto) => texto,
  },
  en: {
    padrao: {
      agachar: "Squat",
      dobradica: "Hip hinge",
      "empurrar-h": "Horizontal push",
      "empurrar-v": "Vertical push",
      "puxar-h": "Horizontal pull",
      "puxar-v": "Vertical pull",
      core: "Core",
    },
    vagas: {
      agachar: {
        academia: "Back squat or hack squat",
        casa: "Bulgarian split squat",
        regressaoCasa: "Bodyweight squat to a chair",
      },
      dobradica: {
        academia: "Romanian deadlift",
        casa: "Single-leg hip thrust",
        regressaoCasa: "Two-leg glute bridge",
      },
      "empurrar-h": {
        academia: "Dumbbell bench press",
        casa: "Push-up",
        regressaoCasa: "Incline push-up (hands elevated)",
      },
      "empurrar-v": {
        academia: "Seated overhead press",
        casa: "Pike push-up, hips high",
        regressaoCasa: "Lateral raise with water bottles",
      },
      "puxar-h": {
        academia: "Bent-over row",
        casa: "Inverted row under a table",
        regressaoCasa: "Resistance band row",
      },
      "puxar-v": {
        academia: "Lat pulldown or pull-up",
        casa: "Foot-assisted pull-up",
        regressaoCasa: "Band pulldown anchored to a door",
      },
      core: {
        academia: "Weighted plank",
        casa: "Plank",
        regressaoCasa: "Plank from the knees",
      },
    },
    sessoes: {
      "Corpo inteiro A": "Full body A",
      "Corpo inteiro B": "Full body B",
      "Corpo inteiro C": "Full body C",
      "Superior A": "Upper A",
      "Superior B": "Upper B",
      "Inferior A": "Lower A",
      "Inferior B": "Lower B",
      "Pontos fracos": "Weak points",
      "Empurrar A": "Push A",
      "Empurrar B": "Push B",
      "Puxar A": "Pull A",
      "Puxar B": "Pull B",
      "Pernas A": "Legs A",
      "Pernas B": "Legs B",
    },
    faixa: faixaEn,
  },
};

/* ============================================================
   SILHUETAS E ATIVIDADE (es/en; o PT vem de shapes.ts e calorias.ts)
   ============================================================ */

export const ROTULO_NIVEL: Record<"es" | "en", Record<string, string>> = {
  es: {
    h1: "Definido",
    h2: "Atlético",
    h3: "En forma",
    h4: "Normal",
    h5: "Ligero exceso",
    h6: "Abdomen prominente",
    h7: "Sobrepeso",
    h8: "Sobrepeso alto",
    m1: "Definida",
    m2: "Atlética",
    m3: "En forma",
    m4: "Normal",
    m5: "Ligero exceso",
    m6: "Exceso moderado",
    m7: "Sobrepeso",
    m8: "Sobrepeso alto",
  },
  en: {
    h1: "Shredded",
    h2: "Athletic",
    h3: "Fit",
    h4: "Average",
    h5: "Slightly over",
    h6: "Belly showing",
    h7: "Overweight",
    h8: "Well overweight",
    m1: "Toned",
    m2: "Athletic",
    m3: "Fit",
    m4: "Average",
    m5: "Slightly over",
    m6: "Moderately over",
    m7: "Overweight",
    m8: "Well overweight",
  },
};

/** Rótulo de uma silhueta no idioma; em PT devolve o rótulo de `shapes.ts`. */
export function rotuloNivel(nivel: { id: string; rotulo: string }, idioma: Idioma = "pt"): string {
  if (idioma === "pt") return nivel.rotulo;
  return ROTULO_NIVEL[idioma][nivel.id] ?? nivel.rotulo;
}

export const ATIVIDADE_TRAD: Record<"es" | "en", Record<string, { nome: string; nota: string }>> = {
  es: {
    sedentario: { nome: "Sedentario", nota: "Poco o ningún ejercicio" },
    leve: { nome: "Ligeramente activo", nota: "1 a 3 entrenamientos por semana" },
    moderado: { nome: "Moderadamente activo", nota: "3 a 5 entrenamientos por semana" },
    alto: { nome: "Muy activo", nota: "6 a 7 entrenamientos por semana" },
    atleta: { nome: "Extremadamente activo", nota: "Dos entrenamientos al día o trabajo físico" },
  },
  en: {
    sedentario: { nome: "Sedentary", nota: "Little or no exercise" },
    leve: { nome: "Lightly active", nota: "1 to 3 workouts per week" },
    moderado: { nome: "Moderately active", nota: "3 to 5 workouts per week" },
    alto: { nome: "Very active", nota: "6 to 7 workouts per week" },
    atleta: { nome: "Extremely active", nota: "Two workouts a day or physical job" },
  },
};
