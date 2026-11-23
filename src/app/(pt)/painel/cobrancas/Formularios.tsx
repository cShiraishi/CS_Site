"use client";

import { useActionState, useState } from "react";

import { criarCobranca, entrarNoPainel, type EstadoCobranca } from "./actions";

/* Mesma linguagem do login do site (LoginOtp): campo sublinhado, rótulo
   em eyebrow, botão em pílula que acende em ouro no hover. */
const campo =
  "mt-2 w-full border-b border-linha bg-transparent py-2.5 text-base font-normal normal-case tracking-normal text-grafite outline-none transition-colors placeholder:text-grafite/35 focus:border-destaque-profundo";
const rotulo = "t-eyebrow block text-grafite/80";
const nota = "ml-1 normal-case tracking-normal font-normal text-grafite/50";
const botao =
  "rounded-full bg-grafite px-7 py-3.5 text-sm font-medium text-porcelana transition-colors hover:bg-ouro-profundo disabled:opacity-50";
const botaoLinha =
  "rounded-full border border-linha-ouro px-6 py-3 text-sm font-medium text-grafite transition-colors hover:border-destaque-profundo hover:text-destaque-profundo";

export function FormEntrar() {
  const [estado, acao, pendente] = useActionState(entrarNoPainel, {});
  return (
    <form action={acao} className="space-y-7">
      <label className={rotulo}>
        Senha do painel
        <input name="senha" type="password" required autoFocus autoComplete="current-password" className={campo} />
      </label>
      {estado.erro && <p role="alert" className="text-sm text-red-400">{estado.erro}</p>}
      <button disabled={pendente} className={`${botao} w-full`}>
        {pendente ? "Verificando…" : "Entrar"}
      </button>
    </form>
  );
}

export function FormCobranca() {
  const [estado, acao, pendente] = useActionState<EstadoCobranca, FormData>(criarCobranca, {});
  const [copiado, setCopiado] = useState(false);

  async function copiar(texto: string) {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div>
      <form action={acao} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <label className={rotulo}>
          Cliente
          <input name="cliente" placeholder="Maria Silva" className={campo} />
        </label>
        <label className={rotulo}>
          E-mail <span className={nota}>pré-preenche o checkout</span>
          <input name="email" type="email" placeholder="maria@email.com" className={campo} />
        </label>
        <label className={`${rotulo} sm:col-span-2`}>
          Nome do plano <span className={nota}>aparece na fatura</span>
          <input name="nome" required defaultValue="Consultoria Carlos Seiti — mensal" className={campo} />
        </label>
        <label className={`${rotulo} sm:col-span-2`}>
          Descrição <span className={nota}>opcional</span>
          <input name="descricao" placeholder="Acompanhamento de treino e nutrição" className={campo} />
        </label>
        <label className={rotulo}>
          Valor por cobrança
          <input name="valor" required inputMode="decimal" placeholder="97,00" className={`${campo} font-display text-2xl`} />
        </label>
        <label className={rotulo}>
          Moeda
          <select name="moeda" defaultValue="eur" className={`${campo} bg-porcelana`}>
            <option value="eur">Euro (€)</option>
            <option value="brl">Real (R$)</option>
          </select>
        </label>
        <label className={rotulo}>
          Cobrar a cada
          <input name="aCada" type="number" min={1} max={12} defaultValue={1} className={campo} />
        </label>
        <label className={rotulo}>
          Período
          <select name="intervalo" defaultValue="month" className={`${campo} bg-porcelana`}>
            <option value="week">semana(s)</option>
            <option value="month">mês(es)</option>
            <option value="year">ano(s)</option>
          </select>
        </label>
        <div className="pt-2 sm:col-span-2">
          <button disabled={pendente} className={botao}>
            {pendente ? "Criando na Stripe…" : "Gerar link de pagamento recorrente →"}
          </button>
        </div>
      </form>

      {estado.erro && (
        <p role="alert" className="mt-7 border-l-2 border-red-400 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {estado.erro}
        </p>
      )}

      {estado.link && (
        <div className="mt-8 border border-linha-ouro bg-porcelana/60 p-6">
          <p className="t-eyebrow text-destaque-profundo">Link pronto — envie ao cliente</p>
          <p className="mt-3 break-all font-mono text-sm text-grafite">{estado.link.urlComEmail}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => copiar(estado.link!.urlComEmail)} className={botao}>
              {copiado ? "Copiado ✓" : "Copiar link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Segue o link para ativar o pagamento recorrente: ${estado.link.urlComEmail}`)}`}
              target="_blank"
              rel="noreferrer"
              className={botaoLinha}
            >
              Enviar por WhatsApp
            </a>
            <a href={estado.link.url} target="_blank" rel="noreferrer" className={botaoLinha}>
              Abrir checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
