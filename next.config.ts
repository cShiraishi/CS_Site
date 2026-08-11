import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URLs sempre sem barra final — uma forma canônica só.
  trailingSlash: false,
  poweredByHeader: false,

  images: {
    // AVIF primeiro, WebP como alternativa. O JPEG do render nunca é servido cru.
    formats: ["image/avif", "image/webp"],
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

  // Quando algum endereço antigo precisar apontar para cá, é aqui:
  // async redirects() {
  //   return [{ source: "/consultoria", destination: "/#programa", permanent: true }];
  // },
};

export default nextConfig;
