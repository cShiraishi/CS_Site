"use client";

import { usePathname, useRouter } from "next/navigation";
import { obterConteudo, type Idioma } from "@/lib/i18n";
import { caminhoForcaEla } from "@/lib/modo";
import { useIdioma } from "@/lib/useIdioma";
import { gravarModo, useModo, type Modo } from "@/lib/useModo";

/**
 * Pílula Ele | Ela. Como um seletor de tema: troca os acentos
 * (ouro ↔ ouro rosé) e o conteúdo dos apps, nunca a marca.
 *
 * O destaque da opção ativa vem do CSS (`.modo-opcao` + `data-modo` no
 * <html>, globals.css), não do estado React: o script do <head> já marcou
 * o modo antes da pintura, então a pílula nasce certa, sem trocar de lado
 * depois da hidratação. O `aria-checked` acompanha pelo estado.
 */
export function SeletorModo({
  escuro = false,
  compacto = false,
  largo = false,
  idioma: idiomaForcado,
  className = "",
}: {
  escuro?: boolean;
  compacto?: boolean;
  /** Ocupa a largura toda, opções divididas ao meio (topo do celular). */
  largo?: boolean;
  idioma?: Idioma;
  className?: string;
}) {
  const idioma = useIdioma(idiomaForcado);
  const t = obterConteudo(idioma);
  const modo = useModo();
  const caminho = usePathname();
  const router = useRouter();

  const opcoes: { valor: Modo; rotulo: string }[] = [
    { valor: "ele", rotulo: t.ui.modoEle },
    { valor: "ela", rotulo: t.ui.modoEla },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t.ui.escolherModo}
      className={`flex items-center gap-0.5 rounded-full border bg-black/40 p-1 font-semibold backdrop-blur-md ${
        largo ? "w-full" : ""
      } ${
        compacto ? "h-8 text-[11px]" : "h-11 text-sm"
      } ${escuro ? "border-porcelana/25" : "border-white/20"} ${className}`}
    >
      {opcoes.map(({ valor, rotulo }) => (
        <button
          key={valor}
          type="button"
          role="radio"
          aria-checked={modo === valor}
          data-valor={valor}
          onClick={() => {
            gravarModo(valor);
            // As páginas do Canal Ela forçam o Modo Ela: escolher "Ele"
            // nelas só faz sentido saindo para a home.
            if (valor === "ele" && caminhoForcaEla(caminho)) router.push(t.rotaHome);
          }}
          className={`modo-opcao flex h-full items-center justify-center gap-1.5 rounded-full transition-[background-color,color,box-shadow] duration-300 ${
            largo ? "flex-1" : ""
          } ${
            compacto ? "px-2.5" : "px-4"
          } ${escuro ? "text-porcelana/65 hover:text-porcelana" : "text-grafite/65 hover:text-grafite"}`}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={compacto ? "size-3" : "size-3.5"}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
          >
            {valor === "ele" ? (
              <>
                <circle cx="10" cy="14" r="6" />
                <path d="M14.5 9.5 20 4M15 4h5v5" />
              </>
            ) : (
              <>
                <circle cx="12" cy="9" r="6" />
                <path d="M12 15v7M9 19h6" />
              </>
            )}
          </svg>
          {rotulo}
        </button>
      ))}
    </div>
  );
}
