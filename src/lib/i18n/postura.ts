/**
 * Postura do dia a dia + Raio-X Postural em três idiomas.
 *
 * O português continua a viver em `postura.ts` e `postura-cotidiano.ts`
 * (as exports originais não mudaram). Aqui ficam só os textos em espanhol
 * e inglês, sobrepostos aos dados PT por id/número/índice — figuras,
 * ligações entre padrões e exercícios e as regras de segurança (3 × 4,
 * exercício 09 só no padrão 4) continuam a vir do PT, num lugar só.
 */

import type { Idioma } from "@/lib/rotas-idioma";
import {
  AVISO,
  EXERCICIOS,
  EXPECTATIVA,
  FASES,
  PADROES,
  PROMESSA,
  SINAIS_DE_ALERTA,
  TESTE,
  exerciciosDe as exerciciosDePt,
  type Exercicio,
  type Padrao,
  type PadraoId,
} from "@/lib/postura";
import {
  PRINCIPIO,
  ROTINA,
  SITUACOES,
  exercicio as exercicioPt,
  type Situacao,
} from "@/lib/postura-cotidiano";

type Outro = Exclude<Idioma, "pt">;

/* ── Padrões ───────────────────────────────────────────────── */

type TextoPadrao = Omit<Padrao, "id" | "figura">;

const PADROES_TXT: Record<Outro, Record<PadraoId, TextoPadrao>> = {
  es: {
    p1: {
      numero: "Patrón 1",
      nome: "Cabeza adelantada",
      resumo: "Oreja por delante del hombro",
      sinalDaParede: "No apoyas la nuca sin levantar el mentón",
      curto: "Suboccipitales, elevador de la escápula, esternocleidomastoideo, trapecio superior",
      fraco:
        "Flexores cervicales profundos (largo del cuello y largo de la cabeza), trapecio inferior",
      custoNoTreino:
        "Limita la extensión cervical en los ejercicios por encima de la cabeza y hace que la barra pase por delante de la línea ideal en el press militar. En el peso muerto, mirar al frente con el mentón elevado agrava el patrón y reduce la estabilidad cervical bajo carga.",
      sinalTipico:
        "Tensión en la base del cráneo al final del día, cefalea tensional, molestia al sostener el celular, sensación de peso en los hombros al trabajar sentado.",
      erros: [
        "Confundir retracción con flexión. Bajar el mentón en lugar de llevarlo hacia atrás entrena los flexores superficiales, que ya están demasiado activos.",
        "Trabajar solo el cuello. La cabeza adelantada casi siempre se apoya en una torácica curvada: sin tratar el patrón 2 en paralelo, la mejora no se mantiene.",
        "Estirar el trapecio superior y quedarse ahí. Alivia por unas horas y no cambia nada en ocho semanas.",
        "Subir la pantalla e ignorar la silla. Un monitor a la altura de los ojos con una silla que empuja la pelvis en retroversión produce el mismo resultado.",
      ],
    },
    p2: {
      numero: "Patrón 2",
      nome: "Cifosis torácica y hombros protraídos",
      resumo: "Hombros rotados hacia dentro, curvatura dorsal aumentada",
      sinalDaParede: "Las escápulas no tocan la pared sin forzar",
      curto: "Pectoral mayor y menor, dorsal ancho, trapecio superior",
      fraco:
        "Serrato anterior, romboides, trapecio medio e inferior, rotadores externos del hombro",
      custoNoTreino:
        "Es la causa mecánica más común de molestia en el hombro en el press vertical: sin los últimos grados de extensión torácica, el hombro compensa con más elevación glenohumeral y el espacio subacromial se reduce. También limita la posición de rack en la sentadilla frontal.",
      sinalTipico:
        "Hombro que pinza en los ejercicios por encima de la cabeza, dificultad para mantener las escápulas retraídas en el press de banca, rigidez entre las escápulas.",
      erros: [
        "Poner el rodillo en la zona lumbar. La lumbar ya está en extensión y el rodillo la agrava: el rodillo va por encima de la última costilla.",
        "Hacer más remo en lugar de movilizar. Añadir remo a una torácica rígida solo fortalece en el rango que ya tenías.",
        "Retraer las escápulas todo el tiempo. La escápula tiene que rotar y deslizarse; la retracción forzada bloquea el serrato, que es justamente el músculo inhibido aquí.",
        "Forzar el press vertical sin rango. Si la barra no pasa por encima de la cabeza sin hiperextender la lumbar, cámbialo por press inclinado.",
      ],
    },
    p3: {
      numero: "Patrón 3",
      nome: "Anteversión pélvica",
      resumo: "Lordosis lumbar acentuada, abdomen proyectado",
      sinalDaParede: "La mano pasa entera y holgada detrás de la lumbar",
      curto: "Psoas ilíaco, recto femoral, erectores lumbares",
      fraco: "Glúteo mayor, abdominales profundos (transverso y oblicuos), isquiotibiales",
      custoNoTreino:
        "Si la pelvis ya parte en anteversión máxima, no queda rango para absorber la bajada de la sentadilla y la lumbar entra en hiperextensión bajo carga. En el peso muerto, la extensión final la hacen los erectores en lugar del glúteo. En el hip thrust, el rango útil desaparece.",
      sinalTipico:
        "Lumbar cansada al final del día, molestia al estar mucho tiempo de pie, glúteo que no se activa en los ejercicios de extensión de cadera.",
      erros: [
        "Estirar el flexor sin retrovertir primero la pelvis. El estiramiento se va todo a la lumbar y el psoas no recibe tensión: anula el ejercicio.",
        "Fortalecer el glúteo solo con puente. Añade trabajo en rango largo (sentadilla profunda, zancada) a partir de la semana 4.",
        "Hacer abdominales tradicionales. La flexión repetida del tronco no entrena el control de la pelvis.",
        "Corregir de forma estática. Andar todo el día con la pelvis conscientemente retrovertida es cambiar una posición rígida por otra.",
      ],
      cuidado:
        "El ejercicio de extensión lumbar (prone press-up) está contraindicado en este patrón. Si apareció en tu lista, el patrón se identificó mal: repite el test de la pared.",
    },
    p4: {
      numero: "Patrón 4",
      nome: "Retroversión y espalda plana",
      resumo: "Lordosis lumbar borrada, pelvis rotada hacia atrás",
      sinalDaParede: "No pasa ni la mano detrás de la lumbar",
      curto: "Isquiotibiales, recto abdominal, glúteo mayor en acortamiento",
      fraco: "Flexores de cadera, erectores lumbares, glúteo medio",
      custoNoTreino:
        "La lumbar pierde la capacidad de absorber carga axial por deformación elástica y la compresión pasa más directamente a los discos. En la sentadilla el butt wink aparece pronto; en el peso muerto, la lumbar tiende a redondearse antes de que la barra despegue del suelo.",
      sinalTipico:
        "Molestia lumbar difusa al final de un día sentado, sensación de no poder arquear la lumbar, isquiotibiales siempre tensos a pesar de estirarlos.",
      erros: [
        "Seguir consejos genéricos de internet. Casi todo el contenido sobre postura asume anteversión: aplicado aquí, empeora el cuadro.",
        "Estirar isquiotibiales con flexión lumbar. Tocarse los pies con la espalda redondeada estira la lumbar, no los isquiotibiales.",
        "Insistir en el core en flexión. El recto abdominal ya es dominante; más crunches refuerzan la retroversión.",
        "Forzar profundidad en la sentadilla. Si el butt wink aparece pronto, trabaja el rango de cadera y la extensión lumbar en lugar de bajar más.",
      ],
      cuidado:
        "Este es el único protocolo del libro que puede empeorar activamente el cuadro si el patrón está mal identificado. Antes de la primera sesión, confirma en el test de la pared que no pasa la mano detrás de la lumbar.",
      naoFazer: [
        "Estiramiento agresivo de flexores de cadera",
        "Puente de glúteo con retroversión forzada",
        "Plancha con báscula pélvica posterior",
      ],
    },
    assimetria: {
      numero: "Aparte",
      nome: "Asimetrías y escoliosis",
      resumo: "Desviaciones laterales: reglas diferentes",
      sinalDaParede: "Hombro o cadera visiblemente desnivelados",
      curto: "Varía según el lado dominante",
      fraco: "Varía según el lado dominante",
      custoNoTreino:
        "Las asimetrías funcionales responden bien al trabajo unilateral. La escoliosis estructural implica rotación vertebral y alteración ósea: no se corrige con ejercicio, pero entrenar fuerza no está contraindicado, está recomendado.",
      sinalTipico: "Desequilibrio de fuerza evidente entre los lados, molestia de un solo lado.",
      erros: [
        "Tratarlo como si fuera del plano sagital. Las desviaciones laterales tienen reglas propias.",
        "Creer en la promesa de corregir la curva con ejercicio. El material que promete eso debe cerrarse de inmediato.",
      ],
      cuidado:
        "Busca evaluación clínica si hay un desnivel visible y progresivo, giba costal al flexionar el tronco, dolor irradiado, hormigueo o pérdida de fuerza. Aquí la respuesta correcta es imagen y evaluación presencial, no un protocolo de ejercicio.",
    },
  },
  en: {
    p1: {
      numero: "Pattern 1",
      nome: "Forward head posture",
      resumo: "Ear in front of the shoulder",
      sinalDaParede: "The back of your head can't touch the wall without lifting your chin",
      curto: "Suboccipitals, levator scapulae, sternocleidomastoid, upper trapezius",
      fraco: "Deep cervical flexors (longus colli and longus capitis), lower trapezius",
      custoNoTreino:
        "Limits cervical extension in overhead work and pushes the bar in front of the ideal path in the overhead press. In the deadlift, looking straight ahead with the chin up worsens the pattern and reduces neck stability under load.",
      sinalTipico:
        "Tension at the base of the skull by the end of the day, tension headaches, discomfort when holding your phone, a heavy feeling in the shoulders during desk work.",
      erros: [
        "Confusing retraction with flexion. Dropping the chin instead of drawing it back trains the superficial flexors, which are already overactive.",
        "Working only the neck. Forward head almost always sits on a rounded thoracic spine — without addressing pattern 2 in parallel, the gains don't hold.",
        "Stretching the upper traps and stopping there. It brings relief for a few hours and changes nothing in eight weeks.",
        "Raising the screen and ignoring the chair. A monitor at eye level with a chair that pushes the pelvis into posterior tilt produces the same result.",
      ],
    },
    p2: {
      numero: "Pattern 2",
      nome: "Thoracic kyphosis and rounded shoulders",
      resumo: "Shoulders rolled in, increased upper-back curve",
      sinalDaParede: "Your shoulder blades don't touch the wall without forcing",
      curto: "Pectoralis major and minor, latissimus dorsi, upper trapezius",
      fraco:
        "Serratus anterior, rhomboids, middle and lower trapezius, shoulder external rotators",
      custoNoTreino:
        "It's the most common mechanical cause of shoulder discomfort in vertical pressing: without the last degrees of thoracic extension, the shoulder compensates with more glenohumeral elevation and the subacromial space narrows. It also limits the rack position in the front squat.",
      sinalTipico:
        "A shoulder that pinches in overhead exercises, trouble keeping the shoulder blades retracted on the bench press, stiffness between the shoulder blades.",
      erros: [
        "Putting the foam roller on the lower back. The lumbar spine is already extended and the roller makes it worse — the roller belongs above the last rib.",
        "Rowing more instead of mobilizing. Adding rows to a stiff thoracic spine only builds strength in the range you already had.",
        "Keeping the shoulder blades retracted all the time. The scapula has to rotate and glide; forced retraction locks up the serratus, which is exactly the inhibited muscle here.",
        "Forcing overhead pressing without the range. If the bar can't go overhead without overarching your lower back, switch to an incline press.",
      ],
    },
    p3: {
      numero: "Pattern 3",
      nome: "Anterior pelvic tilt",
      resumo: "Exaggerated lower-back arch, belly pushed forward",
      sinalDaParede: "Your whole hand slides easily behind your lower back",
      curto: "Iliopsoas, rectus femoris, lumbar erectors",
      fraco: "Gluteus maximus, deep abdominals (transverse and obliques), hamstrings",
      custoNoTreino:
        "If the pelvis already starts at maximum anterior tilt, there's no range left to absorb the descent of the squat and the lower back hyperextends under load. In the deadlift, the lockout is done by the erectors instead of the glutes. In the hip thrust, the useful range disappears.",
      sinalTipico:
        "A tired lower back by the end of the day, discomfort when standing for long periods, glutes that don't fire in hip extension exercises.",
      erros: [
        "Stretching the hip flexor without tucking the pelvis first. The stretch goes straight into the lower back and the psoas gets no tension — it cancels the exercise.",
        "Strengthening the glutes only with bridges. Add long-range work (deep squats, lunges) from week 4.",
        "Doing traditional crunches. Repeated trunk flexion doesn't train pelvic control.",
        "Correcting statically. Walking around all day with the pelvis consciously tucked just swaps one rigid position for another.",
      ],
      cuidado:
        "The lumbar extension exercise (prone press-up) is contraindicated for this pattern. If it showed up on your list, the pattern was misidentified — redo the wall test.",
    },
    p4: {
      numero: "Pattern 4",
      nome: "Posterior tilt and flat back",
      resumo: "Flattened lower-back curve, pelvis rotated backward",
      sinalDaParede: "Not even your hand fits behind your lower back",
      curto: "Hamstrings, rectus abdominis, gluteus maximus in a shortened position",
      fraco: "Hip flexors, lumbar erectors, gluteus medius",
      custoNoTreino:
        "The lower back loses its ability to absorb axial load through elastic deformation, and compression goes more directly to the discs. Butt wink shows up early in the squat; in the deadlift, the lower back tends to round before the bar leaves the floor.",
      sinalTipico:
        "Diffuse lower-back discomfort after a day of sitting, feeling unable to arch the lower back, hamstrings that stay tight no matter how much you stretch.",
      erros: [
        "Following generic internet advice. Almost all posture content assumes anterior tilt — applied here, it makes things worse.",
        "Stretching the hamstrings with a rounded lower back. Reaching for your toes with a rounded back stretches the lower back, not the hamstrings.",
        "Doubling down on flexion-based core work. The rectus abdominis is already dominant; more crunches reinforce the posterior tilt.",
        "Forcing squat depth. If butt wink shows up early, work on hip range and lumbar extension instead of going lower.",
      ],
      cuidado:
        "This is the only protocol in the book that can actively make things worse if the pattern is misidentified. Before the first session, confirm with the wall test that your hand doesn't fit behind your lower back.",
      naoFazer: [
        "Aggressive hip flexor stretching",
        "Glute bridge with a forced posterior tilt",
        "Plank with a posterior pelvic tilt",
      ],
    },
    assimetria: {
      numero: "Separate",
      nome: "Asymmetries and scoliosis",
      resumo: "Side-to-side deviations — different rules",
      sinalDaParede: "Shoulder or hip visibly uneven",
      curto: "Varies with the dominant side",
      fraco: "Varies with the dominant side",
      custoNoTreino:
        "Functional asymmetries respond well to unilateral work. Structural scoliosis involves vertebral rotation and bone changes: it can't be corrected with exercise — but strength training isn't contraindicated, it's recommended.",
      sinalTipico: "An obvious strength imbalance between sides, discomfort on one side only.",
      erros: [
        "Treating it as a sagittal-plane issue. Lateral deviations have their own rules.",
        "Believing promises to fix the curve with exercise. Close any material that promises that right away.",
      ],
      cuidado:
        "Get a clinical evaluation if there's visible, progressive unevenness, a rib hump when bending forward, radiating pain, tingling or loss of strength. Here the right answer is imaging and an in-person assessment — not an exercise protocol.",
    },
  },
};

