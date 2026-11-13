/**
 * Todo o texto do site vive aqui.
 * Para mudar a copy, edite este arquivo — nenhum componente precisa ser tocado.
 *
 * Tom de voz (10 / BRAND BOOK): claro, elegante, direcional, motivador.
 * Uma ideia principal por mensagem. Frases curtas. Verbos de ação.
 */

/**
 * Endereço público do site. Alimenta canonical, Open Graph, sitemap,
 * robots e todos os @id do JSON-LD — cravar um domínio aqui faria o site
 * publicado apontar para outro lugar.
 *
 * Ordem: o que você definir manualmente, depois o domínio de produção que
 * a Vercel injeta sozinha, e por fim o localhost do desenvolvimento.
 */
function enderecoDoSite(): string {
  const definido = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (definido) return definido.replace(/\/+$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}

export const marca = {
  nome: "Carlos Seiti",
  monograma: "CS",
  assinatura: "Evolução com propósito",
  descritor: "Nutrição Avançada",
  instagram: "https://www.instagram.com/carlosseiti/",
  instagramHandle: "@carlosseiti",
  youtube: "https://www.youtube.com/@carlosseitiTV",
  youtubeNome: "Carlos Seiti TV",
  linkedin: "https://www.linkedin.com/in/carlosseiti",
  whatsapp: "https://wa.me/message/HRZB5A4TF2GKA1",
  email: "contato@carlosseiti.com",
  site: enderecoDoSite(),
  /**
   * Formulário de captação da consultoria (LeadConnector). Só o endereço
   * do questionário: os parâmetros de campanha são montados em
   * `lib/campanha.ts`, a partir do que a própria visita trouxe.
   */
  formulario:
    process.env.NEXT_PUBLIC_FORMULARIO_CONSULTORIA ??
    "https://api.leadconnectorhq.com/widget/survey/x7MWU1CgJHNOEMYZfWWa",
} as const;

/** Hrefs absolutos: os mesmos links funcionam na home e nas outras páginas. */
export const nav = [
  { label: "Como funciona", href: "/#metodo", topo: true },
  { label: "Reset Metabólico", href: "/programa-90-dias", topo: true },
  { label: "Cursos", href: "/cursos", topo: true },
  { label: "Biblioteca", href: "/biblioteca", topo: true },
  { label: "CSFlix", href: "/csflix", topo: true },
  { label: "Receitas Fit", href: "/receitas", topo: true },
  { label: "Resultados", href: "/#resultados", topo: false },
  { label: "Sobre", href: "/#sobre", topo: false },
] as const;

export const appsNav = [
  { label: "% Gordura", href: "/calculadora-de-gordura-corporal" },
  { label: "Postura", href: "/postura" },
  { label: "Raio-X", href: "/raio-x-postural" },
  { label: "Calorias", href: "/calculadora-de-calorias" },
  { label: "Prato", href: "/calculadora-do-prato" },
] as const;

export const rotas = {
  /* Porta única da consultoria: um endereço que se dita num Reel e um só
     lugar para trocar quando o formulário mudar de casa. */
  consultoria: "/consultoria",
  calculadora: "/calculadora-de-calorias",
  gordura: "/calculadora-de-gordura-corporal",
  programa: "/programa-90-dias",
  prato: "/calculadora-do-prato",
  biblioteca: "/biblioteca",
  receitas: "/receitas",
  raioX: "/raio-x-postural",
  postura: "/postura",
  csflix: "/csflix",
  cursos: "/cursos",
  links: "/links",
  /* Só em português (fora de TRADUZIDOS). */
  metodoCS: "/metodocs",
} as const;

export const hero = {
  eyebrow: "Consultoria online de treino e dieta",
  titulo: "Emagreça sem\ndietas extremas.",
  texto:
    "Nutrição e treino com base em evidência, ajustados ao seu corpo e à sua rotina. Sem restrição desnecessária. Sem promessa vazia.",
  cta: "Começar consultoria online",
  ctaSecundario: "Ver resultados",
  nota: "Vagas limitadas por turma — acompanhamento individual.",
} as const;

/** 01 / ESSÊNCIA DA MARCA — os quatro pilares, traduzidos para o serviço. */
export const pilares = [
  {
    titulo: "Precisão",
    texto: "Cada escolha do protocolo tem função. Nada é excessivo.",
  },
  {
    titulo: "Evolução",
    texto: "Ajuste contínuo a partir de dados reais, não de achismo.",
  },
  {
    titulo: "Confiança",
    texto: "Método aberto: você entende por que faz cada coisa.",
  },
  {
    titulo: "Ciência",
    texto: "Formação acadêmica em Alimentos aplicada à sua rotina.",
  },
] as const;

export const credenciais = [
  { valor: "2×", rotulo: "Mestrado concluído" },
  { valor: "PhD", rotulo: "Doutorando em Alimentos" },
  { valor: "39", rotulo: "Vidas transformadas" },
  { valor: "100%", rotulo: "Acompanhamento individual" },
] as const;

export const paraQuem = {
  eyebrow: "Para quem é",
  titulo: "Você já tentou o difícil.\nFalta o consistente.",
  texto:
    "A maioria dos planos falha porque é insustentável, não porque você falhou. O trabalho começa pelo que cabe na sua vida.",
  itens: [
    "Já perdeu peso antes e recuperou tudo depois.",
    "Treina, mas não vê o corpo mudar há meses.",
    "Cansou de cortar grupos alimentares inteiros.",
    "Tem rotina cheia e precisa de um plano que caiba nela.",
  ],
  naoE: [
    "Quem procura resultado em duas semanas.",
    "Quem quer protocolo pronto, sem acompanhamento.",
  ],
} as const;

export const metodo = {
  eyebrow: "Método",
  titulo: "Direção antes de esforço.",
  texto:
    "Quatro etapas, cada uma para reduzir a chance de você abandonar no meio.",
  etapas: [
    {
      n: "01",
      titulo: "Diagnóstico",
      texto:
        "Histórico, exames, rotina e limitações. O ponto de partida define o caminho.",
    },
    {
      n: "02",
      titulo: "Protocolo",
      texto:
        "Dieta e treino montados juntos, no seu gasto real e no que você consegue sustentar.",
    },
    {
      n: "03",
      titulo: "Execução",
      texto:
        "Suporte direto na semana. Dúvida respondida no dia é adesão preservada.",
    },
    {
      n: "04",
      titulo: "Ajuste",
      texto:
        "Revisão quinzenal com os seus dados. O plano acompanha o corpo, não o contrário.",
    },
  ],
} as const;

export const programa = {
  eyebrow: "Programa",
  titulo: "O que está incluso.",
  texto: "Acompanhamento individual, do diagnóstico ao ajuste.",
  itens: [
    {
      titulo: "Plano alimentar individual",
      texto:
        "Montado com os alimentos que você já come, com substituição para cada refeição.",
    },
    {
      titulo: "Treino periodizado",
      texto:
        "Para o seu nível, o equipamento que você tem e a frequência que cabe na semana.",
    },
    {
      titulo: "Ajuste quinzenal",
      texto:
        "Carga, volume e calorias revistos pelos seus dados — suplementação incluída, quando faz diferença.",
    },
    {
      titulo: "Suporte direto",
      texto:
        "Canal aberto na semana. Você termina sabendo se manter sozinho: esse é o objetivo.",
    },
  ],
} as const;

export const resultados = {
  eyebrow: "Resultados",
  titulo: "Progresso real, medido.",
  texto:
    "Pessoas reais, cada uma com ponto de partida, rotina e ritmo diferentes.",
  cta: "Ver transformações no Instagram",
  transformacoes: [
    {
      nome: "Carlos Abra",
      instagram: "@carlosabraoficial",
      link: "https://www.instagram.com/carlosabraoficial/",
      imagem: "/resultados/carlos-abra-v2.png",
      largura: 600,
      altura: 1160,
      alt: "Evolução corporal de Carlos Abra, com registros de antes e depois",
    },
    {
      nome: "Laís",
      instagram: "@laisdas",
      link: "https://www.instagram.com/laisdas/",
      imagem: "/resultados/lais-das.png",
      largura: 272,
      altura: 482,
      alt: "Evolução corporal de Laís, com registros de antes e depois vistos de costas",
    },
    {
      nome: "Luanito Castro",
      instagram: "@luanitocastro",
      link: "https://www.instagram.com/luanitocastro/",
      imagem: "/resultados/luanito-castro.png",
      largura: 233,
      altura: 372,
      alt: "Evolução corporal de Luanito Castro, com registros de antes e depois",
    },
    {
      nome: "Isaías Santos",
      instagram: "@isaiassantos_2021",
      link: "https://www.instagram.com/isaiassantos_2021/",
      imagem: "/resultados/isaias-santos-v3.png",
      largura: 360,
      altura: 660,
      alt: "Evolução corporal de Isaías Santos, com registros de antes e depois",
    },
  ],
  aviso:
    "Resultados variam conforme adesão, ponto de partida e individualidade.",
} as const;

export const sobre = {
  eyebrow: "Sobre",
  titulo: "Ciência aplicada\nao seu dia.",
  paragrafos: [
    "Sou Carlos Seiti. Trabalho com nutrição e treino a partir de uma formação acadêmica em Ciência de Alimentos — dois mestrados concluídos, doutorado em andamento — e passo o dia lendo dados. Trouxe esse rigor para a consultoria, porque a maior parte do que circula sobre emagrecimento não sobrevive a uma leitura crítica da evidência.",
    "Também treino e compito. Sei o que é sustentar um protocolo com trabalho, prazo e cansaço — por isso nenhum plano meu depende de você ser perfeito.",
  ],
  citacao: "Evolução não é pressa. É direção.",
  /* A versão da home enxuta (nov/2026): duas linhas, o resto fica para
     quem procurar. */
  curto:
    "Dois mestrados em Ciência de Alimentos, doutorado em andamento e atleta de classic bodybuilding. Nenhum plano meu depende de você ser perfeito.",
} as const;

export const duvidas = {
  eyebrow: "Dúvidas",
  titulo: "Antes de começar.",
  itens: [
    {
      p: "Vou precisar cortar carboidrato, glúten ou lactose?",
      r: "Só se houver um motivo clínico ou uma preferência sua. Restrição sem justificativa é o principal motivo pelo qual as pessoas abandonam a dieta.",
    },
    {
      p: "Em quanto tempo vejo resultado?",
      r: "As primeiras mudanças de composição corporal costumam aparecer entre a quarta e a oitava semana. O ritmo depende do seu ponto de partida e da adesão. Não trabalho com prazo prometido.",
    },
    {
      p: "Preciso de academia?",
      r: "Não necessariamente. O treino é montado com o que você tem disponível, incluindo opções para casa.",
    },
    {
      p: "Isso substitui consulta com nutricionista ou médico?",
      r: "Não. A consultoria é um serviço de orientação em treino e nutrição esportiva e não substitui acompanhamento clínico. Se você tem condição de saúde diagnosticada, faz uso de medicação contínua ou está gestante, siga também com seu médico.",
    },
  ],
} as const;

export const contato = {
  eyebrow: "Próximo passo",
  titulo: "O próximo passo\ncomeça agora.",
  texto:
    "Conte o seu contexto. Respondo pessoalmente com o caminho recomendado, sem compromisso.",
  nota: "Suas informações são usadas apenas para responder a este contato.",
  cta: "Começar minha consultoria",
  /* O que a pessoa encontra depois do clique. Dizer as três etapas antes
     de abrir o questionário reduz o abandono na primeira pergunta: quem
     sabe onde o caminho termina não desiste no meio. */
  passos: [
    {
      numero: "01",
      titulo: "Questionário curto",
      nota: "Objetivo, rotina e histórico — cinco minutos",
    },
    {
      numero: "02",
      titulo: "Análise do seu caso",
      nota: "Leio tudo antes de responder qualquer coisa",
    },
    {
      numero: "03",
      titulo: "Avaliação inicial",
      nota: "Respondo com o caminho recomendado, sem compromisso",
    },
  ],
  objetivos: [
    "Emagrecer",
    "Ganhar massa muscular",
    "Recomposição corporal",
    "Melhorar saúde e energia",
    "Preparação para competição",
  ],
} as const;

export const calculadora = {
  slug: rotas.calculadora,
  eyebrow: "Ferramenta gratuita",
  titulo: "Calculadora de\ncalorias basais.",
  texto:
    "Descubra quanta energia o seu corpo gasta em repouso e quanto precisa por dia. É o número de partida de qualquer protocolo — e o primeiro que a maioria das dietas erra.",
  explicaTmb:
    "É o que o seu corpo consome só para existir: respirar, manter a temperatura, alimentar o cérebro. Nenhuma dieta deveria ficar abaixo disso.",
  ponte:
    "O número é o ponto de partida, não o plano. O que muda o resultado é como ele se distribui na sua rotina — e o ajuste quando o corpo responde.",
  cta: "Calcular minhas calorias",
  aviso:
    "Toda equação de metabolismo é uma estimativa populacional, com erro individual de 10 a 15 %. Use como ponto de partida e ajuste pelo que a balança e o espelho mostram ao longo de semanas.",
  captura: {
    titulo: "Quer este plano por escrito?",
    texto:
      "Envio o seu plano completo por e-mail — os números, os macros e a distribuição das refeições — junto com o que eu ajustaria nele.",
    nota:
      "Mando o plano para você e fico com uma cópia, para conseguir te responder com contexto. Nada além disso.",
    botao: "Receber meu plano",
    sucesso: "Plano enviado. Confira a caixa de entrada — e o spam, por garantia.",
  },
  comoUsar: [
    {
      titulo: "O basal é o piso",
      texto:
        "Comer abaixo da taxa basal por períodos longos custa massa magra, hormônio e adesão. Déficit se faz com margem, não com fome.",
    },
    {
      titulo: "O gasto total é o alvo",
      texto:
        "É o basal multiplicado pela sua atividade real. Trabalhar em pé e treinar cinco vezes por semana não são a mesma coisa.",
    },
    {
      titulo: "O número muda",
      texto:
        "Ele cai conforme você emagrece. Por isso o protocolo é revisado a cada quinze dias, e não calculado uma vez só.",
    },
  ],
} as const;

export const prato = {
  slug: rotas.prato,
  eyebrow: "Ferramenta gratuita",
  titulo: "Quanto pesa\no prato de hoje.",
  texto:
    "Você vai almoçar fora e não faz ideia do que aquilo custa no dia. Monte o prato aqui — em conchas e palmas, não em gramas — e veja calorias e macros antes de sentar à mesa.",
  destaques: [
    "70 alimentos de restaurante brasileiro",
    "Medida pela mão, sem balança",
    "Resultado em faixa, não em número falso",
  ],
} as const;

/**
 * Porta de entrada do tráfego de Instagram. Quem chega aqui veio de um
 * vídeo de 30 segundos, no celular, e decide em poucos segundos se fica —
 * por isso a copy é curta e a primeira tela já é o formulário de medidas.
 */
export const gordura = {
  slug: rotas.gordura,
  eyebrow: "Ferramenta gratuita",
  titulo: "Quanta gordura\nvocê carrega hoje.",
  texto:
    "Dois minutos, nenhum equipamento. Descubra quanta gordura você carrega e o que separa você do corpo que quer.",
  destaques: [
    "Sem balança de bioimpedância",
    "Resultado em faixa, não em número falso",
    "O plano sai junto com o resultado",
  ],
  /**
   * A estimativa rápida vem primeiro e é a que já vem marcada. Quem chega
   * de um anúncio não tem fita métrica na mão, e pedir uma antes de
   * mostrar qualquer coisa perde a pessoa na porta. Quem tem fita troca em
   * um toque e ganha bem mais precisão — o que continua dito aqui, e o
   * resultado por IMC continua rotulado como estimativa fraca.
   */
  metodos: [
    {
      id: "imc",
      titulo: "Não tenho fita",
      nota: "Estimativa rápida, só com peso e altura.",
    },
    {
      id: "fita",
      titulo: "Tenho fita métrica",
      nota: "Bem mais preciso. Pede pescoço e cintura.",
    },
  ],
  avisos: {
    fita: "Erro de 3 a 4 pontos para cada lado — por isso o resultado vem como faixa.",
    imc: "Estimativa fraca: sem as circunferências o erro passa de 5 pontos. Com uma fita, troque acima.",
  },
  comoMedir: {
    pescoco: "Abaixo do pomo de adão, sem apertar.",
    cintura: "Na altura do umbigo, sem prender a barriga.",
    quadril: "Na parte mais larga dos glúteos.",
  },
  alvo: {
    titulo: "Onde você quer chegar",
    texto: "Escolha o que você quer manter, não o que impressiona mais.",
    nota: "Faixas do American Council on Exercise.",
  },
  /**
   * O bloco da home. Os números da prévia saem da própria ferramenta, com
   * as medidas do exemplo — não são ilustrativos: qualquer um pode repetir
   * a conta e chegar neles.
   */
  home: {
    eyebrow: "Ferramenta gratuita",
    cta: "Descobrir meu percentual",
    nota: "Gratuito · sem cadastro · 2 minutos",
    texto:
      "Uma fita métrica basta. A calculadora estima quanta gordura você carrega, você escolhe na escala o abdômen que quer ter, e ela devolve as calorias, os macros e quantas semanas separam um do outro.",
    previa: [
      { n: "27,7", u: "%", r: "Gordura corporal hoje" },
      { n: "22", u: "%", r: "Meta escolhida na escala" },
      { n: "85,3", u: "kg", r: "Peso com a massa magra mantida" },
      { n: "11", u: "semanas", r: "Tempo estimado" },
    ],
    exemplo:
      "Exemplo — homem, 34 anos, 92 kg, 176 cm, pescoço 41 cm e cintura 104 cm.",
    outra: "Prefere começar pelas calorias?",
  },
  plano: {
    titulo: "O que separa você desse ponto",
    /**
     * O fecho é a única parte da página que pede alguma coisa. Ele fala
     * do que a calculadora não resolve — a execução — e usa os números que
     * a própria pessoa acabou de gerar, porque um convite genérico depois
     * de um diagnóstico específico soa como anúncio.
     */
    fecho: {
      eyebrow: "O próximo passo",
      titulo: "A conta é a parte fácil.",
      texto:
        "O que decide o resultado é o que acontece entre hoje e lá — e é aí que eu entro.",
      itens: [
        "Plano alimentar montado com o que você já come",
        "Treino periodizado para a sua frequência real",
        "Revisão a cada quinze dias, com os seus números na mesa",
      ],
      cta: "Quero esse plano comigo",
      urgencia: "Vagas limitadas por turma — o acompanhamento é individual.",
      nota: "Formulário de 2 minutos. Eu leio e respondo pessoalmente.",
      privacidade:
        "O cálculo é feito no seu navegador. Só se você clicar no botão o resultado (% de gordura, meta e calorias) vai junto para o formulário — para eu não te perguntar tudo de novo.",
      /**
       * A prova ao lado do pedido. A calculadora entrega um número; a foto
       * mostra que o número vira corpo em alguém real.
       */
      prova: {
        imagem: "/resultados/transformacao-antes-depois.jpg",
        largura: 900,
        altura: 1600,
        alt: "Antes e depois de uma aluna acompanhada por Carlos Seiti: à esquerda, sem definição; à direita, abdômen e pernas marcados",
        legenda: "Acompanhamento individual, com ajuste a cada quinze dias.",
      },
    },
    cta: "Quero esse plano comigo",
    ctaNota: "Formulário de 2 minutos. Eu leio e respondo pessoalmente.",
  },
} as const;

export const rodape = {
  disclaimer:
    "Consultoria de orientação em treino e nutrição esportiva. Não substitui avaliação médica ou nutricional clínica. Resultados variam individualmente.",
} as const;
