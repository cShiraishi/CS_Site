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
        className={`group flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors ${
          escuro
            ? "border-porcelana/25 text-porcelana hover:border-destaque"
            : "border-linha text-grafite hover:border-destaque"
        }`}
        aria-label={t.ui.escolherIdioma}
      >
        <span aria-hidden className="text-base leading-none">
          {atualInfo.bandeira}
        </span>
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
