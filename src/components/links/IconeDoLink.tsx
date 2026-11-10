import type { IconeDoLink as Nome } from "@/lib/links";

/**
 * Ícones desenhados na mesma gramática do manual: traço fino, canto redondo,
 * uma ideia por símbolo. Inline porque cinco glifos não justificam biblioteca.
 */
export function IconeDoLink({ nome }: { nome: Nome }) {
  const comum = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    className: "h-[18px] w-[18px]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (nome) {
    case "consultoria":
      return (
        <svg {...comum}>
          <path d="M12 20.5V9" />
          <path d="M7.5 20.5v-6" />
          <path d="M16.5 20.5v-9.5" />
          <path d="M4 8.5 10 4l4 3 6-4.5" />
        </svg>
      );
    case "site":
      return (
        <svg {...comum}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <path d="M12 3.5c2.3 2.4 3.4 5.3 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.3-3.4-8.5S9.7 5.9 12 3.5Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...comum}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.3 9.4v5.2l4.6-2.6-4.6-2.6Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "cupom":
      return (
        <svg {...comum}>
          <path d="M3.5 9.2V6.5a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v2.7a2.8 2.8 0 0 0 0 5.6v2.7a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-2.7a2.8 2.8 0 0 0 0-5.6Z" />
          <path d="M9.5 9.5v5" strokeDasharray="1.5 2.5" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...comum}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...comum}>
          <path d="M20.5 11.7a8.4 8.4 0 0 1-12.5 7.3L3.5 20.5l1.5-4.4A8.4 8.4 0 1 1 20.5 11.7Z" />
          <path d="M9.4 9.1a5.6 5.6 0 0 0 5.5 5.5l1-1.1 1.8 1-.4 1.4c-3.4.5-7.3-3.4-6.8-6.8l1.4-.4 1 1.8-1.1 1" />
        </svg>
      );
  }
}
