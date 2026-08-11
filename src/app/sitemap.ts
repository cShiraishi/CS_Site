import type { MetadataRoute } from "next";
import { marca, rotas } from "@/lib/content";

/**
 * Regenerado a cada build — `lastModified` acompanha o deploy.
 * As seções da home são âncoras, não URLs, e âncoras não entram
 * em sitemap (o Google as descobre pelo conteúdo).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return [
    {
      url: marca.site,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${marca.site}${rotas.calculadora}`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${marca.site}${rotas.biblioteca}`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