export function padroes(idioma: Idioma): Padrao[] {
  if (idioma === "pt") return PADROES;
  const t = PADROES_TXT[idioma];
  return PADROES.map((p) => ({ id: p.id, figura: p.figura, ...t[p.id] }));
}

/* ── Exercícios (biblioteca do livro + os dois do cotidiano) ── */

type TextoExercicio = Pick<Exercicio, "nome" | "dose" | "alvo" | "como" | "falha">;

const EXERCICIOS_TXT: Record<Outro, Record<string, TextoExercicio>> = {
  es: {
    "01": {
      nome: "Chin tuck (retracción cervical)",
      dose: "3×10 · 5 s de sostén · diario",
      alvo: "Flexores cervicales profundos",
      como: "Lleva el mentón hacia atrás en línea recta, formando una papada, y sostén. La cabeza se desliza hacia atrás sobre el cuello; no rota ni se inclina.",
      falha:
        "Si el mentón baja en lugar de ir hacia atrás, el trabajo pasó a los flexores superficiales y el ejercicio dejó de tener efecto. Grábate de perfil en la primera sesión.",
    },
    "02": {
      nome: "Extensión torácica en rodillo",
      dose: "2×10 respiraciones · 3 segmentos · diario",
      alvo: "Movilidad torácica",
      como: "Rodillo perpendicular a la columna, en la torácica media, manos detrás de la cabeza y glúteos en el suelo. Exhala y deja que la columna se amolde al rodillo, sin forzar. Luego sube el rodillo dos dedos y repite.",
      falha:
        "Rodillo por debajo de la última costilla. En la lumbar, este ejercicio fuerza justamente la hiperextensión que se quiere evitar, y es donde la mayoría lo coloca.",
    },
    "03": {
      nome: "Wall slide con serrato",
      dose: "3×10 · lento · desde la semana 1",
      alvo: "Serrato anterior y trapecio inferior",
      como: "Espalda en la pared con cuatro puntos de contacto: occipital, dorsal, sacro y antebrazos. Desliza los antebrazos hacia arriba manteniendo todos los contactos. Arriba, empuja ligeramente la pared.",
      falha:
        "El rango útil es el que mantiene los cuatro contactos, no el máximo. Subir más a costa de arquear la lumbar transfiere el trabajo a los erectores.",
    },
    "04": {
      nome: "Face pull",
      dose: "3×12–15 · carga moderada · desde la semana 3",
      alvo: "Trapecio medio, romboides, rotadores externos",
      como: "Tira a la altura de los ojos con los codos por encima de las muñecas, terminando en rotación externa con las escápulas juntas y deprimidas. Pausa de un segundo al final. Es el único ejercicio de esta lista que vale la pena mantener indefinidamente.",
      falha:
        "Si el trapecio superior se encoge y los hombros suben hacia las orejas, la carga es demasiado alta. Redúcela y prioriza la posición final.",
    },
    "05": {
      nome: "Estiramiento de pectoral en el marco de la puerta",
      dose: "3×30–45 s por lado · diario",
      alvo: "Pectoral mayor y menor",
      como: "Antebrazo apoyado en el marco, codo a la altura del hombro a 90°. Da un paso adelante y rota el tronco hacia el lado contrario. Repite con el codo más alto para las fibras claviculares.",
      falha:
        "Debe sentirse en el pecho, nunca en la parte delantera del hombro. Dolor en la cara anterior del hombro significa que la cápsula está recibiendo la tensión: reduce el rango.",
    },
    "06": {
      nome: "Estiramiento de flexor en semiarrodillado",
      dose: "3×30–45 s por lado · diario",
      alvo: "Psoas ilíaco y recto femoral",
      como: "Rodilla de atrás en el suelo, pie de delante por delante de la rodilla. Retrovierte la pelvis primero (contrae el glúteo de atrás y lleva el pubis hacia arriba) y solo después avanza el cuerpo. Costillas abajo todo el tiempo.",
      falha:
        "Sin la retroversión inicial, el estiramiento se va todo a la lumbar en hiperextensión y el psoas no recibe ninguna tensión. Es el error más común de toda la biblioteca.",
    },
    "07": {
      nome: "Dead bug",
      dose: "3×8 por lado · muy lento · diario",
      alvo: "Abdominales profundos y control lumbopélvico",
      como: "Boca arriba, lumbar en contacto con el suelo de principio a fin. Extiende brazo y pierna opuestos mientras exhalas, y vuelve sin prisa. La respiración es parte del ejercicio.",
      falha:
        "En el momento en que la lumbar se despega del suelo, la serie terminó. Reduce el rango del miembro en lugar de aumentar las repeticiones.",
    },
    "08": {
      nome: "Puente de glúteo e hip thrust",
      dose: "3×10–12 · desde la semana 2",
      alvo: "Glúteo mayor",
      como: "Sube hasta alinear rodilla, cadera y hombro, terminando el movimiento con el glúteo y no con la lumbar. Costillas abajo en la parte alta, mentón ligeramente hacia atrás. Pausa de un segundo arriba.",
      falha:
        "Si lo sientes en la lumbar, estás subiendo demasiado o iniciando con los erectores. Reduce el rango y piensa en empujar el suelo con los talones.",
    },
    "09": {
      nome: "Prone press-up (extensión lumbar)",
      dose: "2×10 · 3 s arriba · diario",
      alvo: "Extensión lumbar",
      como: "Boca abajo, manos debajo de los hombros. Extiende los codos manteniendo la pelvis en contacto con el suelo, restaurando la lordosis lumbar. Sube solo hasta donde la pelvis siga en el suelo.",
      falha:
        "Contraindicado en quien tiene anteversión pélvica marcada. Es el ejercicio que más daño hace cuando se aplica al patrón equivocado: confirma el test de la pared antes.",
    },
    "10": {
      nome: "Bird dog",
      dose: "3×8 por lado · desde la semana 1",
      alvo: "Control antirrotación del tronco",
      como: "En cuatro apoyos, extiende brazo y pierna opuestos manteniendo el tronco completamente inmóvil. Un vaso de agua apoyado en la lumbar no debería derramarse.",
      falha:
        "La mejora está en no rotar la pelvis, no en subir más el miembro. Si la cadera del lado de la pierna extendida sube, reduce el rango.",
    },
    "11": {
      nome: "Open book (rotación torácica de lado)",
      dose: "2×10 por lado · diario",
      alvo: "Rotación torácica",
      como: "De lado, caderas y rodillas a 90° con la rodilla de arriba apoyada en un rodillo. Brazos extendidos al frente, palmas juntas. Abre el brazo de arriba en arco hasta el suelo del lado opuesto, exhalando.",
      falha:
        "Si la rodilla de arriba se despega del rodillo, la rotación pasó a la lumbar y la torácica no recibió nada. Mantén la rodilla fija aunque pierdas la mitad del rango.",
    },
    "12": {
      nome: "Prone Y y prone T",
      dose: "3×12 · carga ligera (1–3 kg) · desde la semana 3",
      alvo: "Trapecio inferior y medio",
      como: "Boca abajo en un banco inclinado o en el suelo. En la posición Y, brazos a 120° con los pulgares hacia arriba; en la T, brazos a 90°. Eleva sin encoger los hombros, iniciando desde la escápula.",
      falha:
        "Encoger los hombros durante la subida transfiere el trabajo al trapecio superior, que ya está sobrecargado. Carga ligera de verdad: de uno a tres kilos es suficiente.",
    },
    C1: {
      nome: "Bisagra de cadera con bastón",
      dose: "3×10 · lento · diario",
      alvo: "Patrón para levantar peso del suelo",
      como: "Bastón en la espalda tocando la cabeza, entre las escápulas y el sacro. Rodillas ligeramente flexionadas, lleva la cadera hacia atrás hasta sentir la parte posterior del muslo, sin perder ninguno de los tres contactos. Vuelve empujando el suelo.",
      falha:
        "Si el bastón se despega de la cabeza o del sacro, doblaste la columna en lugar de la cadera. Baja menos.",
    },
    C2: {
      nome: "Carga unilateral (maleta)",
      dose: "3×30 m por lado · carga moderada",
      alvo: "Estabilizadores laterales del tronco",
      como: "Un peso en una sola mano, brazo suelto al lado del cuerpo. Camina despacio con los hombros nivelados y el tronco sin inclinarse hacia ningún lado.",
      falha:
        "Si el hombro del lado del peso cae o el tronco se inclina hacia el lado opuesto, la carga es demasiado alta. Es exactamente la compensación que enseña el bolso al hombro.",
    },
  },
  en: {
    "01": {
      nome: "Chin tuck (cervical retraction)",
      dose: "3×10 · 5 s hold · daily",
      alvo: "Deep cervical flexors",
      como: "Draw your chin straight back, making a double chin, and hold. The head glides back over the neck; it doesn't rotate or tilt.",
      falha:
        "If the chin drops instead of drawing back, the work has shifted to the superficial flexors and the exercise no longer does anything. Film yourself from the side in the first session.",
    },
    "02": {
      nome: "Thoracic extension on a foam roller",
      dose: "2×10 breaths · 3 segments · daily",
      alvo: "Thoracic mobility",
      como: "Roller across your spine at mid-back, hands behind your head and glutes on the floor. Exhale and let your spine mold over the roller without forcing. Then move the roller up two finger-widths and repeat.",
      falha:
        "Roller below the last rib. On the lower back, this exercise forces exactly the hyperextension you want to avoid — and that's where most people put it.",
    },
    "03": {
      nome: "Serratus wall slide",
      dose: "3×10 · slow · from week 1",
      alvo: "Serratus anterior and lower trapezius",
      como: "Back against the wall with four points of contact: back of the head, upper back, sacrum and forearms. Slide your forearms up while keeping every contact. At the top, push lightly into the wall.",
      falha:
        "The useful range is the one that keeps all four contacts — not the maximum. Going higher by arching your lower back shifts the work to the erectors.",
    },
    "04": {
      nome: "Face pull",
      dose: "3×12–15 · moderate load · from week 3",
      alvo: "Middle trapezius, rhomboids, external rotators",
      como: "Pull to eye level with your elbows above your wrists, finishing in external rotation with the shoulder blades together and down. Pause for one second at the end. It's the only exercise on this list worth keeping forever.",
      falha:
        "If the upper traps shrug and the shoulders rise toward the ears, the load is too heavy. Go lighter and prioritize the end position.",
    },
    "05": {
      nome: "Doorway pec stretch",
      dose: "3×30–45 s per side · daily",
      alvo: "Pectoralis major and minor",
      como: "Forearm on the door frame, elbow at shoulder height at 90°. Step forward and rotate your torso away. Repeat with the elbow higher for the clavicular fibers.",
      falha:
        "You should feel it in the chest, never in the front of the shoulder. Pain at the front of the shoulder means the joint capsule is taking the tension — reduce the range.",
    },
    "06": {
      nome: "Half-kneeling hip flexor stretch",
      dose: "3×30–45 s per side · daily",
      alvo: "Iliopsoas and rectus femoris",
      como: "Back knee on the floor, front foot ahead of the knee. Tuck the pelvis first — squeeze the back glute and bring the pubic bone up — and only then shift your body forward. Ribs down the whole time.",
      falha:
        "Without the initial tuck, the stretch goes entirely into a hyperextended lower back and the psoas gets no tension at all. It's the most common mistake in the whole library.",
    },
    "07": {
      nome: "Dead bug",
      dose: "3×8 per side · very slow · daily",
      alvo: "Deep abdominals and lumbopelvic control",
      como: "Lying on your back, lower back in contact with the floor from start to finish. Extend the opposite arm and leg as you exhale, and return without rushing. Breathing is part of the exercise.",
      falha:
        "The moment your lower back lifts off the floor, the set is over. Shorten the limb's range instead of adding reps.",
    },
    "08": {
      nome: "Glute bridge and hip thrust",
      dose: "3×10–12 · from week 2",
      alvo: "Gluteus maximus",
      como: "Rise until knee, hip and shoulder line up, finishing the movement with your glutes, not your lower back. Ribs down at the top, chin slightly tucked. Pause for one second at the top.",
      falha:
        "If you feel it in your lower back, you're going too high or initiating with the erectors. Shorten the range and think about pushing the floor away with your heels.",
    },
    "09": {
      nome: "Prone press-up (lumbar extension)",
      dose: "2×10 · 3 s at the top · daily",
      alvo: "Lumbar extension",
      como: "Lying face down, hands under your shoulders. Straighten your elbows while keeping the pelvis on the floor, restoring the lumbar curve. Go up only as far as the pelvis stays down.",
      falha:
        "Contraindicated for anyone with marked anterior pelvic tilt. It's the exercise that does the most harm when applied to the wrong pattern — confirm the wall test first.",
    },
    "10": {
      nome: "Bird dog",
      dose: "3×8 per side · from week 1",
      alvo: "Trunk anti-rotation control",
      como: "On all fours, extend the opposite arm and leg while keeping your torso completely still. A glass of water resting on your lower back shouldn't spill.",
      falha:
        "The gain is in not rotating the pelvis, not in lifting the limb higher. If the hip on the side of the extended leg rises, reduce the range.",
    },
    "11": {
      nome: "Open book (side-lying thoracic rotation)",
      dose: "2×10 per side · daily",
      alvo: "Thoracic rotation",
      como: "Lying on your side, hips and knees at 90° with the top knee resting on a roller. Arms straight out in front, palms together. Open the top arm in an arc to the floor on the opposite side, exhaling.",
      falha:
        "If the top knee lifts off the roller, the rotation has moved to the lower back and the thoracic spine got nothing. Keep the knee pinned even if you lose half the range.",
    },
    "12": {
      nome: "Prone Y and prone T",
      dose: "3×12 · light load (1–3 kg) · from week 3",
      alvo: "Lower and middle trapezius",
      como: "Face down on an incline bench or on the floor. In the Y, arms at 120° with thumbs up; in the T, arms at 90°. Lift without shrugging, leading with the shoulder blade.",
      falha:
        "Shrugging on the way up shifts the work to the upper traps, which are already overloaded. Truly light load: one to three kilos is enough.",
    },
    C1: {
      nome: "Hip hinge with a dowel",
      dose: "3×10 · slow · daily",
      alvo: "The pattern for lifting from the floor",
      como: "Dowel along your back touching your head, between the shoulder blades and the sacrum. Knees slightly bent, push your hips back until you feel the back of your thighs, without losing any of the three contacts. Return by pushing the floor away.",
      falha:
        "If the dowel leaves your head or sacrum, you bent your spine instead of your hips. Don't go as deep.",
    },
    C2: {
      nome: "Suitcase carry",
      dose: "3×30 m per side · moderate load",
      alvo: "Lateral trunk stabilizers",
      como: "A weight in one hand only, arm hanging at your side. Walk slowly with level shoulders and your torso not leaning to either side.",
      falha:
        "If the shoulder on the weighted side drops or your torso leans the other way, the load is too heavy. It's exactly the compensation a shoulder bag teaches.",
    },
  },
};

