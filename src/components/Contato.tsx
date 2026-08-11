"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { enviarContato } from "@/app/actions";
import { estadoInicial } from "@/lib/contato";
import { contato, marca } from "@/lib/content";
import { Arrow, Eyebrow, Rotulo, Section, campoBase } from "./ui";

const schema = z.object({
  objetivo: z.string().min(1, "Escolha seu principal objetivo."),
  experiencia: z.string().min(1, "Conte em que momento você está."),
  mensagem: z.string().trim().min(10, "Conte um pouco mais sobre o seu contexto."),
  frequencia: z.string().min(1, "Informe sua disponibilidade semanal."),
  inicio: z.string().min(1, "Informe quando gostaria de começar."),
  nome: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  whatsapp: z.string().refine((v) => v.replace(/\D/g, "").length >= 8, {
    message: "Informe um WhatsApp com DDD.",
  }),
});

type Aplicacao = z.infer<typeof schema>;

const etapas = [
  { numero: "01", titulo: "Seu objetivo", nota: "O que você quer transformar" },
  { numero: "02", titulo: "Sua rotina", nota: "Como o plano precisa funcionar" },
  { numero: "03", titulo: "Contato", nota: "Para receber a avaliação inicial" },
] as const;

const camposPorEtapa: Record<number, (keyof Aplicacao)[]> = {
  0: ["objetivo", "experiencia", "mensagem"],
  1: ["frequencia", "inicio"],
  2: ["nome", "email", "whatsapp"],
};

const schemasPorEtapa = [
  schema.pick({ objetivo: true, experiencia: true, mensagem: true }),
  schema.pick({ frequencia: true, inicio: true }),
  schema.pick({ nome: true, email: true, whatsapp: true }),
] as const;

