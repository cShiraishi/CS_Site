import type { VideoEla } from "./canal-ela";
import type { Idioma } from "./i18n";

/**
 * Gestação semana a semana — a espinha do app Gestação do Canal Ela.
 *
 * Nove fases (os meses), cada uma com: o que acontece com o bebê, com o
 * corpo da mãe, os cuidados e exames da fase, vídeos de contexto do mês e
 * um vídeo para CADA semana, numa série semanal de canal grande:
 *   PT · Almanaque dos Pais ("Nª semana de gestação")
 *   ES · El Embarazo Semana a semana ("Semana N de embarazo")
 *   EN · Today's Parent ("Your pregnancy: N weeks")
 * Ids conferidos no oEmbed do YouTube (nov/2026): existem, são do canal
 * indicado e permitem incorporação.
 *
 * Os textos são gerais e conservadores; o calendário exato de exames
 * varia por país e é sempre o do obstetra.
 */

type Txt = Record<Idioma, string>;
type Lista = Record<Idioma, string[]>;

export type FaseGestacao = {
  mes: number;
  de: number;
  ate: number;
  titulo: Txt;
  bebe: Txt;
  mae: Txt;
  cuidados: Lista;
  videos: Record<Idioma, VideoEla[]>;
};

const v = (id: string, titulo: string, canal: string, duracao: string): VideoEla => ({
  id,
  titulo,
  canal,
  duracao,
});

/* ───────────── Série semanal: um vídeo por semana, por idioma ───────────── */

type Semanal = [id: string, duracao: string];

const SEMANAL_PT: Record<number, Semanal> = {
  1: ["UAdQMCTd510", "3:18"], 2: ["a9tY_PhlVHk", "4:17"], 3: ["jqIVfiM8NxM", "12:03"],
  4: ["fiVpHw7iF3I", "12:09"], 5: ["A3uRSTRuR3Q", "14:57"], 6: ["FtMc9Aw9Lnc", "17:06"],
  7: ["0t-tCfyvVtU", "14:19"], 8: ["5maVYZE4fNw", "16:16"], 9: ["IFJ8ATQT8tc", "16:23"],
  10: ["ABD7vnGixIo", "17:07"], 11: ["7Zp4Q9v-EJ0", "14:28"], 12: ["XG_T_PETY2Q", "14:56"],
  13: ["BbNE65pQN7s", "15:52"], 14: ["i0MESNA1PcU", "10:46"], 15: ["O61GOv_9cVw", "13:39"],
  16: ["e2eSNldNHog", "20:35"], 17: ["apUUivyP0UE", "14:19"], 18: ["yIlA61phyzo", "17:20"],
  19: ["vPdxmrYUOcY", "15:18"], 20: ["Ap0hNLAeJA8", "19:35"], 21: ["q8MIosDPlwM", "15:01"],
  22: ["8aAVDUg3c3Y", "16:00"], 23: ["CJAqkkktic8", "14:55"], 24: ["J7qACmW0CEI", "14:37"],
  25: ["3KG_RidFI0Y", "19:05"], 26: ["2AhzBQS1o7I", "18:47"], 27: ["Ffm9D0V5Mk0", "20:03"],
  28: ["Cz5nVsU2bO0", "20:28"], 29: ["Fl2BePy4_Ag", "23:27"], 30: ["MqTko_TGo2Y", "17:53"],
  31: ["OGP8kKLELj4", "18:32"], 32: ["IhEvSbS2dW8", "18:00"], 33: ["177m2WwifTw", "14:21"],
  34: ["ISaHokeJi2Y", "19:07"], 35: ["Kz4x7gORPWk", "19:42"], 36: ["F0WUO84t2uc", "16:40"],
  37: ["01w6mV3DMQ8", "17:59"], 38: ["swU_qP1wfPM", "14:59"], 39: ["7JyhVYTbffk", "10:05"],
  40: ["1EsZbTf7rJc", "6:31"],
};