function traduzirExercicio(e: Exercicio, idioma: Idioma): Exercicio {
  if (idioma === "pt") return e;
  const t = EXERCICIOS_TXT[idioma][e.n];
  return t ? { ...e, ...t } : e;
}

/** Biblioteca do Raio-X filtrada pelos padrões, no idioma pedido. */
export function exerciciosDoPadrao(sel: PadraoId[], idioma: Idioma): Exercicio[] {
  return exerciciosDePt(sel).map((e) => traduzirExercicio(e, idioma));
}

/** Exercício por número (biblioteca + C1/C2), no idioma pedido. */
export function exercicioLocal(n: string, idioma: Idioma): Exercicio {
  return traduzirExercicio(exercicioPt(n), idioma);
}

/** Total da biblioteca do livro (para o "x de 12"). */
export const TOTAL_EXERCICIOS = EXERCICIOS.length;

/* ── O teste da parede ─────────────────────────────────────── */

export type Teste = {
  titulo: string;
  comoFazer: string;
  perguntas: {
    id: string;
    pergunta: string;
    opcoes: { rotulo: string; padrao: PadraoId | null }[];
  }[];
};

const TESTE_TXT: Record<
  Outro,
  { titulo: string; comoFazer: string; perguntas: Record<string, { pergunta: string; opcoes: string[] }> }
