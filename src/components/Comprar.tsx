"use client";

import { useState } from "react";
import { TEXTO_PROGRAMA } from "@/lib/i18n/programa";
import type { Moeda } from "@/lib/produto";
import type { Idioma } from "@/lib/rotas-idioma";
import { useMoeda } from "@/lib/useMoeda";
import { Arrow } from "./ui";

/**
 * O botão que leva ao pagamento.
 *
 * Pede o e-mail antes de sair do site, e não por capricho de formulário:
 * é o e-mail que liga a compra à pessoa. Quem paga por Pix fecha a aba
 * assim que o comprovativo aparece, e sem este campo o pedido voltaria
 * identificado apenas pela conta do Mercado Pago — que muitas vezes é de
 * outra pessoa da família, e nunca é onde o cliente quer receber.
 *
 * Um campo só. Nome e telefone perguntam-se depois da compra, quando a
 * pessoa já é cliente e responder não lhe custa a venda.
 */
export function Comprar({
  plano,
  preco = "R$ 47",
  moedaServidor,
  rotulo,
  idioma = "pt",
}: {
  /** o perfil que gerou o plano, guardado com o pedido */
  plano?: unknown;
  preco?: string;
  moedaServidor?: Moeda | null;
  rotulo?: string;
  idioma?: Idioma;
}) {
  const t = TEXTO_PROGRAMA[idioma].comprar;
  const rotuloBotao = rotulo ?? t.rotuloPadrao;
  const { moeda, info } = useMoeda(moedaServidor);
  const precoExibido = info.precoFormatado || preco;
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [estado, setEstado] = useState<"parado" | "indo" | "erro">("parado");
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function pagar(evento: React.FormEvent) {
    evento.preventDefault();
    if (estado === "indo") return;

    setEstado("indo");
    setMensagem(null);

    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plano, empresa }),
      });

      const dados = await resposta.json();

      if (!resposta.ok || !dados?.url) {
        setEstado("erro");
        /* As mensagens do servidor são em português; fora dele, a
           validação (400) vira "confira o e-mail" e o resto, a genérica. */
        setMensagem(
          t.erroEmail === null
            ? (dados?.erro ?? t.erroAbrir)
            : resposta.status === 400
              ? t.erroEmail
              : t.erroAbrir,
        );
        return;
      }

      /*
       * `location.href` e não `router.push`: o destino é o Mercado Pago,
       * fora desta aplicação. O router do Next tentaria buscar um payload
       * de rota que não existe ali.
       */
      window.location.href = dados.url;
    } catch {
      setEstado("erro");
      setMensagem(t.erroConexao);
    }
  }

  return (
    <form onSubmit={pagar} className="w-full" noValidate>
      {/* Armadilha para robô — invisível, e nunca preenchida por gente. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="compra-empresa">Empresa</label>
        <input
          id="compra-empresa"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />
      </div>

      <label htmlFor="compra-email" className="t-eyebrow block text-[#00ff66]">
        {t.email}
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="compra-email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={estado === "erro"}
          /* 16 px: abaixo disso o Safari do iPhone dá zoom ao focar. */
          className="min-h-12 w-full rounded-lg border border-[#00ff66]/35 bg-[#0b0a09]/90 px-4 py-3 text-base text-grafite transition-all placeholder:text-grafite/50 focus:border-[#00ff66] focus:shadow-[0_0_20px_rgba(0,255,102,0.25)] focus:outline-none sm:max-w-xs"
        />

        <button
          type="submit"
          disabled={estado === "indo"}
          className="group inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#00ff66] px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_30px_rgba(0,255,102,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4be283] hover:shadow-[0_0_45px_rgba(0,255,102,0.65)] disabled:opacity-60"
        >
          {estado === "indo" ? t.abrindo : `${rotuloBotao} — ${precoExibido}`}
          <Arrow />
        </button>
      </div>

      {mensagem && (
        <p role="alert" className="mt-4 text-sm font-medium text-[#ff8c42]">
          {mensagem}
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-grafite/75">
        {t.rodape(idioma === "pt" ? info.meiosPagamento : t.meios[moeda])}
      </p>
    </form>
  );
}
