/**
 * Receitas Fit — conteúdo das receitas em espanhol e inglês.
 *
 * A fonte (e o português) continua em `src/lib/receitas.ts`. Aqui só ficam
 * os textos traduzidos, indexados pelo `id` da receita; números (macros,
 * views, videoId) vêm sempre da fonte. Ingredientes são pares
 * [item, medida] na mesma ordem do original.
 *
 * Arquivo separado da interface (`./receitas.ts`) para que o componente de
 * cliente não carregue este texto todo no bundle: a localização acontece no
 * servidor e o catálogo já chega traduzido por prop.
 */

import type { Idioma } from "../rotas-idioma";
import {
  CATALOGO_RECEITAS,
  carregarTrilhasReceitas,
  type InteresseId,
  type Receita,
  type TrilhaReceitas,
} from "../receitas";
import { TEXTOS_RECEITAS, assuntosInteresse } from "./receitas";

export type TraducaoReceita = {
  titulo: string;
  subtitulo: string;
  tempo: string;
  porcoes: string;
  momento: string;
  ingredientes: [item: string, medida: string][];
  preparo: string[];
  ciencia: string;
};

const ES: Record<string, TraducaoReceita> = {
  /* ── POSTRES CON MENOS DE 100 KCAL ─────────────────────────────────── */
  "mousse-limao-zero-85kcal": {
    titulo: "Mousse Aireada de Limón Sin Azúcar (85 kcal por Copa)",
    subtitulo:
      "Casi 1,9 millones de vistas: 3 ingredientes, una acidez que corta las ganas de dulce al instante y menos de 90 kcal.",
    tempo: "4 min",
    porcoes: "1 copa generosa (85 kcal)",
    momento: "Después del almuerzo · Cena ligera",
    ingredientes: [
      ["Yogur natural descremado o griego 0%", "120 g"],
      ["Jugo de limón recién exprimido", "30 ml (1 limón)"],
      ["Gelatina sin azúcar sabor limón hidratada o leche en polvo descremada", "1 cda."],
      ["Ralladura de limón y gotas de edulcorante", "al gusto"],
    ],
    preparo: [
      "Bate el yogur descremado bien frío con el jugo de limón y la gelatina sin azúcar disuelta en 2 cucharadas de agua tibia.",
      "Bate 1 minuto con la batidora de mano o la licuadora para incorporar aire y duplicar el volumen.",
      "Refrigera 20 minutos y termina con ralladura de la parte verde del limón.",
    ],
    ciencia:
      "El ácido cítrico del limón coagula parcialmente las caseínas del yogur y espesa la crema sin necesidad de nata ni leche condensada.",
  },
  "maca-assada-airfryer-canela-95kcal": {
    titulo: "Manzana Caramelizada en Freidora de Aire con Canela (95 kcal)",
    subtitulo:
      "Más de 1,8 millones de vistas: aroma a tarta de manzana recién horneada, calentita y con menos de 100 calorías.",
    tempo: "8 min",
    porcoes: "1 manzana entera asada (95 kcal)",
    momento: "Noche · Antojo de algo dulce y caliente",
    ingredientes: [
      ["Manzana Fuji o Gala mediana", "1 unidad (150 g)"],
      ["Canela de Ceilán en polvo", "1 cdta. generosa"],
      ["Gotas de limón y eritritol/edulcorante", "al gusto"],
      ["Extracto de vainilla", "3 gotas"],
    ],
    preparo: [
      "Corta la manzana por la mitad o en rodajas gruesas, con la piel (donde se concentra la pectina).",
      "Espolvorea canela, vainilla y unas gotas de limón.",
      "Hornea en la freidora de aire a 180 °C de 7 a 8 minutos, hasta que la superficie se caramelice con los propios azúcares de la fruta.",
    ],
    ciencia:
      "El calor concentra la fructosa natural en la superficie de la manzana y libera el cinamaldehído de la canela, que activa los receptores del dulzor con solo 95 kcal.",
  },
  "pudim-fit-zero-acucar-90kcal": {
    titulo: "Flan Fit Cremoso Sin Azúcar y Sin Leche Condensada (90 kcal)",
    subtitulo:
      "Más de 1,5 millones de vistas: la textura lisa del flan tradicional con solo 90 kcal por porción.",
    tempo: "5 min (+ refrigerador)",
    porcoes: "1 porción generosa (90 kcal)",
    momento: "Postre de domingo · Definición",
    ingredientes: [
      ["Huevos enteros", "2 unidades"],
      ["Leche descremada", "200 ml"],
      ["Leche en polvo descremada o whey de vainilla", "2 cdas."],
      ["Esencia de vainilla y edulcorante para cocinar", "1 cda."],
    ],
    preparo: [
      "Licúa todos los ingredientes con la vainilla durante 2 minutos.",
      "Vierte en ramequines individuales y cocina en el microondas a potencia media de 3 a 4 minutos (o a baño maría).",
      "Refrigera hasta que esté completamente firme.",
    ],
    ciencia:
      "La albúmina y la ovotransferrina del huevo forman una red tridimensional que retiene la leche descremada y dan el corte del flan sin una gota de azúcar.",
  },
  "brigadeiro-colher-cacau-92kcal": {
    titulo: "Crema de Chocolate / Brigadeiro de Cuchara Sin Azúcar en 5 Minutos (92 kcal)",
    subtitulo:
      "Casi 950 mil vistas: hecho con cacao 100% para cuando necesitas chocolate intenso con menos de 100 kcal.",
    tempo: "5 min",
    porcoes: "1 porción de cuchara (92 kcal)",
    momento: "SPM · Antojo de chocolate",
    ingredientes: [
      ["Cacao en polvo 100% alcalinizado", "10 g (1 cda.)"],
      ["Leche en polvo descremada o whey de chocolate", "15 g (1 ½ cdas.)"],
      ["Agua hirviendo o leche descremada", "40 ml"],
      ["Edulcorante al gusto", "gotas"],
    ],
    preparo: [
      "Mezcla el cacao 100%, la leche en polvo descremada y el edulcorante.",
      "Agrega el agua caliente poco a poco, batiendo con energía con una cuchara o minibatidora hasta obtener una crema brillante.",
      "Lleva al congelador 10 minutos para que tome punto de brigadeiro de cuchara.",
    ],
    ciencia:
      "La emulsión de las proteínas de la leche descremada con las partículas finas del cacao alcalinizado crea la viscosidad de una ganache sin mantequilla.",
  },
  "mousse-morango-gelatina-75kcal": {
    titulo: "Mousse de Fresa con 3 Ingredientes (Solo 75 kcal por Copa)",
    subtitulo:
      "Más de 530 mil vistas: puedes comer una copa grande entera por la noche por solo 75 calorías y 12 g de proteína.",
    tempo: "4 min",
    porcoes: "1 copa grande (75 kcal)",
    momento: "Cena ligera · Recta final de definición",
    ingredientes: [
      ["Gelatina sin azúcar sabor fresa o frambuesa", "1 sobre"],
      ["Agua hirviendo", "100 ml"],
      ["Yogur natural descremado o proteína aislada", "100 g"],
      ["Fresas picadas", "40 g"],
    ],
    preparo: [
      "Disuelve la gelatina sin azúcar en el agua hirviendo.",
      "Licúa 2 minutos con el yogur descremado bien frío y unos cubos de hielo.",
      "Reparte en copas con trocitos de fresa y refrigera 30 minutos.",
    ],
    ciencia:
      "El colágeno de la gelatina sin azúcar atrapa aire al batirse con hielo y yogur, lo que genera 300 ml de volumen gástrico con solo 75 kcal.",
  },
  "sorvete-fluff-morango-68kcal": {
    titulo: "Helado Cremoso / Fluff Sin Azúcar y Sin Grasa (68 kcal)",
    subtitulo:
      "Listo en 3 minutos con fruta congelada: un bol lleno de helado cremoso con menos de 70 calorías.",
    tempo: "3 min",
    porcoes: "1 bol lleno (68 kcal)",
    momento: "Calor · Postre libre",
    ingredientes: [
      ["Fresas congeladas", "120 g"],
      ["Clara de huevo pasteurizada o 50 g de yogur 0%", "50 g"],
      ["Gotas de limón y edulcorante", "al gusto"],
    ],
    preparo: [
      "Procesa las fresas congeladas con el yogur 0% (o la clara pasteurizada) y el edulcorante.",
      "Bate de 2 a 3 minutos hasta incorporar aire y duplicar el volumen, con textura de helado italiano.",
    ],
    ciencia:
      "Los microcristales de hielo de la fresa congelada estabilizan las proteínas en una espuma firme (overrun) y entregan el máximo volumen por caloría.",
  },

  /* ── AVENA · DULCES FIT ────────────────────────────────────────────── */
  "overnight-oats-cheesecake-morango": {
    titulo: "Overnight Oats Cremoso (Avena Remojada de Fresa)",
    subtitulo:
      "Más de 15 millones de vistas: lo armas en 3 minutos por la noche y despiertas con un postre frío y proteico listo en el refrigerador.",
    tempo: "3 min (+ refrigerador)",
    porcoes: "1 frasco",
    momento: "Desayuno · Snack listo",
    ingredientes: [
      ["Avena en hojuelas finas", "35 g (3 ½ cdas.)"],
      ["Yogur natural descremado o skyr", "120 g"],
      ["Whey protein de vainilla o leche en polvo", "20 g"],
      ["Crema de ricota light (capa de cheesecake)", "25 g (1 cda.)"],
      ["Fresas picadas", "80 g"],
      ["Semillas de chía", "5 g (1 cdta.)"],
    ],
    preparo: [
      "En el fondo de un frasco de vidrio, mezcla la avena, la chía, el whey y 80 g del yogur.",
      "Bate el resto del yogur (40 g) con la crema de ricota light y unas gotas de vainilla para hacer la crema blanca de arriba.",
      "Cubre con las fresas picadas.",
      "Tapa y deja en el refrigerador al menos 4 horas (o toda la noche).",
    ],
    ciencia:
      "En la hidratación en frío durante la noche, el almidón de la avena y el mucílago de la chía absorben el suero del yogur y crean una textura de pudín sin ir al fuego.",
  },
  "bolo-aveia-banana-4-ingredientes": {
    titulo: "Pastel Rápido de Avena con Banana y Canela (Sin Harina y Sin Azúcar)",
    subtitulo:
      "Casi 10 millones de vistas: solo 4 ingredientes base, húmedo por dentro y perfecto para sustituir el pan o el pastel tradicional.",
    tempo: "10 min",
    porcoes: "1 porción individual",
    momento: "Desayuno · Merienda",
    ingredientes: [
      ["Avena en hojuelas finas", "35 g (3 ½ cdas.)"],
      ["Banana bien madura", "1 unidad mediana (80 g)"],
      ["Huevos enteros", "2 unidades"],
      ["Canela en polvo y polvo de hornear", "½ cdta."],
      ["Whey protein de vainilla (opcional, para subir la proteína)", "15 g"],
    ],
    preparo: [
      "Aplasta bien la banana madura con un tenedor hasta obtener una crema lisa.",
      "Bate los huevos con la banana e incorpora la avena, la canela y el whey.",
      "Agrega el polvo de hornear al final y lleva al microondas 2 minutos o a la freidora de aire a 180 °C por 8 minutos.",
    ],
    ciencia:
      "Al madurar, la banana convierte almidón en azúcares simples naturales que endulzan la masa sin sacarosa, mientras la avena estructura el pastel sin gluten.",
  },
  "brownie-fit-aveia-cacau": {
    titulo: "Postre Cremoso / Brownie de Avena, Banana y Cacao 100%",
    subtitulo:
      "Más de 7,6 millones de vistas: textura densa de chocolate de verdad, sin harina blanca y sin azúcar refinada.",
    tempo: "10 min",
    porcoes: "1 porción generosa",
    momento: "Antojo de dulce · Después de cenar",
    ingredientes: [
      ["Harina u hojuelas finas de avena", "30 g (3 cdas.)"],
      ["Banana bien madura", "1 unidad mediana (75 g)"],
      ["Huevo entero", "1 unidad"],
      ["Cacao en polvo 100%", "12 g (1 cda. colmada)"],
      ["Whey protein de chocolate", "15 g (½ scoop)"],
      ["Chispas de chocolate 70% o nueces", "8 g"],
    ],
    preparo: [
      "Mezcla la banana bien aplastada con el huevo hasta que quede uniforme.",
      "Agrega el cacao 100%, la avena y el whey (sin polvo de hornear, para mantener la textura densa de brownie).",
      "Vierte en un molde pequeño y lleva a la freidora de aire a 170 °C por 8 minutos (o al microondas por 90 segundos).",
    ],
    ciencia:
      "La pectina de la banana madura junto con el β-glucano de la avena retiene el agua en la masa y garantiza un interior húmedo estilo fudgy.",
  },
  "cookie-aveia-banana-chocolate": {
    titulo: "Galletas Crujientes de Avena, Banana y Chispas de Chocolate 70%",
    subtitulo:
      "Más de 2,1 millones de vistas: 4 ingredientes base y 8 minutos de preparación para tener un dulce limpio en la semana.",
    tempo: "10 min",
    porcoes: "3 galletas grandes",
    momento: "Merienda · Preentreno",
    ingredientes: [
      ["Avena en hojuelas gruesas o medianas", "40 g (4 cdas.)"],
      ["Banana bien madura aplastada", "1 unidad mediana (80 g)"],
      ["Mantequilla de maní integral", "10 g (1 cdta. colmada)"],
      ["Whey protein de vainilla o canela", "15 g (½ scoop)"],
      ["Chocolate 70% picado", "12 g"],
    ],
    preparo: [
      "Aplasta la banana con la mantequilla de maní hasta formar una crema homogénea.",
      "Incorpora la avena en hojuelas y el whey protein: la masa debe poder moldearse con cuchara.",
      "Forma 3 discos y espolvorea el chocolate 70% por encima.",
      "Hornea en la freidora de aire a 180 °C de 7 a 8 minutos, hasta que doren los bordes.",
    ],
    ciencia:
      "Usar avena en hojuelas enteras exige más masticación y da bordes crujientes, lo que alarga el tiempo de comida y la señal de saciedad.",
  },
  "mingau-proteico-bombom-aveia": {
    titulo: "Porridge Proteico Cremoso de Avena ('Proats' Sabor Chocolate)",
    subtitulo:
      "Mucho volumen en el plato: un bol entero caliente y aterciopelado con 32 g de proteína que controla el hambre por 4 horas.",
    tempo: "5 min",
    porcoes: "1 bol grande",
    momento: "Desayuno · Cena ligera",
    ingredientes: [
      ["Avena en hojuelas finas o salvado", "40 g (4 cdas.)"],
      ["Leche descremada o bebida vegetal", "200 ml"],
      ["Cacao en polvo 100%", "8 g (1 cda. de postre)"],
      ["Whey protein de chocolate", "25 g"],
      ["Clara de huevo (truco de cremosidad)", "1 unidad"],
    ],
    preparo: [
      "Lleva la avena, la leche y el cacao a fuego bajo, removiendo siempre hasta que espese (3 minutos).",
      "Con el fuego al mínimo, agrega la clara y remueve con energía durante 40 segundos.",
      "Apaga el fuego, espera 1 minuto e incorpora el whey protein.",
    ],
    ciencia:
      "Agregar el whey solo con el fuego apagado evita que la proteína se corte por encima de 75 °C y deja el porridge con textura de ganache.",
  },
  "petit-gateau-aveia-caneca": {
    titulo: "Pastelito en Taza de Avena y Cacao en el Microondas",
    subtitulo:
      "Listo en 90 segundos, calma las ganas de chocolate por la noche y aporta 31 g de proteína.",
    tempo: "3 min",
    porcoes: "1 taza",
    momento: "Cena ligera · Antojo de dulce",
    ingredientes: [
      ["Harina o salvado de avena", "30 g (3 cdas.)"],
      ["Huevo entero", "1 unidad"],
      ["Cacao en polvo 100%", "10 g (1 cda.)"],
      ["Whey protein de chocolate", "20 g"],
      ["Leche descremada o agua", "40 ml (3 cdas.)"],
      ["Chocolate 70% (para el centro)", "1 cuadradito (8 g)"],
    ],
    preparo: [
      "En la taza, bate el huevo con la leche y mezcla la avena, el cacao y el whey.",
      "Hunde el cuadradito de chocolate 70% en el centro.",
      "Microondas de 60 a 75 segundos: sácalo con el centro todavía húmedo.",
    ],
    ciencia:
      "Las fibras solubles de la avena retienen la humedad dentro de la taza; detener la cocción 15 segundos antes conserva el centro cremoso.",
  },

  /* ── AVENA · PANQUEQUES DEL PROTOCOLO ──────────────────────────────── */
  "panqueca-classica-banana-whey": {
    titulo: "Panqueque Clásico Fit de Banana con Avena",
    subtitulo:
      "Más de 3,2 millones de vistas: la receta de panqueque de avena más vista, suave y sin harina blanca.",
    tempo: "5 min",
    porcoes: "1 porción",
    momento: "Desayuno · Postentreno",
    ingredientes: [
      ["Avena en hojuelas finas o harina de avena", "30 g (3 cdas.)"],
      ["Banana madura", "1 unidad mediana (75 g)"],
      ["Huevo entero + 1 clara", "1 huevo + 1 clara"],
      ["Whey protein (vainilla o neutro)", "15 g (½ scoop)"],
      ["Canela en polvo", "al gusto"],
    ],
    preparo: [
      "Aplasta la banana con un tenedor hasta obtener un puré liso.",
      "Mezcla el huevo, la clara, la avena y la canela y deja hidratar 2 minutos.",
      "Agrega el medio scoop de whey al final y cocina en sartén antiadherente tapada a fuego bajo.",
    ],
    ciencia:
      "El fuego bajo y medio scoop de whey en la masa evitan la desnaturalización brusca de las proteínas del suero y mantienen el panqueque suave.",
  },
  "panqueca-americana-fluffy-iogurte": {
    titulo: "Panqueque Americano Fluffy de Avena y Yogur Natural",
    subtitulo:
      "Masa alta y aireada que aprovecha la acidez del yogur natural para dejar la avena esponjosa como un panqueque americano.",
    tempo: "8 min",
    porcoes: "3 discos medianos",
    momento: "Desayuno",
    ingredientes: [
      ["Harina de avena", "35 g (3 ½ cdas.)"],
      ["Yogur natural descremado", "60 g (3 cdas. colmadas)"],
      ["Huevo entero", "1 unidad"],
      ["Whey protein de vainilla", "15 g (½ scoop)"],
      ["Polvo de hornear", "½ cdta. rasa"],
    ],
    preparo: [
      "Mezcla el huevo y el yogur natural hasta que quede uniforme.",
      "Incorpora la harina de avena, el whey y, al final, el polvo de hornear.",
      "Forma 3 discos pequeños en la sartén a fuego mínimo y con tapa.",
    ],
    ciencia:
      "El ácido láctico del yogur reacciona con el polvo de hornear y genera microburbujas de aire que dejan la masa alta y suave.",
  },
  "panqueca-pasta-amendoim-canela": {
    titulo: "Panqueque Energético de Avena, Banana y Mantequilla de Maní",
    subtitulo:
      "Más energía sostenida para el preentreno de piernas o una fase de ganancia de masa limpia.",
    tempo: "7 min",
    porcoes: "1 porción",
    momento: "Preentreno · Ganancia de masa",
    ingredientes: [
      ["Avena en hojuelas finas", "40 g (4 cdas.)"],
      ["Banana madura", "1 unidad mediana (80 g)"],
      ["Huevo entero + 2 claras", "1 huevo + 2 claras"],
      ["Whey protein", "15 g (½ scoop)"],
      ["Mantequilla de maní integral", "15 g (1 cda. rasa)"],
    ],
    preparo: [
      "Mezcla la banana aplastada, el huevo, las claras, la avena y el whey.",
      "Cocina en sartén antiadherente tapada a fuego bajo hasta dorar por ambos lados.",
      "Termina con la mantequilla de maní sobre el panqueque todavía caliente.",
    ],
    ciencia:
      "Los carbohidratos complejos de la avena combinados con las grasas insaturadas del maní garantizan una liberación constante de energía.",
  },
  "panqueca-cacau-calda-whey": {
    titulo: "Panqueque de Avena con Salsa Proteica de Whey y Mantequilla de Maní",
    subtitulo:
      "Cobertura cremosa de whey hecha en 30 segundos para convertir el panqueque en un dulce proteico.",
    tempo: "7 min",
    porcoes: "1 porción",
    momento: "Merienda · Cena ligera",
    ingredientes: [
      ["Salvado o harina de avena", "30 g (3 cdas.)"],
      ["Huevo entero + 2 claras", "1 huevo + 2 claras"],
      ["Banana madura", "1 unidad pequeña"],
      ["Whey sabor chocolate (para la salsa)", "20 g"],
      ["Mantequilla de maní", "10 g"],
    ],
    preparo: [
      "Bate el huevo, las claras, la banana y la avena y cocina a fuego bajo.",
      "Mezcla los 20 g de whey con unas gotas de agua hasta formar una salsa espesa.",
      "Cubre el panqueque listo con la salsa de whey y un hilo de mantequilla de maní.",
    ],
    ciencia:
      "Poner la mayor parte del whey en la salsa fría preserva la textura cremosa sin resecar la masa en la sartén.",
  },

  /* ── TAPIOCA Y CREPIOCA · SALADAS Y DULCES ─────────────────────────── */
  "pao-de-queijo-frigideira-tapioca": {
    titulo: "Pancito de Tapioca / Pan de Queso de Sartén en Minutos",
    subtitulo:
      "Más de 5,4 millones de vistas: costra dorada por fuera, suave por dentro y listo en 5 minutos en la sartén.",
    tempo: "5 min",
    porcoes: "1 porción",
    momento: "Desayuno · Sustituto del pan",
    ingredientes: [
      ["Goma de tapioca hidratada (almidón de yuca)", "30 g (2 cdas.)"],
      ["Huevo entero + 1 clara", "1 huevo + 1 clara"],
      ["Queso crema light o cottage", "25 g (1 cda.)"],
      ["Mozzarella light rallada o parmesano", "20 g"],
      ["Pizca de sal y orégano", "al gusto"],
    ],
    preparo: [
      "Bate con un tenedor el huevo, la clara, el queso crema light, la tapioca y el queso rallado.",
      "Vierte en una sartén antiadherente pequeña a fuego bajo y tapa.",
      "Dale la vuelta cuando se infle y dore la base (unos 2 minutos por lado).",
    ],
    ciencia:
      "La amilopectina del almidón de yuca se gelatiniza rápido y atrapa el vapor del huevo y del queso crema, creando la misma elasticidad del pan de queso con la mitad de las calorías.",
  },
  "tapioca-recheada-metodo-crocante": {
    titulo: "Tapioca Perfecta y Húmeda con Huevos y Queso (Sin Textura de Goma)",
    subtitulo:
      "Más de 5,3 millones de vistas: la forma correcta de sellar la tapioca con proteína para que no se reseque ni pierda saciedad.",
    tempo: "5 min",
    porcoes: "1 porción",
    momento: "Desayuno · Cena rápida",
    ingredientes: [
      ["Goma de tapioca tamizada", "35 g (2 ½ cdas.)"],
      ["Huevos revueltos o a la plancha", "2 unidades"],
      ["Queso fresco light o cottage", "30 g"],
      ["Semillas de chía en la goma (truco glucémico)", "1 cdta."],
    ],
    preparo: [
      "Mezcla 1 cucharadita de chía con la goma de tapioca y espárcela en la sartén tibia.",
      "En cuanto los granos se unan (1 minuto), agrega los huevos y el queso, dobla por la mitad y apaga: no dejes que se seque demasiado.",
    ],
    ciencia:
      "La tapioca sola tiene un índice glucémico alto; combinarla con 2 huevos, queso y chía ralentiza el vaciamiento gástrico y mantiene alta la saciedad.",
  },
  "crepioca-classica-proteica": {
    titulo: "Crepioca Clásica Simple y Rápida (Masa Ligera en 3 Minutos)",
    subtitulo:
      "Más de 4,1 millones de vistas: la proporción exacta entre huevo y goma de tapioca para doblarla sin que se rompa.",
    tempo: "4 min",
    porcoes: "1 porción",
    momento: "Desayuno · Snack proteico",
    ingredientes: [
      ["Goma de tapioca", "25 g (2 cdas. rasas)"],
      ["Huevo entero + 2 claras", "1 huevo + 2 claras"],
      ["Pollo desmenuzado o atún/queso magro (relleno)", "60 g"],
      ["Sal y cúrcuma", "al gusto"],
    ],
    preparo: [
      "Bate bien el huevo y las claras con la goma de tapioca hasta que no quede ningún grumo.",
      "Vierte en la sartén antiadherente caliente a fuego medio-bajo.",
      "Cuando se despegue del fondo, dale la vuelta por 30 segundos, rellena con la proteína elegida y dobla.",
    ],
    ciencia:
      "Más ligera que el pan y sin gluten: 2 cucharadas rasas de tapioca con huevo y claras aportan 28 g de proteína en menos de 300 kcal.",
  },
  "crepioca-doce-banana-chocolate": {
    titulo: "Crepioca Dulce de Cacao Rellena de Banana Caliente",
    subtitulo:
      "Más de 1,3 millones de vistas: versión dulce con masa de tapioca y huevo para variar cuando se acaba la avena.",
    tempo: "5 min",
    porcoes: "1 porción",
    momento: "Merienda · Antojo de dulce",
    ingredientes: [
      ["Goma de tapioca", "25 g (2 cdas.)"],
      ["Huevo entero + 1 clara", "1 huevo + 1 clara"],
      ["Cacao en polvo 100%", "1 cda. de postre"],
      ["Banana en rodajas", "1 unidad mediana"],
      ["Whey de chocolate (salsa) o canela", "15 g"],
    ],
    preparo: [
      "Bate el huevo, la clara, la tapioca, el cacao y unas gotas de edulcorante.",
      "Dora el disco en la sartén, coloca las rodajas de banana en la mitad de la masa y cierra con la salsa de whey.",
    ],
    ciencia:
      "Excelente opción baja en FODMAP y de fácil digestión para un preentreno cerca de la hora del gimnasio.",
  },
  "tapioca-invertida-crocante-ovo": {
    titulo: "Tapioca Invertida con Costra Crujiente de Queso y Huevo",
    subtitulo:
      "El queso va primero a la sartén, forma un encaje crujiente y dorado y envuelve el huevo y la tapioca.",
    tempo: "5 min",
    porcoes: "1 porción",
    momento: "Desayuno · Cena rápida",
    ingredientes: [
      ["Mozzarella light o queso semicurado", "25 g"],
      ["Huevos enteros", "2 unidades"],
      ["Goma de tapioca", "25 g (2 cdas.)"],
      ["Orégano y pimienta negra", "al gusto"],
    ],
    preparo: [
      "Esparce el queso en el fondo de la sartén antiadherente fría, enciende a fuego bajo y casca los huevos encima.",
      "Sazona y espolvorea la goma de tapioca cubriendo los huevos.",
      "Cuando el queso forme una costra dorada, dale la vuelta por 1 minuto y dobla por la mitad.",
    ],
    ciencia:
      "La reacción de Maillard en las proteínas del queso en la sartén da un crujiente intenso y sabor umami sin añadir aceite.",
  },
};

