"use client";

import { TEXTO_PROGRAMA } from "@/lib/i18n/programa";
import { CHECKOUT_RESET, type Moeda } from "@/lib/produto";
import type { Idioma } from "@/lib/rotas-idioma";
import { useMoeda } from "@/lib/useMoeda";
import { Arrow } from "./ui";

/**
 * O botão que leva ao pagamento: o checkout da Cakto, direto.
 *
 * A Cakto pede o e-mail no próprio checkout e o webhook
 * (/api/pagamentos/cakto) grava o pedido pago com ele. É esse e-mail que
 * libera o app em /resetmetabolico/login.
 */
export function Comprar({
  preco = "R$ 297",
  moedaServidor,
  rotulo,
  idioma = "pt",
}: {
  /** mantido por compatibilidade com quem ainda passa o plano */
  plano?: unknown;
  preco?: string;
  moedaServidor?: Moeda | null;
  rotulo?: string;
  idioma?: Idioma;
}) {
  const t = TEXTO_PROGRAMA[idioma].comprar;
  const { moeda, info } = useMoeda(moedaServidor);
  const precoExibido = info.precoFormatado || preco;

  return (
    <div className="w-full">
      <a
        href={CHECKOUT_RESET}
        className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-[#00ff66] px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_30px_rgba(0,255,102,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4be283] hover:shadow-[0_0_45px_rgba(0,255,102,0.65)]"
      >
        {`${rotulo ?? t.rotuloPadrao} — ${precoExibido}`}
        <Arrow />
      </a>
      <p className="mt-5 text-xs leading-relaxed text-grafite/75">
        {t.rodape(idioma === "pt" ? info.meiosPagamento : t.meios[moeda])}
      </p>
    </div>
  );
}
