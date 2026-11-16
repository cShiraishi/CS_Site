import Image from "next/image";
import { resultados } from "@/lib/content";
import type { Idioma } from "@/lib/i18n";

const ROTULO: Record<Idioma, string> = {
  pt: "Antes e depois de alunos",
  es: "Antes y después de alumnos",
  en: "Student before & after",
};

function alt(idioma: Idioma, p: { nome: string; alt: string }) {
  if (idioma === "es") return `Evolución corporal de ${p.nome}, con registros de antes y después`;
  if (idioma === "en") return `${p.nome}'s body transformation, with before and after photos`;
  return p.alt;
}

/**
 * Esteira de antes e depois do hero da home: a prova logo na primeira dobra.
 * A lista vai duplicada (a cópia escondida do leitor de tela) e anda metade
 * da largura, então o loop não tem emenda. O espaço entre as fotos é
 * padding de cada item, e não `gap`, para as duas metades medirem igual.
 * Para no hover e fica parada com movimento reduzido (.esteira, globals.css).
 */
export function EsteiraAntesDepois({
  idioma = "pt",
  grande = false,
  prioridade = false,
}: {
  idioma?: Idioma;
  grande?: boolean;
  prioridade?: boolean;
}) {
  const fotos = resultados.transformacoes;
  /* Com 4 fotos, metade da esteira ficaria mais estreita que a área visível. */
  const base = [...fotos, ...fotos];
  const card = grande ? "h-[24rem] w-[12.5rem]" : "h-64 w-36 sm:h-72 sm:w-40";

  return (
    <div>
      <p className="t-eyebrow flex items-center gap-2.5 text-grafite/60">
        <span aria-hidden className="size-1.5 rounded-full bg-ouro" />
        {ROTULO[idioma]}
      </p>
      <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]">
        <ul className="esteira flex w-max">
          {[...base, ...base].map((p, i) => {
            const copia = i >= fotos.length;
            return (
              <li key={`${p.instagram}-${i}`} aria-hidden={copia || undefined} className="shrink-0 pr-3">
                <a
                  href="#resultados"
                  tabIndex={copia ? -1 : undefined}
                  className={`group relative block overflow-hidden rounded-2xl border border-linha bg-branco transition-colors hover:border-ouro/60 ${card}`}
                >
                  <Image
                    src={p.imagem}
                    alt={copia ? "" : alt(idioma, p)}
                    fill
                    priority={prioridade && i < 3}
                    sizes={grande ? "250px" : "160px"}
                    className="object-cover object-center"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-8">
                    <span className="block truncate text-sm font-semibold text-[#f2ede5]">{p.nome}</span>
                    <span className="block truncate text-[0.7rem] text-[#f2ede5]/70">{p.instagram}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