> = {
  es: {
    titulo: "El test de la pared",
    comoFazer:
      "De espaldas a la pared, talones a cinco u ocho centímetros de ella, pies al ancho de la cadera. Apóyate y comprueba los puntos de contacto.",
    perguntas: {
      nuca: {
        pergunta: "¿Puedes apoyar la nuca sin levantar el mentón?",
        opcoes: ["Sí, sin esfuerzo", "Solo levantando el mentón"],
      },
      omoplatas: {
        pergunta: "¿Las escápulas tocan la pared sin forzar?",
        opcoes: ["Sí, de forma natural", "Solo forzando"],
      },
      lombar: {
        pergunta: "¿Pasa la mano detrás de la lumbar?",
        opcoes: ["Pasa justa, sin holgura", "Pasa entera y holgada", "No pasa ni la mano"],
      },
    },
  },
  en: {
    titulo: "The wall test",
    comoFazer:
      "Stand with your back to a wall, heels five to eight centimeters away from it, feet hip-width apart. Lean back and check the points of contact.",
    perguntas: {
      nuca: {
        pergunta: "Can the back of your head touch the wall without lifting your chin?",
        opcoes: ["Yes, easily", "Only by lifting my chin"],
      },
      omoplatas: {
        pergunta: "Do your shoulder blades touch the wall without forcing?",
        opcoes: ["Yes, naturally", "Only by forcing"],
      },
      lombar: {
        pergunta: "Does your hand fit behind your lower back?",
        opcoes: ["Just barely, snug", "Easily, with room to spare", "Not even my hand fits"],
      },
    },
  },
};

export function teste(idioma: Idioma): Teste {
  const t = idioma === "pt" ? null : TESTE_TXT[idioma];
  return {
    titulo: t?.titulo ?? TESTE.titulo,
    comoFazer: t?.comoFazer ?? TESTE.comoFazer,
    perguntas: TESTE.perguntas.map((p) => ({
      id: p.id,
      pergunta: t?.perguntas[p.id]?.pergunta ?? p.pergunta,
      opcoes: p.opcoes.map((o, i) => ({
        rotulo: t?.perguntas[p.id]?.opcoes[i] ?? o.rotulo,
        padrao: o.padrao,
      })),
    })),
  };
}

/* ── Fases, expectativa, sinais, aviso, promessa ───────────── */

type Fase = { fase: string; semanas: string; objetivo: string; onde: string; dose: string };

const FASES_TXT: Record<Outro, Omit<Fase, "fase">[]> = {
  es: [
    {
      semanas: "Semanas 1–2",
      objetivo: "Movilidad y conciencia",
      onde: "Calentamiento de todas las sesiones, más 8 min diarios",
      dose: "Rango sin carga. 2 series por ejercicio.",
    },
    {
      semanas: "Semanas 3–5",
      objetivo: "Fuerza en lo que está inhibido",
      onde: "Sustituye accesorios del entrenamiento",
      dose: "3×10–15 con una carga que permita control total.",
    },
    {
      semanas: "Semanas 6–8",
      objetivo: "Carga y mantenimiento",
      onde: "Integrado en los básicos, con rango completo",
      dose: "Progresa la carga. La dosis diaria baja a 4 min.",
    },
  ],
  en: [
    {
      semanas: "Weeks 1–2",
      objetivo: "Mobility and awareness",
      onde: "Warm-up for every session, plus 8 min a day",
      dose: "Range without load. 2 sets per exercise.",
    },
    {
      semanas: "Weeks 3–5",
      objetivo: "Strength where it's inhibited",
      onde: "Replaces accessory work in your training",
      dose: "3×10–15 with a load that allows full control.",
    },
    {
      semanas: "Weeks 6–8",
      objetivo: "Load and maintenance",
      onde: "Built into the main lifts, through full range",
      dose: "Progress the load. The daily dose drops to 4 min.",
    },
  ],
};

export function fases(idioma: Idioma): Fase[] {
  if (idioma === "pt") return FASES.map((f) => ({ ...f }));
  return FASES.map((f, i) => ({ fase: f.fase, ...FASES_TXT[idioma][i] }));
}

type Expectativa = { prazo: string; muda: string };

const EXPECTATIVA_TXT: Record<Outro, Expectativa[]> = {
  es: [
    {
      prazo: "Semanas 1–2",
      muda: "Conciencia postural y alivio puntual después de la sesión. Nada estructural todavía.",
    },
    {
      prazo: "Semanas 3–5",
      muda: "Ganancia medible de rango torácico y de cadera. Mejor posicionamiento en los básicos.",
    },
    {
      prazo: "Semanas 6–12",
      muda: "Cambio visible en reposo, sostenido por fuerza: el único que dura.",
    },
  ],
  en: [
    {
      prazo: "Weeks 1–2",
      muda: "Postural awareness and short-term relief after each session. Nothing structural yet.",
    },
    {
      prazo: "Weeks 3–5",
      muda: "Measurable gains in thoracic and hip range. Better positioning in the main lifts.",
    },
    {
      prazo: "Weeks 6–12",
      muda: "Visible change at rest, backed by strength — the only kind that lasts.",
    },
  ],
};

