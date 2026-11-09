import type { MetadataRoute } from "next";
import { marca, rotas } from "@/lib/content";
import { listarLeituras } from "@/lib/leituras";

/**
 * Regenerado a cada build — `lastModified` acompanha o deploy.
 * As seções da home são âncoras, não URLs, e âncoras não entram
 * em sitemap (o Google as descobre pelo conteúdo).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();
  const leituras = await listarLeituras();

  return [
    {
      url: marca.site,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${marca.site}/es`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${marca.site}/en`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      /* O funil é a porta do produto: prioridade acima das ferramentas. */
      url: `${marca.site}${rotas.programa}`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${marca.site}${rotas.calculadora}`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${marca.site}${rotas.gordura}`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${marca.site}${rotas.prato}`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${marca.site}${rotas.raioX}`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${marca.site}${rotas.postura}`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${marca.site}${rotas.csflix}`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${marca.site}${rotas.receitas}`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${marca.site}${rotas.biblioteca}`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${marca.site}${rotas.links}`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...leituras.map((slug) => ({
      url: `${marca.site}/leitura/${slug}`,
      lastModified: agora,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
