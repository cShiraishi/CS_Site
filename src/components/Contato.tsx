"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enviarContato } from "@/app/actions";
import { estadoInicial } from "@/lib/contato";
import { contato, marca } from "@/lib/content";
import { Arrow, Eyebrow, Rotulo, Section, campoBase } from "./ui";

export function Contato() {
  const [estado, acao] = useActionState(enviarContato, estadoInicial);

  return (
    <Section id="contato" tone="branco">
      <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{contato.eyebrow}</Eyebrow>
          <h2 className="t-title mt-7 whitespace-pre-line text-balance">
            {contato.titulo}
          </h2>
          <p className="mt-7 max-w-sm text-pretty leading-relaxed text-grafite/70">
            {contato.texto}
          </p>

          <div className="mt-10 space-y-3 text-sm">
            <Link
              href={marca.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-grafite/70 transition-colors hover:text-ouro-profundo"
            >
              Prefere WhatsApp?
              <Arrow />
            </Link>
            <Link
              href={marca.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-grafite/70 transition-colors hover:text-ouro-profundo"
            >
              {marca.instagramHandle}
              <Arrow />
            </Link>
          </div>
        </div>

        {estado.status === "ok" ? (
          <Sucesso mensagem={estado.mensagem} />
        ) : (
          <form action={acao} className="space-y-9" noValidate>
            {/* honeypot — invisível para pessoas, irresistível para robôs */}
            <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
              <label htmlFor="empresa">Empresa</label>
              <input id="empresa" name="empresa" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-9 sm:grid-cols-2">
              <Campo
                id="nome"
                rotulo="Nome"
                placeholder="Como você se chama"
                autoComplete="name"
                erro={estado.erros?.nome}
              />
              <Campo
                id="email"
                rotulo="E-mail"
                type="email"
                placeholder="voce@email.com"
                autoComplete="email"
                erro={estado.erros?.email}
              />
              <Campo
                id="whatsapp"
                rotulo="WhatsApp"
                type="tel"
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                erro={estado.erros?.whatsapp}
              />

              <div>
                <Rotulo htmlFor="objetivo">Objetivo</Rotulo>
                <select
                  id="objetivo"
                  name="objetivo"
                  defaultValue=""
                  className={`${campoBase} appearance-none`}
                  aria-invalid={Boolean(estado.erros?.objetivo)}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {contato.objetivos.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <Erro>{estado.erros?.objetivo}</Erro>
              </div>
            </div>

            <div>
              <Rotulo htmlFor="mensagem">Seu contexto</Rotulo>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                placeholder="Rotina, histórico, o que já tentou e o que trava hoje."
                className={`${campoBase} resize-none`}
                aria-invalid={Boolean(estado.erros?.mensagem)}
              />
              <Erro>{estado.erros?.mensagem}</Erro>
            </div>

            {estado.status === "erro" && estado.mensagem && (
              <p role="alert" className="text-sm text-ouro-profundo">
                {estado.mensagem}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              <p className="max-w-xs text-xs leading-relaxed text-grafite/45">
                {contato.nota}
              </p>
              <Enviar />
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center gap-2.5 rounded-full bg-grafite px-8 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-all duration-300 hover:bg-ouro-profundo disabled:opacity-55"
    >
      {pending ? "Enviando…" : "Enviar solicitação"}
      <Arrow />
    </button>
  );
}

function Sucesso({ mensagem }: { mensagem?: string }) {
  return (
    <div className="flex flex-col justify-center border-t border-linha-ouro pt-10">
      <span aria-hidden className="rule-gold h-px w-16" />
      <h3 className="t-title mt-7">Recebido.</h3>
      <p className="mt-5 max-w-md leading-relaxed text-grafite/70">
        {mensagem ?? "Respondo em até 24 horas."} Enquanto isso, o próximo passo
        pode ser só olhar as transformações de quem já está no processo.
      </p>
      <Link
        href={marca.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex items-center gap-2.5 self-start border-b border-linha-ouro pb-1.5 text-sm text-ouro-profundo"
      >
        Ver {marca.instagramHandle}
        <Arrow />
      </Link>
    </div>
  );
}

function Erro({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-2 text-xs text-ouro-profundo">{children}</p>;
}

function Campo({
  id,
  rotulo,
  erro,
  ...props
}: {
  id: string;
  rotulo: string;
  erro?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Rotulo htmlFor={id}>{rotulo}</Rotulo>
      <input
        id={id}
        name={id}
        className={campoBase}
        aria-invalid={Boolean(erro)}
        {...props}
      />
      <Erro>{erro}</Erro>
    </div>
  );
}
