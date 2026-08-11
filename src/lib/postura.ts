/**
 * Raio-X Postural — conteúdo extraído do livro "Postura: os cinco padrões
 * mais comuns e o protocolo para corrigir" (Carlos Seiti, 2026).
 *
 * Duas regras de segurança do livro estão codificadas aqui, não só escritas:
 *
 *  · Os padrões 3 e 4 são mutuamente exclusivos e pedem protocolos OPOSTOS.
 *    Aplicar o errado agrava o quadro. A interface não deixa escolher os dois.
 *  · O exercício 09 (prone press-up) é contraindicado na anteversão pélvica.
 *    Ele nunca aparece fora do padrão 4.
 */

export type PadraoId = "p1" | "p2" | "p3" | "p4" | "assimetria";

export type Exercicio = {
  n: string;
  nome: string;
  dose: string;
  alvo: string;
  como: string;
  /** o erro que anula o exercício — destacado no livro */
  falha: string;
  padroes: PadraoId[];
};

export type Padrao = {
  id: PadraoId;
  numero: string;
  nome: string;
  resumo: string;
  figura: string;
  /** o que o teste da parede mostra neste padrão */
  sinalDaParede: string;
  curto: string;
  fraco: string;
  custoNoTreino: string;
  sinalTipico: string;
  erros: string[];
  /** quando existe, aparece como aviso vermelho antes do protocolo */
  cuidado?: string;
  naoFazer?: string[];
};

