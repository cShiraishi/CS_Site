"use client";

import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { marca } from "@/lib/content";

const idiomas = [
  { codigo: "pt", bandeira: "🇧🇷", nome: "Português" },
  { codigo: "es", bandeira: "🇪🇸", nome: "Español" },
  { codigo: "en", bandeira: "🇬🇧", nome: "English" },
] as const;

export function LanguageSelector({ escuro = false }: { escuro?: boolean }) {
  const pathname = usePathname();
  const fundo = escuro
    ? "glass-dark border-white/10 text-porcelana"
    : "glass-light border-white/70 text-grafite";

  function abrirIdioma(codigo: "pt" | "es" | "en") {
    const caminho = `${pathname}${window.location.search}${window.location.hash}`;

    if (codigo === "pt") {
      window.location.assign(new URL(caminho, marca.site).toString());
      return;
    }

    const pagina = new URL(caminho, marca.site).toString();
    const traducao = new URL("https://translate.google.com/translate");
    traducao.searchParams.set("sl", "pt");
    traducao.searchParams.set("tl", codigo);
    traducao.searchParams.set("u", pagina);
    window.location.assign(traducao.toString());
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={`group flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors ${
          escuro
            ? "border-porcelana/25 text-porcelana hover:border-ouro"
            : "border-linha text-grafite hover:border-ouro"
        }`}
        aria-label="Escolher idioma"
      >
        <span aria-hidden className="text-base leading-none">🇧🇷</span>
        <span className="hidden sm:inline">PT</span>
        <svg
          aria-hidden
          viewBox="0 0 10 6"
          className="h-1.5 w-2.5 transition-transform group-data-[state=open]:rotate-180"
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          collisionPadding={12}
          className={`z-[70] w-52 overflow-hidden border shadow-xl data-[state=closed]:animate-out data-[state=open]:animate-in ${fundo}`}
        >
          <DropdownMenu.Label className={`border-b px-4 py-3 text-[10px] uppercase tracking-[0.14em] opacity-50 ${escuro ? "border-porcelana/15" : "border-linha"}`}>
            Escolher idioma
          </DropdownMenu.Label>
          {idiomas.map((idioma) => (
            <DropdownMenu.Item
              key={idioma.codigo}
              onSelect={() => abrirIdioma(idioma.codigo)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm outline-none transition-colors ${
                escuro ? "text-porcelana focus:bg-porcelana/10" : "text-grafite focus:bg-porcelana"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">{idioma.bandeira}</span>
              <span>{idioma.nome}</span>
              {idioma.codigo === "pt" && (
                <span className="ml-auto text-[10px] uppercase tracking-wider text-ouro-profundo">
                  Atual
                </span>
              )}
            </DropdownMenu.Item>
          ))}
          <p className={`border-t px-4 py-2.5 text-[10px] leading-relaxed opacity-45 ${escuro ? "border-porcelana/15" : "border-linha"}`}>
            Espanhol e inglês usam tradução automática.
          </p>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