/* O canal em espanhol junta as semanas 2 a 4 num vídeo só. */
const SEMANAL_ES: Record<number, Semanal> = {
  1: ["twh_oLMftyQ", "1:49"], 2: ["XhCdA_ulgrc", "1:42"], 3: ["XhCdA_ulgrc", "1:42"],
  4: ["XhCdA_ulgrc", "1:42"], 5: ["TytIDp0IwpU", "1:25"], 6: ["FAZL342ZRkg", "1:08"],
  7: ["Xfhe-wDJmJU", "1:41"], 8: ["AAMwNUEPd2w", "2:14"], 9: ["caaAfdmyj9A", "1:56"],
  10: ["Ym0xl2i7MCQ", "1:17"], 11: ["GfP_kG2vMWQ", "2:05"], 12: ["mdRv1WWVEAk", "1:47"],
  13: ["Oehh-bdZdpM", "1:17"], 14: ["0d3_ODddEOY", "1:22"], 15: ["_evhRIxj4Mo", "1:43"],
  16: ["LZDIJZG6nvw", "1:52"], 17: ["O6LwTOGnTho", "1:18"], 18: ["LxLmFWWyy2Q", "1:53"],
  19: ["wXINc0yN_zM", "1:21"], 20: ["kQNRsS7xDAI", "1:24"], 21: ["Msi0gL0uLjc", "1:43"],
  22: ["2RpAgBa2SGg", "1:41"], 23: ["P2wgyU0tyEU", "1:53"], 24: ["t0UBJ9QOApI", "1:49"],
  25: ["MA7z4xITaGE", "1:25"], 26: ["ulBk8KcLjPY", "1:46"], 27: ["5BqOsSbpW0k", "1:21"],
  28: ["RuL7yrh-hog", "1:20"], 29: ["CbBMCIuCOwU", "1:14"], 30: ["36PWVtyPde0", "1:41"],
  31: ["OdMnIk3wD8w", "1:36"], 32: ["o-pa8AscXHw", "1:29"], 33: ["msbDV6W3slM", "1:35"],
  34: ["rt0AgQo4dlY", "1:35"], 35: ["esTPVdg54Ts", "1:54"], 36: ["qZR_JTh5ifs", "1:32"],
  37: ["YriNGYj2k34", "1:20"], 38: ["QN7mK_gkR7E", "1:30"], 39: ["rchgHtV_GEU", "1:45"],
  40: ["Q2oTlKchdgw", "1:54"],
};

/* O Today's Parent junta as semanas 1 a 4 num vídeo só. */
const SEMANAL_EN: Record<number, Semanal> = {
  1: ["e4UPKPv7v38", "1:53"], 2: ["e4UPKPv7v38", "1:53"], 3: ["e4UPKPv7v38", "1:53"],
  4: ["e4UPKPv7v38", "1:53"], 5: ["_Ux1wPgEpJo", "1:35"], 6: ["jgnciIgOFmg", "1:47"],
  7: ["GiRnUn0ApKE", "2:42"], 8: ["gAkxR_Ept1k", "2:30"], 9: ["yRoHw6rnntc", "2:02"],
  10: ["ciG1YICJrDA", "2:09"], 11: ["vtg1w7TUJ3w", "3:01"], 12: ["_QB0qkJ4zRk", "2:18"],
  13: ["B9xiKEWc9SM", "3:03"], 14: ["hmWtKtbIolE", "2:50"], 15: ["shyWWLkA61I", "2:54"],
  16: ["HTIV2AdFTnc", "2:17"], 17: ["tycuzmo-s34", "2:09"], 18: ["wM7I0krDPTg", "2:09"],
  19: ["L-9NcufiDOo", "2:57"], 20: ["MLZ0lbkKbgM", "2:09"], 21: ["umgAThOkJgw", "2:13"],
  22: ["QctcxLDsWB0", "3:05"], 23: ["OmivW51zGvs", "2:54"], 24: ["VYYgOi9AkHU", "2:49"],
  25: ["orLWetHISck", "2:47"], 26: ["k71_-M5q_H0", "2:33"], 27: ["14kbze3sSaY", "2:25"],
  28: ["OzY_2-0NvVM", "3:10"], 29: ["GkcPIcxGy9g", "2:46"], 30: ["AyEm6K295iE", "2:14"],
  31: ["_pE5PqZgleI", "2:37"], 32: ["nFnlovPk1ro", "2:38"], 33: ["wITeiIVieao", "2:29"],
  34: ["9HzZeSX6b2o", "3:09"], 35: ["OtG-M8pHODY", "2:21"], 36: ["eFWuydRmFQg", "2:34"],
  37: ["_oB6wbpWCSo", "2:45"], 38: ["c701W2pzuyo", "2:21"], 39: ["ww8s7PQWWuY", "2:50"],
  40: ["yO6GYS3PnFY", "2:05"],
};

