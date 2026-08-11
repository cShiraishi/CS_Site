/**
 * CSFlix — os vídeos do canal, organizados em trilhas.
 *
 * A fonte são os feeds RSS públicos do YouTube: não exigem chave de API
 * nem consomem cota, e funcionam no build e na revalidação.
 *
 * Limite importante: cada feed devolve os 15 vídeos mais recentes.
 * O feed do canal dá os 15 últimos de todos os 640; o feed de uma
 * playlist dá os 15 últimos daquela playlist. Por isso as trilhas de
 * verdade vêm de playlists — cada uma traz a sua própria janela de 15.
 *
 * Para acrescentar uma trilha: cria a playlist no YouTube (pública),
 * copia o id que aparece na URL depois de `list=` e junta-o aqui.
 */

const CANAL = "UCSq4rGIePKS1u0ODvYsmR7w";

export type Video = {
  id: string;
  titulo: string;
  publicado: string;
  url: string;
};

export type Trilha = {
  id: string;
  nome: string;
  descricao: string;
  videos: Video[];
};

type ConfigTrilha = {
  id: string;
  nome: string;
  descricao: string;
  /** id da playlist do YouTube — a forma preferida */
  playlist?: string;
  /** enquanto não há playlist, agrupa o feed do canal por palavra */
  palavras?: string[];
};

export const TRILHAS: ConfigTrilha[] = [
  {
    id: "recentes",
    nome: "Mais recentes",
    descricao: "O que saiu por último no canal.",
  },
  {
    id: "treino",
    nome: "Treino",
    descricao: "Sessões, execução e bastidores do ginásio.",
    palavras: [
      "treino", "leg day", "ombro", "peito", "costas", "braço", "perna",
      "agachamento", "supino", "levantamento", "série", "carga", "gym",
    ],
  },
  {
    id: "culturismo",
    nome: "Culturismo e competição",
    descricao: "Preparação, palco e o que acontece nos bastidores.",
    palavras: [
      "competição", "campeonato", "palco", "pose", "classic", "bodybuilding",
      "shape", "prep", "categoria", "atleta",
    ],
  },
  {
    id: "nutricao",
    nome: "Nutrição e suplementos",
    descricao: "O que funciona, em que dose, e o que é marketing.",
    palavras: [
      "suplemento", "dieta", "proteína", "creatina", "nutrição", "comer",
      "caloria", "macro", "whey", "carboidrato", "jejum",
    ],
  },
  {
    id: "mente",
    nome: "Mente e método",
    descricao: "Foco, hábito e a ciência por trás do processo.",
    palavras: [
      "mente", "foco", "estudo", "ciência", "evidência", "hábito", "sono",
      "produtividade", "mercado", "carreira",
    ],
  },
];

/* ── leitura dos feeds ─────────────────────────────────────── */

const desescapar = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

/** Parser mínimo por regex: o formato do feed é fixo e não justifica dependência. */
function extrair(xml: string): Video[] {
  const videos: Video[] = [];

  for (const bloco of xml.split("<entry>").slice(1)) {
    const id = bloco.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const titulo = bloco.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const publicado = bloco.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id || !titulo) continue;

    videos.push({
      id,
      titulo: desescapar(titulo).trim(),
      publicado: publicado ?? "",
      url: `https://www.youtube.com/watch?v=${id}`,
    });
  }

  return videos;
}

async function buscarFeed(url: string): Promise<Video[]> {
  try {
    const r = await fetch(url, {
      // uma hora: vídeo novo aparece sem precisar de deploy
      next: { revalidate: 3600 },
    });
    if (!r.ok) return [];
    return extrair(await r.text());
  } catch {
    // O YouTube fora do ar não pode derrubar a página inteira.
    return [];
  }
}

const combina = (titulo: string, palavras: string[]) => {
  const t = titulo.toLowerCase();
  return palavras.some((p) => t.includes(p));
};

export async function carregarTrilhas(): Promise<Trilha[]> {
  const doCanal = await buscarFeed(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CANAL}`,
  );

  const trilhas = await Promise.all(
    TRILHAS.map(async (c): Promise<Trilha> => {
      if (c.playlist) {
        return {
          ...c,
          videos: await buscarFeed(
            `https://www.youtube.com/feeds/videos.xml?playlist_id=${c.playlist}`,
          ),
        };
      }
      if (c.palavras) {
        return { ...c, videos: doCanal.filter((v) => combina(v.titulo, c.palavras!)) };
      }
      return { ...c, videos: doCanal };
    }),
  );

  // trilha vazia não vira faixa vazia na tela
  return trilhas.filter((t) => t.videos.length > 0);
}

export function totalDeVideos(trilhas: Trilha[]) {
  return new Set(trilhas.flatMap((t) => t.videos.map((v) => v.id))).size;
}
