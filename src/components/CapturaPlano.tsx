"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enviarPlano } from "@/app/actions";
import { estadoInicial } from "@/lib/contato";
import { calculadora } from "@/lib/content";
import { Arrow, Rotulo, campoBase } from "./ui";

/** Os mesmos parâmetros que geraram o resultado na tela. */
export type Parametros = {
  sexo: string;
  idade: string;
  peso: string;
  altura: string;
  gordura: string;
  pesoAlvo: string;
  atividade: string;
  formula: string;
  refeicoes: number;
};

/**
 * Captura no pico de intenção: a pessoa já viu o plano inteiro,
 * de graça. Isto não é um portão — é a oferta de levar o
 * resultado embora por escrito.
 */
export function CapturaPlano({ parametros }: { parametros: Parametros }) {
  const [estado, acao] = useActionState(enviarPlano, estadoInicial);

  if (estado.status === "ok") {
    return (
      <div className="mt-14 border-t border-linha-ouro pt-10">
        <span aria-hidden className="rule-gold h-px w-16" />
        <h3 className="t-title mt-6">Enviado.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-grafite/70">
          {calculadora.captura.sucesso}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-14 border-t border-linha-ouro pt-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h3 className="t-title text-balance">{calculadora.captura.titulo}</h3>
          <p className="mt-5 max-w-sm leading-relaxed text-grafite/70">
            {calculadora.captura.texto}
          </p>
        </div>

        <form action={acao} className="space-y-7" noValidate>
          {/* Os parâmetros seguem crus: o servidor recalcula o plano. */}
          {Object.entries(parametros).map(([chave, valor]) => (
            <input key={chave} type="hidden" name={chave} value={String(valor)} />
          ))}

          <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor="plano-empresa">Empresa</label>
            <input id="plano-empresa" name="empresa" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <Rotulo htmlFor="plano-nome">Nome</Rotulo>
              <input
                id="plano-nome"
                name="nome"
                autoComplete="name"
                placeholder="Como você se chama"
                className={campoBase}
                aria-invalid={Boolean(estado.erros?.nome)}
              />
              {estado.erros?.nome && (
                <p className="mt-2 text-xs text-ouro-profundo">{estado.erros.nome}</p>
              )}
            </div>

            <div>
              <Rotulo htmlFor="plano-email">E-mail</Rotulo>
              <input
                id="plano-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                className={campoBase}
                aria-invalid={Boolean(estado.erros?.email)}
              />
              {estado.erros?.email && (
                <p className="mt-2 text-xs text-ouro-profundo">{estado.erros.email}</p>
              )}
            </div>
          </div>

          {estado.status === "erro" && estado.mensagem && (
            <p role="alert" className="text-sm text-ouro-profundo">
              {estado.mensagem}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-xs text-xs leading-relaxed text-grafite/45">
              {calculadora.captura.nota}
            </p>
            <Botao />
          </div>
        </form>
      </div>
    </div>
  );
}

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center gap-2.5 rounded-full bg-grafite px-8 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-all duration-300 hover:bg-ouro-profundo disabled:opacity-55"
    >
      {pending ? "Enviando…" : calculadora.captura.botao}
      <Arrow />
    </button>
  );
}
