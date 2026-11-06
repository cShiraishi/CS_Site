"use client";

import { useState } from "react";
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
  preco,
  rotulo = "Quero o programa",
}: {
  /** o perfil que gerou o plano, guardado com o pedido */
  plano?: unknown;
  preco: string;
  rotulo?: string;
}) {
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
        setMensagem(dados?.erro ?? "Não consegui abrir o pagamento. Tente de novo.");
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
      setMensagem("Sem conexão com o pagamento. Tente de novo em instantes.");
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

      <label htmlFor="compra-email" className="t-eyebrow block text-ouro">
        Seu e-mail
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="compra-email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={estado === "erro"}
          /* 16 px: abaixo disso o Safari do iPhone dá zoom ao focar. */
          className="min-h-12 w-full border-b border-porcelana/30 bg-transparent py-3 text-base text-porcelana transition-colors placeholder:text-porcelana/40 focus:border-ouro focus:outline-none sm:max-w-xs"
        />

        <button
          type="submit"
          disabled={estado === "indo"}
          className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-ouro-profundo px-8 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-all duration-300 hover:bg-ouro disabled:opacity-60"
        >
          {estado === "indo" ? "Abrindo o pagamento…" : `${rotulo} — ${preco}`}
          <Arrow />
        </button>
      </div>

      {mensagem && (
        <p role="alert" className="mt-4 text-sm text-ouro">
          {mensagem}
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-porcelana/70">
        Pagamento por Pix, cartão ou boleto, no ambiente do Mercado Pago. Seus dados de
        cartão não passam por este site.
      </p>
    </form>
  );
}
