import { calculadora, marca, rotas } from "./content";
import { obterConteudo, type Idioma } from "./i18n";
import type { Leitura } from "./leituras";

/** Textos do JSON-LD da home que não vêm do conteúdo traduzido. */
const SEO_HOME: Record<
  Idioma,
  {
    inLanguage: string;
    jobTitle: string;
    pessoa: string;
    conhecimentos: string[];
    servico: string;
    tipoServico: string;
    descricaoServico: string;
    canal: string;
    catalogo: string;
  }
> = {
  pt: {
    inLanguage: "pt-BR",
    jobTitle: "Consultor em treino e nutrição esportiva",
    pessoa: "Pesquisador em Ciência de Alimentos e quimioinformática. Consultoria online de treino e dieta com base científica.",
    conhecimentos: ["Nutrição esportiva", "Emagrecimento", "Ciência de Alimentos", "Treinamento de força"],
    servico: "Consultoria online de treino e dieta",
    tipoServico: "Consultoria em treino e nutrição esportiva",
    descricaoServico: "Protocolo individual de nutrição e treino, com diagnóstico, ajustes quinzenais e suporte direto.",
    canal: "Solicitação de avaliação online",
    catalogo: "O que está incluso",
  },
  es: {
    inLanguage: "es",
    jobTitle: "Asesor en entrenamiento y nutrición deportiva",
    pessoa: "Investigador en Ciencia de los Alimentos y quimioinformática. Asesoría online de entrenamiento y dieta con base científica.",
    conhecimentos: ["Nutrición deportiva", "Pérdida de grasa", "Ciencia de los Alimentos", "Entrenamiento de fuerza"],
    servico: "Asesoría online de entrenamiento y dieta",
    tipoServico: "Asesoría en entrenamiento y nutrición deportiva",
    descricaoServico: "Protocolo individual de nutrición y entrenamiento, con diagnóstico, ajustes quincenales y soporte directo.",
    canal: "Solicitud de evaluación online",
    catalogo: "Qué incluye",
  },
  en: {
    inLanguage: "en",
    jobTitle: "Training and sports nutrition coach",
    pessoa: "Food Science and cheminformatics researcher. Evidence-based online training and nutrition coaching.",
    conhecimentos: ["Sports nutrition", "Fat loss", "Food Science", "Strength training"],
    servico: "Online training and nutrition coaching",
    tipoServico: "Training and sports nutrition coaching",
    descricaoServico: "Individual nutrition and training protocol, with assessment, biweekly adjustments and direct support.",
    canal: "Online assessment request",
    catalogo: "What's included",
  },
};

/**
 * Dados estruturados da home, no idioma da página. Um único @graph:
 *
 *  · Person   — identidade (a marca é a pessoa; mesmo @id nos 3 idiomas)
 *  · WebSite  — o site, com os três idiomas
 *  · Service  — a consultoria, com o catálogo do que está incluso
 *  · FAQPage  — as dúvidas VISÍVEIS na página, no idioma dela (o Google
 *               exige que o FAQ marcado seja o mesmo que está na tela)
 *
 * Sem SearchAction (o site não tem busca) e sem areaServed: com ES/EN no
 * ar, "Brasil" deixou de ser verdade.
 */
export function jsonLd(idioma: Idioma = "pt") {
  const t = obterConteudo(idioma);
  const s = SEO_HOME[idioma];
  const pagina = idioma === "pt" ? marca.site : `${marca.site}${t.rotaHome}`;
  const pessoa = `${marca.site}/#pessoa`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": pessoa,
        name: marca.nome,
        url: marca.site,
        image: `${marca.site}/brand/cs-mark.jpg`,
        jobTitle: s.jobTitle,
        description: s.pessoa,
        knowsAbout: s.conhecimentos,
        sameAs: [marca.instagram, marca.youtube, marca.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${marca.site}/#site`,
        url: marca.site,
        name: `${marca.nome} | ${t.marca.descritor}`,
        inLanguage: ["pt-BR", "es", "en"],
        publisher: { "@id": pessoa },
      },
      {
        "@type": "Service",
        "@id": `${pagina}#servico`,
        name: s.servico,
        serviceType: s.tipoServico,
        description: s.descricaoServico,
        inLanguage: s.inLanguage,
        provider: { "@id": pessoa },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${pagina}#contato`,
          name: s.canal,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: s.catalogo,
          itemListElement: t.programa.itens.map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.titulo,
              description: item.texto,
            },
          })),
        },
        // As etapas do método, na ordem.
        potentialAction: t.metodo.etapas.map((e, i) => ({
          "@type": "Action",
          name: e.titulo,
          description: e.texto,
          position: i + 1,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pagina}#faq`,
        inLanguage: s.inLanguage,
        mainEntity: t.duvidas.itens.map((item) => ({
          "@type": "Question",
          name: item.p,
          acceptedAnswer: { "@type": "Answer", text: item.r },
        })),
      },
    ],
  };
}

/**
 * Página da calculadora.
 *
 *  · WebApplication  — é uma ferramenta, e gratuita (Offer com preço 0)
 *  · BreadcrumbList  — agora existe hierarquia real: Início › Calculadora
 */
export function jsonLdCalculadora() {
  const url = `${marca.site}${calculadora.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Calculadora de calorias basais",
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: "Todos — roda no navegador",
        inLanguage: "pt-BR",
        description:
          "Calcula a taxa metabólica basal e o gasto energético diário por Mifflin-St Jeor, Harris-Benedict ou Katch-McArdle.",
        featureList: [
          "Taxa metabólica basal (TMB)",
          "Gasto energético total (GET)",
          "Alvos de emagrecimento, manutenção e ganho de massa",
          "Faixa diária de proteína",
        ],
        author: { "@id": `${marca.site}/#pessoa` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "Calculadora de calorias", item: url },
        ],
      },
    ],
  };
}

