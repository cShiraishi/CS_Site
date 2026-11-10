import type { Idioma } from "./i18n";
import { totalVideosLinhaDoTempo } from "./gestacao";

/**
 * Canal Ela — os apps do Modo Ela como trilhas de vídeos curados de canais
 * grandes do YouTube, em cada idioma com canais daquele idioma:
 *   PT · Drauzio Varella, Tua Saúde, Carol Borba, Paulo Muzy…
 *   ES · Dra. Pau Zúñiga, gymvirtual, aulaginecologia…
 *   EN · Cleveland Clinic, Chloe Ting, MadFit, Pamela Reif…
 *
 * Cada id foi conferido no oEmbed do YouTube (nov/2026): existe, é do canal
 * indicado e permite incorporação. O vídeo toca no player do próprio
 * YouTube (youtube-nocookie), com crédito ao canal — nada é rehospedado.
 */

type Txt = Record<Idioma, string>;

export type VideoEla = {
  id: string;
  titulo: string;
  canal: string;
  duracao: string;
};

export type TrilhaEla = {
  id: string;
  nome: string;
  descricao: string;
  videos: VideoEla[];
};

export type AppEla = {
  slug: "ciclo" | "treino-em-casa" | "gestacao";
  nome: Txt;
  eyebrow: Txt;
  titulo: Txt;
  descricao: Txt;
  /** Aviso de saúde no topo da página — o vídeo informa, não trata. */
  aviso: Txt;
  seo: { titulo: Txt; descricao: Txt };
  trilhas: Record<Idioma, TrilhaEla[]>;
};

const v = (id: string, titulo: string, canal: string, duracao: string): VideoEla => ({
  id,
  titulo,
  canal,
  duracao,
});

