/**
 * Todo o texto do site vive aqui.
 * Para mudar a copy, edite este arquivo — nenhum componente precisa ser tocado.
 *
 * Tom de voz (10 / BRAND BOOK): claro, elegante, direcional, motivador.
 * Uma ideia principal por mensagem. Frases curtas. Verbos de ação.
 */

export const marca = {
  nome: "Carlos Seiti",
  monograma: "CS",
  assinatura: "Evolução com propósito",
  descritor: "Nutrição Avançada",
  instagram: "https://www.instagram.com/carlosseiti/",
  instagramHandle: "@carlosseiti",
  whatsapp: "https://wa.me/message/HRZB5A4TF2GKA1",
  email: "contato@carlosseiti.com",
  site: "https://carlosseiti.com",
} as const;

/** Hrefs absolutos: os mesmos links funcionam na home e nas outras páginas. */
export const nav = [
  { label: "Método", href: "/#metodo", topo: true },
  { label: "Programa", href: "/#programa", topo: false },
  { label: "Calculadora", href: "/calculadora-de-calorias", topo: true },
  { label: "Biblioteca", href: "/biblioteca", topo: true },
  { label: "Resultados", href: "/#resultados", topo: true },
  { label: "Sobre", href: "/#sobre", topo: true },
  { label: "Dúvidas", href: "/#duvidas", topo: false },
] as const;

export const rotas = {
  calculadora: "/calculadora-de-calorias",
  biblioteca: "/biblioteca",
} as const;

export const hero = {
  eyebrow: "Consultoria online de treino e dieta",
  titulo: "Emagreça sem\ndietas extremas.",
  texto:
    "Um protocolo de nutrição e treino construído sobre evidência, ajustado ao seu corpo e à sua rotina. Sem restrição desnecessária. Sem promessa vazia.",
  cta: "Solicitar avaliação",
  ctaSecundario: "Calcular minhas calorias",
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
  { valor: "4,5 mil", rotulo: "Seguidores no Instagram" },
  { valor: "100%", rotulo: "Acompanhamento individual" },
] as const;

export const paraQuem = {
  eyebrow: "Para quem é",
  titulo: "Você já tentou o difícil.\nFalta o consistente.",
  texto:
    "A maioria dos planos falha porque é insustentável, não porque você falhou. O trabalho aqui começa pelo que cabe na sua vida.",
  itens: [
    "Já perdeu peso antes e recuperou tudo depois.",
    "Treina, mas não vê o corpo mudar há meses.",
    "Cansou de cortar grupos alimentares inteiros.",
    "Quer entender o porquê, não só receber uma folha de dieta.",
    "Tem rotina cheia e precisa de um plano que caiba nela.",
  ],
  naoE: [
    "Quem procura resultado em duas semanas.",
    "Quem quer protocolo pronto, sem acompanhamento.",
  ],
} as const;

export const metodo = {
  eyebrow: "02 / Método",
  titulo: "Direção antes de esforço.",
  texto:
    "Quatro etapas. Cada uma existe para reduzir a chance de você abandonar o processo no meio.",
  etapas: [
    {
      n: "01",
      titulo: "Diagnóstico",
      texto:
        "Anamnese completa, histórico de peso, exames, rotina, preferências e limitações. O ponto de partida define o caminho.",
    },
    {
      n: "02",
      titulo: "Protocolo",
      texto:
        "Plano alimentar e treino montados juntos, calibrados ao seu gasto real e ao que você consegue sustentar.",
    },
    {
      n: "03",
      titulo: "Execução",
      texto:
        "Suporte direto durante a semana. Dúvida respondida no dia é adesão preservada.",
    },
    {
      n: "04",
      titulo: "Ajuste",
      texto:
        "Revisão periódica com dados: peso, medidas, foto, treino e energia. O plano acompanha o corpo, não o contrário.",
    },
  ],
} as const;

export const programa = {
  eyebrow: "Programa",
  titulo: "O que está incluso.",
  texto:
    "Acompanhamento individual, do diagnóstico ao ajuste. Sem plano genérico.",
  itens: [
    {
      titulo: "Plano alimentar individual",
      texto:
        "Construído com os alimentos que você come, com substituições reais para cada refeição.",
    },
    {
      titulo: "Treino periodizado",
      texto:
        "Estruturado para o seu nível, equipamento disponível e frequência semanal possível.",
    },
    {
      titulo: "Ajustes quinzenais",
      texto:
        "Revisão de carga, volume e calorias com base no que os dados mostram.",
    },
    {
      titulo: "Suporte direto",
      texto: "Canal aberto para dúvidas ao longo da semana.",
    },
    {
      titulo: "Estratégia de suplementação",
      texto:
        "Apenas o que tem respaldo na literatura — e apenas se fizer diferença para você.",
    },
    {
      titulo: "Educação alimentar",
      texto:
        "Você termina o processo sabendo se manter sozinho. Esse é o objetivo.",
    },
  ],
} as const;

export const resultados = {
  eyebrow: "Resultados",
  titulo: "Progresso real, medido.",
  texto:
    "Transformações e feedbacks de alunos estão nos destaques do Instagram. Resultados variam conforme adesão, ponto de partida e individualidade.",
  cta: "Ver transformações no Instagram",
  depoimentos: [
    {
      texto:
        "Pela primeira vez segui um plano sem sentir que estava me privando de tudo.",
      autor: "Aluno — 6 meses de acompanhamento",
    },
    {
      texto:
        "O ajuste quinzenal mudou o jogo. Toda vez que travava, o plano mudava junto.",
      autor: "Aluna — 4 meses de acompanhamento",
    },
    {
      texto:
        "Entendi o porquê de cada escolha. Hoje consigo me virar sozinho no restaurante.",
      autor: "Aluno — 8 meses de acompanhamento",
    },
  ],
} as const;

export const sobre = {
  eyebrow: "Sobre",
  titulo: "Ciência aplicada\nao seu dia.",
  paragrafos: [
    "Sou Carlos Seiti. Trabalho com nutrição e treino a partir de uma formação acadêmica em Ciência de Alimentos — dois mestrados concluídos e doutorado em andamento.",
    "Minha pesquisa é em ciência de alimentos e quimioinformática: passo o dia lendo dados. Trouxe esse mesmo rigor para a consultoria, porque a maior parte do que circula sobre emagrecimento não sobrevive a uma leitura crítica da evidência.",
    "Também treino e compito. Sei o que é sustentar um protocolo na vida real, com trabalho, prazo e cansaço — e é por isso que nenhum plano meu depende de você ser perfeito.",
  ],
  citacao: "Evolução não é pressa. É direção.",
} as const;

export const duvidas = {
  eyebrow: "Dúvidas",
  titulo: "Antes de começar.",
  itens: [
    {
      p: "Preciso morar perto para fazer a consultoria?",
      r: "Não. Todo o acompanhamento é online: diagnóstico, entrega do protocolo, ajustes e suporte.",
    },
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
      p: "Como funciona o acompanhamento?",
      r: "Você recebe o protocolo completo, tem canal direto para dúvidas durante a semana e passa por uma revisão de dados a cada quinze dias.",
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
    "Conte o seu contexto. Respondo pessoalmente com uma avaliação inicial e o caminho recomendado — sem compromisso.",
  nota: "Suas informações são usadas apenas para responder a este contato.",
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

export const rodape = {
  disclaimer:
    "Consultoria de orientação em treino e nutrição esportiva. Não substitui avaliação médica ou nutricional clínica. Resultados variam individualmente.",
} as const;
