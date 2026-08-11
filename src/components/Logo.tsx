import Image from "next/image";
import { marca } from "@/lib/content";

/**
 * 03 / LOGOTIPO PRINCIPAL — versão preferencial.
 * A versão tridimensional em branco e ouro é a expressão principal da marca.
 *
 * O render vive sobre o papel marfim original do manual; a classe `paper`
 * reproduz esse mesmo papel para que o recorte desapareça na placa.
 * Tamanho mínimo digital do manual: 48 px.
 */
export function Logo({
  size = 48,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  /** Só o logotipo acima da dobra deve pré-carregar; o resto entra em lazy. */
  priority?: boolean;
}) {
  return (
    <span
      className={`paper relative block shrink-0 overflow-hidden rounded-[22%] ring-1 ring-linha ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/cs-mark.jpg"
        alt={`Monograma ${marca.monograma}`}
        width={1024}
        height={1024}
        sizes={`${size}px`}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

/**
 * 04 / ASSINATURA NOMINAL SUGERIDA — opcional, com respiro amplo.
 * O símbolo pode funcionar sozinho quando a marca já estiver reconhecida.
 */
export function Assinatura({
  size = 44,
  tone = "grafite",
  priority = false,
}: {
  size?: number;
  tone?: "grafite" | "porcelana";
  priority?: boolean;
}) {
  return (
    <span className="flex items-center gap-3.5">
      <Logo size={size} priority={priority} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[0.98rem] tracking-[0.16em] ${
            tone === "grafite" ? "text-grafite" : "text-porcelana"
          }`}
        >
          {marca.nome.toUpperCase()}
        </span>
        <span className="mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-ouro-profundo">
          {marca.descritor}
        </span>
      </span>
    </span>
  );
}
