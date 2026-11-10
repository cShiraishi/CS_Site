import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ============================================================
   Primitivas do sistema visual
   07 / linhas delicadas · 08 / espaço negativo · ouro pontual
   ============================================================ */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  tone = "porcelana",
  denso = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "porcelana" | "branco" | "grafite";
  /** respiro curto, para páginas de ferramenta que precisam começar cedo */
  denso?: boolean;
}) {
  const tones = {
    porcelana: "bg-porcelana text-grafite",
    branco: "bg-branco text-grafite",
    grafite: "bg-grafite text-porcelana",
  } as const;

  /*
   * O espaçamento é prop, não classe passada por fora. Mandar `py-10` no
   * `className` não reduz nada: as duas classes ficam na mesma camada e
   * vence a que o Tailwind emite por último, que é `py-24` — o padding
   * pedido some sem aviso e a página fica com o dobro do respiro.
   */
  const espaco = denso ? "py-10 sm:py-16" : "py-24 sm:py-32 lg:py-40";

  return (
    <section
      id={id}
      className={`${tones[tone]} scroll-mt-24 ${espaco} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Rótulo de seção. Ouro como ponto de direção, nunca como decoração. */
export function Eyebrow({
  children,
  tone = "ouro",
}: {
  children: ReactNode;
  tone?: "ouro" | "claro";
}) {
  return (
    <p
      className={`t-eyebrow flex items-center gap-3 ${
        tone === "ouro" ? "text-ouro-profundo" : "text-ouro"
      }`}
    >
      <span aria-hidden className="rule-gold inline-block h-px w-8 shrink-0" />
      {children}
    </p>
  );
}

/**
 * Campo de formulário: só uma linha inferior, que acende em ouro no foco.
 *
 * O placeholder é deliberadamente mais claro que o valor. Com a mesma cor
 * dos dois, o campo vazio parece preenchido — e o formulário inteiro passa
 * a impressão de estar pronto quando não está.
 */
export const campoBase =
  "w-full border-b border-linha bg-transparent py-3 text-[0.98rem] text-grafite transition-colors placeholder:text-grafite/40 focus:border-ouro focus:outline-none";

/** Rótulo curto e espaçado, no padrão do manual. */
export function Rotulo({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="t-eyebrow block text-grafite">
      {children}
    </label>
  );
}

/** Linha delicada — 1 px, equivalente ao 0,5–1,5 pt do manual. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 h-px bg-linha ${className}`} />;
}

type ButtonProps = {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost" | "consultoria";
  className?: string;
  /**
   * Sai por âncora nativa em vez de `Link`.
   *
   * `Link` faz prefetch e navegação client-side: pede o payload RSC do
   * destino. Uma rota que só devolve `Response.redirect` — como
   * `/consultoria` — não tem payload nenhum, e cada botão passa a gritar
   * "Failed to fetch RSC payload" na consola antes de cair para a
   * navegação normal. Para esses, a âncora é o caminho certo.
   */
  nativo?: boolean;
} & Omit<ComponentProps<typeof Link>, "className">;

export function Button({
  children,
  variant = "solid",
  className = "",
  nativo = false,
  ...props
}: ButtonProps) {
  const classe = `${buttonClass(variant)} ${className}`;

  if (nativo) {
    return (
      <a className={classe} href={String(props.href)}>
        {children}
        <Arrow />
      </a>
    );
  }

  return (
    <Link className={classe} {...props}>
      {children}
      <Arrow />
    </Link>
  );
}

export function buttonClass(
  variant: "solid" | "outline" | "ghost" | "consultoria" = "solid",
) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-md px-7 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] transition-all duration-300 text-center sm:whitespace-nowrap";
  /* Tema escuro: o botão principal é ouro chapado com tinta preta — o
     único bloco de cor saturada da tela, para o olho ir direto nele. */
  const variants = {
    solid:
      "bg-ouro text-[#0b0a09] hover:bg-grafite hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(199,160,106,0.25)]",
    outline:
      "border border-grafite/30 text-grafite hover:border-ouro hover:text-ouro-profundo",
    ghost: "text-grafite hover:text-ouro-profundo",
    /* Só para "começar a consultoria". O verde é reservado: a pessoa
       aprende numa tela que verde = começar, e reconhece nas outras. */
    consultoria:
      "bg-verde text-[#06140b] hover:bg-verde-claro hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(31,193,91,0.32)]",
  } as const;
  return `${base} ${variants[variant]}`;
}

/** 02 / A seta ascendente: direção, crescimento e ambição. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12 12 4" />
      <path d="M5.5 4H12v6.5" />
    </svg>
  );
}