const SERIE: Record<Idioma, { tabela: Record<number, Semanal>; canal: string; titulo: (n: number) => string }> = {
  pt: { tabela: SEMANAL_PT, canal: "Almanaque dos Pais", titulo: (n) => `${n}ª semana de gestação` },
  es: { tabela: SEMANAL_ES, canal: "El Embarazo Semana a semana", titulo: (n) => `Semana ${n} de embarazo` },
  en: { tabela: SEMANAL_EN, canal: "Today's Parent", titulo: (n) => `Your pregnancy: week ${n}` },
};

/** O vídeo da semana `n` (1–40) no idioma pedido. */
export function videoDaSemana(idioma: Idioma, n: number): VideoEla {
  const s = SERIE[idioma];
  const [id, duracao] = s.tabela[n];
  return v(id, s.titulo(n), s.canal, duracao);
}

export function trimestreDa(semana: number) {
  return semana <= 13 ? 1 : semana <= 27 ? 2 : 3;
}

/* ─────────────────────────── As nove fases ─────────────────────────── */

export const FASES: FaseGestacao[] = [
  {
    mes: 1,
    de: 1,
    ate: 4,
    titulo: { pt: "Começo de tudo", es: "El comienzo", en: "Where it begins" },
    bebe: {
      pt: "A contagem começa no primeiro dia da última menstruação (DUM). A fecundação acontece por volta da semana 2 e o embrião se implanta no útero entre as semanas 3 e 4.",
      es: "La cuenta empieza el primer día de la última regla (FUR). La fecundación ocurre hacia la semana 2 y el embrión se implanta en el útero entre las semanas 3 y 4.",
      en: "The count starts on the first day of your last period (LMP). Conception happens around week 2, and the embryo implants in the uterus between weeks 3 and 4.",
    },
    mae: {
      pt: "Quase nada muda por fora. Perto da semana 4 vem o atraso menstrual, e o teste de farmácia costuma dar positivo.",
      es: "Por fuera casi nada cambia. Cerca de la semana 4 llega el retraso y el test de farmacia suele dar positivo.",
      en: "Almost nothing shows yet. Around week 4 your period is late and a home test usually turns positive.",
    },
    cuidados: {
      pt: ["Ácido fólico diário (o ideal é começar antes de engravidar)", "Marcar a primeira consulta de pré-natal", "Zero álcool e cigarro", "Revisar com o médico qualquer remédio em uso"],
      es: ["Ácido fólico diario (lo ideal es empezar antes del embarazo)", "Pedir la primera consulta prenatal", "Cero alcohol y tabaco", "Revisar con tu médico cualquier medicamento"],
      en: ["Daily folic acid (ideally started before pregnancy)", "Book your first prenatal appointment", "No alcohol, no smoking", "Review any medication with your doctor"],
    },
    videos: {
      pt: [v("TnCjzfocdf8", "Primeiro mês de gravidez, semana a semana", "Médico da Mulher", "12:25"), v("US4QH-781Kc", "Tudo sobre o primeiro mês de gravidez", "Dra Jannuzzi", "7:54")],
      es: [v("U7R10e_A5Ac", "10 primeros síntomas de embarazo", "Dra. Pau Zúñiga", "8:59"), v("8VJNWHjnG2c", "¿Cuándo hacerte una prueba de embarazo?", "Dra. Pau Zúñiga", "5:13")],
      en: [v("cfn04QUO4B8", "What to expect in your first trimester", "Today's Parent", "19:08")],
    },
  },
  {
    mes: 2,
    de: 5,
    ate: 8,
    titulo: { pt: "O coração começa a bater", es: "Empieza a latir el corazón", en: "A heartbeat appears" },
    bebe: {
      pt: "Fase de formação dos órgãos. O coração começa a bater por volta da semana 6 e o tubo neural, que dá origem ao cérebro e à medula, se fecha.",
      es: "Fase de formación de los órganos. El corazón empieza a latir hacia la semana 6 y se cierra el tubo neural, origen del cerebro y la médula.",
      en: "Organs are forming. The heart starts beating around week 6 and the neural tube — future brain and spinal cord — closes.",
    },
    mae: {
      pt: "Enjoo, sono, seios sensíveis e vontade frequente de urinar são os sinais mais comuns.",
      es: "Náuseas, sueño, pechos sensibles y ganas frecuentes de orinar son lo más habitual.",
      en: "Nausea, tiredness, tender breasts and frequent urination are the most common signs.",
    },
    cuidados: {
      pt: ["Primeira consulta e exames de sangue e urina", "Ultrassom inicial para confirmar a idade gestacional", "Enjoo que impede de comer ou beber: procure atendimento"],
      es: ["Primera consulta y análisis de sangre y orina", "Ecografía inicial para confirmar la edad gestacional", "Náuseas que impiden comer o beber: consulta"],
      en: ["First visit with blood and urine tests", "Early ultrasound to date the pregnancy", "Vomiting that stops you eating or drinking: get seen"],
    },
    videos: {
      pt: [v("S_Hl16ZpHFs", "2 meses de gravidez — semanas 5 a 8", "Médico da Mulher", "11:41")],
      es: [v("sDMdDndasos", "¿Sangrado de implantación o menstruación?", "Dra. Pau Zúñiga", "5:01")],
      en: [v("x2sFwxX1Bzk", "How to survive the first trimester", "Natalie Crawford, MD", "12:06")],
    },
  },
  {
    mes: 3,
    de: 9,
    ate: 12,
    titulo: { pt: "De embrião a feto", es: "De embrión a feto", en: "From embryo to fetus" },
    bebe: {
      pt: "Por volta da semana 10 o embrião passa a se chamar feto. Na semana 12 os órgãos principais já estão formados e ele mede cerca de 5 a 6 cm.",
      es: "Hacia la semana 10 el embrión pasa a llamarse feto. En la semana 12 los órganos principales ya están formados y mide unos 5–6 cm.",
      en: "Around week 10 the embryo becomes a fetus. By week 12 the main organs are formed and it measures about 5–6 cm.",
    },
    mae: {
      pt: "O enjoo costuma aliviar no fim do trimestre. A barriga ainda quase não aparece.",
      es: "Las náuseas suelen aliviar al final del trimestre. La barriga aún casi no se nota.",
      en: "Nausea usually eases toward the end of the trimester. The bump is barely visible yet.",
    },
    cuidados: {
      pt: ["Ultrassom do 1º trimestre (translucência nucal) entre 11 e 14 semanas", "Rastreios do 1º trimestre conforme o seu obstetra"],
      es: ["Ecografía del 1.er trimestre (translucencia nucal) entre las semanas 11 y 14", "Cribados del 1.er trimestre según tu ginecóloga"],
      en: ["First-trimester scan (nuchal translucency) between weeks 11 and 14", "First-trimester screening as your provider advises"],
    },
    videos: {
      pt: [v("MLMrQY5c2Dg", "3 meses de gravidez — semanas 9 a 12", "Médico da Mulher", "11:32"), v("XXYRDn9D9fI", "Cuidados nos três primeiros meses", "Médico da Mulher", "8:55")],
      es: [v("wOb91woR0X8", "Primer trimestre — guía de embarazo", "Dra. Paula Mojarro", "5:37")],
      en: [v("Jr4nt6XM3gA", "Ob-Gyn answers first-trimester questions", "UT Dell Medicine", "5:22")],
    },
  },
  {
    mes: 4,
    de: 13,
    ate: 16,
    titulo: { pt: "Entrada no 2º trimestre", es: "Entrada al 2.º trimestre", en: "Into the second trimester" },
    bebe: {
      pt: "O esqueleto começa a endurecer e o bebê já se mexe bastante, embora a mãe ainda não sinta. O 2º trimestre começa na semana 14.",
      es: "El esqueleto empieza a endurecerse y el bebé ya se mueve mucho, aunque la madre aún no lo note. El 2.º trimestre empieza en la semana 14.",
      en: "The skeleton starts to harden and the baby moves a lot, though you can't feel it yet. The second trimester starts at week 14.",
    },
    mae: {
      pt: "Costuma ser a fase de mais energia. A barriga começa a aparecer.",
      es: "Suele ser la etapa con más energía. La barriga empieza a notarse.",
      en: "Often the most energetic phase. The bump starts to show.",
    },
    cuidados: {
      pt: ["Manter atividade física regular (com liberação médica)", "Acompanhar o ganho de peso nas consultas"],
      es: ["Mantener actividad física regular (con el visto bueno médico)", "Vigilar el aumento de peso en las consultas"],
      en: ["Keep up regular exercise (with medical clearance)", "Track weight gain at your visits"],
    },
    videos: {
      pt: [v("bc-dRh5_ZnI", "4 meses de gravidez — semanas 13 a 16", "Médico da Mulher", "11:23"), v("btZgESWhRIw", "Cuidados no segundo trimestre", "Médico da Mulher", "13:33")],
      es: [v("r7mB7DZ-8dw", "Segundo trimestre — guía de embarazo", "Dra. Paula Mojarro", "5:42")],
      en: [v("IPj4dJnP85o", "What to expect in your second trimester", "Today's Parent", "38:15")],
    },
  },
  {
    mes: 5,
    de: 17,
    ate: 21,
    titulo: { pt: "Sentir o bebê mexer", es: "Sentir al bebé moverse", en: "Feeling the first kicks" },
    bebe: {
      pt: "O bebê já ouve sons de fora, inclusive a sua voz. Os primeiros movimentos costumam ser sentidos entre as semanas 18 e 22 (antes, em quem já teve filhos).",
      es: "El bebé ya oye sonidos de fuera, incluida tu voz. Los primeros movimientos suelen notarse entre las semanas 18 y 22 (antes si ya tuviste hijos).",
      en: "The baby can hear outside sounds, including your voice. First movements are usually felt between weeks 18 and 22 (earlier if you've given birth before).",
    },
    mae: {
      pt: "Barriga mais evidente e, para muitas, os primeiros \"chutinhos\".",
      es: "Barriga más evidente y, para muchas, las primeras \"pataditas\".",
      en: "A clearer bump and, for many, the first flutters.",
    },
    cuidados: {
      pt: ["Ultrassom morfológico do 2º trimestre, por volta de 20 a 24 semanas"],
      es: ["Ecografía morfológica del 2.º trimestre, hacia las semanas 20–24"],
      en: ["Mid-pregnancy anatomy scan, around weeks 20–24"],
    },
    videos: {
      pt: [v("P2cYN0enhV4", "5 meses de gravidez — semanas 17 a 21", "Médico da Mulher", "9:11")],
      es: [v("Yr_2b8VL2iI", "Segundo trimestre: consejos y estudios", "Creafam Clínicas", "11:56")],
      en: [],
    },
  },
  {
    mes: 6,
    de: 22,
    ate: 27,
    titulo: { pt: "Crescer e ganhar peso", es: "Crecer y ganar peso", en: "Growing and gaining" },
    bebe: {
      pt: "O bebê ganha peso, os pulmões seguem se desenvolvendo e os olhos se abrem por volta das semanas 26 a 28.",
      es: "El bebé gana peso, los pulmones siguen desarrollándose y abre los ojos hacia las semanas 26–28.",
      en: "The baby gains weight, the lungs keep developing and the eyes open around weeks 26–28.",
    },
    mae: {
      pt: "Dor lombar, câimbras e inchaço leve nos pés são comuns.",
      es: "Dolor lumbar, calambres e hinchazón leve de pies son habituales.",
      en: "Low back pain, leg cramps and mild foot swelling are common.",
    },
    cuidados: {
      pt: ["Teste de glicose (curva glicêmica) entre 24 e 28 semanas", "Vacina dTpa conforme o calendário do seu país (no Brasil, a partir de 20 semanas)"],
      es: ["Prueba de glucosa (curva de O'Sullivan/sobrecarga) entre las semanas 24 y 28", "Vacuna dTpa según el calendario de tu país"],
      en: ["Glucose screening between weeks 24 and 28", "Tdap vaccine per your country's schedule"],
    },
    videos: {
      pt: [v("xztOqCpDc60", "6 meses de gravidez — semanas 23 a 27", "Médico da Mulher", "10:03"), v("31rs-VJu-L0", "Diabetes gestacional: o que comer", "Tua Saúde", "2:58")],
      es: [],
      en: [],
    },
  },
  {
    mes: 7,
    de: 28,
    ate: 31,
    titulo: { pt: "Começa o 3º trimestre", es: "Empieza el 3.er trimestre", en: "The third trimester begins" },
    bebe: {
      pt: "O cérebro se desenvolve rápido e o bebê acumula gordura. Os movimentos ficam mais fortes e com um padrão próprio.",
      es: "El cerebro se desarrolla rápido y el bebé acumula grasa. Los movimientos son más fuertes y con un patrón propio.",
      en: "The brain develops fast and the baby lays down fat. Movements get stronger, with their own pattern.",
    },
    mae: {
      pt: "Falta de ar, azia e inchaço aparecem com mais frequência.",
      es: "Falta de aire, acidez e hinchazón aparecen con más frecuencia.",
      en: "Shortness of breath, heartburn and swelling become more frequent.",
    },
    cuidados: {
      pt: ["Consultas mais frequentes e controle da pressão", "Dor de cabeça forte, visão turva ou inchaço súbito: maternidade (risco de pré-eclâmpsia)", "Conhecer o padrão de movimentos do bebê", "Gestante Rh negativo: imunoglobulina conforme orientação"],
      es: ["Consultas más frecuentes y control de la tensión", "Dolor de cabeza fuerte, visión borrosa o hinchazón repentina: urgencias (riesgo de preeclampsia)", "Conocer el patrón de movimientos del bebé", "Si eres Rh negativo: inmunoglobulina según indicación"],
      en: ["More frequent visits and blood-pressure checks", "Severe headache, blurred vision or sudden swelling: go in (preeclampsia risk)", "Learn your baby's movement pattern", "Rh-negative: anti-D as your provider advises"],
    },
    videos: {
      pt: [v("gelS2XLo1oA", "7 meses de gravidez — pré-eclâmpsia e 3º trimestre", "Médico da Mulher", "16:44"), v("dbNYAkf0eC4", "7 sinais de perigo na gravidez", "Médico da Mulher", "12:42")],
      es: [v("3f3Y8kl0WJE", "Tercer trimestre — guía de embarazo", "Dra. Paula Mojarro", "3:12")],
      en: [v("lpDW00nQhUo", "What to expect in your third trimester", "Today's Parent", "37:28")],
    },
  },
  {
    mes: 8,
    de: 32,
    ate: 35,
    titulo: { pt: "Preparar a chegada", es: "Preparar la llegada", en: "Getting ready" },
    bebe: {
      pt: "A maioria dos bebês já fica de cabeça para baixo. Os pulmões seguem amadurecendo.",
      es: "La mayoría de los bebés ya se colocan cabeza abajo. Los pulmones siguen madurando.",
      en: "Most babies settle head-down. The lungs keep maturing.",
    },
    mae: {
      pt: "Contrações de treinamento (Braxton Hicks), sono mais difícil e cansaço.",
      es: "Contracciones de entrenamiento (Braxton Hicks), sueño más difícil y cansancio.",
      en: "Practice contractions (Braxton Hicks), harder sleep and fatigue.",
    },
    cuidados: {
      pt: ["Plano de parto e mala da maternidade", "Exame de estreptococo do grupo B entre 35 e 37 semanas"],
      es: ["Plan de parto y bolsa del hospital", "Cultivo de estreptococo del grupo B entre las semanas 35 y 37"],
      en: ["Birth plan and hospital bag", "Group B strep test between weeks 35 and 37"],
    },
    videos: {
      pt: [v("8M_aJG7ZFDE", "8 meses de gravidez — contrações e sinais de alerta", "Médico da Mulher", "22:10")],
      es: [],
      en: [],
    },
  },
  {
    mes: 9,
    de: 36,
    ate: 40,
    titulo: { pt: "Reta final e parto", es: "Recta final y parto", en: "The final stretch" },
    bebe: {
      pt: "A partir de 37 semanas o bebê é considerado a termo. A data provável do parto é 40 semanas após a DUM.",
      es: "Desde la semana 37 el bebé se considera a término. La fecha probable de parto es 40 semanas tras la FUR.",
      en: "From 37 weeks the baby is considered full term. The due date is 40 weeks after your LMP.",
    },
    mae: {
      pt: "Pródromos, perda do tampão mucoso e a barriga \"descendo\".",
      es: "Pródromos, expulsión del tapón mucoso y la barriga \"bajando\".",
      en: "Early labor signs, losing the mucus plug and the baby \"dropping\".",
    },
    cuidados: {
      pt: ["Contrações regulares, bolsa rota ou sangramento: maternidade", "Bebê mexendo menos que o normal: avaliação no mesmo dia"],
      es: ["Contracciones regulares, rotura de bolsa o sangrado: hospital", "Bebé moviéndose menos de lo normal: valoración el mismo día"],
      en: ["Regular contractions, waters breaking or bleeding: go to hospital", "Baby moving less than usual: get checked the same day"],
    },
    videos: {
      pt: [v("dQZREdy-fh0", "9 meses de gravidez — sinais de trabalho de parto", "Médico da Mulher", "17:56")],
      es: [v("-dAMx4PaJAQ", "¿Cómo saber si estoy de parto?", "Embarazo & Bebés", "4:22"), v("LrBC2DVXVlg", "¿Estoy de parto? Síntomas y falsas alarmas", "Creafam Clínicas", "12:18")],
      en: [v("sTbJJ4Ci7iE", "Signs of labor — when to go to the hospital", "Diana In The Pink", "10:19")],
    },
  },
];

