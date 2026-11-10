"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PadraoId } from "@/lib/postura";
import {
  TOTAL_EXERCICIOS,
  UI_RAIOX,
  exerciciosDoPadrao,
  expectativa,
  fases,
  padroes,
  promessa,
  sinaisDeAlerta,
  teste,
} from "@/lib/i18n/postura";
import { rotas } from "@/lib/content";
import { rotaIdioma, type Idioma } from "@/lib/rotas-idioma";
import { Arrow, Eyebrow, buttonClass } from "./ui";

/** Padrões 3 e 4 são mutuamente exclusivos — pedem protocolos opostos. */
const OPOSTOS: Partial<Record<PadraoId, PadraoId>> = { p3: "p4", p4: "p3" };

export function RaioXPostural({ idioma = "pt" }: { idioma?: Idioma }) {
  const ui = UI_RAIOX[idioma];
  const PADROES = useMemo(() => padroes(idioma), [idioma]);
  const TESTE = useMemo(() => teste(idioma), [idioma]);
  const [modo, setModo] = useState<"escolher" | "teste">("escolher");
  const [selecionados, setSelecionados] = useState<PadraoId[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  const alternar = (id: PadraoId) =>
    setSelecionados((atual) => {
      if (atual.includes(id)) return atual.filter((x) => x !== id);
      // tirar o oposto evita montar um protocolo que se contradiz
      const oposto = OPOSTOS[id];
      const limpo = oposto ? atual.filter((x) => x !== oposto) : atual;
      return [...limpo, id];
    });

  const exercicios = useMemo(() => exerciciosDoPadrao(selecionados, idioma), [selecionados, idioma]);
  const escolhidos = PADROES.filter((p) => selecionados.includes(p.id));

  /* ── teste da parede ── */
  const responder = (pergunta: string, valor: string, padrao: PadraoId | null) => {
    setRespostas((r) => ({ ...r, [pergunta]: valor }));
    setSelecionados((atual) => {
      // limpa o que esta pergunta podia ter marcado antes
      const daPergunta = TESTE.perguntas
        .find((p) => p.id === pergunta)!
        .opcoes.map((o) => o.padrao)
        .filter(Boolean) as PadraoId[];
      const limpo = atual.filter((x) => !daPergunta.includes(x));
      return padrao ? [...limpo, padrao] : limpo;
    });
  };

  const testeCompleto = TESTE.perguntas.every((p) => respostas[p.id]);

  return (
    <div className="space-y-16">
      {/* ── Sinais de alerta, antes de tudo ─────────────────── */}
      <details className="group rounded-sm border border-ouro/35 bg-ouro/[0.06] p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[0.98rem] font-medium text-grafite [&::-webkit-details-marker]:hidden">
          {ui.alertaTitulo}
          <span aria-hidden className="relative h-3 w-3 shrink-0 text-ouro-profundo">
            <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
            <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
          </span>
        </summary>
        <div className="mt-5">
          <p className="text-sm leading-relaxed text-grafite/75">
            {ui.alertaIntro}
          </p>
          <ul className="mt-4 space-y-2">
            {sinaisDeAlerta(idioma).map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm text-grafite/80">
                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-ouro-profundo" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </details>

      {/* ── 01 · Identificar ────────────────────────────────── */}
      <section>
        <Eyebrow>{ui.identificar}</Eyebrow>
        <h2 className="t-title mt-6 text-balance">{ui.qualPadrao}</h2>

        <div className="mt-7 inline-flex rounded-full border border-linha p-1">
          {(
            [
              ["escolher", ui.modoEscolher],
              ["teste", ui.modoTeste],
            ] as const
          ).map(([id, rotulo]) => (
            <button
              key={id}
              type="button"
              onClick={() => setModo(id)}
              aria-pressed={modo === id}
              className={`rounded-full px-5 py-2 text-sm transition-colors duration-300 ${
                modo === id
                  ? "bg-grafite text-porcelana"
                  : "text-grafite/60 hover:text-grafite"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>

        {modo === "teste" ? (
          <div className="mt-9 max-w-2xl">
            <p className="text-[0.95rem] leading-relaxed text-grafite/75">
              {TESTE.comoFazer}
            </p>
            <div className="mt-8 space-y-8">
              {TESTE.perguntas.map((p, i) => (
                <fieldset key={p.id}>
                  <legend className="flex items-baseline gap-3 text-[0.98rem] text-grafite">
                    <span className="font-display text-sm text-ouro-profundo">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p.pergunta}
                  </legend>
                  <div className="mt-3.5 flex flex-wrap gap-2.5">
                    {p.opcoes.map((o) => (
                      <button
                        key={o.rotulo}
                        type="button"
                        onClick={() => responder(p.id, o.rotulo, o.padrao)}
                        aria-pressed={respostas[p.id] === o.rotulo}
                        className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                          respostas[p.id] === o.rotulo
                            ? "border-ouro bg-ouro/12 text-grafite"
                            : "border-linha text-grafite/70 hover:border-ouro/50 hover:text-grafite"
                        }`}
                      >
                        {o.rotulo}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            {testeCompleto && selecionados.length === 0 && (
              <p className="mt-9 border-l-2 border-ouro pl-5 text-[0.95rem] leading-relaxed text-grafite/80">
                {ui.neutro}
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="mt-8 max-w-2xl text-[0.95rem] leading-relaxed text-grafite/70">
              {ui.escolherIntro}
            </p>

            <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {PADROES.map((p) => {
                const ativo = selecionados.includes(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => alternar(p.id)}
                      aria-pressed={ativo}
                      className={`group flex h-full w-full flex-col items-center rounded-sm border p-5 text-center transition-all duration-300 ${
                        ativo
                          ? "border-ouro bg-ouro/[0.07]"
                          : "border-linha hover:border-ouro/50"
                      }`}
                    >
                      <span className="relative block h-36 w-full">
                        <Image
                          src={p.figura}
                          alt=""
                          fill
                          sizes="180px"
                          className="object-contain invert hue-rotate-180 transition-transform duration-500 group-hover:-translate-y-1"
                        />
                      </span>
                      <span className="mt-4 text-[0.62rem] uppercase tracking-[0.16em] text-ouro-profundo">
                        {p.numero}
                      </span>
                      <span className="mt-1.5 font-display text-[0.98rem] leading-tight text-grafite">
                        {p.nome}
                      </span>
                      <span className="mt-1.5 text-xs leading-snug text-grafite/55">
                        {p.resumo}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* ── 02 · Resultado ──────────────────────────────────── */}
      {escolhidos.length > 0 && (
        <section className="border-t border-linha-ouro pt-14">
          <Eyebrow>{ui.protocolo}</Eyebrow>

          {selecionados.includes("p1") && selecionados.includes("p2") && (
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-grafite/75">
              {ui.p1p2}
            </p>
          )}

          <div className="mt-10 space-y-12">
            {escolhidos.map((p) => (
              <article key={p.id}>
                <div className="flex items-start gap-6">
                  <span className="relative hidden h-32 w-20 shrink-0 sm:block">
                    <Image src={p.figura} alt="" fill sizes="80px" className="object-contain invert hue-rotate-180" />
                  </span>
                  <div>
                    <p className="t-eyebrow text-ouro-profundo">{p.numero}</p>
                    <h3 className="mt-3 font-display text-2xl">{p.nome}</h3>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-grafite/75">
                      {p.custoNoTreino}
                    </p>
                  </div>
                </div>

                <dl className="mt-8 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-2">
                  <div className="bg-porcelana p-5">
                    <dt className="text-xs uppercase tracking-[0.14em] text-grafite/55">
                      {ui.curto}
                    </dt>
                    <dd className="mt-2.5 text-[0.92rem] leading-relaxed text-grafite/85">
                      {p.curto}
                    </dd>
                  </div>
                  <div className="bg-porcelana p-5">
                    <dt className="text-xs uppercase tracking-[0.14em] text-grafite/55">
                      {ui.fraco}
                    </dt>
                    <dd className="mt-2.5 text-[0.92rem] leading-relaxed text-grafite/85">
                      {p.fraco}
                    </dd>
                  </div>
                </dl>

                {p.cuidado && (
                  <p className="mt-6 max-w-2xl border-l-2 border-ouro pl-5 text-[0.92rem] leading-relaxed text-grafite/85">
                    <strong className="font-medium">{ui.atencao}</strong> {p.cuidado}
                  </p>
                )}

                {p.naoFazer && (
                  <div className="mt-6">
                    <p className="t-eyebrow text-grafite/50">{ui.naoFazer}</p>
                    <ul className="mt-3 space-y-1.5">
                      {p.naoFazer.map((x) => (
                        <li key={x} className="flex items-start gap-3 text-sm text-grafite/70">
                          <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-grafite/40" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <details className="group mt-6">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2.5 text-sm text-ouro-profundo [&::-webkit-details-marker]:hidden">
                    {ui.erros}
                    <span aria-hidden className="transition-transform duration-300 group-open:rotate-90">
                      ›
                    </span>
                  </summary>
                  <ul className="mt-4 space-y-3">
                    {p.erros.map((e) => (
                      <li
                        key={e}
                        className="max-w-2xl border-l border-linha pl-4 text-[0.9rem] leading-relaxed text-grafite/70"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>

          {/* Exercícios */}
          <h3 className="t-eyebrow mt-16 text-grafite/50">
            {ui.seusExercicios(exercicios.length, TOTAL_EXERCICIOS)}
          </h3>

          <ol className="mt-6 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-2">
            {exercicios.map((e) => (
              <li key={e.n} className="bg-porcelana p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm text-ouro-profundo">{e.n}</span>
                  <span aria-hidden className="rule-gold h-px flex-1" />
                </div>
                <h4 className="mt-4 font-display text-lg leading-tight">{e.nome}</h4>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ouro-profundo">
                  {e.dose}
                </p>
                <p className="mt-3.5 text-[0.9rem] leading-relaxed text-grafite/75">
                  {e.como}
                </p>
                <p className="mt-4 border-l-2 border-ouro pl-4 text-[0.85rem] leading-relaxed text-grafite/70">
                  <strong className="font-medium text-grafite">{ui.pontoFalha}</strong>{" "}
                  {e.falha}
                </p>
              </li>
            ))}
          </ol>

          {/* Fases */}
          <h3 className="t-eyebrow mt-16 text-grafite/50">{ui.semanas}</h3>
          <div className="mt-6 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-3">
            {fases(idioma).map((f) => (
              <div key={f.fase} className="bg-porcelana p-6">
                <p className="font-display text-4xl text-ouro/50">{f.fase}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.13em] text-grafite/55">
                  {f.semanas}
                </p>
                <p className="mt-2.5 font-display text-lg">{f.objetivo}</p>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-grafite/70">
                  {f.onde}. {f.dose}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-2xl border-l border-linha-ouro pl-7">
            <p className="t-eyebrow text-grafite/50">{ui.expectativa}</p>
            <dl className="mt-4 space-y-3">
              {expectativa(idioma).map((x) => (
                <div key={x.prazo} className="text-[0.9rem] leading-relaxed">
                  <dt className="inline text-grafite">{x.prazo}. </dt>
                  <dd className="inline text-grafite/70">{x.muda}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[0.9rem] leading-relaxed text-grafite/70">{promessa(idioma)}</p>
          </div>

          {/* Ponte */}
          <div className="mt-14 border-t border-linha pt-9">
            <p className="max-w-xl leading-relaxed text-grafite/70">
              {ui.ponte}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={rotaIdioma(idioma, `${rotas.consultoria}?de=raio-x`)}
                className={`${buttonClass("consultoria")}`}
              >
                {ui.cta}
                <Arrow />
              </a>
              <Link
                href={rotaIdioma(idioma, "/leitura/postura")}
                className="group inline-flex items-center gap-2.5 border-b border-linha-ouro pb-1.5 text-sm text-ouro-profundo"
              >
                {ui.livro}
                <Arrow />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