export function expectativa(idioma: Idioma): Expectativa[] {
  return idioma === "pt" ? EXPECTATIVA.map((x) => ({ ...x })) : EXPECTATIVA_TXT[idioma];
}

const SINAIS_TXT: Record<Outro, string[]> = {
  es: [
    "Dolor irradiado al brazo o la pierna, con hormigueo o adormecimiento",
    "Pérdida de fuerza objetiva en un miembro",
    "Dolor nocturno que despierta, o que no alivia al cambiar de posición",
    "Dolor tras un traumatismo: caída, accidente, impacto",
    "Fiebre, pérdida de peso no intencionada o antecedentes oncológicos",
    "Dolor torácico asociado al esfuerzo, falta de aire o palpitaciones",
    "Alteración del control de esfínteres o adormecimiento en la región perineal: urgencia médica inmediata",
  ],
  en: [
    "Pain radiating into an arm or leg, with tingling or numbness",
    "Objective loss of strength in a limb",
    "Night pain that wakes you up, or that doesn't ease when you change position",
    "Pain after trauma — a fall, accident or impact",
    "Fever, unintentional weight loss or a history of cancer",
    "Chest pain linked to exertion, shortness of breath or palpitations",
    "Changes in bladder or bowel control, or numbness in the groin or saddle area — an immediate medical emergency",
  ],
};

export function sinaisDeAlerta(idioma: Idioma): readonly string[] {
  return idioma === "pt" ? SINAIS_DE_ALERTA : SINAIS_TXT[idioma];
}

const AVISO_TXT: Record<Idioma, string> = {
  pt: AVISO,
  es: "Esto es material educativo de entrenamiento físico. No es un diagnóstico, no es una prescripción médica y no sustituye la evaluación presencial de un médico o fisioterapeuta.",
  en: "This is educational material on physical training. It is not a diagnosis or a medical prescription, and it does not replace an in-person assessment by a physician or physical therapist.",
};

export const aviso = (idioma: Idioma) => AVISO_TXT[idioma];

const PROMESSA_TXT: Record<Idioma, string> = {
  pt: PROMESSA,
  es: "La promesa honesta no es que vas a quedar recto. Es que te vas a mover mejor, tolerar más y entrenar con rango completo. Quien promete corrección postural en dos semanas está vendiendo.",
  en: "The honest promise isn't that you'll end up standing perfectly straight. It's that you'll move better, tolerate more and train through full range. Anyone promising postural correction in two weeks is selling something.",
};

export const promessa = (idioma: Idioma) => PROMESSA_TXT[idioma];

/* ── Situações do dia a dia ────────────────────────────────── */

type TextoSituacao = Pick<
  Situacao,
  "titulo" | "curto" | "frase" | "incomoda" | "oQueAcontece" | "ajustes" | "regra"
>;

