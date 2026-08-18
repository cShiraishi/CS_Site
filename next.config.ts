import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URLs sempre sem barra final — uma forma canônica só.
  trailingSlash: false,
  poweredByHeader: false,

  images: {
    // AVIF primeiro, WebP como alternativa. O JPEG do render nunca é servido cru.
    formats: ["image/avif", "image/webp"],
    // miniaturas dos vídeos do canal, no CSFlix
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Os assets da marca não mudam de nome; podem ficar em cache longo.
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Herdeiros do Linktree: as variações que alguém já possa ter guardado
      // chegam todas à mesma página. Temporário (307) de propósito: 301 fica
      // gravado no navegador e impede mudar o destino depois.
      { source: "/link", destination: "/links", permanent: false },
      { source: "/linktree", destination: "/links", permanent: false },
      { source: "/bio", destination: "/links", permanent: false },
    ];
  },
};

export default nextConfig;
