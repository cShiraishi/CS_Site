"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { enviarPlano } from "@/app/actions";
import { estadoInicial } from "@/lib/contato";
import { calculadora } from "@/lib/content";
import { criarSupabaseBrowser } from "@/lib/supabase/client";
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
export function CapturaPlano({ parametros, onLiberar }: { parametros: Parametros; onLiberar?: () => void }) {
  const [estado, acao] = useActionState(enviarPlano, estadoInicial);
  const supabaseRef = useState(() => criarSupabaseBrowser())[0];
  const [verificando, setVerificando] = useState(Boolean(supabaseRef));
  const [temConta, setTemConta] = useState(false);

  useEffect(() => {
    if (!supabaseRef) return;
    supabaseRef.auth.getUser().then(({ data }) => {
      setTemConta(Boolean(data.user));
      setVerificando(false);
      if (data.user) onLiberar?.();
    });
  }, [onLiberar, supabaseRef]);

  useEffect(() => {
    if (estado.status === "ok") onLiberar?.();
  }, [estado.status, onLiberar]);

  if (verificando || temConta) {
    return (
      <div className="surface-elevated mt-10 bg-white p-7 sm:p-10">
        <p className="t-eyebrow text-ouro-profundo">{verificando ? "Reconhecendo seu perfil" : "Perfil reconhecido"}</p>
        <p className="mt-3 text-sm text-grafite">{verificando ? "Só um instante…" : "Seus dados serão vinculados ao histórico da sua conta."}</p>
      </div>
    );
  }

  if (estado.status === "ok") {
    return (
      <div className="surface-elevated mt-10 bg-white p-7 sm:p-10">
        <span aria-hidden className="rule-gold h-px w-16" />
        {/* A ação manda a própria mensagem quando o e-mail não saiu. Anunciar
            "confira a caixa de entrada" nesse caso seria prometer o que não
            aconteceu — e o plano na tela, esse, foi mesmo liberado. */}
        <h3 className="t-title mt-6">{estado.mensagem ? "Recebido." : "Enviado."}</h3>
        <p className="mt-4 max-w-md leading-relaxed text-grafite">
          {estado.mensagem ?? calculadora.captura.sucesso}
        </p>
      </div>
    );
  }

  return (
    <div className="surface-elevated mt-10 overflow-hidden bg-white">
      <div className="h-1 bg-linear-to-r from-ouro-profundo via-ouro to-transparent" />
      <div className="p-7 sm:p-10 lg:p-12">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="t-eyebrow text-ouro-profundo">Seu plano está pronto</p>
          <h3 className="t-title mt-4 text-balance">Libere o resultado completo.</h3>
          <p className="mt-5 max-w-sm leading-relaxed text-grafite">
            Informe apenas nome, e-mail e telefone para ver calorias, macros, refeições e receber uma cópia estruturada.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-grafite">
            <li>✓ Meta calórica individual</li>
            <li>✓ Proteína, carboidrato e gordura</li>
            <li>✓ Distribuição por refeições</li>
          </ul>
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

            <div>
              <Rotulo htmlFor="plano-whatsapp">Telefone</Rotulo>
              <input
                id="plano-whatsapp"
                name="whatsapp"
                type="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                className={campoBase}
                aria-invalid={Boolean(estado.erros?.whatsapp)}
              />
              {estado.erros?.whatsapp && (
                <p className="mt-2 text-xs text-ouro-profundo">{estado.erros.whatsapp}</p>
              )}
            </div>
          </div>

          {estado.status === "erro" && estado.mensagem && (
            <p role="alert" className="text-sm text-ouro-profundo">
              {estado.mensagem}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-xs text-xs leading-relaxed text-grafite">
              Ao continuar, você concorda em receber este resultado e um contato relacionado à sua avaliação. Sem spam.
            </p>
            <Botao />
          </div>
          {process.env.NEXT_PUBLIC_SUPABASE_URL && (
            <p className="border-t border-linha pt-5 text-center text-sm text-grafite">
              Já possui cadastro? <Link href="/entrar?retorno=/calculadora-de-calorias" className="font-medium underline decoration-ouro underline-offset-4">Entrar com código</Link>
            </p>
          )}
        </form>
      </div>
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
      {pending ? "Preparando…" : "Liberar meu plano"}
      <Arrow />
    </button>
  );
}
