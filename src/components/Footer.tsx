import Link from "next/link";
import { Logo } from "./Logo";
import { Container, Arrow } from "./ui";
import { marca, nav, rodape } from "@/lib/content";

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-grafite text-porcelana">
      <Container className="py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          {/* Assinatura com respiro amplo (04 / brand book) */}
          <div>
            <div className="flex items-center gap-4">
              <Logo size={56} />
              <div>
                <p className="font-display text-lg tracking-[0.18em]">
                  {marca.nome.toUpperCase()}
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-ouro">
                  {marca.descritor}
                </p>
              </div>
            </div>
            <p className="mt-8 font-display text-2xl italic text-porcelana/80">
              {marca.assinatura}.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Rodapé">
              <p className="t-eyebrow text-porcelana/40">Navegação</p>
              <ul className="mt-5 space-y-3 text-sm">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-porcelana/70 transition-colors hover:text-ouro"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="t-eyebrow text-porcelana/40">Contato</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <Link
                    href={marca.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-porcelana/70 transition-colors hover:text-ouro"
                  >
                    Instagram
                    <Arrow />
                  </Link>
                </li>
                <li>
                  <Link
                    href={marca.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-porcelana/70 transition-colors hover:text-ouro"
                  >
                    WhatsApp
                    <Arrow />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contato"
                    className="text-porcelana/70 transition-colors hover:text-ouro"
                  >
                    Solicitar avaliação
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-14 h-px border-0 bg-porcelana/12" />

        <div className="flex flex-col gap-6 text-xs text-porcelana/40 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-2xl leading-relaxed">{rodape.disclaimer}</p>
          <p className="shrink-0">
            © {ano} {marca.nome}
          </p>
        </div>
      </Container>
    </footer>
  );
}