const SITUACOES_TXT: Record<Outro, Record<string, TextoSituacao>> = {
  es: {
    computador: {
      titulo: "Sentado frente a la computadora",
      curto: "Computadora",
      frase: "Ocho horas de pantalla y la cabeza va, centímetro a centímetro, a su encuentro.",
      incomoda: ["Cuello", "Entre las escápulas", "Lumbar"],
      oQueAcontece:
        "Con la pantalla baja, la cabeza se adelanta y el tronco se redondea para alcanzarla. La pelvis se desliza hacia el borde del asiento y la lumbar pierde el apoyo del respaldo. La posición en sí no lesiona; la molestia viene de sostenerla durante horas sin cambiar.",
      ajustes: [
        {
          titulo: "Pantalla a la altura de los ojos",
          texto: "La parte superior del monitor en la línea de los ojos, a un brazo de distancia. Con laptop, soporte y teclado aparte.",
        },
        {
          titulo: "Cadera al fondo de la silla",
          texto: "Siéntate con la cadera pegada al respaldo, los pies enteros en el suelo y las rodillas a la altura de la cadera o un poco por debajo.",
        },
        {
          titulo: "Codos cerca del cuerpo",
          texto: "Antebrazos apoyados en la mesa, codos cerca de 90°. Hombros sueltos, sin subir hacia las orejas.",
        },
      ],
      regra: "Levántate cada 30 a 45 minutos. La mejor postura es la siguiente.",
    },
    celular: {
      titulo: "Mirando el celular",
      curto: "Celular",
      frase: "La cabeza pesa unos cinco kilos. Inclinada hacia la pantalla, el cuello sostiene bastante más que eso.",
      incomoda: ["Nuca", "Parte alta de los hombros", "Dolor de cabeza"],
      oQueAcontece:
        "Mirar hacia abajo flexiona el cuello y saca la cabeza de la línea del tronco. Cuanto mayor el ángulo, mayor la palanca que sostienen los músculos de la nuca. Durante minutos es irrelevante; durante horas seguidas, todos los días, es el origen más común de la tensión en la base del cráneo.",
      ajustes: [
        {
          titulo: "Sube la pantalla, no bajes la cabeza",
          texto: "Lleva el celular cerca de la altura de los ojos. Los ojos bajan, el cuello se queda.",
        },
        {
          titulo: "Codo apoyado",
          texto: "Apoya el codo en el tronco o sostén el brazo con la otra mano. Sin apoyo, el brazo se cansa y el celular vuelve a bajar.",
        },
        {
          titulo: "Lleva el mentón atrás de vez en cuando",
          texto: "Un chin tuck cada tanto devuelve la cabeza sobre los hombros. Sin forzar, sin mirar hacia arriba.",
        },
      ],
      regra: "No está prohibido mirar hacia abajo. Hacerlo durante horas sale caro.",
    },
    "em-pe": {
      titulo: "De pie mucho tiempo",
      curto: "De pie",
      frase: "Fila, mostrador, cocina: el cuerpo busca descanso colgado de un solo lado.",
      incomoda: ["Lumbar", "Lateral de la cadera", "Pies"],
      oQueAcontece:
        "Para ahorrar energía, el peso se va todo a una pierna y la cadera del otro lado cae. La lumbar se inclina para compensar y los ligamentos sostienen lo que los músculos dejaron de sostener. No está mal descansar sobre una pierna; lo malo es hacerlo siempre sobre la misma.",
      ajustes: [
        {
          titulo: "Alterna la pierna de apoyo",
          texto: "Cambia de lado con frecuencia. La asimetría solo pesa cuando es siempre la misma.",
        },
        {
          titulo: "Un pie en un escalón",
          texto: "Un apoyo bajo, de 10 a 20 cm, alivia la lumbar de quien pasa mucho tiempo de pie. Cambia de pie de vez en cuando.",
        },
        {
          titulo: "Muévete en el sitio",
          texto: "Pequeñas transferencias de peso, subir de puntillas, flexionar las rodillas. Movimiento barato y constante.",
        },
      ],
      regra: "De pie o sentado, el problema es el mismo: tiempo quieto.",
    },
    bolsa: {
      titulo: "Bolso en un solo hombro",
      curto: "Bolso",
      frase: "El hombro sube para sujetar la correa. El tronco se inclina para equilibrar el peso.",
      incomoda: ["Parte alta del hombro", "Cuello", "Costado de la cintura"],
      oQueAcontece:
        "Para que la correa no se resbale, el trapecio superior eleva el hombro y se queda contraído todo el trayecto. El tronco se inclina hacia el lado opuesto para equilibrar la carga. Con poco peso y de vez en cuando, no pasa nada; con la laptop todos los días y siempre en el mismo hombro, se vuelve un patrón.",
      ajustes: [
        {
          titulo: "Mochila en los dos hombros",
          texto: "Correas ajustadas para que la mochila quede pegada a la espalda, con el fondo a la altura de la cintura.",
        },
        {
          titulo: "Si es bolso, alterna",
          texto: "Cambia de hombro o de mano en cada tramo. Una correa cruzada reparte mejor que una correa corta en un hombro.",
        },
        {
          titulo: "Carga menos",
          texto: "Saca lo que no necesitas. Una referencia práctica: hasta cerca del 10 % del peso corporal.",
        },
      ],
      regra: "Asimetría de vez en cuando es entrenamiento. Todos los días del mismo lado es hábito.",
    },
    "pegar-peso": {
      titulo: "Levantando peso del suelo",
      curto: "Levantar peso",
      frase: "La caja lejos, las piernas estiradas, la columna haciendo el trabajo de la cadera.",
      incomoda: ["Lumbar", "Parte posterior del muslo"],
      oQueAcontece:
        "Con la carga lejos de los pies y las rodillas bloqueadas, la palanca sobre la lumbar crece y quien levanta es la columna. Doblar la columna no está prohibido: está hecha para eso. El riesgo aparece cuando la carga es pesada, está lejos y llega sin aviso, en un cuerpo que no entrena ese movimiento.",
      ajustes: [
        {
          titulo: "Acerca la carga",
          texto: "Acércate hasta que la caja quede entre los pies o pegada a las espinillas. Distancia es palanca.",
        },
        {
          titulo: "Flexiona cadera y rodillas",
          texto: "Lleva la cadera hacia atrás y baja con las rodillas flexionadas. El pecho apunta al frente, no al suelo.",
        },
        {
          titulo: "No gires con peso",
          texto: "Primero levanta, después gira con los pies. Rotar el tronco cargado es la combinación que más molesta.",
        },
      ],
      regra: "La columna aguanta mucho. Aguanta más cuando la cadera también trabaja.",
    },
    dormir: {
      titulo: "Durmiendo de lado",
      curto: "Dormir",
      frase: "Almohada baja, cabeza cayendo, rodilla de arriba tirando de la cadera.",
      incomoda: ["Cuello al despertar", "Hombro de abajo", "Lumbar"],
      oQueAcontece:
        "Con la almohada más baja que el ancho del hombro, la cabeza cuelga y el cuello pasa la noche inclinado. La rodilla de arriba cae hacia delante y rota la pelvis sobre la lumbar. Nadie duerme inmóvil, y no existe una posición perfecta para dormir, pero esos dos detalles despiertan a mucha gente con dolor.",
      ajustes: [
        {
          titulo: "Almohada a la altura del hombro",
          texto: "La altura correcta llena el espacio entre la oreja y el colchón. La cabeza queda en la línea del tronco, ni colgando ni empujada hacia arriba.",
        },
        {
          titulo: "Una almohada entre las rodillas",
          texto: "Mantiene la rodilla de arriba alineada con la cadera y quita la torsión de la pelvis.",
        },
        {
          titulo: "Boca arriba, un apoyo bajo las rodillas",
          texto: "Si duermes de espaldas, una almohada bajo las rodillas relaja la lumbar.",
        },
      ],
      regra: "Duerme en la posición que te deja dormir. Ajusta los apoyos, no a la persona.",
    },
  },
  en: {
    computador: {
      titulo: "Sitting at the computer",
      curto: "Computer",
      frase: "Eight hours of screen time, and your head drifts toward it, centimeter by centimeter.",
      incomoda: ["Neck", "Between the shoulder blades", "Lower back"],
      oQueAcontece:
        "With the screen too low, your head moves forward and your upper back rounds to reach it. The pelvis slides toward the front of the seat and the lower back loses the backrest's support. The position itself doesn't injure you; the discomfort comes from holding it for hours without changing.",
      ajustes: [
        {
          titulo: "Screen at eye level",
          texto: "Top of the monitor at eye level, an arm's length away. On a laptop, use a stand and a separate keyboard.",
        },
        {
          titulo: "Hips all the way back",
          texto: "Sit with your hips against the backrest, feet flat on the floor and knees level with your hips or slightly below.",
        },
        {
          titulo: "Elbows close to your body",
          texto: "Forearms resting on the desk, elbows close to 90°. Shoulders relaxed, not creeping up toward your ears.",
        },
      ],
      regra: "Get up every 30 to 45 minutes. The best posture is the next one.",
    },
    celular: {
      titulo: "Looking at your phone",
      curto: "Phone",
      frase: "Your head weighs about five kilos. Tilted toward the screen, your neck holds a lot more than that.",
      incomoda: ["Back of the neck", "Top of the shoulders", "Headache"],
      oQueAcontece:
        "Looking down flexes the neck and takes the head out of line with the torso. The bigger the angle, the bigger the lever the neck muscles have to hold. For a few minutes it's irrelevant; for hours on end, every day, it's the most common source of tension at the base of the skull.",
      ajustes: [
        {
          titulo: "Bring the screen up, not your head down",
          texto: "Hold your phone closer to eye level. Your eyes drop; your neck stays.",
        },
        {
          titulo: "Elbow supported",
          texto: "Rest your elbow against your torso or support your arm with the other hand. Without support, your arm tires and the phone drops again.",
        },
        {
          titulo: "Tuck your chin now and then",
          texto: "An occasional chin tuck brings your head back over your shoulders. No forcing, no looking up.",
        },
      ],
      regra: "Looking down isn't forbidden. Doing it for hours is costly.",
    },
    "em-pe": {
      titulo: "Standing for a long time",
      curto: "Standing",
      frase: "Lines, counters, kitchens: the body looks for rest by hanging on one side.",
      incomoda: ["Lower back", "Side of the hip", "Feet"],
      oQueAcontece:
        "To save energy, all the weight shifts to one leg and the opposite hip drops. The lower back tilts to compensate and the ligaments hold what the muscles stopped holding. Resting on one leg isn't wrong — always resting on the same one is.",
      ajustes: [
        {
          titulo: "Switch your standing leg",
          texto: "Change sides often. Asymmetry only matters when it's always the same side.",
        },
        {
          titulo: "One foot on a step",
          texto: "A low support, 10 to 20 cm high, eases the lower back for people who stand a lot. Switch feet from time to time.",
        },
        {
          titulo: "Move in place",
          texto: "Small weight shifts, rising onto your toes, bending your knees. Cheap, constant movement.",
        },
      ],
      regra: "Standing or sitting, the problem is the same: time spent still.",
    },
    bolsa: {
      titulo: "Bag on one shoulder",
      curto: "Bag",
      frase: "Your shoulder hikes up to hold the strap. Your torso leans to balance the weight.",
      incomoda: ["Top of the shoulder", "Neck", "Side of the waist"],
      oQueAcontece:
        "To keep the strap from slipping, the upper trapezius lifts the shoulder and stays contracted the whole way. The torso leans to the opposite side to balance the load. With a light load once in a while, no big deal; with a laptop every day, always on the same shoulder, it becomes a pattern.",
      ajustes: [
        {
          titulo: "Backpack on both shoulders",
          texto: "Adjust the straps so the backpack sits snug against your back, with the bottom at waist height.",
        },
        {
          titulo: "If it's a bag, alternate",
          texto: "Switch shoulders or hands every so often. A crossbody strap spreads the load better than a short strap on one shoulder.",
        },
        {
          titulo: "Carry less",
          texto: "Take out what you don't need. A practical reference: up to about 10% of your body weight.",
        },
      ],
      regra: "Asymmetry once in a while is training. Every day on the same side is a habit.",
    },
    "pegar-peso": {
      titulo: "Lifting something off the floor",
      curto: "Lifting",
      frase: "Box far away, legs straight, spine doing the hips' job.",
      incomoda: ["Lower back", "Back of the thigh"],
      oQueAcontece:
        "With the load far from your feet and your knees locked, the lever on your lower back grows and your spine does the lifting. Bending the spine isn't forbidden — it's built for that. The risk shows up when the load is heavy, far away and comes without warning, in a body that doesn't train that movement.",
      ajustes: [
        {
          titulo: "Bring the load close",
          texto: "Step in until the box is between your feet or against your shins. Distance is leverage.",
        },
        {
          titulo: "Bend hips and knees",
          texto: "Push your hips back and lower down with your knees bent. Your chest points forward, not at the floor.",
        },
        {
          titulo: "Don't twist under load",
          texto: "Lift first, then turn with your feet. Rotating your torso while loaded is the combination that causes the most trouble.",
        },
      ],
      regra: "Your spine can take a lot. It takes more when your hips do their share.",
    },
    dormir: {
      titulo: "Sleeping on your side",
      curto: "Sleep",
      frase: "Low pillow, head sagging, top knee pulling the hip down.",
      incomoda: ["Neck on waking", "Bottom shoulder", "Lower back"],
      oQueAcontece:
        "With a pillow lower than your shoulder width, your head sags and your neck spends the night tilted. The top knee drops forward and rotates the pelvis over the lower back. Nobody sleeps still, and there's no perfect sleeping position — but these two details wake a lot of people up in pain.",
      ajustes: [
        {
          titulo: "Pillow at shoulder height",
          texto: "The right height fills the space between your ear and the mattress. Your head stays in line with your torso, neither sagging nor pushed up.",
        },
        {
          titulo: "A pillow between your knees",
          texto: "Keeps the top knee in line with the hip and takes the twist out of the pelvis.",
        },
        {
          titulo: "On your back, support under your knees",
          texto: "If you sleep on your back, a pillow under your knees relaxes the lower back.",
        },
      ],
      regra: "Sleep in whatever position lets you sleep. Adjust the supports, not the person.",
    },
  },
};

export function situacoes(idioma: Idioma): Situacao[] {
  if (idioma === "pt") return SITUACOES;
  const t = SITUACOES_TXT[idioma];
  return SITUACOES.map((s) => ({ ...s, ...t[s.id] }));
}

type Rotina = { titulo: string; texto: string; passos: { tempo: string; exercicio: string }[] };

const ROTINA_TXT: Record<Outro, { titulo: string; texto: string }> = {
  es: {
    titulo: "La pausa de cinco minutos",
    texto:
      "Una secuencia para hacer de pie o en el suelo, entre un bloque de trabajo y otro. No corrige nada por sí sola; saca al cuerpo de la posición en la que estaba, que es la mitad del trabajo.",
  },
  en: {
    titulo: "The five-minute break",
    texto:
      "A sequence to do standing or on the floor, between work blocks. It doesn't fix anything on its own; it gets your body out of the position it was in, which is half the job.",
  },
};

