import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Arrow, Container, Eyebrow, buttonClass } from "@/components/ui";
import { marca, nav } from "@/lib/content";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "A página que você procurava não existe mais ou mudou de endereço. Volte ao início para conhecer a consultoria online de treino e dieta.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-porcelana py-24">
      <Container>
        <div className="max-w-xl">
          <Logo size={64} />

          <div className="mt-10">
            <Eyebrow>Erro 404</Eyebrow>
          </div>

          <h1 className="t-display mt-7 text-balance">
            Essa página
            <br />
            mudou de direção.
          </h1>

          <p className="t-sub mt-7 text-pretty text-grafite/70">
            O endereço não existe ou foi movido. O caminho de volta é curto.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <Link href="/" className={buttonClass("solid")}>
              Voltar ao início
              <Arrow />
            </Link>
            <Link href="/#contato" className={buttonClass("outline")}>
              Solicitar avaliação
              <Arrow />
            </Link>
          </div>

          <nav aria-label="Seções do site" className="mt-14">
            <p className="t-eyebrow text-grafite/45">Ou vá direto para</p>
            <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="border-b border-linha pb-1 text-grafite/70 transition-colors hover:border-ouro hover:text-ouro-profundo"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-14 font-display text-lg italic text-grafite/50">
            {marca.assinatura}.
          </p>
        </div>
      </Container>
    </main>
  );
}