export const APPS_ELA: AppEla[] = [
  /* ───────────────────────── CICLO & TPM ───────────────────────── */
  {
    slug: "ciclo",
    nome: { pt: "Ciclo & TPM", es: "Ciclo y SPM", en: "Cycle & PMS" },
    eyebrow: {
      pt: "Modo Ela · Ciclo & TPM",
      es: "Modo Ella · Ciclo y SPM",
      en: "Her Mode · Cycle & PMS",
    },
    titulo: {
      pt: "Entenda o seu ciclo.\nTreine e coma a favor dele.",
      es: "Entiende tu ciclo.\nEntrena y come a su favor.",
      en: "Understand your cycle.\nTrain and eat with it.",
    },
    descricao: {
      pt: "As quatro fases, o que os hormônios fazem em cada semana, como lidar com TPM e cólica e o que muda no treino e no prato — com quem entende do assunto.",
      es: "Las cuatro fases, lo que hacen las hormonas cada semana, cómo manejar el SPM y los cólicos y qué cambia en el entrenamiento y en el plato — con quien sabe del tema.",
      en: "The four phases, what your hormones do each week, how to handle PMS and cramps, and what changes in training and on your plate — from people who know the subject.",
    },
    aviso: {
      pt: "Conteúdo educativo. Dor forte, sangramento fora do padrão ou sintomas que atrapalham a rotina pedem consulta com ginecologista.",
      es: "Contenido educativo. Dolor fuerte, sangrado fuera de lo habitual o síntomas que alteran tu rutina requieren consulta con ginecología.",
      en: "Educational content. Severe pain, unusual bleeding or symptoms that disrupt your routine call for a visit to a gynecologist.",
    },
    seo: {
      titulo: {
        pt: "Ciclo menstrual e TPM — vídeos para entender o seu corpo",
        es: "Ciclo menstrual y SPM — vídeos para entender tu cuerpo",
        en: "Menstrual cycle and PMS — videos to understand your body",
      },
      descricao: {
        pt: "Fases do ciclo, TPM, cólica, SOP, treino e alimentação no ciclo menstrual: trilhas de vídeos curadas de Drauzio Varella, Tua Saúde, Paulo Muzy e mais.",
        es: "Fases del ciclo, SPM, cólicos, SOP, entrenamiento y alimentación en el ciclo menstrual: vídeos seleccionados de la Dra. Pau Zúñiga, aulaginecologia y más.",
        en: "Cycle phases, PMS, cramps, PCOS, training and nutrition across the menstrual cycle: curated videos from Cleveland Clinic, Osmosis, Dr. Stacy Sims and more.",
      },
    },
    trilhas: {
      pt: [
        {
          id: "entenda",
          nome: "Entenda o seu ciclo",
          descricao: "Folicular, ovulação, lútea e menstruação — semana a semana.",
          videos: [
            v("WK8n-er_J6A", "O ciclo menstrual", "Saúde da Mulher com Dra Laura Lucia", "9:07"),
            v("8ynCll6GabY", "Ciclo menstrual para leigos", "Médico da Mulher", "11:59"),
            v("fJgvgAfVrsg", "Como os hormônios afetam o seu mês", "Dr. André Vinícius", "12:58"),
          ],
        },
        {
          id: "tpm",
          nome: "TPM e cólica",
          descricao: "O que é, por que acontece e o que realmente alivia.",
          videos: [
            v("C0jwluTlzXo", "5 coisas sobre TPM que você precisa saber", "Drauzio Varella", "5:40"),
            v("lUfKK25FTp4", "Como aliviar a cólica menstrual", "Tua Saúde", "5:53"),
            v("zhCOvEKygVw", "Cólica menstrual", "Drauzio Varella", "2:46"),
          ],
        },
        {
          id: "treino-prato",
          nome: "Treino e prato no ciclo",
          descricao: "O ciclo muda o rendimento e a fome. Dá para usar isso a seu favor.",
          videos: [
            v("e73mcH91pcU", "O ciclo menstrual afeta a musculação?", "Paulo Muzy", "10:05"),
            v("8fldI7AqCco", "Como treinar no período menstrual", "Leandro Twin", "10:17"),
            v("v-zsk1fKqUI", "Alimentação durante a menstruação", "Drauzio Varella", "1:57"),
            v("fyIVMbQXpfY", "7 alimentos que podem ajudar na TPM", "Nutricionista Patricia Leite", "10:23"),
          ],
        },
        {
          id: "sop",
          nome: "SOP — ovários policísticos",
          descricao: "Muito além do ovário: insulina, acne, peso e o que comer.",
          videos: [
            v("mJe2G33_wAk", "Ovários policísticos, açúcar no sangue e acne", "Drauzio Varella", "1:47"),
            v("WjbcVL_dNfw", "A verdade sobre a SOP", "Dr. André Vinícius", "14:24"),
            v("Y-7l0CciCBc", "SOP: o que comer para tratar", "Tua Saúde", "5:35"),
          ],
        },
      ],
      es: [
        {
          id: "entiende",
          nome: "Entiende tu ciclo",
          descricao: "Folicular, ovulación, lútea y menstruación — semana a semana.",
          videos: [
            v("vqZrvmdqwko", "Conoce tu ciclo menstrual y tus días fértiles", "Dra. Pau Zúñiga", "10:04"),
            v("oY2-MSMdBKs", "Ciclo menstrual: conceptos básicos en 3D", "Dra. Paula Mojarro", "0:53"),
            v("SLAAeQWCrTU", "Ciclo ovárico: explicación hormonal", "aulaginecologia", "9:02"),
          ],
        },
        {
          id: "spm",
          nome: "SPM y cólicos",
          descricao: "Qué es, por qué ocurre y qué alivia de verdad.",
          videos: [
            v("jrtYAgeyGd0", "Síndrome premenstrual: síntomas y qué hacer", "Dra. Pau Zúñiga", "8:02"),
            v("eWURujDE6wg", "Síndrome premenstrual: causas y tratamiento", "aulaginecologia", "9:04"),
            v("QedGmtVK0Dc", "Remedios para los cólicos menstruales", "Dr. Agustin Landivar", "8:34"),
          ],
        },
        {
          id: "entreno-plato",
          nome: "Entreno y plato en el ciclo",
          descricao: "El ciclo cambia el rendimiento y el hambre. Úsalo a tu favor.",
          videos: [
            v("_sY53CyR_WM", "Cómo entrenar y comer en cada fase", "The Saiyan Kiwi", "26:39"),
            v("Lda2fXeWjew", "Entrenamiento y ciclo menstrual", "ENFAF", "10:30"),
          ],
        },
        {
          id: "sop",
          nome: "SOP — ovario poliquístico",
          descricao: "Mucho más que el ovario: insulina, acné, peso y alimentación.",
          videos: [
            v("RFI1zc_lH_s", "Síndrome de ovario poliquístico: causas, síntomas y tratamiento", "Dra. Pau Zúñiga", "10:57"),
            v("o39CxAbFtpY", "6 señales de ovario poliquístico", "Dra. Pau Zúñiga", "2:33"),
          ],
        },
      ],
      en: [
        {
          id: "understand",
          nome: "Understand your cycle",
          descricao: "Follicular, ovulation, luteal and period — week by week.",
          videos: [
            v("JMatrteYHNw", "What happens during your menstrual cycle?", "Cleveland Clinic", "3:33"),
            v("wtxQRuEmgyM", "The 4 phases and hormones explained", "Sprouts", "3:46"),
            v("7HlHGLr1hTA", "The menstrual cycle", "Osmosis from Elsevier", "10:58"),
          ],
        },
        {
          id: "pms",
          nome: "PMS and cramps",
          descricao: "What it is, why it happens and what actually helps.",
          videos: [
            v("i5uD4i2c440", "Top 5 doctor-approved PMS cures", "Mama Doctor Jones", "14:46"),
            v("6eToeyIls94", "If you suffer from premenstrual dysphoria", "Dr. Tracey Marks", "9:47"),
          ],
        },
        {
          id: "train-eat",
          nome: "Training and food across the cycle",
          descricao: "Your cycle shifts performance and hunger. Use it.",
          videos: [
            v("I-FmJyhdQSc", "Should women train according to their cycle?", "Dr. Stacy Sims Official", "4:29"),
            v("YSJubcbzJmo", "How to exercise at each stage of your cycle", "The Diary Of A CEO Clips", "10:01"),
          ],
        },
        {
          id: "pcos",
          nome: "PCOS",
          descricao: "Far beyond the ovaries: insulin, acne, weight and food.",
          videos: [
            v("As4V7KyErZw", "What is PCOS? A fertility doctor explains", "Natalie Crawford, MD", "11:11"),
            v("D7O59psP8Lc", "PCOS: conditions, diagnosis and treatment", "JJ Medicine", "18:58"),
          ],
        },
      ],
    },
  },

  /* ──────────────────────── TREINO EM CASA ──────────────────────── */
  {
    slug: "treino-em-casa",
    nome: { pt: "Treino em casa", es: "Entreno en casa", en: "Home workouts" },
    eyebrow: {
      pt: "Modo Ela · Treino em casa",
      es: "Modo Ella · Entreno en casa",
      en: "Her Mode · Home workouts",
    },
    titulo: {
      pt: "Sem academia.\nSem equipamento. Sem desculpa.",
      es: "Sin gimnasio.\nSin material. Sin excusas.",
      en: "No gym.\nNo equipment. No excuses.",
    },
    descricao: {
      pt: "Treinos guiados para fazer na sala, do primeiro dia ao avançado: corpo todo, pernas e glúteos, abdômen e cardio. É só dar o play e acompanhar.",
      es: "Entrenamientos guiados para hacer en el salón, del primer día al avanzado: cuerpo completo, piernas y glúteos, abdomen y cardio. Dale al play y síguelo.",
      en: "Guided workouts for your living room, from day one to advanced: full body, legs and glutes, abs and cardio. Just press play and follow along.",
    },
    aviso: {
      pt: "Comece pelo nível iniciante e respeite a dor articular. Com lesão, gestação ou condição de saúde, converse antes com o seu médico.",
      es: "Empieza por el nivel principiante y respeta el dolor articular. Con lesión, embarazo o una condición de salud, consulta antes con tu médico.",
      en: "Start at beginner level and respect joint pain. With an injury, pregnancy or a health condition, talk to your doctor first.",
    },
    seo: {
      titulo: {
        pt: "Treino em casa para mulheres — sem equipamento",
        es: "Entreno en casa para mujeres — sin material",
        en: "Home workouts for women — no equipment",
      },
      descricao: {
        pt: "Treinos em casa guiados, sem equipamento: iniciante, pernas e glúteos, abdômen e cardio HIIT. Vídeos de Carol Borba, Pamela Reif e Roberta's Gym.",
        es: "Entrenamientos guiados en casa, sin material: principiante, piernas y glúteos, abdomen y cardio. Vídeos de gymvirtual (Patry Jordán).",
        en: "Guided home workouts, no equipment: beginner, legs and glutes, abs and HIIT cardio. Videos from Chloe Ting, MadFit, Pamela Reif and growwithjo.",
      },
    },
    trilhas: {
      pt: [
        {
          id: "comecar",
          nome: "Para começar",
          descricao: "Zero impacto, zero equipamento. O primeiro passo é este.",
          videos: [
            v("8UaguGuEQWg", "Treino para iniciantes em casa", "Carol Borba", "11:36"),
            v("m1QV6EAyuaw", "18 minutos em pé, sem impacto", "Carol Borba", "20:51"),
            v("YlG4lBk9JAM", "Iniciantes: corpo todo", "Carol Borba", "14:46"),
            v("UItWltVZZmE", "20 min full body — versão iniciante", "Pamela Reif", "21:55"),
          ],
        },
        {
          id: "gluteos",
          nome: "Pernas e glúteos",
          descricao: "Os treinos de bumbum mais assistidos do YouTube brasileiro.",
          videos: [
            v("HlbxXkRAXxw", "Treino completo de glúteos em casa", "Carol Borba", "19:49"),
            v("d_4Z1LMNEGM", "Aumentar pernas e bumbum em casa", "Carol Borba", "15:11"),
            v("slw2FJ_cs9I", "Treino completo sem intervalo: pernas e bumbum", "Carol Borba", "34:13"),
          ],
        },
        {
          id: "abdomen",
          nome: "Abdômen",
          descricao: "Core forte sustenta treino, postura e coluna.",
          videos: [
            v("wVBUwiTxO14", "Abdômen definido — desafio 30 dias", "Carol Borba", "11:06"),
            v("M2k4yDk3H-A", "10 minutos para a barriga", "Carol Borba", "12:47"),
            v("p1cHou8spPs", "Abdômen superior e pochete", "Carol Borba", "13:47"),
          ],
        },
        {
          id: "cardio",
          nome: "Cardio e HIIT",
          descricao: "Suar em pouco tempo, sem sair de casa.",
          videos: [
            v("Tru9n5mOEAQ", "Cardio HIIT — 21 minutos em pé", "Carol Borba", "23:57"),
            v("UBMk30rjy0o", "20 min full body — sem equipamento", "Pamela Reif", "20:20"),
            v("R0kT30RbN-k", "Cardio HIIT para queimar gordura", "Carol Borba", "13:25"),
            v("SPFz4hFgGv8", "10 minutos de corpo inteiro todas as noites", "Roberta's Gym Brasil", "10:33"),
          ],
        },
      ],
      es: [
        {
          id: "empezar",
          nome: "Para empezar",
          descricao: "Bajo impacto, sin material. El primer paso es este.",
          videos: [
            v("q9b9afJ-GnA", "Entrenamiento para principiantes: total body", "gymvirtual", "11:42"),
            v("Wt5tvvZzPpA", "10 minutos de cardio para principiantes, bajo impacto", "gymvirtual", "11:00"),
            v("39Sn10y7HMM", "Rutina de cardio ideal para principiantes", "gymvirtual", "10:28"),
          ],
        },
        {
          id: "gluteos",
          nome: "Piernas y glúteos",
          descricao: "Las rutinas de glúteos más vistas de YouTube en español.",
          videos: [
            v("yGXwjAoQciQ", "Ejercicios para aumentar glúteos — 25 minutos", "gymvirtual", "24:44"),
            v("jFQIewEEf9o", "Tonificar y levantar glúteos — 10 minutos", "gymvirtual", "10:33"),
          ],
        },
        {
          id: "abdomen",
          nome: "Abdomen",
          descricao: "Un core fuerte sostiene el entrenamiento, la postura y la espalda.",
          videos: [
            v("k_u8obkaGE4", "Rutina de abdominales — 10 minutos", "gymvirtual", "10:53"),
            v("VyTq2yCjF4o", "Rutina para abdomen bajo", "gymvirtual", "12:18"),
          ],
        },
        {
          id: "cardio",
          nome: "Cardio",
          descricao: "Sudar en poco tiempo, sin salir de casa.",
          videos: [
            v("2E79glUF7mA", "Rutina de cardio — 15 minutos", "gymvirtual", "17:02"),
            v("R3qhBB2zKzM", "Cardio sin impacto", "gymvirtual", "15:57"),
          ],
        },
      ],
      en: [
        {
          id: "start",
          nome: "Getting started",
          descricao: "No jumping, no equipment. This is step one.",
          videos: [
            v("CD6BCdFHogg", "15 min full body fat burn — no jumping", "Chloe Ting", "15:44"),
            v("UItWltVZZmE", "20 min full body — beginner version", "Pamela Reif", "21:55"),
            v("Nc_NZ3PXhE8", "Fast walking in 15 minutes at home", "growwithjo", "17:28"),
          ],
        },
        {
          id: "glutes",
          nome: "Legs and glutes",
          descricao: "The most-watched at-home booty workouts on YouTube.",
          videos: [
            v("5KYAVG7BWAU", "The best at-home booty workout — 20 min", "MadFit", "22:06"),
            v("FJA3R7n_594", "10 min leg, booty and thigh workout", "MadFit", "11:45"),
          ],
        },
        {
          id: "abs",
          nome: "Abs",
          descricao: "A strong core supports training, posture and your back.",
          videos: [v("2pLT-olgUJs", "Abs workout challenge", "Chloe Ting", "11:04")],
        },
        {
          id: "cardio",
          nome: "Cardio and HIIT",
          descricao: "Get sweaty in little time, without leaving home.",
          videos: [
            v("UBMk30rjy0o", "20 min full body — no equipment", "Pamela Reif", "20:20"),
            v("1skBf6h2ksI", "15 min full body HIIT", "Pamela Reif", "15:29"),
            v("2MoGxae-zyo", "2 weeks shred challenge", "Chloe Ting", "14:23"),
          ],
        },
      ],
    },
  },

  /* ─────────────────────────── GESTAÇÃO ─────────────────────────── */
  {
    slug: "gestacao",
    nome: { pt: "Gestação", es: "Embarazo", en: "Pregnancy" },
    eyebrow: {
      pt: "Modo Ela · Gestação",
      es: "Modo Ella · Embarazo",
      en: "Her Mode · Pregnancy",
    },
    titulo: {
      pt: "Nove meses com informação,\nnão com achismo.",
      es: "Nueve meses con información,\nno con suposiciones.",
      en: "Nine months of evidence,\nnot guesswork.",
    },
    descricao: {
      pt: "Um lugar para aprender cada estágio da gestação: as 40 semanas em nove fases, com o que acontece com o bebê e com o seu corpo, os cuidados e exames de cada momento e um vídeo para cada semana.",
      es: "Un lugar para aprender cada etapa del embarazo: las 40 semanas en nueve fases, con lo que pasa con el bebé y con tu cuerpo, los cuidados y pruebas de cada momento y un vídeo para cada semana.",
      en: "A place to learn every stage of pregnancy: all 40 weeks in nine stages, with what's happening to your baby and your body, the care and tests for each moment, and a video for every week.",
    },
    aviso: {
      pt: "Nada aqui substitui o pré-natal. Sangramento, dor forte, perda de líquido, inchaço súbito ou bebê mexendo menos: procure a maternidade.",
      es: "Nada aquí sustituye el control prenatal. Sangrado, dolor fuerte, pérdida de líquido, hinchazón repentina o menos movimientos del bebé: acude a urgencias.",
      en: "Nothing here replaces prenatal care. Bleeding, severe pain, leaking fluid, sudden swelling or reduced baby movement: go to the hospital.",
    },
    seo: {
      titulo: {
        pt: "Gestação — vídeos sobre gravidez, alimentação e treino seguro",
        es: "Embarazo — vídeos sobre gestación, alimentación y ejercicio seguro",
        en: "Pregnancy — videos on nutrition, safe exercise and recovery",
      },
      descricao: {
        pt: "Primeiro trimestre, alimentação na gravidez, diabetes gestacional, exercício seguro e diástase no pós-parto: vídeos de Drauzio Varella, Tua Saúde e Carol Borba.",
        es: "Primer trimestre, alimentación en el embarazo, ejercicio seguro y diástasis posparto: vídeos de la Dra. Pau Zúñiga, Alimmenta, Susana Ares y más.",
        en: "First trimester, pregnancy nutrition, safe prenatal exercise and postpartum diastasis: videos from Today's Parent, Natalie Crawford MD, MadFit and more.",
      },
    },
    trilhas: {
      pt: [
        {
          id: "alimentacao",
          nome: "Alimentação na gravidez",
          descricao: "Ganho de peso saudável, nutrientes-chave e diabetes gestacional.",
          videos: [
            v("XgX6A78FjeI", "Como não engordar demais na gravidez", "Tua Saúde", "5:37"),
            v("8KVJ9XrVmNc", "6 alimentos para comer na gravidez", "Tatiana Magri", "5:19"),
            v("31rs-VJu-L0", "Diabetes gestacional: o que comer", "Tua Saúde", "2:58"),
          ],
        },
        {
          id: "movimento",
          nome: "Movimento seguro",
          descricao: "Exercício na gestação é recomendado — do jeito certo.",
          videos: [
            v("eSHcjlRJTCU", "Sexo e atividade física na gravidez", "Drauzio Varella", "2:26"),
            v("3RssxPFS_io", "Exercícios para grávidas — corpo todo", "Carol Borba", "15:16"),
            v("W_bqDaj-Jfg", "Treino seguro e eficiente para grávidas", "Carol Borba", "16:41"),
            v("Rzstsi41As8", "Abdômen e assoalho pélvico na gestação", "Carol Borba", "6:57"),
          ],
        },
        {
          id: "pos-parto",
          nome: "Pós-parto e diástase",
          descricao: "Recuperar o core com calma, depois da liberação médica.",
          videos: [
            v("Ke9al-Aliyc", "5 exercícios para fechar a diástase", "Jaqueline Vaz - Fisio e Pilates", "8:38"),
            v("eOMsHn6ePkI", "4 melhores exercícios para a diástase", "Carol Borba", "15:39"),
          ],
        },
      ],
      es: [
        {
          id: "alimentacion",
          nome: "Alimentación en el embarazo",
          descricao: "Qué comer en cada trimestre, explicado por nutricionistas.",
          videos: [
            v("3Ir_8ZdyPkI", "Alimentación en el primer trimestre", "Alimmenta", "5:38"),
            v("OiiQTw4psr4", "Alimentación en el segundo trimestre", "Alimmenta", "6:10"),
          ],
        },
        {
          id: "movimiento",
          nome: "Movimiento seguro",
          descricao: "El ejercicio en el embarazo se recomienda — bien hecho.",
          videos: [
            v("QoJCMkybVzA", "Rutina embarazada: primer y segundo trimestre", "Susana Ares", "17:27"),
            v("7BCo6DsIXEw", "Rutina para embarazadas: segundo y tercer trimestre", "Caribe Azul", "14:11"),
            v("mlcc_EskZyE", "Ejercicios con pelota: movilidad de la pelvis", "Maca Girón Estudio de Movimiento", "22:25"),
          ],
        },
        {
          id: "posparto",
          nome: "Posparto y diástasis",
          descricao: "Recuperar el core con calma, tras el alta médica.",
          videos: [
            v("oOTr0zHmjQ8", "Ejercicios para reducir la diástasis abdominal", "Susana Ares", "13:16"),
            v("Szw-BCo-Cb8", "Ejercicios para corregir la diástasis", "GABY WELLNESS", "20:04"),
          ],
        },
      ],
      en: [
        {
          id: "nutrition",
          nome: "Pregnancy nutrition",
          descricao: "Healthy weight gain, key nutrients and what to eat.",
          videos: [
            v("3GTK6MLPJ9g", "Top 10 foods to eat during pregnancy", "Pregnancy and Postpartum TV", "6:13"),
            v("IWBF60kQcuk", "Nutrition tips: pregnancy and nutrition", "Loyola Medicine", "2:30"),
            v("BLBbEPGJEAY", "Pregnancy diet: 5 tips", "Whitney E. RD", "4:35"),
          ],
        },
        {
          id: "movement",
          nome: "Safe movement",
          descricao: "Exercise in pregnancy is recommended — done right.",
          videos: [
            v("rPLw0kk9los", "Pregnancy exercises safe for all trimesters", "Pregnancy and Postpartum TV", "25:47"),
            v("0mCvtuG_4Og", "20-min prenatal Pilates class", "Pregnancy and Postpartum TV", "21:09"),
            v("hXuDYMORye0", "30 min full body pregnancy workout", "MadFit", "34:17"),
          ],
        },
        {
          id: "postpartum",
          nome: "Postpartum and diastasis",
          descricao: "Rebuild your core gently, after medical clearance.",
          videos: [
            v("u4z7sBiGFA8", "10-minute abs after baby", "nourishmovelove", "14:31"),
            v("gmqjLD_hJ-c", "Diastasis recti repair exercises", "Michelle Kenway", "7:40"),
          ],
        },
      ],
    },
  },
];

