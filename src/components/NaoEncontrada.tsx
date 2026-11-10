import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Arrow, Container, Eyebrow, buttonClass } from "@/components/ui";
import { marca, rotas } from "@/lib/content";
import { obterConteudo } from "@/lib/i18n";
import { rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/** Página 404 nos três idiomas — usada pelos not-found de (pt), es, en e pelo global. */
const TEXTO: Record<
  Idioma,
  {
    seoTitulo: string;
    seoDescricao: string;
    eyebrow: string;
    titulo: [string, string];
    texto: string;
    voltar: string;
    consultoria: string;
    navegacao: string;
    atalhos: string;
  }
> = {
  pt: {
    seoTitulo: "Página não encontrada",
    seoDescricao:
      "A página que você procurava não existe mais ou mudou de endereço. Volte ao início para conhecer a consultoria online de treino e dieta.",
    eyebrow: "Erro 404",
    titulo: ["Essa página", "mudou de direção."],
    texto: "O endereço não existe ou foi movido. O caminho de volta é curto.",
    voltar: "Voltar ao início",
    consultoria: "Começar consultoria",
    navegacao: "Seções do site",
    atalhos: "Ou vá direto para",
  },
  es: {
    seoTitulo: "Página no encontrada",
    seoDescricao:
      "La página que buscabas ya no existe o cambió de dirección. Vuelve al inicio para conocer la asesoría online de entrenamiento y nutrición.",
    eyebrow: "Error 404",
    titulo: ["Esta página", "cambió de rumbo."],
    texto: "La dirección no existe o se ha movido. El camino de vuelta es corto.",
    voltar: "Volver al inicio",
    consultoria: "Empezar asesoría",
    navegacao: "Secciones del sitio",
    atalhos: "O ve directo a",
  },
  en: {
    seoTitulo: "Page not found",
    seoDescricao:
      "The page you were looking for no longer exists or has moved. Head back home to learn about online training and nutrition coaching.",
    eyebrow: "Error 404",
    titulo: ["This page", "changed direction."],
    texto: "This address doesn't exist or has moved. The way back is short.",
    voltar: "Back to home",
    consultoria: "Start coaching",
    navegacao: "Site sections",
    atalhos: "Or go straight to",
  },
};

export function metadataNaoEncontrada(idioma: Idioma): Metadata {
  return {
    title: TEXTO[idioma].seoTitulo,
    description: TEXTO[idioma].seoDescricao,
    robots: { index: false, follow: true },
  };
}

export function NaoEncontrada({ idioma }: { idioma: Idioma }) {
  const tx = TEXTO[idioma];
  const t = obterConteudo(idioma);
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-porcelana py-24">
      <Container>
        <div className="max-w-xl">
          <Logo size={64} idioma={idioma} />

          <div className="mt-10">
            <Eyebrow>{tx.eyebrow}</Eyebrow>
          </div>

          <h1 className="t-display mt-7 text-balance">
            {tx.titulo[0]}
            <br />
            {tx.titulo[1]}
          </h1>

          <p className="t-sub mt-7 text-pretty text-grafite">{tx.texto}</p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <Link href={t.rotaHome} className={buttonClass("solid")}>
              {tx.voltar}
              <Arrow />
            </Link>
            <a href={`${rotas.consultoria}?de=404`} className={buttonClass("consultoria")}>
              {tx.consultoria}
              <Arrow />
            </a>
          </div>

          <nav aria-label={tx.navegacao} className="mt-14">
            <p className="t-eyebrow text-grafite">{tx.atalhos}</p>
            <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={rotaIdioma(idioma, item.href)}
                    className="border-b border-linha pb-1 text-grafite transition-colors hover:border-ouro hover:text-ouro-profundo"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-14 font-display text-lg italic text-grafite">
            {idioma === "pt" ? marca.assinatura : t.marca.assinatura}.
          </p>
        </div>
      </Container>
    </main>
  );
}
