import type { CSSProperties, ReactNode } from "react";
import type { Curso, IconeCurso } from "@/lib/cursos";

/**
 * Capa de um módulo, desenhada em código (sem imagem): ícone grande,
 * selo "Módulo N", título, duração e resultado. A cor vem de --tom —
 * os tokens verde/ouro já viram rosé no Modo Ela, então a vitrine
 * acompanha o modo sozinha.
 *
 * Sem hooks: serve à vitrine (client) e à conta do aluno (server).
 */

const TOM: Record<Curso["tom"], string> = {
  verde: "var(--color-verde)",
  lima: "color-mix(in srgb, var(--color-verde) 55%, var(--color-ouro))",
  ouro: "var(--color-ouro)",
};

export function estiloTom(tom: Curso["tom"]): CSSProperties {
  return { "--tom": TOM[tom] } as CSSProperties;
}

export function IconeDoCurso({ icone, className = "" }: { icone: IconeCurso; className?: string }) {
  const p = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (icone) {
    case "nutricao":
      return (
        <svg {...p}>
          <path d="M24 14c-3-4-9-4-12 0-4 5-2 16 3 21 3 3 6 3 9 1 3 2 6 2 9-1 5-5 7-16 3-21-3-4-9-4-12 0Z" />
          <path d="M24 14c0-4 2-7 6-8" />
          <path d="M24 13c-3-1-5-3-6-6 4 0 6 2 6 6Z" />
        </svg>
      );
    case "halter":
      return (
        <svg {...p}>
          <path d="M16 24h16" />
          <rect x="9" y="15" width="7" height="18" rx="2" />
          <rect x="32" y="15" width="7" height="18" rx="2" />
          <path d="M5 20v8M43 20v8" />
        </svg>
      );
    case "anilha":
      return (
        <svg {...p}>
          <circle cx="20" cy="24" r="13" />
          <circle cx="20" cy="24" r="4" />
          <path d="M20 11a13 13 0 0 1 0 26" opacity=".5" />
          <path d="M24 24h20" />
        </svg>
      );
    case "camadas":
      return (
        <svg {...p}>
          <path d="m24 8 17 8-17 8-17-8 17-8Z" />
          <path d="m7 24 17 8 17-8" />
          <path d="m7 32 17 8 17-8" />
        </svg>
      );
    case "trofeu":
      return (
        <svg {...p}>
          <path d="M15 8h18v9a9 9 0 0 1-18 0V8Z" />
          <path d="M15 11H8v3a7 7 0 0 0 7 7M33 11h7v3a7 7 0 0 1-7 7" />
          <path d="M24 26v7M17 40h14M19 40l1-7h8l1 7" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <rect x="5" y="9" width="38" height="25" rx="3" />
          <path d="M2 39h44" />
          <path d="m21 16 8 5.5-8 5.5Z" fill="currentColor" />
        </svg>
      );
    case "talheres":
      return (
        <svg {...p}>
          <path d="M14 6v12a4 4 0 0 0 8 0V6M18 6v36" />
          <path d="M34 42V6c-4 2-6 8-6 14 0 3 2 5 6 5" />
        </svg>
      );
    case "calendario":
      return (
        <svg {...p}>
          <rect x="7" y="10" width="34" height="31" rx="3" />
          <path d="M7 18h34M16 6v8M32 6v8" />
          <path d="m15 28 3 3 5-6M27 28l3 3 5-6" />
        </svg>
      );
    case "tigela":
      return (
        <svg {...p}>
          <path d="M6 24h36a18 18 0 0 1-36 0Z" />
          <path d="M18 18c0-3 2-4 2-7M26 18c0-3 2-4 2-7" />
        </svg>
      );
    case "grafico":
      return (
        <svg {...p}>
          <path d="M8 40h34" />
          <path d="M12 40V30M20 40V24M28 40V27M36 40V16" />
          <path d="m10 22 9-8 7 5 12-11M32 8h6v6" />
        </svg>
      );
    case "montanha":
      return (
        <svg {...p}>
          <path d="m4 40 14-22 7 10 5-6 14 18Z" />
          <path d="M18 18V6l9 3-9 3" />
        </svg>
      );
  }
}

function Cadeado({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/**
 * Pôster de um curso ou cartão de um módulo. Fica dentro de um link ou
 * botão com a classe `group`: é o pai que dá o hover (sobe, acende o
 * brilho e mostra o "Ver detalhes").
 */
export function CapaCurso({
  tom,
  icone,
  selo,
  titulo,
  chip,
  texto,
  status,
  bloqueado = false,
  acao,
  formato = "poster",
}: {
  tom: Curso["tom"];
  icone: IconeCurso;
  selo: string;
  titulo: string;
  chip?: string;
  texto: string;
  /** pílula do rodapé ("Disponível · R$ 47", "Em breve", "Liberado") */
  status?: ReactNode;
  bloqueado?: boolean;
  /** texto que aparece no hover ("Ver detalhes →") */
  acao?: string;
  formato?: "poster" | "cartao";
}) {
  const poster = formato === "poster";
  return (
    <div
      style={estiloTom(tom)}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-(--tom)/40 bg-[#070807] p-4 shadow-[0_0_24px_color-mix(in_srgb,var(--tom)_14%,transparent)] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-(--tom) group-hover:shadow-[0_18px_50px_color-mix(in_srgb,var(--tom)_38%,transparent)] group-focus-visible:-translate-y-1.5 group-focus-visible:border-(--tom) motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 sm:p-5 ${
        poster ? "min-h-[23rem]" : "min-h-[19rem]"
      }`}
    >
      {/* Brilho de fundo na cor do módulo; cresce no hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,color-mix(in_srgb,var(--tom)_30%,transparent),transparent_60%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <span className="relative self-start rounded-md bg-(--tom) px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider text-[#0b0a09]">
        {selo}
      </span>

      <IconeDoCurso
        icone={icone}
        className={`relative mx-auto my-4 shrink-0 text-(--tom) drop-shadow-[0_0_18px_color-mix(in_srgb,var(--tom)_60%,transparent)] transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none ${
          poster ? "size-20 sm:size-24" : "size-16"
        } ${bloqueado ? "opacity-55" : ""}`}
      />

      <div className="relative mt-auto">
        <p
          className={`font-display uppercase leading-[0.95] text-[#f2ede5] ${
            poster ? "text-[1.7rem] sm:text-3xl" : "text-2xl"
          }`}
        >
          {titulo}
        </p>
        {chip && (
          <span className="mt-2 inline-block rounded-md border border-(--tom)/60 bg-(--tom)/15 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-(--tom)">
            {chip}
          </span>
        )}
        <p className="mt-2 text-xs font-medium leading-snug text-[#f2ede5]/80 sm:text-[0.8rem]">{texto}</p>
        {status && (
          <p
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${
              bloqueado
                ? "bg-white/8 text-[#f2ede5]/70 ring-1 ring-inset ring-white/15"
                : "bg-(--tom) text-[#0b0a09]"
            }`}
          >
            {bloqueado && <Cadeado className="size-3" />}
            {status}
          </p>
        )}
        {acao && (
          <p className="mt-3 max-h-0 overflow-hidden text-xs font-bold uppercase tracking-wider text-(--tom) opacity-0 transition-all duration-300 group-hover:max-h-6 group-hover:opacity-100 group-focus-visible:max-h-6 group-focus-visible:opacity-100">
            {acao} →
          </p>
        )}
      </div>
    </div>
  );
}