export function obterAppEla(slug: string) {
  return APPS_ELA.find((a) => a.slug === slug) ?? null;
}

export function totalVideosEla(app: AppEla, idioma: Idioma) {
  const trilhas = app.trilhas[idioma].reduce((n, t) => n + t.videos.length, 0);
  // Gestação soma a linha do tempo: vídeos de cada fase + um por semana.
  return app.slug === "gestacao" ? trilhas + totalVideosLinhaDoTempo(idioma) : trilhas;
}

export { rotaEla } from "./modo";

/** Textos fixos das páginas do canal. */
export const UI_ELA: Record<
  Idioma,
  {
    hubEyebrow: string;
    hubTitulo: string;
    hubTexto: string;
    videos: string;
    assistir: string;
    fechar: string;
    creditos: string;
    voltarHub: string;
    outrosApps: string;
    ctaTitulo: string;
    ctaTexto: string;
    ctaBotao: string;
    hubSeoTitulo: string;
    hubSeoDescricao: string;
  }
> = {
  pt: {
    hubEyebrow: "Modo Ela · Canal",
    hubTitulo: "Um canal de\nautoconhecimento.",
    hubTexto:
      "Ciclo, TPM, treino em casa e gestação — os melhores vídeos de médicos, nutricionistas e treinadoras do YouTube, organizados em trilhas.",
    videos: "vídeos",
    assistir: "Assistir",
    fechar: "Fechar",
    creditos:
      "Vídeos dos próprios canais no YouTube, incorporados com crédito. Todo o mérito é de quem os criou.",
    voltarHub: "Canal Ela",
    outrosApps: "Continue no Canal Ela",
    ctaTitulo: "Vídeo inspira. Plano individual transforma.",
    ctaTexto: "Treino e dieta montados para o seu corpo, a sua rotina e o seu momento.",
    ctaBotao: "Começar consultoria",
    hubSeoTitulo: "Canal Ela — autoconhecimento da mulher",
    hubSeoDescricao:
      "Ciclo menstrual, TPM, treino em casa e gestação: trilhas de vídeos curados de canais grandes do YouTube, organizadas por Carlos Seiti.",
  },
  es: {
    hubEyebrow: "Modo Ella · Canal",
    hubTitulo: "Un canal de\nautoconocimiento.",
    hubTexto:
      "Ciclo, SPM, entreno en casa y embarazo — los mejores vídeos de médicas, nutricionistas y entrenadoras de YouTube, organizados en rutas.",
    videos: "vídeos",
    assistir: "Ver",
    fechar: "Cerrar",
    creditos:
      "Vídeos de los propios canales de YouTube, insertados con crédito. Todo el mérito es de quienes los crearon.",
    voltarHub: "Canal Ella",
    outrosApps: "Sigue en el Canal Ella",
    ctaTitulo: "El vídeo inspira. El plan individual transforma.",
    ctaTexto: "Entreno y dieta hechos para tu cuerpo, tu rutina y tu momento.",
    ctaBotao: "Empezar asesoría",
    hubSeoTitulo: "Canal Ella — autoconocimiento de la mujer",
    hubSeoDescricao:
      "Ciclo menstrual, SPM, entreno en casa y embarazo: rutas de vídeos seleccionados de grandes canales de YouTube, organizadas por Carlos Seiti.",
  },
  en: {
    hubEyebrow: "Her Mode · Channel",
    hubTitulo: "A channel for\nknowing your body.",
    hubTexto:
      "Cycle, PMS, home workouts and pregnancy — the best videos from doctors, dietitians and trainers on YouTube, organized into tracks.",
    videos: "videos",
    assistir: "Watch",
    fechar: "Close",
    creditos:
      "Videos from their own YouTube channels, embedded with credit. All merit goes to their creators.",
    voltarHub: "Her Channel",
    outrosApps: "Keep exploring",
    ctaTitulo: "Videos inspire. An individual plan transforms.",
    ctaTexto: "Training and nutrition built for your body, your routine and your season of life.",
    ctaBotao: "Start coaching",
    hubSeoTitulo: "Her Channel — women's health, explained",
    hubSeoDescricao:
      "Menstrual cycle, PMS, home workouts and pregnancy: tracks of curated videos from major YouTube channels, organized by Carlos Seiti.",
  },
};
