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
  duracao?: string;
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
  /** episódios já curados, na ordem editorial da série */
  episodios?: string[];
  /** enquanto não há playlist, agrupa o feed do canal por palavra */
  palavras?: string[];
  excluir?: string[];
};

export const TRILHAS: ConfigTrilha[] = [
  {
    id: "lancamentos",
    nome: "Lançamentos",
    descricao: "Os episódios longos mais recentes do canal.",
  },
  {
    id: "sessoes-brutas",
    nome: "Série · Sessões Brutas",
    descricao: "Treinos completos, execução real e o que acontece depois da última série.",
    episodios: ["68Rxs5iP32A", "p1LL2brbwe8", "DN8HMhT2Elw", "Xuat0DwvjR4"],
    palavras: ["treino", "leg day", "ombro", "perna", "pós-legday", "gym"],
    excluir: ["menstruação"],
  },
  {
    id: "true-shape",
    nome: "Série · Projeto True Shape",
    descricao: "Transformação, desafios e acompanhamento sem esconder o processo.",
    episodios: ["rmzMP-LsuOQ", "8u9vHL5cE0w", "VI0eleGqumA", "pLDvj0_EocQ", "uhww5Mzvy1I", "d2imA9F6UbI", "ZFcpJenQdHo", "r9oFfFtCgdE"],
    palavras: ["shape", "true shape", "desafio", "ganhou 10kg", "180kgs"],
  },
  {
    id: "conversas",
    nome: "Série · Conversas que Formam",
    descricao: "Doutorado, carreira, esporte e decisões explicadas por quem vive o tema.",
    episodios: ["CryXN-5LhXs", "rtd8u5Cfies", "oOpriO5YJ8g", "WQLA9id1s7E", "bI6hA1gS6sk", "-6oc99Gh5gg", "9oHT6bC-20k"],
    palavras: ["papo com", "doutorado", "mentalidade", "mindset", "explica", "o que é"],
  },
  {
    id: "ciencia-aplicada",
    nome: "Série · Ciência Aplicada",
    descricao: "Pesquisa, dados e ferramentas científicas traduzidos em prática.",
    episodios: ["CryXN-5LhXs", "rtd8u5Cfies", "GVMcSQf7hxE", "1Zwr8UrtOEo", "nCAufgJ4IWw", "p1XZPvSNm3g", "AnwFEVx-HEU"],
    palavras: ["ciência", "doutorado", "dados", "python", "chembl", "qsar", "pymol", "menstruação"],
  },
  {
    id: "nutricao-real",
    nome: "Série · Nutrição no Mundo Real",
    descricao: "Produtos, suplementação e alimentação avaliados fora da propaganda.",
    episodios: ["itJ06wOXEbM", "-fUAu0CSUVA", "6Ty3OJYTwoY"],
    palavras: ["produto", "suplement", "plant-based", "nutrição", "dieta"],
  },
  {
    id: "fora-da-curva",
    nome: "Série · Fora da Curva",
    descricao: "Esporte, eventos e histórias de quem escolheu uma trajetória incomum.",
    episodios: ["-6oc99Gh5gg", "WQLA9id1s7E", "qer5ATqTGN8", "ca57g0N0fT0", "9oHT6bC-20k"],
    palavras: ["boxe", "crossfit", "evento", "fisicultur", "campeão", "atleta"],
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

/** A aba `/videos` do canal já exclui Shorts na origem. */
async function buscarVideosTradicionais(): Promise<Video[]> {
  try {
    const r = await fetch(`https://www.youtube.com/channel/${CANAL}/videos`, {
      next: { revalidate: 3600 },
      headers: {
        cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+410",
        "accept-language": "pt-BR",
      },
    });
    if (!r.ok) return [];

    const html = await r.text();
    const json = html.match(/var ytInitialData = (\{[\s\S]+?\});<\/script>/)?.[1];
    if (!json) return [];

    const encontrados = new Map<string, Video>();
    const visitar = (valor: unknown) => {
      if (!valor || typeof valor !== "object") return;
      const objeto = valor as Record<string, unknown>;
      const lockup = objeto.lockupViewModel as Record<string, unknown> | undefined;
      const id = lockup?.contentId;
      const metadata = lockup?.metadata as Record<string, unknown> | undefined;
      const view = metadata?.lockupMetadataViewModel as Record<string, unknown> | undefined;
      const titulo = (view?.title as Record<string, unknown> | undefined)?.content;
      const imagem = JSON.stringify(lockup?.contentImage ?? {});
      const duracao = imagem.match(/"text":"(\d{1,2}:\d{2}(?::\d{2})?)"/)?.[1];
      const linhas = ((view?.metadata as Record<string, unknown> | undefined)
        ?.contentMetadataViewModel as Record<string, unknown> | undefined)
        ?.metadataRows as Array<Record<string, unknown>> | undefined;
      const partes = (linhas?.[0]?.metadataParts ?? []) as Array<Record<string, unknown>>;
      const publicado = ((partes[1]?.text as Record<string, unknown> | undefined)?.content as string | undefined) ?? "";

      if (typeof id === "string" && typeof titulo === "string" && !encontrados.has(id)) {
        encontrados.set(id, {
          id,
          titulo,
          publicado,
          duracao,
          url: `https://www.youtube.com/watch?v=${id}`,
        });
      }

      Object.values(objeto).forEach(visitar);
    };

    visitar(JSON.parse(json));
    return [...encontrados.values()].slice(0, 30);
  } catch {
    return [];
  }
}

/**
 * O feed RSS mistura vídeos tradicionais e Shorts e não informa o formato.
 * A página pública expõe uma URL canônica `/shorts/…` para esse formato.
 * O cookie apenas evita a tela regional de consentimento; não identifica o usuário.
 */
async function videoTradicional(video: Video): Promise<Video | null> {
  try {
    const r = await fetch(`https://www.youtube.com/watch?v=${video.id}`, {
      next: { revalidate: 3600 },
      headers: { cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+410" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!r.ok) return null;
    const html = await r.text();
    return html.includes('"canonicalUrl":"https://www.youtube.com/shorts/')
      ? null
      : video;
  } catch {
    // Falha fechada: se não foi possível confirmar o formato, não arriscamos
    // colocar um Short no catálogo.
    return null;
  }
}

async function filtrarTradicionais(videos: Video[]) {
  const aprovados: Video[] = [];
  // Lotes pequenos evitam bloqueio do YouTube e pico de memória no servidor.
  for (let i = 0; i < videos.length; i += 4) {
    const lote = await Promise.all(videos.slice(i, i + 4).map(videoTradicional));
    aprovados.push(...lote.filter((video): video is Video => video !== null));
  }
  return aprovados;
}

const combina = (titulo: string, palavras: string[]) => {
  const t = titulo.toLowerCase();
  return palavras.some((p) => t.includes(p));
};

function montarSerie(config: ConfigTrilha, catalogo: Video[]) {
  const porId = new Map(catalogo.map((video) => [video.id, video]));
  const curados = (config.episodios ?? [])
    .map((id) => porId.get(id))
    .filter((video): video is Video => Boolean(video));
  const idsCurados = new Set(curados.map((video) => video.id));
  const novos = config.palavras
    ? catalogo.filter(
        (video) =>
          !idsCurados.has(video.id) &&
          combina(video.titulo, config.palavras!) &&
          !(config.excluir && combina(video.titulo, config.excluir)),
      )
    : [];
  return [...curados, ...novos];
}

export async function carregarTrilhas(): Promise<Trilha[]> {
  const doCanal = await buscarVideosTradicionais();

  const trilhas = await Promise.all(
    TRILHAS.map(async (c): Promise<Trilha> => {
      if (c.playlist) {
        const feedDaPlaylist = await buscarFeed(
          `https://www.youtube.com/feeds/videos.xml?playlist_id=${c.playlist}`,
        );
        return {
          ...c,
          videos: await filtrarTradicionais(feedDaPlaylist),
        };
      }
      if (c.palavras || c.episodios) {
        return { ...c, videos: montarSerie(c, doCanal) };
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