export function Contato() {
  const [estado, acao, pendente] = useActionState(enviarContato, estadoInicial);
  const [etapa, setEtapa] = useState(0);
  const reduzirMovimento = useReducedMotion();
  const {
    register,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<Aplicacao>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      objetivo: "",
      experiencia: "",
      mensagem: "",
      frequencia: "",
      inicio: "",
      nome: "",
      email: "",
      whatsapp: "",
    },
  });

  function avancar() {
    const campos = camposPorEtapa[etapa];
    clearErrors(campos);
    const resultado = schemasPorEtapa[etapa].safeParse(getValues());

    if (!resultado.success) {
      resultado.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof Aplicacao;
        setError(campo, { type: "manual", message: issue.message });
      });
      return;
    }

    setEtapa((atual) => Math.min(atual + 1, etapas.length - 1));
  }

  function enviar(_dados: Aplicacao, evento?: React.BaseSyntheticEvent) {
    const form = evento?.currentTarget as HTMLFormElement | undefined;
    if (!form) return;
    startTransition(() => acao(new FormData(form)));
  }

  return (
    <Section id="contato" tone="branco">
      <div ref={(node) => { if (node) node.dataset.interactive = "true"; }}>
      <div className="grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{contato.eyebrow}</Eyebrow>
          <h2 className="t-title mt-7 whitespace-pre-line text-balance">
            Aplicar para o acompanhamento.
          </h2>
          <p className="mt-7 max-w-sm text-pretty leading-relaxed text-grafite">
            Três etapas curtas para eu entender seu momento e responder com o
            caminho mais adequado — sem compromisso.
          </p>

          <div className="mt-10 space-y-5">
            {etapas.map((item, i) => (
              <button
                key={item.numero}
                type="button"
                onClick={() => i < etapa && setEtapa(i)}
                disabled={i > etapa}
                className="group flex w-full items-start gap-4 text-left disabled:cursor-default"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium tracking-wider transition-all ${
                    i === etapa
                      ? "border-ouro-profundo bg-grafite text-porcelana shadow-[0_8px_22px_rgba(29,27,25,.16)]"
                      : i < etapa
                        ? "border-ouro bg-ouro/10 text-ouro-profundo"
                        : "border-linha text-grafite"
                  }`}
                >
                  {i < etapa ? "✓" : item.numero}
                </span>
                <span className="pt-0.5">
                  <span className={`block text-sm ${i <= etapa ? "text-grafite" : "text-grafite"}`}>
                    {item.titulo}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-grafite">
                    {item.nota}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 text-xs text-grafite">
            <Link href={marca.whatsapp} target="_blank" className="hover:text-ouro-profundo">
              Prefere WhatsApp? ↗
            </Link>
            <span>Resposta pessoal</span>
          </div>
        </div>

        {estado.status === "ok" ? (
          <Sucesso mensagem={estado.mensagem} />
        ) : (
          <div className="surface-elevated overflow-hidden bg-porcelana">
            <div className="h-1 bg-linha">
              <motion.div
                className="h-full origin-left bg-ouro"
                animate={{ scaleX: (etapa + 1) / etapas.length }}
                transition={reduzirMovimento ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 24 }}
              />
            </div>

            <form
              onSubmit={handleSubmit(enviar)}
              className="min-h-[560px] p-6 sm:p-10 lg:p-12"
              noValidate
            >
              <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="empresa">Empresa</label>
                <input id="empresa" name="empresa" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex items-end justify-between gap-5 border-b border-linha pb-6">
                <div>
                  <p className="t-eyebrow text-ouro-profundo">Etapa {etapa + 1} de 3</p>
                  <h3 className="mt-3 font-display text-3xl">{etapas[etapa].titulo}</h3>
                </div>
                <span aria-hidden className="font-display text-5xl text-ouro-profundo">{etapas[etapa].numero}</span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={etapa}
                  initial={reduzirMovimento ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduzirMovimento ? undefined : { opacity: 0, x: -14 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-9"
                >
                  {etapa === 0 && (
                    <div className="space-y-8">
                      <Selecao
                        id="objetivo"
                        rotulo="Principal objetivo"
                        erro={errors.objetivo?.message ?? estado.erros?.objetivo}
                        register={register("objetivo")}
                        opcoes={contato.objetivos}
                      />
                      <Selecao
                        id="experiencia"
                        rotulo="Em que momento você está?"
                        erro={errors.experiencia?.message}
                        register={register("experiencia")}
                        opcoes={[
                          "Estou começando agora",
                          "Já tentei outros planos",
                          "Treino, mas estou sem evolução",
                          "Quero preparar uma competição",
                        ]}
                      />
                      <div>
                        <Rotulo htmlFor="mensagem">Seu contexto</Rotulo>
                        <textarea
                          id="mensagem"
                          rows={4}
                          placeholder="Rotina, histórico, o que já tentou e o que mais dificulta hoje."
                          className={`${campoBase} resize-none`}
                          aria-invalid={Boolean(errors.mensagem)}
                          {...register("mensagem")}
                        />
                        <Erro>{errors.mensagem?.message ?? estado.erros?.mensagem}</Erro>
                      </div>
                    </div>
                  )}

                  {etapa === 1 && (
                    <div className="space-y-8">
                      <Selecao
                        id="frequencia"
                        rotulo="Quantos dias por semana cabem na sua rotina?"
                        erro={errors.frequencia?.message}
                        register={register("frequencia")}
                        opcoes={["2 dias", "3 dias", "4 dias", "5 dias", "6 ou mais dias"]}
                      />
                      <Selecao
                        id="inicio"
                        rotulo="Quando gostaria de começar?"
                        erro={errors.inicio?.message}
                        register={register("inicio")}
                        opcoes={["Assim que possível", "Nas próximas 2 semanas", "No próximo mês", "Ainda estou avaliando"]}
                      />
                      <div className="border-l border-linha-ouro bg-white/60 p-5 text-sm leading-relaxed text-grafite">
                        O plano é ajustado ao tempo que você realmente tem. Consistência
                        importa mais do que uma rotina perfeita no papel.
                      </div>
                    </div>
                  )}

                  {etapa === 2 && (
                    <div className="grid gap-8 sm:grid-cols-2">
                      <Campo id="nome" rotulo="Nome" placeholder="Como você se chama" erro={errors.nome?.message ?? estado.erros?.nome} register={register("nome")} />
                      <Campo id="email" rotulo="E-mail" type="email" placeholder="voce@email.com" erro={errors.email?.message ?? estado.erros?.email} register={register("email")} />
                      <Campo id="whatsapp" rotulo="WhatsApp" type="tel" placeholder="(00) 00000-0000" erro={errors.whatsapp?.message ?? estado.erros?.whatsapp} register={register("whatsapp")} />
                      <div className="flex items-end pb-3 text-xs leading-relaxed text-grafite">
                        {contato.nota}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {estado.status === "erro" && estado.mensagem && etapa === 2 && (
                <p role="alert" className="mt-6 text-sm text-ouro-profundo">
                  {estado.mensagem}
                </p>
              )}

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-linha pt-7">
                <button
                  type="button"
                  onClick={() => setEtapa((atual) => Math.max(0, atual - 1))}
                  disabled={etapa === 0 || pendente}
                  className="text-sm text-grafite transition-colors hover:text-grafite disabled:invisible"
                >
                  ← Voltar
                </button>

                {etapa < etapas.length - 1 ? (
                  <button type="button" onClick={avancar} className="group inline-flex items-center gap-2.5 rounded-full bg-grafite px-7 py-3.5 text-sm font-medium text-porcelana transition-all hover:-translate-y-0.5 hover:bg-ouro-profundo">
                    Continuar <Arrow />
                  </button>
                ) : (
                  <button type="submit" disabled={pendente} className="group inline-flex items-center gap-2.5 rounded-full bg-grafite px-7 py-3.5 text-sm font-medium text-porcelana transition-all hover:-translate-y-0.5 hover:bg-ouro-profundo disabled:opacity-55">
                    {pendente ? "Enviando…" : "Enviar aplicação"} <Arrow />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      </div>
    </Section>
  );
}

function Sucesso({ mensagem }: { mensagem?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="surface-elevated flex min-h-[460px] flex-col justify-center bg-porcelana p-10">
      <span className="flex size-12 items-center justify-center rounded-full bg-ouro/15 text-xl text-ouro-profundo">✓</span>
      <p className="t-eyebrow mt-8 text-ouro-profundo">Aplicação recebida</p>
      <h3 className="t-title mt-4">Agora eu avalio o contexto.</h3>
      <p className="mt-5 max-w-md leading-relaxed text-grafite">
        {mensagem ?? "Respondo em até 24 horas."} A resposta será pessoal e indicará
        o caminho mais adequado para o seu momento.
      </p>
      <Link href={marca.instagram} target="_blank" className="group mt-8 inline-flex items-center gap-2.5 self-start border-b border-linha-ouro pb-1.5 text-sm text-ouro-profundo">
        Ver transformações <Arrow />
      </Link>
    </motion.div>
  );
}

function Erro({ children }: { children?: string }) {
  return children ? <p className="mt-2 text-xs text-ouro-profundo">{children}</p> : null;
}

function Selecao({ id, rotulo, erro, register, opcoes }: { id: string; rotulo: string; erro?: string; register: UseFormRegisterReturn; opcoes: readonly string[] }) {
  return (
    <div>
      <Rotulo htmlFor={id}>{rotulo}</Rotulo>
      <select id={id} className={`${campoBase} appearance-none`} aria-invalid={Boolean(erro)} {...register}>
        <option value="" disabled>Selecione</option>
        {opcoes.map((opcao) => <option key={opcao} value={opcao}>{opcao}</option>)}
      </select>
      <Erro>{erro}</Erro>
    </div>
  );
}

function Campo({ id, rotulo, erro, register, ...props }: { id: string; rotulo: string; erro?: string; register: UseFormRegisterReturn } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Rotulo htmlFor={id}>{rotulo}</Rotulo>
      <input id={id} className={campoBase} aria-invalid={Boolean(erro)} {...props} {...register} />
      <Erro>{erro}</Erro>
    </div>
  );
}