/**
 * Biblioteca: CollectionPage com um ItemList de Book.
 * Cada livro entra com título, autor e o motivo de estar na lista.
 */
export function jsonLdBiblioteca(livros: Leitura[]) {
  const url = `${marca.site}${rotas.biblioteca}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#pagina`,
        url,
        name: "Biblioteca",
        inLanguage: "pt-BR",
        author: { "@id": `${marca.site}/#pessoa` },
        description:
          "Guias de nutrição, treino, postura e método escritos por Carlos Seiti, para ler online.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: livros.length,
          itemListElement: livros.map((livro, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Book",
              name: livro.titulo,
              ...(livro.subtitulo ? { description: livro.subtitulo } : {}),
              numberOfPages: livro.total,
              author: { "@id": `${marca.site}/#pessoa` },
              inLanguage: "pt-BR",
              url: `${marca.site}/leitura/${livro.slug}`,
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "Biblioteca", item: url },
        ],
      },
    ],
  };
}

export function jsonLdLeitura(livro: {
  slug: string;
  titulo: string;
  subtitulo: string | null;
  total: number;
}) {
  const url = `${marca.site}/leitura/${livro.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": `${url}#livro`,
        name: livro.titulo,
        ...(livro.subtitulo ? { description: livro.subtitulo } : {}),
        numberOfPages: livro.total,
        inLanguage: "pt-BR",
        author: { "@id": `${marca.site}/#pessoa` },
        workExample: {
          "@type": "Book",
          bookFormat: "https://schema.org/EBook",
          readOnlineUrl: url,
          isAccessibleForFree: true,
          inLanguage: "pt-BR",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          {
            "@type": "ListItem",
            position: 2,
            name: "Biblioteca",
            item: `${marca.site}${rotas.biblioteca}`,
          },
          { "@type": "ListItem", position: 3, name: livro.titulo, item: url },
        ],
      },
    ],
  };
}

/** Raio-X Postural — ferramenta gratuita, como a calculadora. */
export function jsonLdRaioX() {
  const url = `${marca.site}${rotas.raioX}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Raio-X Postural",
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: "Todos — roda no navegador",
        inLanguage: "pt-BR",
        description:
          "Identifica o padrão postural pelo teste da parede e devolve os exercícios correspondentes, com dose e ponto de falha.",
        featureList: [
          "Teste da parede guiado",
          "Quatro padrões posturais ilustrados",
          "Doze exercícios com dose e execução",
          "Protocolo de oito semanas em três fases",
        ],
        author: { "@id": `${marca.site}/#pessoa` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "Raio-X Postural", item: url },
        ],
      },
    ],
  };
}

/** Calculadora de gordura corporal — porta de entrada do tráfego social. */
export function jsonLdGordura() {
  const url = `${marca.site}${rotas.gordura}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Calculadora de gordura corporal",
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: "Todos — roda no navegador",
        inLanguage: "pt-BR",
        description:
          "Estima o percentual de gordura corporal por circunferências (método da Marinha dos EUA) e devolve calorias, macros e prazo até o percentual desejado.",
        featureList: [
          "Estimativa por fita métrica, sem bioimpedância",
          "Resultado em faixa, com o erro do método declarado",
          "Classificação nas faixas do American Council on Exercise",
          "Escala visual para escolher o percentual desejado",
          "Peso alvo com massa magra preservada",
          "Calorias, macros e prazo estimado em semanas",
        ],
        author: { "@id": `${marca.site}/#pessoa` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "Calculadora de gordura corporal", item: url },
        ],
      },
    ],
  };
}

/** Calculadora do Prato — ferramenta gratuita, como as outras duas. */
export function jsonLdPrato() {
  const url = `${marca.site}${rotas.prato}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Calculadora do Prato",
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: "Todos — roda no navegador",
        inLanguage: "pt-BR",
        description:
          "Monta o prato de restaurante com referências visuais de porção e estima calorias, proteína, carboidrato e gordura em faixa.",
        featureList: [
          "Tabela de alimentos de restaurante brasileiro",
          "Porção medida pela mão, sem balança",
          "Calorias e macros como faixa de estimativa",
          "Comparação com a meta diária de calorias",
          "Sugestão de trocas de menor densidade energética",
        ],
        author: { "@id": `${marca.site}/#pessoa` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "Calculadora do Prato", item: url },
        ],
      },
    ],
  };
}

/** CSFlix — coleção de vídeos do canal. */
export function jsonLdCSFlix(total: number) {
  const url = `${marca.site}${rotas.csflix}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#pagina`,
        url,
        name: "CSFlix",
        inLanguage: "pt-BR",
        author: { "@id": `${marca.site}/#pessoa` },
        description: `Os vídeos do canal Carlos Seiti TV organizados por área: treino, culturismo de competição, nutrição e método. ${total} vídeos em exibição.`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "CSFlix", item: url },
        ],
      },
    ],
  };
}


/** Receitas Fit — coleção de receitas no estilo CSFlix. */
export function jsonLdReceitas(total: number) {
  const url = `${marca.site}${rotas.receitas}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#pagina`,
        url,
        name: "Receitas Fit — CSFlix",
        inLanguage: "pt-BR",
        author: { "@id": `${marca.site}/#pessoa` },
        description: `Receitas fit práticas com macros calculados e base em Ciência de Alimentos. ${total} receitas disponíveis.`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: marca.site },
          { "@type": "ListItem", position: 2, name: "Receitas", item: url },
        ],
      },
    ],
  };
}
