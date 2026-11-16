import Image from "next/image";
import Link from "next/link";

import { rotas } from "@/lib/content";
import { CURSOS } from "@/lib/cursos";
import { rotaIdioma, type Idioma } from "@/lib/rotas-idioma";

/**
 * A trilha do Reset Metabólico 21D: os 7 módulos do programa, com as artes
 * oficiais (public/reset21d/modulos). A arte já traz número, título e
 * descrição; o texto do módulo vai no `alt` para leitores de ecrã e busca.
 * Verde nos módulos 1–4, ouro nos 5–7, como na arte da trilha.
 */
export function TrilhaReset({ idioma }: { idioma: Idioma }) {
  const modulos = CURSOS[0].modulos ?? [];
  const venda = rotaIdioma(idioma, rotas.programa);

  return (
    <>
      <ol className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 pt-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 xl:mx-0 xl:grid xl:grid-cols-7 xl:gap-3 xl:overflow-visible xl:px-0">
        {modulos.map((m, i) => {
          const n = String(i + 1).padStart(2, "0");
          const ouro = m.tom === "ouro";
          return (
            <li key={n} className="w-[62%] shrink-0 snap-start sm:w-[34%] md:w-[28%] xl:w-auto">
              <Link
                href={venda}
                className={`group block overflow-hidden rounded-2xl outline-none ring-1 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 focus-visible:ring-2 motion-reduce:transition-none ${
                  ouro
                    ? "ring-ouro/40 hover:shadow-[0_0_32px_color-mix(in_srgb,var(--color-ouro)_45%,transparent)]"
                    : "ring-verde/40 hover:shadow-[0_0_32px_color-mix(in_srgb,var(--color-verde)_45%,transparent)]"
                }`}
              >
                <Image
                  src={`/reset21d/modulos/modulo-${n}.webp`}
                  alt={`Módulo ${n} · ${m.titulo[idioma]}: ${m.texto[idioma]}`}
                  width={900}
                  height={1125}
                  sizes="(min-width: 1280px) 14vw, (min-width: 768px) 28vw, (min-width: 640px) 34vw, 62vw"
                  className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Linha do tempo sob as artes (só onde ficam alinhadas). */}
      <div aria-hidden className="relative mt-4 hidden h-4 xl:block">
        <div className="absolute inset-x-[7%] top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-verde via-verde to-ouro opacity-70" />
        <div className="grid grid-cols-7">
          {modulos.map((m, i) => (
            <span
              key={i}
              className={`mx-auto size-4 rounded-full ring-4 ${
                m.tom === "ouro"
                  ? "bg-ouro shadow-[0_0_14px_var(--color-ouro)] ring-ouro/25"
                  : "bg-verde shadow-[0_0_14px_var(--color-verde)] ring-verde/25"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