export const PADROES: Padrao[] = [
  {
    id: "p1",
    numero: "Padrão 1",
    nome: "Cabeça anteriorizada",
    resumo: "Ouvido à frente do ombro",
    figura: "/postura/padrao-1.png",
    sinalDaParede: "Não encosta a nuca sem levantar o queixo",
    curto:
      "Subocciptais, elevador da escápula, esternocleidomastoídeo, trapézio superior",
    fraco:
      "Flexores cervicais profundos (longo do pescoço e longo da cabeça), trapézio inferior",
    custoNoTreino:
      "Limita a extensão cervical em exercícios acima da cabeça e faz a barra passar à frente da linha ideal no press militar. No levantamento terra, olhar em frente com o queixo elevado agrava o padrão e reduz a estabilidade cervical sob carga.",
    sinalTipico:
      "Tensão na base do crânio ao fim do dia, cefaleia tensional, desconforto ao segurar o telemóvel, sensação de peso nos ombros em trabalho sentado.",
    erros: [
      "Confundir retração com flexão. Baixar o queixo em vez de o recuar treina os flexores superficiais, que já estão ativos de mais.",
      "Trabalhar só o pescoço. A anteriorização assenta quase sempre numa torácica curvada — sem tratar o padrão 2 em paralelo, o ganho não se mantém.",
      "Alongar o trapézio superior e parar aí. Alivia por umas horas e não muda nada em oito semanas.",
      "Elevar o ecrã e ignorar a cadeira. Monitor à altura dos olhos com uma cadeira que empurra a pélvis em retroversão produz o mesmo resultado.",
    ],
  },
  {
    id: "p2",
    numero: "Padrão 2",
    nome: "Cifose torácica e ombros protraídos",
    resumo: "Ombros rodados para dentro, curvatura dorsal aumentada",
    figura: "/postura/padrao-2.png",
    sinalDaParede: "As omoplatas não tocam a parede sem forçar",
    curto: "Peitoral maior e menor, grande dorsal, trapézio superior",
    fraco:
      "Serrátil anterior, romboides, trapézio médio e inferior, rotadores externos do ombro",
    custoNoTreino:
      "É a causa mecânica mais comum de desconforto no ombro em press vertical: sem os últimos graus de extensão torácica, o ombro compensa com mais elevação glenoumeral e o espaço subacromial reduz-se. Também limita a posição de rack no agachamento frontal.",
    sinalTipico:
      "Ombro que pinça em exercícios acima da cabeça, dificuldade em manter as omoplatas retraídas no supino, rigidez entre as omoplatas.",
    erros: [
      "Colocar o rolo na lombar. A lombar já está em extensão e o rolo agrava-a — o rolo pertence acima da última costela.",
      "Puxar mais em vez de mobilizar. Acrescentar remada a uma torácica rígida só fortalece na amplitude que já tinhas.",
      "Retrair as omoplatas permanentemente. A omoplata tem de rodar e deslizar; a retração forçada bloqueia o serrátil, que é justamente o músculo inibido aqui.",
      "Forçar press vertical sem amplitude. Se a barra não passa acima da cabeça sem hiperestender a lombar, troca por press inclinado.",
    ],
  },
  {
    id: "p3",
    numero: "Padrão 3",
    nome: "Anteversão pélvica",
    resumo: "Lordose lombar acentuada, abdómen projetado",
    figura: "/postura/padrao-3.png",
    sinalDaParede: "A mão passa inteira e folgada atrás da lombar",
    curto: "Psoas-ilíaco, reto femoral, eretores lombares",
    fraco:
      "Glúteo máximo, abdominais profundos (transverso e oblíquos), isquiotibiais",
    custoNoTreino:
      "Se a pelve já parte em anteversão máxima, não resta amplitude para absorver a descida do agachamento e a lombar entra em hiperextensão sob carga. No levantamento terra, a extensão final é feita pelos eretores em vez do glúteo. No hip thrust, a amplitude útil desaparece.",
    sinalTipico:
      "Lombar cansada no fim do dia, desconforto ao ficar muito tempo de pé, glúteo que não pega nos exercícios de extensão de anca.",
    erros: [
      "Alongar o flexor sem retroverter a pelve primeiro. O alongamento vai todo para a lombar e o psoas não recebe tensão — anula o exercício.",
      "Fortalecer o glúteo apenas em ponte. Acrescenta trabalho em amplitude longa (agachamento fundo, afundo) a partir da semana 4.",
      "Fazer abdominais tradicionais. Flexão repetida do tronco não treina o controlo da pelve.",
      "Corrigir de forma estática. Andar o dia todo com a pelve conscientemente retrovertida é substituir uma posição rígida por outra.",
    ],
    cuidado:
      "O exercício de extensão lombar (prone press-up) é contraindicado neste padrão. Se apareceu na tua lista, o padrão foi mal identificado — refaz o teste da parede.",
  },
  {
    id: "p4",
    numero: "Padrão 4",
    nome: "Retroversão e dorso plano",
    resumo: "Lordose lombar apagada, pelve rodada para trás",
    figura: "/postura/padrao-4.png",
    sinalDaParede: "Não passa nem a mão atrás da lombar",
    curto: "Isquiotibiais, reto abdominal, glúteo máximo em encurtamento",
    fraco: "Flexores do quadril, eretores lombares, glúteo médio",
    custoNoTreino:
      "A lombar perde a capacidade de absorver carga axial por deformação elástica e a compressão passa mais diretamente para os discos. No agachamento aparece butt wink cedo; no levantamento terra, a lombar tende a arredondar antes da barra sair do chão.",
    sinalTipico:
      "Desconforto lombar difuso ao fim do dia sentado, sensação de não conseguir arquear a lombar, isquiotibiais permanentemente tensos apesar do alongamento.",
    erros: [
      "Seguir conselhos genéricos da internet. Quase todo o conteúdo sobre postura assume anteversão — aplicado aqui, agrava.",
      "Alongar isquiotibiais em flexão lombar. Alcançar os dedos dos pés com as costas arredondadas alonga a lombar, não os isquiotibiais.",
      "Insistir no core em flexão. O reto abdominal já está dominante; mais crunches reforçam a retroversão.",
      "Forçar profundidade no agachamento. Se o butt wink aparece cedo, trabalha amplitude de anca e extensão lombar em vez de descer mais.",
    ],
    cuidado:
      "Este é o único protocolo do livro que pode piorar ativamente o quadro se o padrão estiver mal identificado. Antes da primeira sessão, confirma no teste da parede que não passa a mão atrás da lombar.",
    naoFazer: [
      "Alongamento agressivo de flexores do quadril",
      "Ponte de glúteo com retroversão forçada",
      "Prancha com báscula pélvica posterior",
    ],
  },
  {
    id: "assimetria",
    numero: "À parte",
    nome: "Assimetrias e escoliose",
    resumo: "Desvios laterais — regras diferentes",
    figura: "/postura/neutro.png",
    sinalDaParede: "Ombro ou anca visivelmente desnivelados",
    curto: "Varia conforme o lado dominante",
    fraco: "Varia conforme o lado dominante",
    custoNoTreino:
      "Assimetrias funcionais respondem bem a trabalho unilateral. Escoliose estrutural envolve rotação vertebral e alteração óssea: não se corrige com exercício — mas treinar força não é contraindicado, é recomendado.",
    sinalTipico:
      "Desequilíbrio de força evidente entre os lados, desconforto de um lado só.",
    erros: [
      "Tratar como se fosse plano sagital. Desvios laterais têm regras próprias.",
      "Acreditar em promessa de corrigir a curva com exercício. Material que promete isso deve ser fechado imediatamente.",
    ],
    cuidado:
      "Encaminha para avaliação clínica se houver desnível visível e progressivo, giba costal à flexão do tronco, dor irradiada, formigueiro ou perda de força. Aqui a resposta certa é imagem e avaliação presencial — não um protocolo de exercício.",
  },
];

