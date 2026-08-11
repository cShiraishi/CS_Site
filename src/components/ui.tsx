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
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  tone = "porcelana",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "porcelana" | "branco" | "grafite";
}) {
  const tones = {
    porcelana: "bg-porcelana text-grafite",
    branco: "bg-branco text-grafite",
    grafite: "bg-grafite text-porcelana",
  } as const;

  return (
    <section
      id={id}
      className={`${tones[tone]} scroll-mt-24 py-24 sm:py-32 lg:py-40 ${className}`}
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
      <span
        aria-hidden
        className="rule-gold inline-block h-px w-8 shrink-0"
      />
      {children}
    </p>
  );
}

/** Campo de formulário: só uma linha inferior, que acende em ouro no foco. */
export const campoBase =
  "w-full border-b border-linha bg-transparent py-3 text-[0.98rem] text-grafite transition-colors placeholder:text-grafite/35 focus:border-ouro focus:outline-none";

/** Rótulo curto e espaçado, no padrão do manual. */
export function Rotulo({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="t-eyebrow block text-grafite/50">
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
  variant?: "solid" | "outline" | "ghost";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className">;

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <Link className={`${buttonClass(variant)} ${className}`} {...props}>
      {children}
      <Arrow />
    </Link>
  );
}

export function buttonClass(variant: "solid" | "outline" | "ghost" = "solid") {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap";
  const variants = {
    solid:
      "bg-grafite text-porcelana hover:bg-ouro-profundo shadow-[0_1px_2px_rgba(29,27,25,0.14)]",
    outline:
      "border border-linha text-grafite hover:border-ouro hover:text-ouro-profundo",
    ghost: "text-grafite hover:text-ouro-profundo",
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