/** Vídeos distintos da linha do tempo (as fases + a série semanal). */
export function totalVideosLinhaDoTempo(idioma: Idioma) {
  const ids = new Set<string>();
  for (const f of FASES) for (const x of f.videos[idioma]) ids.add(x.id);
  for (let n = 1; n <= 40; n++) ids.add(SERIE[idioma].tabela[n][0]);
  return ids.size;
}

export function faseDaSemana(semana: number) {
  return FASES.find((f) => semana >= f.de && semana <= f.ate) ?? FASES[0];
}

/** Textos fixos da linha do tempo. */
export const UI_GESTACAO: Record<
  Idioma,
  {
    titulo: string;
    texto: string;
    perguntaSemana: string;
    ouDum: string;
    dum: string;
    voceEsta: (s: number, m: number, t: number) => string;
    limpar: string;
    privacidade: string;
    mes: (m: number) => string;
    semanas: (a: number, b: number) => string;
    trimestre: (t: number) => string;
    semana: (n: number) => string;
    bebe: string;
    mae: string;
    cuidados: string;
    videosDoMes: string;
    videoDaSemana: string;
    aquiVoce: string;
    alemDasSemanas: string;
  }
> = {
  pt: {
    titulo: "Sua gestação, semana a semana",
    texto: "Nove fases, quarenta semanas. Em cada uma: o que acontece com o bebê, com o seu corpo, os cuidados do momento e um vídeo para cada semana.",
    perguntaSemana: "Em que semana você está?",
    ouDum: "ou",
    dum: "Data da última menstruação",
    voceEsta: (s, m, t) => `Você está na semana ${s} · ${m}º mês · ${t}º trimestre`,
    limpar: "Limpar",
    privacidade: "Fica só neste aparelho. Nada é enviado.",
    mes: (m) => `Mês ${m}`,
    semanas: (a, b) => `Semanas ${a}–${b}`,
    trimestre: (t) => `${t}º trimestre`,
    semana: (n) => `Semana ${n}`,
    bebe: "O bebê",
    mae: "Seu corpo",
    cuidados: "Cuidados da fase",
    videosDoMes: "Para entender a fase",
    videoDaSemana: "Um vídeo por semana",
    aquiVoce: "Você está aqui",
    alemDasSemanas: "Ao longo da gestação",
  },
  es: {
    titulo: "Tu embarazo, semana a semana",
    texto: "Nueve etapas, cuarenta semanas. En cada una: qué pasa con el bebé, con tu cuerpo, los cuidados del momento y un vídeo para cada semana.",
    perguntaSemana: "¿En qué semana estás?",
    ouDum: "o",
    dum: "Fecha de tu última regla",
    voceEsta: (s, m, t) =>
      `Estás en la semana ${s} · mes ${m} · ${t === 2 ? "2.º" : t === 1 ? "1.er" : "3.er"} trimestre`,
    limpar: "Borrar",
    privacidade: "Se queda solo en este dispositivo. No se envía nada.",
    mes: (m) => `Mes ${m}`,
    semanas: (a, b) => `Semanas ${a}–${b}`,
    trimestre: (t) => (t === 1 ? "1.er trimestre" : t === 2 ? "2.º trimestre" : "3.er trimestre"),
    semana: (n) => `Semana ${n}`,
    bebe: "El bebé",
    mae: "Tu cuerpo",
    cuidados: "Cuidados de la etapa",
    videosDoMes: "Para entender la etapa",
    videoDaSemana: "Un vídeo por semana",
    aquiVoce: "Estás aquí",
    alemDasSemanas: "Durante todo el embarazo",
  },
  en: {
    titulo: "Your pregnancy, week by week",
    texto: "Nine stages, forty weeks. In each: what's happening with your baby and your body, what to take care of now, and a video for every week.",
    perguntaSemana: "How many weeks are you?",
    ouDum: "or",
    dum: "First day of your last period",
    voceEsta: (s, m, t) => `You're at week ${s} · month ${m} · trimester ${t}`,
    limpar: "Clear",
    privacidade: "Stays on this device only. Nothing is sent.",
    mes: (m) => `Month ${m}`,
    semanas: (a, b) => `Weeks ${a}–${b}`,
    trimestre: (t) => `Trimester ${t}`,
    semana: (n) => `Week ${n}`,
    bebe: "Your baby",
    mae: "Your body",
    cuidados: "To take care of",
    videosDoMes: "Understand this stage",
    videoDaSemana: "One video per week",
    aquiVoce: "You are here",
    alemDasSemanas: "Throughout pregnancy",
  },
};
