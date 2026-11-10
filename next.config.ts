import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URLs sempre sem barra final — uma forma canônica só.
  trailingSlash: false,
  poweredByHeader: false,

  /*
   * Três root layouts (pt, es, en) — um por idioma, para o <html lang>
   * sair certo do servidor. Sem layout único, o 404 de endereço que não
   * casa com rota nenhuma vem de app/global-not-found.tsx.
   */
  experimental: {
    globalNotFound: true,
  },

  /*
   * Os protocolos em PDF vivem em `protocolos/`, fora de `public/`, e são
   * lidos do disco pela rota que os serve. Sem esta linha o rastreador de
   * ficheiros do Next não os vê — nada no código os importa — e a função
   * é publicada sem eles: em produção, todo o download devolveria 500.
   */
  outputFileTracingIncludes: {
    "/api/protocolos/*": ["./protocolos/*.pdf"],
  },

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
      // Um endereço canônico só: www e o *.vercel.app caem no domínio.
      // 308 permanente — aqui não há campanha a mudar de destino.
      {
        source: "/:caminho*",
        has: [{ type: "host", value: "www.carlosseiti.com" }],
        destination: "https://carlosseiti.com/:caminho*",
        permanent: true,
      },
      {
        source: "/:caminho*",
        has: [{ type: "host", value: "carlosseiti.vercel.app" }],
        destination: "https://carlosseiti.com/:caminho*",
        permanent: true,
      },
      // Atalho para caber na bio e na legenda do Reels. Temporário (307) de
      // propósito: 301 fica gravado no navegador e impede mudar o destino da
      // campanha depois. O Next repassa a query string sozinho, então os
      // parâmetros do anúncio chegam inteiros à calculadora.
      { source: "/bf", destination: "/calculadora-de-gordura-corporal", permanent: false },
      // Herdeiros do Linktree: as variacoes que alguem ja possa ter na bio
      // chegam todas a mesma pagina.
      { source: "/link", destination: "/links", permanent: false },
      { source: "/linktree", destination: "/links", permanent: false },
      { source: "/bio", destination: "/links", permanent: false },
    ];
  },
};

export default nextConfig;