/* ── O teste da parede ─────────────────────────────────────── */

export const TESTE = {
  titulo: "O teste da parede",
  comoFazer:
    "De costas para a parede, calcanhares a cinco a oito centímetros dela, pés à largura da anca. Encosta e verifica os pontos de contacto.",
  perguntas: [
    {
      id: "nuca",
      pergunta: "Consegues encostar a nuca sem levantar o queixo?",
      opcoes: [
        { rotulo: "Sim, sem esforço", padrao: null },
        { rotulo: "Só levantando o queixo", padrao: "p1" as PadraoId },
      ],
    },
    {
      id: "omoplatas",
      pergunta: "As omoplatas tocam a parede sem forçar?",
      opcoes: [
        { rotulo: "Sim, naturalmente", padrao: null },
        { rotulo: "Só forçando", padrao: "p2" as PadraoId },
      ],
    },
    {
      id: "lombar",
      pergunta: "Passa a mão atrás da lombar?",
      opcoes: [
        { rotulo: "Passa justa, sem folga", padrao: null },
        { rotulo: "Passa inteira e folgada", padrao: "p3" as PadraoId },
        { rotulo: "Não passa nem a mão", padrao: "p4" as PadraoId },
      ],
    },
  ],
} as const;

/* ── Biblioteca de exercícios ──────────────────────────────── */

