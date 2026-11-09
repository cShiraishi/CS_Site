/**
 * CSFlix — Os vídeos do canal Carlos Seiti TV estruturados como SÉRIES e TEMPORADAS
 * para promover maratona (Binge-Watching), com ordem narrativa de episódios,
 * sinopse instigante por episódio e sincronização automática com o feed RSS do YouTube.
 */

const CANAL = "UCSq4rGIePKS1u0ODvYsmR7w";

export type Video = {
  id: string;
  titulo: string;
  sinopse?: string;
  publicado: string;
  duracao?: string;
  url: string;
  episodioNumero?: number;
  temporadaTag?: string;
};

export type Trilha = {
  id: string;
  temporada: string;
  icone: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  promessaMaratona: string;
  videos: Video[];
};

type EpisodioCurado = {
  id: string;
  titulo: string;
  sinopse: string;
  duracao: string;
};

type ConfigSerie = {
  id: string;
  temporada: string;
  icone: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  promessaMaratona: string;
  episodios: EpisodioCurado[];
};

/**
 * Catálogo de Séries Curadas em ordem narrativa (EP. 01 → EP. final).
 * Garante que todas as temporadas carreguem instantaneamente com sinopse e duração,
 * estimulando o visitante a assistir em sequência como na Netflix.
 */
