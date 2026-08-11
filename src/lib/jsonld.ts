import { LIVROS } from "./biblioteca";
import { calculadora, duvidas, marca, metodo, programa, rotas } from "./content";

/**
 * Dados estruturados. Um único bloco @graph, com os tipos que
 * realmente descrevem este site:
 *
 *  · Person        — identidade (a marca é a pessoa)
 *  · WebSite       — o site em si
 *  · Service       — a consultoria, com o catálogo do que está incluso
 *  · FAQPage       — a seção de dúvidas
 *
 * Sem SearchAction (o site não tem busca) e sem BreadcrumbList
 * (página única — um breadcrumb de um nível só é ruído).
 */
export function jsonLd() {
  const pessoa = `${marca.site}/#pessoa`;
  const servico = `${marca.site}/#servico`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": pessoa,
        name: marca.nome,
        url: marca.site,
        image: `${marca.site}/brand/cs-mark.jpg`,
        jobTitle: "Consultor em treino e nutrição esportiva",
        description:
          "Pesquisador em Ciência de Alimentos e quimioinformática. Consultoria online de treino e dieta com base científica.",
        knowsAbout: [
          "Nutrição esportiva",
          "Emagrecimento",
          "Ciência de Alimentos",
          "Treinamento de força",
        ],
        sameAs: [marca.instagram, marca.youtube, marca.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${marca.site}/#site`,
        url: marca.site,
        name: `${marca.nome} | ${marca.descritor}`,
        inLanguage: "pt-BR",
        publisher: { "@id": pessoa },
      },
      {
        "@type": "Service",
        "@id": servico,
        name: "Consultoria online de treino e dieta",
        serviceType: "Consultoria em treino e nutrição esportiva",
        description:
          "Protocolo individual de nutrição e treino, com diagnóstico, ajustes quinzenais e suporte direto.",
        provider: { "@id": pessoa },
        areaServed: { "@type": "Country", name: "Brasil" },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${marca.site}/#contato`,
          name: "Solicitação de avaliação online",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "O que está incluso",
          itemListElement: programa.itens.map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.titulo,
              description: item.texto,
            },
          })),
        },
        // As etapas do método, na ordem.
        potentialAction: metodo.etapas.map((e, i) => ({
          "@type": "Action",
          name: e.titulo,
          description: e.texto,
          position: i + 1,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${marca.site}/#faq`,
        mainEntity: duvidas.itens.map((item) => ({
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
export function jsonLdBiblioteca() {
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
          "Livros de nutrição, treino e comportamento recomendados por Carlos Seiti, cada um com a justificativa da indicação.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: LIVROS.length,
          itemListElement: LIVROS.map((livro, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Book",
              name: livro.titulo,
              author: { "@type": "Person", name: livro.autor },
              ...(livro.ano ? { datePublished: String(livro.ano) } : {}),
              description: livro.chamada,
              inLanguage: "pt-BR",
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

/**
 * Uma leitura online. `Book` com `readOnlineUrl` é o par certo:
 * diz ao buscador que o conteúdo pode ser lido no próprio site.
 */
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