export const EXERCICIOS: Exercicio[] = [
  {
    n: "01",
    nome: "Chin tuck (retração cervical)",
    dose: "3×10 · 5 s de sustentação · diário",
    alvo: "Flexores cervicais profundos",
    como: "Recua o queixo em linha reta, criando um duplo queixo, e sustenta. A cabeça desliza para trás sobre o pescoço; não roda nem se inclina.",
    falha:
      "Se o queixo desce em vez de recuar, o trabalho passou para os flexores superficiais e o exercício deixou de ter efeito. Filma-te de perfil na primeira sessão.",
    padroes: ["p1"],
  },
  {
    n: "02",
    nome: "Extensão torácica no rolo",
    dose: "2×10 respirações · 3 segmentos · diário",
    alvo: "Mobilidade torácica",
    como: "Rolo transversal à coluna, na torácica média, mãos atrás da cabeça e glúteos no chão. Expira e deixa a coluna moldar-se ao rolo, sem forçar. Depois sobe o rolo dois dedos e repete.",
    falha:
      "Rolo abaixo da última costela. Na lombar, este exercício força exatamente a hiperextensão que se quer evitar — e é onde a maioria o coloca.",
    padroes: ["p1", "p2"],
  },
  {
    n: "03",
    nome: "Wall slide com serrátil",
    dose: "3×10 · lento · semana 1 em diante",
    alvo: "Serrátil anterior e trapézio inferior",
    como: "Costas na parede com quatro pontos de contacto: occipital, dorsal, sacro e antebraços. Desliza os antebraços para cima mantendo todos os contactos. No topo, empurra ligeiramente a parede.",
    falha:
      "A amplitude útil é a que mantém os quatro contactos — não a máxima. Subir mais à custa de arquear a lombar transfere o trabalho para os eretores.",
    padroes: ["p1", "p2"],
  },
  {
    n: "04",
    nome: "Face pull",
    dose: "3×12–15 · carga moderada · semana 3 em diante",
    alvo: "Trapézio médio, romboides, rotadores externos",
    como: "Puxa à altura dos olhos com os cotovelos acima dos punhos, terminando em rotação externa com as omoplatas juntas e deprimidas. Pausa de um segundo no fim. É o único exercício desta lista que vale manter indefinidamente.",
    falha:
      "Se o trapézio superior encolhe e os ombros sobem em direção às orelhas, a carga está alta de mais. Reduz e prioriza a posição final.",
    padroes: ["p1", "p2"],
  },
  {
    n: "05",
    nome: "Alongamento de peitoral no batente",
    dose: "3×30–45 s por lado · diário",
    alvo: "Peitoral maior e menor",
    como: "Antebraço apoiado no batente, cotovelo à altura do ombro a 90°. Avança um passo e roda o tronco para o lado oposto. Repete com o cotovelo mais alto para as fibras claviculares.",
    falha:
      "Deve sentir-se no peito, nunca à frente do ombro. Dor na face anterior do ombro significa que a cápsula está a receber a tensão — reduz a amplitude.",
    padroes: ["p2"],
  },
  {
    n: "06",
    nome: "Alongamento de flexor em meio-ajoelhado",
    dose: "3×30–45 s por lado · diário",
    alvo: "Psoas-ilíaco e reto femoral",
    como: "Joelho de trás no chão, pé da frente à frente do joelho. Retroverte a pelve primeiro — contrai o glúteo de trás e leva o púbis para cima — e só depois avança o corpo. Costelas para baixo o tempo todo.",
    falha:
      "Sem a retroversão inicial, o alongamento vai todo para a lombar em hiperextensão e o psoas não recebe tensão nenhuma. É o erro mais comum de toda a biblioteca.",
    padroes: ["p3"],
  },
  {
    n: "07",
    nome: "Dead bug",
    dose: "3×8 por lado · muito lento · diário",
    alvo: "Abdominais profundos e controlo lombopélvico",
    como: "Deitado de costas, lombar em contacto com o solo do princípio ao fim. Estende braço e perna opostos enquanto expiras, e regressa sem pressa. A respiração é parte do exercício.",
    falha:
      "No momento em que a lombar se descola do chão, a série acabou. Reduz a amplitude do membro em vez de aumentar as repetições.",
    padroes: ["p3", "p4"],
  },
  {
    n: "08",
    nome: "Ponte de glúteo e hip thrust",
    dose: "3×10–12 · semana 2 em diante",
    alvo: "Glúteo máximo",
    como: "Sobe até alinhar joelho, anca e ombro, terminando o movimento com o glúteo e não com a lombar. Costelas para baixo no topo, queixo ligeiramente recuado. Pausa de um segundo em cima.",
    falha:
      "Se sentes na lombar, estás a subir alto de mais ou a iniciar com os eretores. Baixa a amplitude e pensa em empurrar o chão com os calcanhares.",
    padroes: ["p3"],
  },
  {
    n: "09",
    nome: "Prone press-up (extensão lombar)",
    dose: "2×10 · 3 s no topo · diário",
    alvo: "Extensão lombar",
    como: "Deitado de barriga para baixo, mãos sob os ombros. Estende os cotovelos mantendo a pelve em contacto com o solo, restaurando a lordose lombar. Sobe só até onde a pelve permanecer no chão.",
    falha:
      "Contraindicado em quem tem anteversão pélvica marcada. É o exercício que mais dano faz quando aplicado ao padrão errado — confirma o teste da parede antes.",
    padroes: ["p4"],
  },
  {
    n: "10",
    nome: "Bird dog",
    dose: "3×8 por lado · semana 1 em diante",
    alvo: "Controlo antirrotação do tronco",
    como: "Em quatro apoios, estende braço e perna opostos mantendo o tronco completamente imóvel. Um copo de água apoiado na lombar não deveria entornar.",
    falha:
      "O ganho está em não rodar a pelve, não em subir mais o membro. Se a anca do lado da perna estendida sobe, reduz a amplitude.",
    padroes: ["p3", "p4"],
  },
  {
    n: "11",
    nome: "Open book (rotação torácica deitado de lado)",
    dose: "2×10 por lado · diário",
    alvo: "Rotação torácica",
    como: "Deitado de lado, ancas e joelhos a 90° com o joelho de cima apoiado num rolo. Braços estendidos à frente, palmas juntas. Abre o braço de cima em arco até ao chão do lado oposto, expirando.",
    falha:
      "Se o joelho de cima levanta do rolo, a rotação passou para a lombar e a torácica não recebeu nada. Mantém o joelho fixo mesmo que percas metade da amplitude.",
    padroes: ["p1", "p2"],
  },
  {
    n: "12",
    nome: "Prone Y e prone T",
    dose: "3×12 · carga leve (1–3 kg) · semana 3 em diante",
    alvo: "Trapézio inferior e médio",
    como: "De barriga para baixo num banco inclinado ou no chão. Na posição Y, braços a 120° com os polegares para cima; na T, braços a 90°. Eleva sem encolher os ombros, iniciando pela omoplata.",
    falha:
      "Encolher os ombros durante a subida transfere o trabalho para o trapézio superior, que já está sobrecarregado. Carga leve a sério: um a três quilos chegam.",
    padroes: ["p1", "p2"],
  },
];

