"use client";

import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { IDIOMAS_DISPONIVEIS, obterConteudo, type Idioma } from "@/lib/i18n";
import { gravarPreferenciaIdioma, useIdioma } from "@/lib/useIdioma";
import { caminhoBase, rotaIdioma, temTraducao } from "@/lib/rotas-idioma";

export function LanguageSelector({
  escuro = false,
  idioma: idiomaForcado,
}: {
  escuro?: boolean;
  idioma?: Idioma;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const idiomaAtual = useIdioma(idiomaForcado);
  const t = obterConteudo(idiomaAtual);
  const atualInfo =
    IDIOMAS_DISPONIVEIS.find((i) => i.codigo === idiomaAtual) ?? IDIOMAS_DISPONIVEIS[0];

  const fundo = escuro
    ? "glass-dark border-white/10 text-porcelana"
    : "glass-light border-white/70 text-grafite";

  function selecionarIdioma(codigo: Idioma) {
    gravarPreferenciaIdioma(codigo);
    if (codigo === idiomaAtual) return;

    /*
     * Todas as páginas públicas têm versão nativa nos três idiomas, no
     * mesmo caminho com prefixo (/receitas → /es/receitas). Cada idioma
     * tem o seu root layout, então a navegação recarrega a página inteira
     * — e o <html lang> chega certo do servidor.
     */
    const base = caminhoBase(pathname);
    if (temTraducao(base)) {
      const extra =
        typeof window !== "undefined" ? `${window.location.search}${window.location.hash}` : "";
      router.push(`${rotaIdioma(codigo, base)}${extra}`);
      return;
    }

    /* Conta, painel e área do aluno só existem em português: leva à home
       do idioma escolhido. */
    const destinoHome =
      IDIOMAS_DISPONIVEIS.find((i) => i.codigo === codigo)?.rotaHome ?? "/";
    router.push(destinoHome);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        /* Mesmo peso visual do seletor Ele | Ela ao lado: altura, fundo e
           texto. Globo em vez de depender da bandeira — no Windows o emoji
           de bandeira vira só as letras "BR". */
        className={`group flex h-11 items-center gap-2 rounded-full border bg-black/40 px-4 text-sm font-semibold backdrop-blur-md transition-colors data-[state=open]:border-destaque data-[state=open]:text-destaque ${
          escuro
            ? "border-porcelana/30 text-porcelana hover:border-destaque hover:text-destaque"
            : "border-white/20 text-grafite hover:border-destaque hover:text-destaque"
        }`}
        aria-label={t.ui.escolherIdioma}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-4 text-destaque"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        <span>{atualInfo.sigla}</span>
        <svg
          aria-hidden
          viewBox="0 0 10 6"
          className="h-1.5 w-2.5 transition-transform group-data-[state=open]:rotate-180"
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          collisionPadding={12}
          className={`z-[70] w-56 overflow-hidden rounded-2xl border shadow-xl data-[state=closed]:animate-out data-[state=open]:animate-in ${fundo}`}
        >
          <DropdownMenu.Label
            className={`border-b px-4 py-3 text-[10px] uppercase tracking-[0.14em] opacity-50 ${
              escuro ? "border-porcelana/15" : "border-linha"
            }`}
          >
            {t.ui.escolherIdioma}
          </DropdownMenu.Label>
          {IDIOMAS_DISPONIVEIS.map((item) => {
            const ativo = item.codigo === idiomaAtual;
            return (
              <DropdownMenu.Item
                key={item.codigo}
                onSelect={() => selecionarIdioma(item.codigo)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm outline-none transition-colors ${
                  escuro
                    ? "text-porcelana focus:bg-porcelana/10"
                    : "text-grafite focus:bg-porcelana"
                } ${ativo ? "font-semibold" : ""}`}
              >
                <span aria-hidden className="text-lg leading-none">
                  {item.bandeira}
                </span>
                <span>{item.nome}</span>
                {ativo ? (
                  <span className="ml-auto rounded-full bg-destaque/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destaque">
                    {t.ui.idiomaAtual}
                  </span>
                ) : (
                  <span className="ml-auto text-[10px] uppercase tracking-wider opacity-40">
                    {item.rotaHome}
                  </span>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