export function rotina(idioma: Idioma): Rotina {
  const passos = ROTINA.passos.map((p) => ({ ...p }));
  if (idioma === "pt") return { titulo: ROTINA.titulo, texto: ROTINA.texto, passos };
  return { ...ROTINA_TXT[idioma], passos };
}

const PRINCIPIO_TXT: Record<Idioma, { titulo: string; texto: string }> = {
  pt: PRINCIPIO,
  es: {
    titulo: "La mejor postura es la siguiente.",
    texto:
      "No existe una posición perfecta que proteja la columna. Los estudios que comparan postura y dolor encuentran una relación débil. Lo que separa a quien siente dolor de quien no lo siente es pasar horas en la misma posición sin fuerza para sostenerla. El ajuste ayuda; el movimiento y el ejercicio resuelven.",
  },
  en: {
    titulo: "The best posture is the next one.",
    texto:
      "There's no perfect position that protects your spine. Studies comparing posture and pain find a weak link. What separates people who hurt from those who don't is spending hours in the same position without the strength to hold it. Adjustments help; movement and exercise solve it.",
  },
};

export const principio = (idioma: Idioma) => PRINCIPIO_TXT[idioma];

/* ── Interface: página /postura ────────────────────────────── */

export const UI_POSTURA: Record<
  Idioma,
  {
    seoTitulo: string;
    seoDescricao: string;
    ogDescricao: string;
    ogAlt: string;
    migalhaAria: string;
    inicio: string;
    migalha: string;
    eyebrow: string;
    h1: [string, string, string];
    sub: [string, string, string];
    stats: [string, string, string];
    rotinaEyebrow: string;
    proximoEyebrow: string;
    proximoTitulo: string;
    proximoTexto: string;
    proximoBotao: string;
    consultoriaEyebrow: string;
    consultoriaTitulo: string;
    consultoriaTexto: string;
    consultoriaBotao: string;
    sinaisTitulo: string;
  }
> = {
  pt: {
    seoTitulo: "Postura no dia a dia: ajustes e exercícios",
    seoDescricao:
      "Computador, celular, em pé, bolsa, pegar peso e dormir: o que acontece com o corpo em cada situação, como ajustar e os exercícios que compensam.",
    ogDescricao:
      "Seis situações do cotidiano, o ajuste de cada uma e os exercícios para os desconfortos mais comuns.",
    ogAlt: "Postura do dia a dia",
    migalhaAria: "Você está em",
    inicio: "Início",
    migalha: "Postura",
    eyebrow: "Guia visual · gratuito",
    h1: ["Postura", "do dia ", "a dia."],
    sub: [
      "As seis situações em que você passa mais horas parado, o que cada uma faz com o corpo e o ajuste que resolve. Toque em",
      "Como arrumar",
      "e veja a postura mudar.",
    ],
    stats: ["Situações", "Min de pausa", "Exercícios"],
    rotinaEyebrow: "Para fazer hoje",
    proximoEyebrow: "Próximo passo",
    proximoTitulo: "Qual é o seu padrão?",
    proximoTexto:
      "Os ajustes daqui servem a todo mundo. Os exercícios de pelve dependem do seu padrão, e alguns são opostos entre si. O teste da parede mostra qual é o seu em cinco minutos.",
    proximoBotao: "Fazer o Raio-X Postural",
    consultoriaEyebrow: "Consultoria",
    consultoriaTitulo: "Treino que corrige enquanto evolui.",
    consultoriaTexto:
      "Os exercícios de postura entram no treino que você já faz, como acessórios, e não como uma rotina a mais.",
    consultoriaBotao: "Começar consultoria ↗",
    sinaisTitulo: "Quando não é postura: sinais para procurar avaliação",
  },
  es: {
    seoTitulo: "Postura diaria: ajustes y ejercicios",
    seoDescricao:
      "Computadora, celular, de pie, bolso, levantar peso y dormir: qué le pasa al cuerpo en cada situación, cómo ajustarlo y los ejercicios que lo compensan.",
    ogDescricao:
      "Seis situaciones cotidianas, el ajuste de cada una y los ejercicios para las molestias más comunes.",
    ogAlt: "Postura del día a día",
    migalhaAria: "Estás en",
    inicio: "Inicio",
    migalha: "Postura",
    eyebrow: "Guía visual · gratis",
    h1: ["Postura", "del día ", "a día."],
    sub: [
      "Las seis situaciones en las que pasas más horas quieto, lo que cada una le hace al cuerpo y el ajuste que lo resuelve. Toca",
      "Cómo corregir",
      "y mira cómo cambia la postura.",
    ],
    stats: ["Situaciones", "Min de pausa", "Ejercicios"],
    rotinaEyebrow: "Para hacer hoy",
    proximoEyebrow: "Siguiente paso",
    proximoTitulo: "¿Cuál es tu patrón?",
    proximoTexto:
      "Los ajustes de aquí sirven para todo el mundo. Los ejercicios de pelvis dependen de tu patrón, y algunos son opuestos entre sí. El test de la pared muestra cuál es el tuyo en cinco minutos.",
    proximoBotao: "Hacer el Rayos-X Postural",
    consultoriaEyebrow: "Asesoría",
    consultoriaTitulo: "Entrenamiento que corrige mientras progresas.",
    consultoriaTexto:
      "Los ejercicios de postura entran en el entrenamiento que ya haces, como accesorios, y no como una rutina más.",
    consultoriaBotao: "Empezar asesoría ↗",
    sinaisTitulo: "Cuando no es postura: señales para buscar evaluación",
  },
  en: {
    seoTitulo: "Everyday posture — the fix for each situation",
    seoDescricao:
      "Computer, phone, standing, bags, lifting and sleeping: what happens to your body in each situation, how to adjust and the exercises that compensate.",
    ogDescricao:
      "Six everyday situations, the adjustment for each one and the exercises for the most common aches.",
    ogAlt: "Everyday posture",
    migalhaAria: "You are here",
    inicio: "Home",
    migalha: "Posture",
    eyebrow: "Visual guide · free",
    h1: ["Everyday", "", "posture."],
    sub: [
      "The six situations where you spend the most hours standing or sitting still, what each one does to your body and the adjustment that fixes it. Tap",
      "How to fix",
      "and watch the posture change.",
    ],
    stats: ["Situations", "Min break", "Exercises"],
    rotinaEyebrow: "To do today",
    proximoEyebrow: "Next step",
    proximoTitulo: "What's your pattern?",
    proximoTexto:
      "These adjustments work for everyone. The pelvic exercises depend on your pattern, and some are opposites. The wall test shows yours in five minutes.",
    proximoBotao: "Take the Posture X-Ray",
    consultoriaEyebrow: "Coaching",
    consultoriaTitulo: "Training that corrects as you progress.",
    consultoriaTexto:
      "The posture exercises go into the training you already do, as accessory work — not as one more routine.",
    consultoriaBotao: "Start coaching ↗",
    sinaisTitulo: "When it's not posture: signs to get checked",
  },
};

/* ── Interface: componente PosturaCotidiano ────────────────── */

export const UI_COTIDIANO: Record<
  Idioma,
  {
    navAria: string;
    seloCerto: string;
    seloErrado: string;
    botaoErrado: string;
    botaoCerto: string;
    comoArrumar: string;
    exercicios: string;
    ondeFalha: string;
  }
> = {
  pt: {
    navAria: "Situações",
    seloCerto: "Ajustado",
    seloErrado: "Como costuma ficar",
    botaoErrado: "Como fica",
    botaoCerto: "Como arrumar",
    comoArrumar: "Como arrumar",
    exercicios: "Exercícios para compensar",
    ondeFalha: "Onde falha: ",
  },
  es: {
    navAria: "Situaciones",
    seloCerto: "Ajustado",
    seloErrado: "Cómo suele quedar",
    botaoErrado: "Cómo queda",
    botaoCerto: "Cómo corregir",
    comoArrumar: "Cómo corregir",
    exercicios: "Ejercicios para compensar",
    ondeFalha: "Dónde falla: ",
  },
  en: {
    navAria: "Situations",
    seloCerto: "Adjusted",
    seloErrado: "How it usually looks",
    botaoErrado: "How it looks",
    botaoCerto: "How to fix",
    comoArrumar: "How to fix",
    exercicios: "Exercises to compensate",
    ondeFalha: "Where it fails: ",
  },
};

/* ── Interface: página /raio-x-postural ────────────────────── */

export const UI_RAIOX_PAGINA: Record<
  Idioma,
  {
    seoTitulo: string;
    seoDescricao: string;
    ogDescricao: string;
    nome: string;
    migalhaAria: string;
    inicio: string;
    eyebrow: string;
    h1: [string, string];
    sub: string;
    chips: [string, string, string];
    linkPostura: string;
    /** JSON-LD */
    ldDescricao: string;
    ldSistema: string;
    ldRecursos: string[];
  }