export function exerciciosDe(padroes: PadraoId[]): Exercicio[] {
  return EXERCICIOS.filter((e) => e.padroes.some((p) => padroes.includes(p)));
}

/* ── Fases e limites ───────────────────────────────────────── */

export const FASES = [
  {
    fase: "1",
    semanas: "Semanas 1–2",
    objetivo: "Mobilidade e consciência",
    onde: "Aquecimento de todas as sessões, mais 8 min diários",
    dose: "Amplitude sem carga. 2 séries por exercício.",
  },
  {
    fase: "2",
    semanas: "Semanas 3–5",
    objetivo: "Força no que está inibido",
    onde: "Substitui acessórios do treino",
    dose: "3×10–15 com carga que permite controlo total.",
  },
  {
    fase: "3",
    semanas: "Semanas 6–8",
    objetivo: "Carga e manutenção",
    onde: "Integrado nos básicos, com amplitude completa",
    dose: "Progride carga. Dose diária cai para 4 min.",
  },
] as const;

export const EXPECTATIVA = [
  { prazo: "Semanas 1–2", muda: "Consciência postural e alívio pontual após a sessão. Nada de estrutural ainda." },
  { prazo: "Semanas 3–5", muda: "Ganho mensurável de amplitude torácica e de quadril. Melhor posicionamento nos básicos." },
  { prazo: "Semanas 6–12", muda: "Alteração visível em repouso, sustentada por força — a única que dura." },
] as const;

/** Capítulo 12 — os sinais que mandam parar e procurar avaliação clínica. */
export const SINAIS_DE_ALERTA = [
  "Dor irradiada para braço ou perna, com formigueiro ou dormência",
  "Perda de força objetiva num membro",
  "Dor noturna que acorda, ou que não alivia com mudança de posição",
  "Dor após trauma — queda, acidente, impacto",
  "Febre, perda de peso não intencional ou história oncológica",
  "Dor torácica associada a esforço, falta de ar ou palpitações",
  "Alteração do controlo de esfíncteres ou dormência na região perineal — urgência médica imediata",
] as const;

export const AVISO =
  "Isto é material de educação em treino físico. Não é diagnóstico, não é prescrição médica e não substitui a avaliação presencial por médico ou fisioterapeuta.";

export const PROMESSA =
  "A promessa honesta não é que vais ficar direito. É que vais mover-te melhor, tolerar mais e treinar com amplitude completa. Quem promete correção postural em duas semanas está a vender.";