const EN: Record<string, TraducaoReceita> = {
  /* ── DESSERTS UNDER 100 KCAL ───────────────────────────────────────── */
  "mousse-limao-zero-85kcal": {
    titulo: "Airy Sugar-Free Lime Mousse (85 kcal per Cup)",
    subtitulo:
      "Nearly 1.9 million views: 3 ingredients, a tang that shuts down sugar cravings instantly, and under 90 kcal.",
    tempo: "4 min",
    porcoes: "1 generous cup (85 kcal)",
    momento: "After lunch · Light late snack",
    ingredientes: [
      ["Plain nonfat yogurt or 0% Greek yogurt", "120 g"],
      ["Freshly squeezed lime juice", "30 ml (1 lime)"],
      ["Bloomed sugar-free lime gelatin or nonfat dry milk", "1 tbsp"],
      ["Lime zest and a few drops of sweetener", "to taste"],
    ],
    preparo: [
      "Blend the ice-cold nonfat yogurt with the lime juice and the sugar-free gelatin dissolved in 2 tablespoons of warm water.",
      "Blend for 1 minute with an immersion blender or blender to whip in air and double the volume.",
      "Chill for 20 minutes and finish with zest from the green part of the lime.",
    ],
    ciencia:
      "The citric acid in lime partially coagulates the yogurt's caseins, thickening the cream without heavy cream or condensed milk.",
  },
  "maca-assada-airfryer-canela-95kcal": {
    titulo: "Air Fryer Caramelized Cinnamon Apple (95 kcal)",
    subtitulo:
      "Over 1.8 million views: smells like apple pie fresh from the oven, served warm and under 100 calories.",
    tempo: "8 min",
    porcoes: "1 whole baked apple (95 kcal)",
    momento: "Evening · Craving something warm and sweet",
    ingredientes: [
      ["Medium Fuji or Gala apple", "1 apple (150 g)"],
      ["Ground Ceylon cinnamon", "1 heaping tsp"],
      ["A few drops of lemon and erythritol/sweetener", "to taste"],
      ["Vanilla extract", "3 drops"],
    ],
    preparo: [
      "Cut the apple in half or into thick slices, skin on (that's where the pectin is concentrated).",
      "Sprinkle with cinnamon, vanilla and a few drops of lemon.",
      "Air fry at 180 °C (355 °F) for 7 to 8 minutes, until the surface caramelizes in the fruit's own sugars.",
    ],
    ciencia:
      "Heat concentrates the apple's natural fructose on the surface and releases cinnamaldehyde from the cinnamon, triggering sweetness receptors for just 95 kcal.",
  },
  "pudim-fit-zero-acucar-90kcal": {
    titulo: "Creamy Sugar-Free Flan with No Condensed Milk (90 kcal)",
    subtitulo:
      "Over 1.5 million views: the smooth texture of a classic flan for just 90 kcal per slice.",
    tempo: "5 min (+ fridge)",
    porcoes: "1 generous slice (90 kcal)",
    momento: "Sunday dessert · Cutting phase",
    ingredientes: [
      ["Whole eggs", "2 eggs"],
      ["Skim milk", "200 ml"],
      ["Nonfat dry milk or vanilla whey", "2 tbsp"],
      ["Vanilla extract and baking sweetener", "1 tbsp"],
    ],
    preparo: [
      "Blend all the ingredients with the vanilla for 2 minutes.",
      "Pour into individual ramekins and microwave on medium power for 3 to 4 minutes (or bake in a water bath).",
      "Chill until completely set.",
    ],
    ciencia:
      "Egg albumin and ovotransferrin form a three-dimensional network that holds the skim milk, giving you a sliceable flan without a drop of sugar.",
  },
  "brigadeiro-colher-cacau-92kcal": {
    titulo: "5-Minute Sugar-Free Chocolate Cream / Spoon Brigadeiro (92 kcal)",
    subtitulo:
      "Nearly 950K views: made with 100% cocoa for when you need intense chocolate for under 100 kcal.",
    tempo: "5 min",
    porcoes: "1 spoonable serving (92 kcal)",
    momento: "PMS · Chocolate craving",
    ingredientes: [
      ["100% Dutch-process cocoa powder", "10 g (1 tbsp)"],
      ["Nonfat dry milk or chocolate whey", "15 g (1 ½ tbsp)"],
      ["Boiling water or skim milk", "40 ml"],
      ["Sweetener to taste", "a few drops"],
    ],
    preparo: [
      "Mix the 100% cocoa, the nonfat dry milk and the sweetener.",
      "Add the hot water little by little, whisking hard with a spoon or mini frother until it turns into a glossy cream.",
      "Freeze for 10 minutes so it sets to a spoonable brigadeiro texture.",
    ],
    ciencia:
      "Emulsifying skim-milk proteins with fine Dutch-process cocoa particles creates ganache-like thickness without butter.",
  },
  "mousse-morango-gelatina-75kcal": {
    titulo: "3-Ingredient Strawberry Mousse (Just 75 kcal per Cup)",
    subtitulo:
      "Over 530K views: you can eat a whole big cup at night for only 75 calories and 12 g of protein.",
    tempo: "4 min",
    porcoes: "1 large cup (75 kcal)",
    momento: "Late snack · Final stretch of a cut",
    ingredientes: [
      ["Sugar-free strawberry or raspberry gelatin", "1 packet"],
      ["Boiling water", "100 ml"],
      ["Plain nonfat yogurt or protein isolate", "100 g"],
      ["Chopped strawberries", "40 g"],
    ],
    preparo: [
      "Dissolve the sugar-free gelatin in the boiling water.",
      "Blend with the ice-cold nonfat yogurt and a few ice cubes for 2 minutes.",
      "Divide into cups with strawberry pieces and chill for 30 minutes.",
    ],
    ciencia:
      "The collagen in sugar-free gelatin traps air when whipped with ice and yogurt, producing 300 ml of stomach-filling volume for just 75 kcal.",
  },
  "sorvete-fluff-morango-68kcal": {
    titulo: "Creamy Sugar-Free, Fat-Free Ice Cream / Fluff (68 kcal)",
    subtitulo:
      "Ready in 3 minutes with frozen fruit: a full bowl of creamy ice cream for under 70 calories.",
    tempo: "3 min",
    porcoes: "1 full bowl (68 kcal)",
    momento: "Hot days · Guilt-free dessert",
    ingredientes: [
      ["Frozen strawberries", "120 g"],
      ["Pasteurized egg white or 50 g of 0% yogurt", "50 g"],
      ["A few drops of lemon and sweetener", "to taste"],
    ],
    preparo: [
      "Process the frozen strawberries with the 0% yogurt (or pasteurized egg white) and the sweetener.",
      "Blend for 2 to 3 minutes until it whips up, doubles in size and reaches a gelato texture.",
    ],
    ciencia:
      "The ice microcrystals in frozen strawberries stabilize the proteins into a firm foam (overrun), delivering maximum volume per calorie.",
  },

  /* ── OATS · FIT SWEETS ─────────────────────────────────────────────── */
  "overnight-oats-cheesecake-morango": {
    titulo: "Creamy Strawberry Cheesecake Overnight Oats",
    subtitulo:
      "Over 15 million views: assemble it in 3 minutes at night and wake up to a cold, high-protein dessert waiting in the fridge.",
    tempo: "3 min (+ fridge)",
    porcoes: "1 jar",
    momento: "Breakfast · Grab-and-go snack",
    ingredientes: [
      ["Quick oats", "35 g (3 ½ tbsp)"],
      ["Plain nonfat yogurt or skyr", "120 g"],
      ["Vanilla whey protein or dry milk", "20 g"],
      ["Light ricotta cream (cheesecake layer)", "25 g (1 tbsp)"],
      ["Chopped strawberries", "80 g"],
      ["Chia seeds", "5 g (1 tsp)"],
    ],
    preparo: [
      "In the bottom of a glass jar, mix the oats, chia, whey and 80 g of the yogurt.",
      "Whisk the rest of the yogurt (40 g) with the light ricotta cream and a few drops of vanilla to make the white top layer.",
      "Top with the chopped strawberries.",
      "Cover and refrigerate for at least 4 hours (or overnight).",
    ],
    ciencia:
      "During the overnight cold soak, oat starch and chia mucilage absorb the yogurt's whey and create a pudding texture without any cooking.",
  },
  "bolo-aveia-banana-4-ingredientes": {
    titulo: "Quick Banana Cinnamon Oat Cake (No Flour, No Sugar)",
    subtitulo:
      "Nearly 10 million views: just 4 base ingredients, moist inside and perfect to replace bread or regular cake.",
    tempo: "10 min",
    porcoes: "1 single serving",
    momento: "Breakfast · Afternoon snack",
    ingredientes: [
      ["Quick oats", "35 g (3 ½ tbsp)"],
      ["Very ripe banana", "1 medium (80 g)"],
      ["Whole eggs", "2 eggs"],
      ["Ground cinnamon and baking powder", "½ tsp"],
      ["Vanilla whey protein (optional, for extra protein)", "15 g"],
    ],
    preparo: [
      "Mash the ripe banana with a fork until smooth and creamy.",
      "Beat the eggs with the banana and fold in the oats, cinnamon and whey.",
      "Add the baking powder last and microwave for 2 minutes or air fry at 180 °C (355 °F) for 8 minutes.",
    ],
    ciencia:
      "As bananas ripen, their starch turns into natural simple sugars that sweeten the batter without table sugar, while the oats give the cake structure without gluten.",
  },
  "brownie-fit-aveia-cacau": {
    titulo: "Creamy Oat, Banana & 100% Cocoa Brownie",
    subtitulo:
      "Over 7.6 million views: the dense texture of real chocolate, with no white flour and no refined sugar.",
    tempo: "10 min",
    porcoes: "1 generous serving",
    momento: "Sweet craving · After dinner",
    ingredientes: [
      ["Oat flour or quick oats", "30 g (3 tbsp)"],
      ["Very ripe banana", "1 medium (75 g)"],
      ["Whole egg", "1 egg"],
      ["100% cocoa powder", "12 g (1 heaping tbsp)"],
      ["Chocolate whey protein", "15 g (½ scoop)"],
      ["70% chocolate chips or nuts", "8 g"],
    ],
    preparo: [
      "Mix the well-mashed banana with the egg until even.",
      "Add the 100% cocoa, oats and whey (no baking powder, to keep that dense brownie texture).",
      "Pour into a small dish and air fry at 170 °C (340 °F) for 8 minutes (or microwave for 90 seconds).",
    ],
    ciencia:
      "Pectin from ripe banana plus beta-glucan from oats holds water in the batter, guaranteeing a moist, fudgy center.",
  },
  "cookie-aveia-banana-chocolate": {
    titulo: "Crispy Oat, Banana & 70% Chocolate Chip Cookies",
    subtitulo:
      "Over 2.1 million views: 4 base ingredients and 8 minutes of prep for a clean sweet treat all week.",
    tempo: "10 min",
    porcoes: "3 large cookies",
    momento: "Afternoon snack · Pre-workout",
    ingredientes: [
      ["Old-fashioned or medium rolled oats", "40 g (4 tbsp)"],
      ["Very ripe mashed banana", "1 medium (80 g)"],
      ["Natural peanut butter", "10 g (1 heaping tsp)"],
      ["Vanilla or cinnamon whey protein", "15 g (½ scoop)"],
      ["Chopped 70% chocolate", "12 g"],
    ],
    preparo: [
      "Mash the banana with the peanut butter until smooth.",
      "Fold in the rolled oats and whey protein; the dough should hold its shape on a spoon.",
      "Shape 3 discs and sprinkle the 70% chocolate on top.",
      "Air fry at 180 °C (355 °F) for 7 to 8 minutes, until the edges are golden.",
    ],
    ciencia:
      "Whole rolled oats require more chewing and crisp up at the edges, stretching out the meal and strengthening fullness signals.",
  },
  "mingau-proteico-bombom-aveia": {
    titulo: "Creamy Chocolate Protein Oatmeal ('Proats')",
    subtitulo:
      "High volume on the plate: a whole warm, velvety bowl with 32 g of protein that keeps hunger away for 4 hours.",
    tempo: "5 min",
    porcoes: "1 large bowl",
    momento: "Breakfast · Late snack",
    ingredientes: [
      ["Quick oats or oat bran", "40 g (4 tbsp)"],
      ["Skim milk or plant-based milk", "200 ml"],
      ["100% cocoa powder", "8 g (2 tsp)"],
      ["Chocolate whey protein", "25 g"],
      ["Egg white (the creaminess trick)", "1 egg white"],
    ],
    preparo: [
      "Cook the oats, milk and cocoa over low heat, stirring constantly until thick (3 minutes).",
      "With the heat on the lowest setting, add the egg white and stir hard for 40 seconds.",
      "Turn off the heat, wait 1 minute and stir in the whey protein.",
    ],
    ciencia:
      "Adding the whey only after the heat is off keeps the protein from curdling above 75 °C (167 °F), leaving the oatmeal with a ganache-like texture.",
  },
  "petit-gateau-aveia-caneca": {
    titulo: "Microwave Oat & Cocoa Mug Cake",
    subtitulo:
      "Ready in 90 seconds, crushes nighttime chocolate cravings and delivers 31 g of protein.",
    tempo: "3 min",
    porcoes: "1 mug",
    momento: "Late snack · Sweet craving",
    ingredientes: [
      ["Oat flour or oat bran", "30 g (3 tbsp)"],
      ["Whole egg", "1 egg"],
      ["100% cocoa powder", "10 g (1 tbsp)"],
      ["Chocolate whey protein", "20 g"],
      ["Skim milk or water", "40 ml (3 tbsp)"],
      ["70% chocolate (for the center)", "1 small square (8 g)"],
    ],
    preparo: [
      "In the mug, beat the egg with the milk and stir in the oats, cocoa and whey.",
      "Press the square of 70% chocolate into the center.",
      "Microwave for 60 to 75 seconds; take it out while the center is still moist.",
    ],
    ciencia:
      "Soluble oat fiber holds moisture inside the mug; stopping the cooking 15 seconds early keeps the center molten.",
  },

  /* ── OATS · PROTOCOL PANCAKES ──────────────────────────────────────── */
  "panqueca-classica-banana-whey": {
    titulo: "Classic Fit Banana Oat Pancake",
    subtitulo:
      "Over 3.2 million views: the most-watched oat pancake recipe, soft and made without white flour.",
    tempo: "5 min",
    porcoes: "1 serving",
    momento: "Breakfast · Post-workout",
    ingredientes: [
      ["Quick oats or oat flour", "30 g (3 tbsp)"],
      ["Ripe banana", "1 medium (75 g)"],
      ["Whole egg + 1 egg white", "1 egg + 1 white"],
      ["Whey protein (vanilla or unflavored)", "15 g (½ scoop)"],
      ["Ground cinnamon", "to taste"],
    ],
    preparo: [
      "Mash the banana with a fork into a smooth purée.",
      "Mix in the egg, egg white, oats and cinnamon and let it hydrate for 2 minutes.",
      "Add the half scoop of whey last and cook in a covered nonstick pan over low heat.",
    ],
    ciencia:
      "Low heat and only half a scoop of whey in the batter prevent the whey proteins from denaturing abruptly, keeping the pancake soft.",
  },
  "panqueca-americana-fluffy-iogurte": {
    titulo: "Fluffy American-Style Oat & Yogurt Pancakes",
    subtitulo:
      "Tall, airy batter that uses the tang of plain yogurt to make oats as fluffy as American pancakes.",
    tempo: "8 min",
    porcoes: "3 medium pancakes",
    momento: "Breakfast",
    ingredientes: [
      ["Oat flour", "35 g (3 ½ tbsp)"],
      ["Plain nonfat yogurt", "60 g (3 heaping tbsp)"],
      ["Whole egg", "1 egg"],
      ["Vanilla whey protein", "15 g (½ scoop)"],
      ["Baking powder", "½ level tsp"],
    ],
    preparo: [
      "Mix the egg and plain yogurt until smooth.",
      "Fold in the oat flour, the whey and, last, the baking powder.",
      "Cook 3 small pancakes in a covered pan over the lowest heat.",
    ],
    ciencia:
      "The lactic acid in yogurt reacts with the baking powder to create tiny air bubbles that make the batter tall and soft.",
  },
  "panqueca-pasta-amendoim-canela": {
    titulo: "Energy Oat, Banana & Peanut Butter Pancake",
    subtitulo:
      "More sustained energy for a leg-day pre-workout or a lean bulking phase.",
    tempo: "7 min",
    porcoes: "1 serving",
    momento: "Pre-workout · Lean bulk",
    ingredientes: [
      ["Quick oats", "40 g (4 tbsp)"],
      ["Ripe banana", "1 medium (80 g)"],
      ["Whole egg + 2 egg whites", "1 egg + 2 whites"],
      ["Whey protein", "15 g (½ scoop)"],
      ["Natural peanut butter", "15 g (1 level tbsp)"],
    ],
    preparo: [
      "Mix the mashed banana, egg, egg whites, oats and whey.",
      "Cook in a covered nonstick pan over low heat until golden on both sides.",
      "Finish with the peanut butter on top while the pancake is still hot.",
    ],
    ciencia:
      "Complex carbs from oats combined with the unsaturated fats in peanuts provide a steady release of energy.",
  },
  "panqueca-cacau-calda-whey": {
    titulo: "Oat Pancake with Whey Protein Sauce & Peanut Butter",
    subtitulo:
      "A creamy whey topping made in 30 seconds that turns the pancake into a high-protein treat.",
    tempo: "7 min",
    porcoes: "1 serving",
    momento: "Afternoon snack · Late snack",
    ingredientes: [
      ["Oat bran or oat flour", "30 g (3 tbsp)"],
      ["Whole egg + 2 egg whites", "1 egg + 2 whites"],
      ["Ripe banana", "1 small"],
      ["Chocolate whey (for the sauce)", "20 g"],
      ["Peanut butter", "10 g"],
    ],
    preparo: [
      "Blend the egg, egg whites, banana and oats and cook over low heat.",
      "Mix the 20 g of whey with a few drops of water until it forms a thick sauce.",
      "Top the finished pancake with the whey sauce and a drizzle of peanut butter.",
    ],
    ciencia:
      "Putting most of the whey in the cold sauce keeps it creamy and stops the batter from drying out in the pan.",
  },

  /* ── TAPIOCA & CREPIOCA · SAVORY AND SWEET ─────────────────────────── */
  "pao-de-queijo-frigideira-tapioca": {
    titulo: "Skillet Tapioca Bread / Quick Brazilian Cheese Bread",
    subtitulo:
      "Over 5.4 million views: golden crust outside, soft inside and ready in 5 minutes in a skillet.",
    tempo: "5 min",
    porcoes: "1 serving",
    momento: "Breakfast · Bread swap",
    ingredientes: [
      ["Hydrated tapioca starch (cassava)", "30 g (2 tbsp)"],
      ["Whole egg + 1 egg white", "1 egg + 1 white"],
      ["Light cream cheese or cottage cheese", "25 g (1 tbsp)"],
      ["Shredded light mozzarella or parmesan", "20 g"],
      ["Pinch of salt and oregano", "to taste"],
    ],
    preparo: [
      "Whisk the egg, egg white, light cream cheese, tapioca and grated cheese with a fork.",
      "Pour into a small nonstick skillet over low heat and cover.",
      "Flip once it puffs up and the bottom is golden (about 2 minutes per side).",
    ],
    ciencia:
      "Amylopectin in cassava starch gelatinizes quickly and traps steam from the egg and cream cheese, creating the same chewiness as Brazilian cheese bread with half the calories.",
  },
  "tapioca-recheada-metodo-crocante": {
    titulo: "Perfect Moist Tapioca Crepe with Eggs & Cheese (Never Rubbery)",
    subtitulo:
      "Over 5.3 million views: the right way to seal tapioca with protein so it doesn't dry out or tank your fullness.",
    tempo: "5 min",
    porcoes: "1 serving",
    momento: "Breakfast · Quick dinner",
    ingredientes: [
      ["Sifted tapioca starch", "35 g (2 ½ tbsp)"],
      ["Scrambled or griddled eggs", "2 eggs"],
      ["Light fresh white cheese or cottage cheese", "30 g"],
      ["Chia seeds in the starch (glycemic trick)", "1 tsp"],
    ],
    preparo: [
      "Mix 1 teaspoon of chia into the tapioca starch and spread it in a warm skillet.",
      "As soon as the granules bind (1 minute), add the eggs and cheese, fold in half and turn off the heat; don't let it dry out.",
    ],
    ciencia:
      "Plain tapioca has a high glycemic index; pairing it with 2 eggs, cheese and chia slows gastric emptying and keeps you full longer.",
  },
  "crepioca-classica-proteica": {
    titulo: "Simple, Quick Classic Crepioca (Light 3-Minute Batter)",
    subtitulo:
      "Over 4.1 million views: the exact egg-to-tapioca ratio so it folds without breaking.",
    tempo: "4 min",
    porcoes: "1 serving",
    momento: "Breakfast · Protein snack",
    ingredientes: [
      ["Tapioca starch", "25 g (2 level tbsp)"],
      ["Whole egg + 2 egg whites", "1 egg + 2 whites"],
      ["Shredded chicken or tuna/lean cheese (filling)", "60 g"],
      ["Salt and turmeric", "to taste"],
    ],
    preparo: [
      "Whisk the egg and egg whites with the tapioca starch until there are no lumps left.",
      "Pour into a hot nonstick skillet over medium-low heat.",
      "Once it releases from the pan, flip for 30 seconds, add your protein of choice and fold.",
    ],
    ciencia:
      "Lighter than bread and gluten-free: 2 level tablespoons of tapioca with egg and whites deliver 28 g of protein for under 300 kcal.",
  },
  "crepioca-doce-banana-chocolate": {
    titulo: "Sweet Cocoa Crepioca Filled with Warm Banana",
    subtitulo:
      "Over 1.3 million views: a sweet version with tapioca-and-egg batter for when you run out of oats.",
    tempo: "5 min",
    porcoes: "1 serving",
    momento: "Afternoon snack · Sweet craving",
    ingredientes: [
      ["Tapioca starch", "25 g (2 tbsp)"],
      ["Whole egg + 1 egg white", "1 egg + 1 white"],
      ["100% cocoa powder", "2 tsp"],
      ["Sliced banana", "1 medium"],
      ["Chocolate whey (sauce) or cinnamon", "15 g"],
    ],
    preparo: [
      "Whisk the egg, egg white, tapioca, cocoa and a few drops of sweetener.",
      "Brown the crepe in the skillet, lay the banana slices over half of it and close it with the whey sauce.",
    ],
    ciencia:
      "A great low-FODMAP, easy-to-digest option for a pre-workout close to gym time.",
  },
  "tapioca-invertida-crocante-ovo": {
    titulo: "Upside-Down Tapioca with a Crispy Cheese & Egg Crust",
    subtitulo:
      "The cheese goes into the pan first, forms a golden crispy lace and wraps around the egg and tapioca.",
    tempo: "5 min",
    porcoes: "1 serving",
    momento: "Breakfast · Quick dinner",
    ingredientes: [
      ["Light mozzarella or semi-aged white cheese", "25 g"],
      ["Whole eggs", "2 eggs"],
      ["Tapioca starch", "25 g (2 tbsp)"],
      ["Oregano and black pepper", "to taste"],
    ],
    preparo: [
      "Spread the cheese over the bottom of a cold nonstick skillet, turn the heat to low and crack the eggs on top.",
      "Season and sprinkle the tapioca starch over the eggs.",
      "When the cheese forms a golden crust, flip for 1 minute and fold in half.",
    ],
    ciencia:
      "The Maillard reaction in the cheese proteins delivers intense crunch and umami flavor without adding oil.",
  },
};

