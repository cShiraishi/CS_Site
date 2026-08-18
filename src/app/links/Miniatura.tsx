import Image from "next/image";
import type { IconeDoLink } from "@/lib/links";

/**
 * As miniaturas quadradas do Linktree, redesenhadas: a placa da marca para o
 * que é nosso, o glifo de cada plataforma para o que é de terceiros. SVG
 * inline — dois glifos não justificam nem biblioteca nem requisição extra.
 */
export function Miniatura({ nome }: { nome: IconeDoLink }) {
  const moldura =
    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg";

  if (nome === "marca") {
    return (
      <span className={`${moldura} paper`}>
        <Image
          src="/brand/cs-mark.jpg"
          alt=""
          width={1024}
          height={1024}
          sizes="44px"
          className="h-full w-full scale-[1.18] object-cover"
        />
      </span>
    );
  }

  if (nome === "youtube") {
    return (
      <span className={`${moldura} bg-white`}>
        <svg viewBox="0 0 28 20" aria-hidden className="h-6 w-6">
          <rect width="28" height="20" rx="5" fill="#FF0000" />
          <path d="M11.2 5.8v8.4l7.3-4.2-7.3-4.2Z" fill="#fff" />
        </svg>
      </span>
    );
  }

  /* Zumub: quadrado preto com as três barras diagonais azuis. */
  return (
    <span className={`${moldura} bg-[#0a0a0a]`}>
      <svg viewBox="0 0 44 44" aria-hidden className="h-full w-full">
        <g fill="#0b7ff5">
          <path d="M13 31 24 13h6L19 31Z" />
          <path d="M22 31 33 13h4L26 31Z" />
          <path d="M8 31 15 20h3.5L11.5 31Z" />
        </g>
      </svg>
    </span>
  );
}