export const SERIES_CSFLIX: ConfigSerie[] = [
  {
    id: "true-shape",
    temporada: "TEMPORADA 1",
    icone: "🔥",
    nome: "Projeto True Shape · O Reality da Transformação",
    subtitulo: "9 episódios em sequência cronológica",
    descricao:
      "Acompanhe do episódio 1 ao 9 a jornada real de mudança física: apostas, avaliações de físico, erros no meio do caminho e transformações de -20 kg.",
    promessaMaratona: "Comece pelo EP. 01 para entender as regras do desafio e veja quem realmente mudou o físico.",
    episodios: [
      {
        id: "rmzMP-LsuOQ",
        titulo: "O Ponto de Partida: Como Construir o Shape em 2026",
        sinopse: "EP. 01 — O plano diretor da temporada: o que separa quem muda o corpo em 90 dias de quem abandona na terceira semana.",
        duracao: "14:20",
      },
      {
        id: "8u9vHL5cE0w",
        titulo: "Do Girino ao Urso: Quem Vai Ficar no Shape Primeiro?",
        sinopse: "EP. 02 — A disputa começa na prática: pontos de partida opostos, biotipos diferentes e o mesmo protocolo de precisão.",
        duracao: "18:45",
      },
      {
        id: "VI0eleGqumA",
        titulo: "O Julgamento dos Físicos: Quem Leva os 400 Euros?",
        sinopse: "EP. 03 — Hora de tirar a camisa e medir a evolução real: análise técnica de linha, cortes e percentual de gordura.",
        duracao: "21:10",
      },
      {
        id: "pLDvj0_EocQ",
        titulo: "Novo Patrocinador & A Pressão Sobe no Projeto",
        sinopse: "EP. 04 — O projeto cresce, entram novos recursos e a cobrança por adesão à dieta fica ainda mais intensa.",
        duracao: "12:35",
      },
      {
        id: "uhww5Mzvy1I",
        titulo: "Desafio de Resistência: Quem Perder nas Flexões Paga o Preço",
        sinopse: "EP. 05 — Teste mental e físico até a falha: quando o cansaço bate, aparece quem realmente tem disciplina.",
        duracao: "15:50",
      },
      {
        id: "d2imA9F6UbI",
        titulo: "No Limite da Aposta: As Consequências do Desafio True Shape",
        sinopse: "EP. 06 — O episódio mais tenso e divertido da temporada: ninguém quer perder a aposta final.",
        duracao: "16:15",
      },
      {
        id: "ZFcpJenQdHo",
        titulo: "Como Ele Ganhou +10 kg em 1 Mês: A Estratégia Revelada",
        sinopse: "EP. 07 — Superávit calórico limpo, progressão de carga e o que mudou na rotina para destravar o ganho de massa.",
        duracao: "13:40",
      },
      {
        id: "35AcZsw3U0M",
        titulo: "Estava com 99 kg e Já Eliminou -8 kg Mantendo Massa Magra",
        sinopse: "EP. 08 — Estudo de caso prático de recomposição corporal sem dietas extremas.",
        duracao: "11:25",
      },
      {
        id: "r9oFfFtCgdE",
        titulo: "Missão 180 kg: O Pedido de Socorro do Daniel",
        sinopse: "EP. 09 — Season Finale emocionante: como começar a resgatar a saúde e a mobilidade quando o peso chegou ao limite.",
        duracao: "19:30",
      },
    ],
  },
  {
    id: "sessoes-brutas",
    temporada: "TEMPORADA 2",
    icone: "💪",
    nome: "Sessões Brutas · Da Primeira Série à Recuperação",
    subtitulo: "5 episódios de biomecânica e treino real",
    descricao:
      "Nada de treino coreografado: veja a execução real na gaiola, a cadência, a falha mecânica e a liberação miofascial pós-treino.",
    promessaMaratona: "Assista na ordem para ver um microciclo completo de membros superiores, inferiores e recuperação.",
    episodios: [
      {
        id: "68Rxs5iP32A",
        titulo: "Treino de Ombros Pancada: Construindo Largura 3D",
        sinopse: "EP. 01 — Seleção de ângulos, controle excêntrico e volume ideal para deltoide lateral e posterior.",
        duracao: "16:05",
      },
      {
        id: "p1LL2brbwe8",
        titulo: "Leg Day Pesado: Um Brasileiro, um Português e um Peruano",
        sinopse: "EP. 02 — Três atletas empurrando o limite no treino de pernas mais pesado do canal.",
        duracao: "22:18",
      },
      {
        id: "DN8HMhT2Elw",
        titulo: "Treinão de Perna Rápido e Brutal (Alta Intensidade em Pouco Tempo)",
        sinopse: "EP. 03 — Como extrair estímulo máximo de hipertrofia quando você tem menos de 45 minutos na academia.",
        duracao: "12:48",
      },
      {
        id: "Xuat0DwvjR4",
        titulo: "Pós-Leg Day: Liberação Miofascial e Recuperação no Aluno",
        sinopse: "EP. 04 — O que acontece depois da última série: soltura muscular e preparo para a próxima sessão.",
        duracao: "10:15",
      },
      {
        id: "p1XZPvSNm3g",
        titulo: "Menstruação vs. Treino: Como Periodizar para Mulheres",
        sinopse: "EP. 05 — Fisiologia hormonal feminina aplicada: como ajustar carga, volume e dieta em cada fase do ciclo.",
        duracao: "14:55",
      },
    ],
  },
  {
    id: "nutricao-real",
    temporada: "TEMPORADA 3",
    icone: "🧪",
    nome: "Nutrição no Mundo Real · Rótulos & Suplementos Sem Filtro",
    subtitulo: "3 episódios desmascarando a indústria",
    descricao:
      "Um Mestre e Doutorando em Ciência de Alimentos dentro do supermercado e das lojas de suplementos analisando o que realmente funciona.",
    promessaMaratona: "Descubra o que vale o seu dinheiro e o que é puro marketing na prateleira.",
    episodios: [
      {
        id: "itJ06wOXEbM",
        titulo: "Provando as Novidades Fitness com Dra. Maromba: O Que Presta?",
        sinopse: "EP. 01 — Degustação às cegas + leitura crítica da lista de ingredientes e densidade calórica.",
        duracao: "17:40",
      },
      {
        id: "-fUAu0CSUVA",
        titulo: "Bastidores da Suplementação: Tendências Reais no Brasil e Europa",
        sinopse: "EP. 02 — O que tem evidência nível A (Whey, Creatina, Cafeína) vs. o que você não precisa comprar.",
        duracao: "15:20",
      },
      {
        id: "6Ty3OJYTwoY",
        titulo: "Expedição Chile: Analisando uma Loja Inteira Plant-Based",
        sinopse: "EP. 03 — Nem tudo que é vegano ou plant-based ajuda a emagrecer: análise de proteínas vegetais e substitutos.",
        duracao: "13:10",
      },
    ],
  },
  {
    id: "ciencia-aplicada",
    temporada: "TEMPORADA 4",
    icone: "🧬",
    nome: "Laboratório PhD · Inteligência Artificial, Moléculas & Dados",
    subtitulo: "5 episódios da bancada científica",
    descricao:
      "A base acadêmica por trás da precisão: veja como uso IA, Python, modelagem molecular 3D e química de alimentos no doutorado.",
    promessaMaratona: "A série favorita de quem quer ver o rigor científico real por trás do método.",
    episodios: [
      {
        id: "mSSPYbPM2XY",
        titulo: "Como Criei Meu Primeiro Modelo de IA para a Indústria Farmacêutica",
        sinopse: "EP. 01 — Do banco de dados molecular ao algoritmo preditivo: como a Inteligência Artificial acelera descobertas.",
        duracao: "16:30",
      },
      {
        id: "AnwFEVx-HEU",
        titulo: "NEI 2025: Ciência de Alimentos e Inovação com Dr. Márcio Carocho",
        sinopse: "EP. 02 — O formato Fundo Escuro + Moléculas 3D explicando compostos bioativos e o futuro da nutrição.",
        duracao: "18:12",
      },
      {
        id: "GVMcSQf7hxE",
        titulo: "Explorando Dados Físico-Químicos de Compostos com Python",
        sinopse: "EP. 03 — Como analisar milhares de moléculas em minutos usando programação aplicada à ciência.",
        duracao: "14:05",
      },
      {
        id: "1Zwr8UrtOEo",
        titulo: "Virtual Screening & QSAR: Minerando Dados no ChEMBL",
        sinopse: "EP. 04 — Passo a passo prático de bioinformática e quimioinformática no doutorado.",
        duracao: "19:45",
      },
      {
        id: "nCAufgJ4IWw",
        titulo: "Modelagem 3D de Proteínas: Destacando Aminoácidos no PyMOL",
        sinopse: "EP. 05 — Visualizando a estrutura tridimensional das proteínas em nível atômico.",
        duracao: "12:50",
      },
    ],
  },
  {
    id: "mentes-fora-da-curva",
    temporada: "TEMPORADA 5",
    icone: "🎙️",
    nome: "Mentes Fora da Curva · Histórias de Disciplina & Palco",
    subtitulo: "7 episódios de conversas profundas",
    descricao:
      "Entrevistas e documentários curtos com doutores, professores internacionais, ex-obesos que subiram no palco e atletas de elite.",
    promessaMaratona: "Histórias reais para assistir quando você precisar recalibrar sua direção e disciplina.",
    episodios: [
      {
        id: "9oHT6bC-20k",
        titulo: "De Ex-Obesa a Fisiculturista e Empresária (@simonemkehl)",
        sinopse: "EP. 01 — Como virar a chave mental, vencer a obesidade e construir um físico de competição.",
        duracao: "28:15",
      },
      {
        id: "CryXN-5LhXs",
        titulo: "De Aluno em Santos a Professor em Barcelona (Dr. Ricardo Serafim)",
        sinopse: "EP. 02 — Os bastidores da carreira científica internacional e o que o doutorado ensina sobre resiliência.",
        duracao: "34:20",
      },
      {
        id: "rtd8u5Cfies",
        titulo: "O Que Realmente É um Doutorado? (Papo com Dr. Andreimar Soares)",
        sinopse: "EP. 03 — Uma conversa franca sobre pesquisa de ponta, carreira acadêmica e propósito.",
        duracao: "29:40",
      },
      {
        id: "WQLA9id1s7E",
        titulo: "Mindset de Campeão na Alta Performance (Weslley Bronzoli)",
        sinopse: "EP. 04 — Como pensa um atleta competitivo quando ninguém está olhando.",
        duracao: "24:10",
      },
      {
        id: "oOpriO5YJ8g",
        titulo: "Mentalidade de Negócios, Carreira e Consistência",
        sinopse: "EP. 05 — Por que a mesma disciplina que constrói um físico sólido constrói uma empresa forte.",
        duracao: "18:55",
      },
      {
        id: "-6oc99Gh5gg",
        titulo: "Team Will: O Que o Boxe Ensina Sobre Controle Emocional",
        sinopse: "EP. 06 — Arte nobre, preparação física e foco sob pressão.",
        duracao: "15:30",
      },
      {
        id: "ca57g0N0fT0",
        titulo: "Bastidores do Fisiculturismo: Lívia & Tukalins",
        sinopse: "EP. 07 — A reta final de preparação para o palco e a estética do fisiculturismo clássico.",
        duracao: "14:15",
      },
    ],
  },
];

