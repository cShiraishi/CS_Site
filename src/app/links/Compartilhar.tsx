"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * O "⋮" do Linktree, com a função que ele tinha lá: partilhar aquele link.
 * No telemóvel abre a folha nativa; no computador copia para a área de
 * transferência. Sem nenhuma das duas coisas, o botão não aparece — um botão
 * que não faz nada é pior do que botão nenhum.
 */
/** Capacidade do browser: não muda durante a vida da página. */
function assinarNada() {
  return () => {};
}

function temPartilha() {
  return (
    typeof navigator !== "undefined" &&
    (typeof navigator.share === "function" ||
      typeof navigator.clipboard?.writeText === "function")
  );
}

export function Compartilhar({
  titulo,
  href,
  className = "relative",
}: {
  titulo: string;
  href: string;
  className?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  // No servidor não existe `navigator`: o HTML estático sai sem o botão e o
  // browser decide na hidratação. `useSyncExternalStore` é o caminho previsto
  // para ler algo de fora do React sem divergir entre servidor e cliente.
  const pronto = useSyncExternalStore(assinarNada, temPartilha, () => false);

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 1800);
    return () => clearTimeout(t);
  }, [copiado]);

  if (!pronto) return null;

  const url = href.startsWith("http")
    ? href
    : typeof window !== "undefined"
      ? new URL(href, window.location.origin).toString()
      : href;

  async function partilhar() {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: titulo, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
    } catch {
      // Cancelar a partilha é uma escolha do utilizador, não um erro.
    }
  }

  return (
    // Sem "relative" fixo: quem chama e que decide o posicionamento, e uma
    // classe de posicao cravada aqui competiria com a que vem de fora.
    <span className={className}>
      <button
        type="button"
        onClick={partilhar}
        aria-label={`Partilhar: ${titulo}`}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#111]/55 transition-colors duration-200 hover:bg-white/45 hover:text-[#111]"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]" fill="currentColor">
          <circle cx="12" cy="5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="19" r="1.7" />
        </svg>
      </button>

      {copiado ? (
        <span
          role="status"
          className="pointer-events-none absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded-md bg-[#111] px-2 py-1 text-[0.68rem] text-white"
        >
          Link copiado
        </span>
      ) : null}
    </span>
  );
}