> = {
  pt: {
    seoTitulo: "Raio-X Postural: seu padrão em 5 minutos",
    seoDescricao:
      "Identifique seu padrão postural pelo teste da parede e receba os exercícios certos, com dose e ponto de falha. Gratuito, sem cadastro, baseado em evidência.",
    ogDescricao:
      "Quatro padrões, doze exercícios e um protocolo de oito semanas que entra no treino que você já faz.",
    nome: "Raio-X Postural",
    migalhaAria: "Você está em",
    inicio: "Início",
    eyebrow: "Ferramenta gratuita",
    h1: ["Raio-X", "Postural."],
    sub: "Descubra o seu padrão em cinco minutos, sem equipamento, e receba os exercícios que correspondem a ele — com dose, execução e o erro que anula cada um.",
    chips: ["4 padrões", "12 exercícios", "Protocolo de 8 semanas"],
    linkPostura: "Antes do teste: a postura do dia a dia ↗",
    ldDescricao:
      "Identifica o padrão postural pelo teste da parede e devolve os exercícios correspondentes, com dose e ponto de falha.",
    ldSistema: "Todos — roda no navegador",
    ldRecursos: [
      "Teste da parede guiado",
      "Quatro padrões posturais ilustrados",
      "Doze exercícios com dose e execução",
      "Protocolo de oito semanas em três fases",
    ],
  },
  es: {
    seoTitulo: "Rayos-X Postural: tu patrón en 5 minutos",
    seoDescricao:
      "Identifica tu patrón postural con el test de la pared y recibe los ejercicios correctos, con dosis y punto de falla. Gratis, sin registro, basado en evidencia.",
    ogDescricao:
      "Cuatro patrones, doce ejercicios y un protocolo de ocho semanas que entra en el entrenamiento que ya haces.",
    nome: "Rayos-X Postural",
    migalhaAria: "Estás en",
    inicio: "Inicio",
    eyebrow: "Herramienta gratuita",
    h1: ["Rayos-X", "Postural."],
    sub: "Descubre tu patrón en cinco minutos, sin equipo, y recibe los ejercicios que le corresponden, con dosis, ejecución y el error que anula cada uno.",
    chips: ["4 patrones", "12 ejercicios", "Protocolo de 8 semanas"],
    linkPostura: "Antes del test: la postura del día a día ↗",
    ldDescricao:
      "Identifica el patrón postural con el test de la pared y devuelve los ejercicios correspondientes, con dosis y punto de falla.",
    ldSistema: "Todos: funciona en el navegador",
    ldRecursos: [
      "Test de la pared guiado",
      "Cuatro patrones posturales ilustrados",
      "Doce ejercicios con dosis y ejecución",
      "Protocolo de ocho semanas en tres fases",
    ],
  },
  en: {
    seoTitulo: "Posture X-Ray: your pattern in 5 minutes",
    seoDescricao:
      "Identify your postural pattern with the wall test and get the right exercises, with dosage and failure point. Free, no sign-up, evidence-based.",
    ogDescricao:
      "Four patterns, twelve exercises and an eight-week protocol that fits into the training you already do.",
    nome: "Posture X-Ray",
    migalhaAria: "You are here",
    inicio: "Home",
    eyebrow: "Free tool",
    h1: ["Posture", "X-Ray."],
    sub: "Find your pattern in five minutes, no equipment needed, and get the exercises that match it — with dosage, technique and the mistake that cancels out each one.",
    chips: ["4 patterns", "12 exercises", "8-week protocol"],
    linkPostura: "Before the test: everyday posture ↗",
    ldDescricao:
      "Identifies your postural pattern with the wall test and returns the matching exercises, with dosage and failure point.",
    ldSistema: "All — runs in the browser",
    ldRecursos: [
      "Guided wall test",
      "Four illustrated postural patterns",
      "Twelve exercises with dosage and technique",
      "Eight-week protocol in three phases",
    ],
  },
};

/* ── Interface: componente RaioXPostural ───────────────────── */

export const UI_RAIOX: Record<
  Idioma,
  {
    alertaTitulo: string;
    alertaIntro: string;
    identificar: string;
    qualPadrao: string;
    modoEscolher: string;
    modoTeste: string;
    neutro: string;
    escolherIntro: string;
    protocolo: string;
    p1p2: string;
    curto: string;
    fraco: string;
    atencao: string;
    naoFazer: string;
    erros: string;
    seusExercicios: (n: number, total: number) => string;
    pontoFalha: string;
    semanas: string;
    expectativa: string;
    ponte: string;
    cta: string;
    livro: string;
  }
> = {
  pt: {
    alertaTitulo: "Antes de começar: quando isto não é postura",
    alertaIntro:
      "Há quadros que se parecem com problemas posturais e não são. Interrompe e procura avaliação clínica se houver:",
    identificar: "01 / Identificar",
    qualPadrao: "Qual é o teu padrão?",
    modoEscolher: "Já sei — escolher na imagem",
    modoTeste: "Não sei — fazer o teste",
    neutro:
      "Os três pontos deram neutro. Não há padrão a corrigir — o que não quer dizer que não valha treinar mobilidade. Os exercícios dos padrões 1 e 2 são seguros em qualquer cenário.",
    escolherIntro:
      "Perfil direito, comparando com o teu. A linha tracejada é o fio de prumo. Resiste à tentação de te encaixares no padrão mais dramático — a maior parte das pessoas tem uma versão ligeira de um destes, ou uma combinação de dois.",
    protocolo: "02 / O teu protocolo",
    p1p2: "Os padrões 1 e 2 aparecem quase sempre juntos — a cabeça avança para compensar a torácica curvada. Janda chamou-lhe síndrome cruzada superior. Trata os dois em bloco.",
    curto: "Curto ou sobrecarregado",
    fraco: "Fraco ou inibido",
    atencao: "Atenção.",
    naoFazer: "Não fazer neste padrão",
    erros: "Erros frequentes neste padrão",
    seusExercicios: (n, total) => `Os teus exercícios · ${n} de ${total}`,
    pontoFalha: "Ponto de falha.",
    semanas: "As oito semanas",
    expectativa: "Expectativa realista",
    ponte:
      "O protocolo está aqui inteiro. O que muda o resultado é integrá-lo no treino que já fazes — e ajustar quando o corpo responde.",
    cta: "Começar consultoria",
    livro: "Ler o livro completo",
  },
  es: {
    alertaTitulo: "Antes de empezar: cuando esto no es postura",
    alertaIntro:
      "Hay cuadros que parecen problemas posturales y no lo son. Detente y busca evaluación clínica si hay:",
    identificar: "01 / Identificar",
    qualPadrao: "¿Cuál es tu patrón?",
    modoEscolher: "Ya lo sé: elegir en la imagen",
    modoTeste: "No lo sé: hacer el test",
    neutro:
      "Los tres puntos dieron neutro. No hay un patrón que corregir, lo que no quiere decir que no valga la pena entrenar movilidad. Los ejercicios de los patrones 1 y 2 son seguros en cualquier escenario.",
    escolherIntro:
      "Perfil derecho, para comparar con el tuyo. La línea discontinua es la plomada. Resiste la tentación de encajarte en el patrón más dramático: la mayoría de las personas tiene una versión leve de uno de estos, o una combinación de dos.",
    protocolo: "02 / Tu protocolo",
    p1p2: "Los patrones 1 y 2 aparecen casi siempre juntos: la cabeza se adelanta para compensar la torácica curvada. Janda lo llamó síndrome cruzado superior. Trata los dos en bloque.",
    curto: "Acortado o sobrecargado",
    fraco: "Débil o inhibido",
    atencao: "Atención.",
    naoFazer: "No hacer en este patrón",
    erros: "Errores frecuentes en este patrón",
    seusExercicios: (n, total) => `Tus ejercicios · ${n} de ${total}`,
    pontoFalha: "Punto de falla.",
    semanas: "Las ocho semanas",
    expectativa: "Expectativa realista",
    ponte:
      "El protocolo está aquí completo. Lo que cambia el resultado es integrarlo en el entrenamiento que ya haces, y ajustarlo cuando el cuerpo responde.",
    cta: "Empezar asesoría",
    livro: "Leer el libro completo",
  },
  en: {
    alertaTitulo: "Before you start: when this isn't posture",
    alertaIntro:
      "Some conditions look like postural problems but aren't. Stop and get a clinical evaluation if you have:",
    identificar: "01 / Identify",
    qualPadrao: "What's your pattern?",
    modoEscolher: "I know — pick from the images",
    modoTeste: "I don't know — take the test",
    neutro:
      "All three checks came out neutral. There's no pattern to correct — which doesn't mean mobility work isn't worth it. The exercises for patterns 1 and 2 are safe in any scenario.",
    escolherIntro:
      "Right side view, to compare with yours. The dashed line is the plumb line. Resist the urge to fit yourself into the most dramatic pattern — most people have a mild version of one of these, or a combination of two.",
    protocolo: "02 / Your protocol",
    p1p2: "Patterns 1 and 2 almost always show up together — the head moves forward to compensate for the rounded thoracic spine. Janda called it upper crossed syndrome. Treat both as a block.",
    curto: "Short or overloaded",
    fraco: "Weak or inhibited",
    atencao: "Caution.",
    naoFazer: "Don't do with this pattern",
    erros: "Common mistakes with this pattern",
    seusExercicios: (n, total) => `Your exercises · ${n} of ${total}`,
    pontoFalha: "Failure point.",
    semanas: "The eight weeks",
    expectativa: "Realistic expectations",
    ponte:
      "The whole protocol is right here. What changes the result is building it into the training you already do — and adjusting as your body responds.",
    cta: "Start coaching",
    livro: "Read the full book",
  },
};