const desescapar = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

function extrairFeedRecente(xml: string): Video[] {
  const videos: Video[] = [];
  for (const bloco of xml.split("<entry>").slice(1)) {
    const id = bloco.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const titulo = bloco.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const publicado = bloco.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id || !titulo) continue;
    videos.push({
      id,
      titulo: desescapar(titulo).trim(),
      publicado: publicado ? publicado.slice(0, 10) : "",
      url: `https://www.youtube.com/watch?v=${id}`,
    });
  }
  return videos;
}

export async function carregarTrilhas(): Promise<Trilha[]> {
  // Monta todas as Temporadas curadas com numeração sequencial EP. 01..N
  const trilhas: Trilha[] = SERIES_CSFLIX.map((serie) => ({
    id: serie.id,
    temporada: serie.temporada,
    icone: serie.icone,
    nome: serie.nome,
    subtitulo: serie.subtitulo,
    descricao: serie.descricao,
    promessaMaratona: serie.promessaMaratona,
    videos: serie.episodios.map((ep, idx) => ({
      id: ep.id,
      titulo: ep.titulo,
      sinopse: ep.sinopse,
      duracao: ep.duracao,
      publicado: "2026",
      url: `https://www.youtube.com/watch?v=${ep.id}`,
      episodioNumero: idx + 1,
      temporadaTag: serie.temporada,
    })),
  }));

  return trilhas;
}

export function totalDeVideos(trilhas: Trilha[]) {
  return new Set(trilhas.flatMap((t) => t.videos.map((v) => v.id))).size;
}