export const RECEITAS_TRADUZIDAS: Record<Exclude<Idioma, "pt">, Record<string, TraducaoReceita>> = {
  es: ES,
  en: EN,
};

/** Receita no idioma pedido; sem tradução (ou pt) devolve a original. */
export function localizarReceita(receita: Receita, idioma: Idioma): Receita {
  if (idioma === "pt") return receita;
  const t = RECEITAS_TRADUZIDAS[idioma][receita.id];
  if (!t) return receita;
  return {
    ...receita,
    titulo: t.titulo,
    subtitulo: t.subtitulo,
    tempo: t.tempo,
    porcoes: t.porcoes,
    momento: t.momento,
    ingredientes: receita.ingredientes.map((ing, i) => {
      const par = t.ingredientes[i];
      return par ? { item: par[0], medida: par[1] } : ing;
    }),
    preparo: t.preparo.length > 0 ? t.preparo : receita.preparo,
    ciencia: t.ciencia,
  };
}

/** Catálogo completo no idioma pedido (mesma ordem da fonte). */
export function catalogoReceitas(idioma: Idioma): Receita[] {
  return CATALOGO_RECEITAS.map((r) => localizarReceita(r, idioma));
}

/**
 * Mesmas fileiras de `carregarTrilhasReceitas`, no idioma pedido. Em
 * português delega para a função original (saída idêntica).
 */
export function carregarTrilhasReceitasIdioma(idioma: Idioma): TrilhaReceitas[] {
  if (idioma === "pt") return carregarTrilhasReceitas();
  const assuntos = new Map(assuntosInteresse(idioma).map((a) => [a.id as string, a]));
  const top = TEXTOS_RECEITAS[idioma].trilhaTop;
  return carregarTrilhasReceitas().map((t) => {
    const a = assuntos.get(t.id as InteresseId);
    return {
      ...t,
      nome: t.ranking ? top.nome : (a?.tituloTrilha ?? t.nome),
      descricao: t.ranking ? top.descricao : (a?.descricao ?? t.descricao),
      receitas: t.receitas.map((r) => localizarReceita(r, idioma)),
    };
  });
}
