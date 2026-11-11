import type { MetadataRoute } from "next";
import { marca } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Só a API fica de fora. /_next/ NÃO pode ser bloqueado: é de lá
        // que vêm o CSS, o JS e as imagens (next/image) que o Googlebot
        // precisa baixar para renderizar a página.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${marca.site}/sitemap.xml`,
    host: marca.site,
  };
}
