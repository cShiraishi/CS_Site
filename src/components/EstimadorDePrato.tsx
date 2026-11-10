"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ALIMENTOS,
  CATEGORIAS,
  POR_ID,
  QUANTIDADES,
  type Alimento,
  type CategoriaId,
} from "@/lib/alimentos";
import { rotas } from "@/lib/content";
import { TEXTOS_PRATO } from "@/lib/i18n/prato";
import { type Idioma, LANG_HTML, rotaIdioma } from "@/lib/rotas-idioma";
import { type ItemPrato, lerContraMeta, montarPrato } from "@/lib/prato";
import { Arrow, Eyebrow, buttonClass } from "./ui";

/**
 * A meta do dia sobrevive entre visitas — ninguém quer redigitar.
 *
 * Ler o `localStorage` num efeito daria hidratação divergente (o servidor não
 * tem `localStorage`) e um render em cascata. `useSyncExternalStore` resolve
 * as duas coisas: o servidor recebe o instantâneo vazio e o cliente lê o valor
 * real já no primeiro render depois da hidratação.
 */
const CHAVE_META = "cs:meta-kcal";

/** O evento `storage` só cruza abas; para a própria aba, avisamos à mão. */
const ouvintes = new Set<() => void>();

function inscrever(aoMudar: () => void) {
  ouvintes.add(aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    ouvintes.delete(aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

const lerMeta = () => localStorage.getItem(CHAVE_META) ?? "";
/** No servidor não há armazenamento — o campo nasce vazio. */
const metaNoServidor = () => "";

function gravarMeta(valor: string) {
  if (valor) localStorage.setItem(CHAVE_META, valor);
  else localStorage.removeItem(CHAVE_META);
  for (const avisar of ouvintes) avisar();
}

/** "1,5× concha" lê pior do que "1½ concha". */
function fracao(q: number): string {
  const inteiro = Math.floor(q);
  const meio = q - inteiro >= 0.5;
  if (inteiro === 0) return "½";
  return meio ? `${inteiro}½` : String(inteiro);
}

const formatarGramas = (lang: string) => (n: number) =>
  n >= 1000 ? `${(n / 1000).toLocaleString(lang, { maximumFractionDigits: 1 })} kg` : `${Math.round(n)} g`;

export function EstimadorDePrato({ idioma = "pt" }: { idioma?: Idioma } = {}) {
  const t = TEXTOS_PRATO[idioma];
  const e = t.est;
  const gramas = formatarGramas(LANG_HTML[idioma]);
  const nome = (a: Alimento) => t.alimentos[a.id] ?? a.nome;
  const unidade = (a: Alimento) => t.unidades[a.unidade] ?? a.unidade;
  const [escolhas, setEscolhas] = useState<ItemPrato[]>([]);
  const [aba, setAba] = useState<CategoriaId>("base");
  const meta = useSyncExternalStore(inscrever, lerMeta, metaNoServidor);

  const adicionar = (id: string) =>
    setEscolhas((atual) =>
      atual.some((e) => e.id === id)
        ? atual.filter((e) => e.id !== id)
        : [...atual, { id, quantidade: 1 }],
    );

  const ajustar = (id: string, quantidade: number) =>
    setEscolhas((atual) =>
      atual.map((e) => (e.id === id ? { ...e, quantidade } : e)),
    );

  const prato = useMemo(() => montarPrato(escolhas), [escolhas]);
  const leitura = useMemo(
    () => lerContraMeta(prato.kcal, Number(meta)),
    [prato.kcal, meta],
  );

  const temPrato = prato.itens.length > 0;
  const daAba = ALIMENTOS.filter((a) => a.categoria === aba);

  return (
    <div className={temPrato ? "pb-24 lg:pb-0" : undefined}>
      {/* ── O guia de porção, antes de qualquer número ──────── */}
      <details className="group rounded-sm border border-ouro/35 bg-ouro/[0.06] p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[0.98rem] font-medium text-grafite [&::-webkit-details-marker]:hidden">
          {e.guiaTitulo}
          <span aria-hidden className="relative h-3 w-3 shrink-0 text-ouro-profundo">
            <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
            <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
          </span>
        </summary>
        <div className="mt-5">
          <p className="max-w-2xl text-sm leading-relaxed text-grafite/75">
            {e.guiaTexto}
          </p>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-2">
            {t.referencias.map((r) => (
              <div key={r.gesto} className="bg-porcelana p-5">
                <dt className="font-display text-lg leading-tight">{r.gesto}</dt>
                <dd className="mt-2 text-[0.9rem] text-ouro-profundo">{r.equivale}</dd>
                <dd className="mt-1.5 text-[0.85rem] leading-relaxed text-grafite/65">
                  {r.nota}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </details>

      {/* `1.35fr` sozinho não segura: `fr` respeita o min-content, e a coluna
          da esquerda incha até espremer a conta. Os `minmax` cravam o piso. */}
      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)] lg:gap-12">
        {/* ── 01 · Montar o prato ──────────────────────────── */}
        {/* `min-w-0`: item de grid nasce com `min-width: auto`, então a fileira
            de abas empurrava a coluna a 892 px e estourava a tela no celular.
            O `overflow-x-auto` das abas só passa a valer com isto aqui. */}
        <section className="min-w-0">
          <Eyebrow>{e.montarEyebrow}</Eyebrow>
          <h2 className="t-title mt-6 text-balance">{e.montarTitulo}</h2>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-grafite/70">
            {e.montarTexto}
          </p>

          {/* Abas de categoria */}
          {/* Rola na horizontal no celular; a barra fica escondida porque a
              própria fileira de abas já indica que há mais para o lado. */}
          <div className="mt-8 flex min-w-0 gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIAS.map((c) => {
              const escolhidosAqui = escolhas.filter(
                (x) => POR_ID.get(x.id)?.categoria === c.id,
              ).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAba(c.id)}
                  aria-pressed={aba === c.id}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                    aba === c.id
                      ? "border-grafite bg-grafite text-porcelana"
                      : "border-linha text-grafite/65 hover:border-ouro/50 hover:text-grafite"
                  }`}
                >
                  {t.categorias[c.id].nome}
                  {escolhidosAqui > 0 && (
                    <span
                      className={`flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[0.62rem] ${
                        aba === c.id ? "bg-ouro text-grafite" : "bg-ouro/25 text-ouro-profundo"
                      }`}
                    >
                      {escolhidosAqui}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[0.85rem] text-grafite/55">
            {t.categorias[aba].nota}
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {daAba.map((a) => {
              const escolha = escolhas.find((x) => x.id === a.id);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => adicionar(a.id)}
                    aria-pressed={Boolean(escolha)}
                    className={`flex w-full items-start justify-between gap-3 rounded-sm border p-4 text-left transition-all duration-300 ${
                      escolha
                        ? "border-ouro bg-ouro/[0.07]"
                        : "border-linha hover:border-ouro/50"
                    }`}
                  >
                    <span>
                      <span className="block text-[0.95rem] leading-tight text-grafite">
                        {nome(a)}
                      </span>
                      <span className="mt-1.5 block text-xs text-grafite/55">
                        1 {unidade(a)} · {gramas(a.gramas)} ·{" "}
                        {Math.round((a.kcal * a.gramas) / 100)} kcal
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem] transition-colors ${
                        escolha
                          ? "border-ouro bg-ouro text-grafite"
                          : "border-linha text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── 02 · O prato e o resultado ───────────────────── */}
        <section className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>{e.contaEyebrow}</Eyebrow>

          {!temPrato ? (
            <p className="mt-6 border-l-2 border-linha pl-5 text-[0.95rem] leading-relaxed text-grafite/60">
              {e.vazio}
            </p>
          ) : (
            <>
              {/* Itens escolhidos, com a quantidade */}
              <ul className="mt-6 divide-y divide-linha border-y border-linha">
                {prato.itens.map((i) => (
                  <li key={i.alimento.id} className="py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[0.95rem] leading-tight text-grafite">
                        {nome(i.alimento)}
                      </p>
                      <button
                        type="button"
                        onClick={() => adicionar(i.alimento.id)}
                        aria-label={e.tirar(nome(i.alimento))}
                        className="shrink-0 text-xs text-grafite/40 transition-colors hover:text-ouro-profundo"
                      >
                        {e.remover}
                      </button>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {QUANTIDADES.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => ajustar(i.alimento.id, q)}
                          aria-pressed={i.quantidade === q}
                          aria-label={`${fracao(q)} ${unidade(i.alimento)}`}
                          className={`min-w-9 rounded-full border px-2.5 py-1 text-xs transition-all duration-300 ${
                            i.quantidade === q
                              ? "border-ouro bg-ouro/15 text-grafite"
                              : "border-linha text-grafite/55 hover:border-ouro/50"
                          }`}
                        >
                          {fracao(q)}
                        </button>
                      ))}
                      <span className="ml-1 text-xs text-grafite/55">
                        {unidade(i.alimento)} · {gramas(i.gramas)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Resultado */}
              <div className="mt-8">
                <p className="t-eyebrow text-grafite/50">{e.estimativa}</p>
                <p className="mt-3 font-display text-5xl leading-none text-grafite">
                  {prato.kcal.min}
                  <span className="mx-2 text-2xl text-grafite/35">{e.a}</span>
                  {prato.kcal.max}
                </p>
                <p className="mt-2 text-sm text-grafite/55">
                  {e.deComida(gramas(prato.gramas))}
                </p>

                <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-linha">
                  {[
                    [e.proteina, prato.proteina],
                    [e.carboidrato, prato.carboidrato],
                    [e.gordura, prato.gordura],
                  ].map(([rotulo, f]) => {
                    const faixa = f as typeof prato.proteina;
                    return (
                      <div key={rotulo as string} className="bg-porcelana p-4">
                        <dt className="text-[0.62rem] uppercase tracking-[0.13em] text-grafite/55">
                          {rotulo as string}
                        </dt>
                        <dd className="mt-2 font-display text-xl leading-none text-grafite">
                          {faixa.min}–{faixa.max}
                          <span className="ml-1 text-xs text-grafite/50">g</span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                {/* O álcool é o quarto macronutriente e o único que ninguém
                    contabiliza. Só aparece quando existe — e explicado. */}
                {prato.alcool.medio > 0 && (
                  <p className="mt-4 border-l-2 border-ouro pl-4 text-[0.88rem] leading-relaxed text-grafite/75">
                    <strong className="font-medium text-grafite">
                      {e.alcool(prato.alcool.min, prato.alcool.max)}
                    </strong>{" "}
                    {e.alcoolTexto(Math.round((prato.alcool.medio * 7) / 5) * 5)}
                  </p>
                )}
              </div>

              {/* Meta do dia */}
              <div className="mt-9 border-t border-linha pt-7">
                <label
                  htmlFor="meta-diaria"
                  className="t-eyebrow block text-grafite"
                >
                  {e.meta}
                </label>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    id="meta-diaria"
                    type="number"
                    inputMode="numeric"
                    min={800}
                    max={6000}
                    step={10}
                    value={meta}
                    onChange={(ev) => gravarMeta(ev.target.value)}
                    placeholder="2030"
                    className="w-28 border-b border-linha bg-transparent py-2 text-[0.98rem] text-grafite transition-colors placeholder:text-grafite/40 focus:border-ouro focus:outline-none"
                  />
                  <span className="text-sm text-grafite/55">{e.kcalDia}</span>
                </div>

                {!meta && (
                  <Link
                    href={rotaIdioma(idioma, rotas.calculadora)}
                    className="group mt-4 inline-flex items-center gap-2 border-b border-linha-ouro pb-1 text-sm text-ouro-profundo"
                  >
                    {e.naoSabe}
                    <Arrow />
                  </Link>
                )}

                {leitura && (
                  <div className="mt-6">
                    {/* A barra mostra a faixa inteira, não um traço único —
                        a incerteza tem que estar visível também aqui. */}
                    <div
                      className="relative h-2 w-full overflow-hidden rounded-full bg-linha"
                      role="img"
                      aria-label={e.barraAria(leitura.pctMin, leitura.pctMax)}
                    >
                      <span
                        className={`absolute inset-y-0 rounded-full transition-all duration-500 ${
                          leitura.tom === "estourou" ? "bg-ouro-profundo" : "bg-ouro"
                        }`}
                        style={{
                          left: `${Math.min(100, leitura.pctMin)}%`,
                          right: `${Math.max(0, 100 - Math.min(100, leitura.pctMax))}%`,
                        }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-grafite">
                      <strong className="font-medium">
                        {e.pctFaixa(leitura.pctMin, leitura.pctMax)}
                      </strong>{" "}
                      {e.daMeta}
                      {leitura.tom !== "estourou" && (
                        <span className="text-grafite/60">
                          {" "}
                          {e.sobram(leitura.restante)}
                        </span>
                      )}
                    </p>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-grafite/70">
                      {idioma === "pt" ? leitura.frase : e.frases[leitura.tom]}
                    </p>
                  </div>
                )}
              </div>

              {/* Onde estão as calorias */}
              <div className="mt-9 border-t border-linha pt-7">
                <p className="t-eyebrow text-grafite/50">{e.ondeEstao}</p>
                <ol className="mt-4 space-y-2.5">
                  {prato.maiores.map((i) => (
                    <li
                      key={i.alimento.id}
                      className="flex items-baseline justify-between gap-4 text-[0.92rem]"
                    >
                      <span className="text-grafite/80">{nome(i.alimento)}</span>
                      <span className="shrink-0 tabular-nums text-grafite/55">
                        {Math.round(i.kcal / 5) * 5} kcal
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trocas */}
              {prato.trocas.length > 0 && (
                <div className="mt-9 border-t border-linha pt-7">
                  <p className="t-eyebrow text-grafite/50">
                    {e.aliviar}
                  </p>
                  <ul className="mt-4 space-y-4">
                    {prato.trocas.map((tr) => (
                      <li key={tr.de.id} className="text-[0.92rem] leading-relaxed">
                        <p className="text-grafite/80">
                          {nome(tr.de)} <span className="text-grafite/40">→</span>{" "}
                          <button
                            type="button"
                            onClick={() => {
                              const q =
                                escolhas.find((x) => x.id === tr.de.id)?.quantidade ?? 1;
                              setEscolhas((atual) => [
                                ...atual.filter(
                                  (x) => x.id !== tr.de.id && x.id !== tr.para.id,
                                ),
                                { id: tr.para.id, quantidade: q },
                              ]);
                            }}
                            className="border-b border-linha-ouro pb-0.5 text-ouro-profundo transition-colors hover:text-grafite"
                          >
                            {nome(tr.para)}
                          </button>
                        </p>
                        <p className="mt-1 text-xs text-grafite/55">
                          {e.economia(tr.economia)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => setEscolhas([])}
                className="mt-9 text-sm text-grafite/45 transition-colors hover:text-ouro-profundo"
              >
                {e.limpar}
              </button>
            </>
          )}
        </section>
      </div>

      {/* ── O aviso fica no fim do fluxo, mas visível ───────── */}
      <p className="mt-16 max-w-2xl border-l-2 border-ouro-profundo/50 pl-5 text-[0.86rem] leading-relaxed text-grafite/65">
        {t.aviso}
      </p>

      {/* ── Ponte ───────────────────────────────────────────── */}
      <div className="mt-14 border-t border-linha pt-9">
        <h2 className="t-title max-w-xl text-balance">
          {e.ponteTitulo}
        </h2>
        <p className="mt-6 max-w-lg leading-relaxed text-grafite/70">
          {e.ponteTexto}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={rotaIdioma(idioma, `${rotas.consultoria}?de=prato`)}
            className={`${buttonClass("consultoria")}`}
          >
            {e.comecar}
            <Arrow />
          </a>
          <Link
            href={rotaIdioma(idioma, rotas.calculadora)}
            className="group inline-flex items-center gap-2.5 border-b border-linha-ouro pb-1.5 text-sm text-ouro-profundo"
          >
            {e.calcular}
            <Arrow />
          </Link>
        </div>
      </div>

      {/* ── Barra fixa no celular: a conta acompanha a escolha ── */}
      {temPrato && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-porcelana/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
            <p className="text-sm text-grafite/60">
              <span className="font-display text-xl text-grafite">
                {prato.kcal.min}–{prato.kcal.max}
              </span>{" "}
              kcal
            </p>
            <p className="text-xs text-grafite/50">
              {e.itens(prato.itens.length)}
              {leitura && e.doDia(leitura.pctMin, leitura.pctMax)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
