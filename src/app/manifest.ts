import type { MetadataRoute } from "next";
import { marca } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${marca.nome} | ${marca.descritor}`,
    short_name: marca.nome,
    description:
      "Consultoria online de treino e dieta baseada em ciência, com protocolo individual e acompanhamento direto.",
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    // 05 / sistema cromático — porcelana e grafite
    background_color: "#f7f5f2",
    theme_color: "#1d1b19",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
