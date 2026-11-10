"use client";

import { obterConteudo, type Idioma } from "@/lib/i18n";
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
  idioma: idiomaForcado,
  className = "",
}: {
  escuro?: boolean;
  compacto?: boolean;
  idioma?: Idioma;
  className?: string;
}) {
  const idioma = useIdioma(idiomaForcado);
  const t = obterConteudo(idioma);
  const modo = useModo();

  const opcoes: { valor: Modo; rotulo: string }[] = [
    { valor: "ele", rotulo: t.ui.modoEle },
    { valor: "ela", rotulo: t.ui.modoEla },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t.ui.escolherModo}
      className={`flex items-center rounded-full border p-1 font-medium ${
        compacto ? "h-8 text-[11px]" : "h-10 text-xs"
      } ${escuro ? "border-porcelana/25" : "border-white/15"} ${className}`}
    >
      {opcoes.map(({ valor, rotulo }) => (
        <button
          key={valor}
          type="button"
          role="radio"
          aria-checked={modo === valor}
          data-valor={valor}
          onClick={() => gravarModo(valor)}
          className={`modo-opcao h-full rounded-full transition-colors duration-300 ${
            compacto ? "px-2.5" : "px-3"
          } ${escuro ? "text-porcelana/60 hover:text-porcelana" : "text-grafite/60 hover:text-grafite"}`}
        >
          {rotulo}
        </button>
      ))}
    </div>
  );
}
