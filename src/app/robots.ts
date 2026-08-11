import type { MetadataRoute } from "next";
import { marca } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Rotas internas do Next não têm valor de indexação.
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: `${marca.site}/sitemap.xml`,
    host: marca.site,
  };
}
