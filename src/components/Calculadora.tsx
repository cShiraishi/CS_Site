"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ATIVIDADES,
  FORMULAS,
  type Atividade,
  type Formula,
  type Macros,
  type Plano,
  type Refeicao,
  type Resultado as ResultadoBase,
  type Sexo,
  calcular,
  distribuir,
  macros as calcularMacros,
  planejar,
} from "@/lib/calorias";
import { rotas } from "@/lib/content";
import { TEXTOS_CALORIAS, type TextosCalorias } from "@/lib/i18n/calorias";
import { type Idioma, LANG_HTML, rotaIdioma } from "@/lib/rotas-idioma";
import { criarSupabaseBrowser } from "@/lib/supabase/client";
import { CapturaPlano, type Parametros } from "./CapturaPlano";
import { Arrow, Rotulo, buttonClass, campoBase } from "./ui";

const dec = (s: string) => Number(s.replace(",", "."));

type Fmt = {
  num: (n: number) => string;
  /** casas fixas — "1,5" em pt/es, "1.5" em en */
  fixo: (n: number, casas: number) => string;
};

function formatadores(idioma: Idioma): Fmt {
  const lang = LANG_HTML[idioma];
  return {
    num: (n) => n.toLocaleString(lang),
    fixo: (n, casas) =>
      n.toLocaleString(lang, { minimumFractionDigits: casas, maximumFractionDigits: casas }),
  };
}

export function Calculadora({ idioma = "pt" }: { idioma?: Idioma } = {}) {
  const id = useId();
  const t = TEXTOS_CALORIAS[idioma].calc;

  const [sexo, setSexo] = useState<Sexo>("masculino");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [gordura, setGordura] = useState("");
  const [pesoAlvo, setPesoAlvo] = useState("");
  const [atividade, setAtividade] = useState<Atividade>("moderado");
  const [formula, setFormula] = useState<Formula>("mifflin");
  const [refeicoes, setRefeicoes] = useState(4);

  useEffect(() => {
    const supabase = criarSupabaseBrowser();
    if (!supabase) return;
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: perfil }, { data: medida }, { data: ultimo }] = await Promise.all([
        supabase.from("profiles").select("nascimento,sexo,altura_cm").eq("id", user.id).maybeSingle(),
        supabase.from("measurements").select("weight_kg,body_fat_pct").eq("user_id", user.id).order("measured_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("calculator_results").select("activity,formula,meals_per_day,target_weight_kg").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (perfil?.sexo === "masculino" || perfil?.sexo === "feminino") setSexo(perfil.sexo);
      if (perfil?.altura_cm) setAltura(String(perfil.altura_cm));
      if (perfil?.nascimento) {
        const hoje = new Date(); const nascimento = new Date(`${perfil.nascimento}T12:00:00`);
        let anos = hoje.getFullYear() - nascimento.getFullYear();
        if (hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())) anos--;
        if (anos > 0) setIdade(String(anos));
      }
      if (medida?.weight_kg) setPeso(String(medida.weight_kg));
      if (medida?.body_fat_pct) setGordura(String(medida.body_fat_pct));
      if (ultimo?.target_weight_kg) setPesoAlvo(String(ultimo.target_weight_kg));
      if (ultimo && ATIVIDADES.some((a) => a.id === ultimo.activity)) setAtividade(ultimo.activity as Atividade);
      if (ultimo && FORMULAS.some((f) => f.id === ultimo.formula)) setFormula(ultimo.formula as Formula);
      if (ultimo?.meals_per_day) setRefeicoes(ultimo.meals_per_day);
    })();
  }, []);

  const dados = useMemo(() => {
    const base = calcular(
      {
        sexo,
        idade: dec(idade),
        peso: dec(peso),
        altura: dec(altura),
        gordura: gordura ? dec(gordura) : undefined,
      },
      formula,
      atividade,
    );
    if (!base) return null;

    // Sem peso alvo, o plano assume manutenção.
    const alvo = pesoAlvo ? dec(pesoAlvo) : dec(peso);
    const plano = planejar(base.get, base.tmb, dec(peso), alvo);
    if (!plano) return null;

    const m = calcularMacros(plano.alvo, dec(peso), plano.direcao);
    const parametros: Parametros = {
      sexo,
      idade,
      peso,
      altura,
      gordura,
      pesoAlvo: pesoAlvo || peso,
      atividade,
      formula,
      refeicoes,
    };
    return {
      base,
      plano,
      macros: m,
      // Os nomes vêm do dicionário; a conta, de `distribuir`.
      pratos: distribuir(plano.alvo, m, refeicoes).map((r, i, todas) => ({
        ...r,
        nome: (t.nomesRefeicoes[todas.length] ?? t.nomesRefeicoes[3])[i] ?? r.nome,
      })),
      parametros,
    };
  }, [sexo, idade, peso, altura, gordura, pesoAlvo, formula, atividade, refeicoes, t]);

  const faltaGordura = formula === "katch" && !gordura;

  return (
    <div className="space-y-20" ref={(node) => { if (node) node.dataset.interactive = "true"; }}>
      <nav aria-label={t.etapasAria} className="surface-card grid overflow-hidden sm:grid-cols-3">
        {[
          ["01", t.etapas[0], "#calc-dados"],
          ["02", t.etapas[1], "#calc-objetivo"],
          ["03", t.etapas[2], "#calc-resultado"],
        ].map(([numero, rotulo, href], i) => (
          <a
            key={numero}
            href={href}
            className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ouro/10 ${
              i > 0 ? "border-t border-linha sm:border-l sm:border-t-0" : ""
            }`}
          >
            <span className="font-display text-2xl text-ouro-profundo transition-colors group-hover:text-ouro-profundo">
              {numero}
            </span>
            <span className="text-sm text-grafite">{rotulo}</span>
            <span aria-hidden className="ml-auto text-ouro-profundo/35 transition-transform group-hover:translate-x-1">↓</span>
          </a>
        ))}
      </nav>

      {/* ── 1. Dados ──────────────────────────────────────────── */}
      <form
        id="calc-dados"
        onSubmit={(e) => e.preventDefault()}
        aria-label={t.dadosAria}
        className="surface-card scroll-mt-28 bg-white p-6 sm:p-10 lg:p-12"
      >
        <p className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
          <span aria-hidden className="rule-gold inline-block h-px w-8" />
          <Icone tipo="pessoa" />
          {t.dadosEyebrow}
        </p>

        <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-3">
          <fieldset className="lg:col-span-3">
            <legend className="t-eyebrow text-grafite">{t.sexoLegenda}</legend>
            <div className="mt-3 inline-flex rounded-full border border-linha bg-white p-1 shadow-sm">
              {(["masculino", "feminino"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSexo(s)}
                  aria-pressed={sexo === s}
                  className={`rounded-full px-6 py-2 text-sm capitalize transition-colors duration-300 ${
                    sexo === s
                      ? "bg-grafite text-porcelana"
                      : "text-grafite hover:text-grafite"
                  }`}
                >
                  {t.sexos[s]}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-grafite">
              {t.sexoNota}
            </p>
          </fieldset>

          <Numero id={`${id}-idade`} rotulo={t.idade} unidade={t.anos} dica="32" valor={idade} set={setIdade} />
          <Numero id={`${id}-peso`} rotulo={t.peso} unidade="kg" dica="78" valor={peso} set={setPeso} />
          <Numero id={`${id}-altura`} rotulo={t.altura} unidade="cm" dica="176" valor={altura} set={setAltura} />

          <div className="lg:col-span-2">
            <Rotulo htmlFor={`${id}-atividade`}>{t.atividade}</Rotulo>
            <select
              id={`${id}-atividade`}
              value={atividade}
              onChange={(e) => setAtividade(e.target.value as Atividade)}
              className={`${campoBase} appearance-none`}
            >
              {ATIVIDADES.map((a) => (
                <option key={a.id} value={a.id}>
                  {t.atividades[a.id].nome} — {t.atividades[a.id].nota}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="lg:col-span-3">
            <legend className="t-eyebrow text-grafite">
              {t.formulaLegenda}
            </legend>
            <p className="mt-2 text-sm text-grafite">
              {t.formulaDica}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {FORMULAS.map((f) => {
                const selecionada = formula === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormula(f.id)}
                    aria-pressed={selecionada}
                    className={`min-h-36 border p-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ouro-profundo ${
                      selecionada
                        ? "border-ouro-profundo bg-ouro/10"
                        : "border-linha bg-white hover:border-ouro/70"
                    }`}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-porcelana text-ouro-profundo">
                          <Icone
                            tipo={
                              f.id === "mifflin"
                                ? "recomendado"
                                : f.id === "harris"
                                  ? "historico"
                                  : "medicao"
                            }
                          />
                        </span>
                        <span className="font-display text-xl text-grafite">
                          {f.nome}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                          selecionada ? "border-ouro-profundo" : "border-grafite/30"
                        }`}
                      >
                        {selecionada && <span className="size-2 rounded-full bg-ouro-profundo" />}
                      </span>
                    </span>
                    {f.id === "mifflin" && (
                      <span className="mt-3 inline-block bg-grafite px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-porcelana">
                        {t.recomendado}
                      </span>
                    )}
                    <span className="mt-3 block text-sm leading-relaxed text-grafite">
                      {t.formulas[f.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {formula === "katch" && (
            <div className="lg:col-span-3">
              <div className="max-w-xs">
                <Numero
                  id={`${id}-gordura`}
                  rotulo={t.gordura}
                  unidade="%"
                  dica="18"
                  valor={gordura}
                  set={setGordura}
                />
              </div>
              <p className="mt-2.5 text-xs text-grafite">
                {t.gorduraNota}
              </p>
            </div>
          )}
        </div>
      </form>

      {/* ── 2. Objetivo ───────────────────────────────────────── */}
      <form
        id="calc-objetivo"
        onSubmit={(e) => e.preventDefault()}
        aria-label={t.objetivoAria}
        className="surface-card scroll-mt-28 bg-white p-6 sm:p-10 lg:p-12"
      >
        <p className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
          <span aria-hidden className="rule-gold inline-block h-px w-8" />
          <Icone tipo="alvo" />
          {t.objetivoEyebrow}
        </p>

        <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-3">
          <Numero
            id={`${id}-alvo`}
            rotulo={t.pesoAlvo}
            unidade="kg"
            dica="72"
            valor={pesoAlvo}
            set={setPesoAlvo}
          />

          <div className="lg:col-span-2">
            <Rotulo htmlFor={`${id}-refeicoes`}>{t.refeicoes}</Rotulo>
            <div
              id={`${id}-refeicoes`}
              role="radiogroup"
              aria-label={t.refeicoes}
              className="mt-3 inline-flex rounded-full border border-linha p-1"
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={refeicoes === n}
                  onClick={() => setRefeicoes(n)}
                  className={`h-10 w-10 rounded-full text-sm transition-colors duration-300 ${
                    refeicoes === n
                      ? "bg-grafite text-porcelana"
                      : "text-grafite hover:text-grafite"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-grafite">
              {t.refeicoesNota}
            </p>
          </div>
        </div>
      </form>

      {/* ── 3. Resultado ──────────────────────────────────────── */}
      <div id="calc-resultado" aria-live="polite" className="scroll-mt-28">
        <AnimatePresence mode="wait" initial={false}>
          {dados ? (
            <motion.div
              key="resultado"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Resultado {...dados} idioma={idioma} t={t} />
            </motion.div>
          ) : (
          <motion.div
            key="vazio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-t border-linha-ouro pt-10"
          >
            <span aria-hidden className="rule-gold h-px w-16" />
            <p className="mt-7 max-w-sm font-display text-2xl leading-snug text-grafite">
              {faltaGordura ? t.faltaGordura : t.vazio}
            </p>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================ */

type DadosCalculados = {
  base: ResultadoBase;
  plano: Plano;
  macros: Macros;
  pratos: Refeicao[];
  parametros: Parametros;
};

function Resultado({
  base,
  plano,
  macros,
  pratos,
  parametros,
  idioma,
  t,
}: DadosCalculados & { idioma: Idioma; t: TextosCalorias["calc"] }) {
  const { num, fixo } = formatadores(idioma);
  const [liberado, setLiberado] = useState(false);
  const salvo = useRef(false);
  const liberar = useCallback(async () => {
    setLiberado(true);
    if (salvo.current) return;
    const supabase = criarSupabaseBrowser();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    salvo.current = true;
    await Promise.all([
      supabase.from("measurements").insert({ user_id: user.id, weight_kg: dec(parametros.peso), body_fat_pct: parametros.gordura ? dec(parametros.gordura) : null }),
      supabase.from("calculator_results").insert({
        user_id: user.id, bmr: base.tmb, daily_expenditure: base.get,
        target_calories: plano.alvo, direction: plano.direcao,
        protein_g: macros.proteina.g, carbohydrate_g: macros.carboidrato.g, fat_g: macros.gordura.g,
        target_weight_kg: dec(parametros.pesoAlvo), activity: parametros.atividade,
        formula: parametros.formula, meals_per_day: parametros.refeicoes,
      }),
    ]);
  }, [base, plano, macros, parametros]);
  const rumo = t.rumo[plano.direcao];

  return (
    <div className="border-t border-linha-ouro pt-12">
      <p className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
        <span aria-hidden className="rule-gold inline-block h-px w-8" />
        <Icone tipo="grafico" />
        {t.planoEyebrow}
      </p>

      {!liberado && (
        <>
          <div aria-hidden className="relative mt-10 overflow-hidden rounded-xl border border-linha bg-white p-6 sm:p-8">
            <div className="grid gap-4 blur-[7px] select-none sm:grid-cols-3">
              {t.borrao.map((item) => (
                <div key={item} className="bg-porcelana p-6">
                  <p className="text-xs uppercase tracking-wider">{item}</p>
                  <p className="mt-4 font-display text-4xl">{num(2000)}</p>
                  <span className="mt-5 block h-1 w-3/4 bg-ouro/40" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/20">
              <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-medium text-grafite shadow-lg backdrop-blur-xl">
                {t.reservado}
              </span>
            </div>
          </div>
          <CapturaPlano parametros={parametros} onLiberar={liberar} idioma={idioma} />
        </>
      )}

      {liberado && (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

      {/* Números principais */}
      <dl className="mt-10 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-3">
        <Numeral
          rotulo={t.tmb}
          valor={base.tmb}
          nota={t.explicaTmb}
          num={num}
        />
        <Numeral
          rotulo={t.get}
          valor={base.get}
          nota={t.getNota}
          num={num}
        />
        <Numeral
          rotulo={t.alvo(rumo)}
          valor={plano.alvo}
          nota={
            plano.direcao === "manter"
              ? t.alvoManter
              : t.ajustePorDia(`${plano.ajuste > 0 ? "+" : ""}${num(plano.ajuste)}`)
          }
          num={num}
          destaque
        />
      </dl>

      {/* Trajetória */}
      {plano.direcao !== "manter" && (
        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-l border-linha-ouro pl-7">
          <Traco rotulo={t.diferenca} valor={`${fixo(plano.diferenca, 1)} kg`} />
          <Traco
            rotulo={t.ritmo}
            valor={t.porSemana(fixo(plano.ritmoSemanal, 2))}
          />
          <Traco
            rotulo={t.prazo}
            valor={t.semanas(plano.semanas)}
          />
        </div>
      )}

      {plano.limitado && (
        <p className="mt-7 max-w-2xl border-l-2 border-ouro pl-5 text-sm leading-relaxed text-grafite">
          {t.limitado}
        </p>
      )}

      {/* Macros */}
      <h3 className="t-eyebrow mt-16 text-grafite">{t.macrosTitulo}</h3>
      <dl className="mt-6 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-3">
        <Macro rotulo={t.proteina} dados={macros.proteina} num={num} pct={t.pctCalorias} />
        <Macro rotulo={t.gorduraMacro} dados={macros.gordura} num={num} pct={t.pctCalorias} />
        <Macro rotulo={t.carboidrato} dados={macros.carboidrato} num={num} pct={t.pctCalorias} />
      </dl>

      {macros.apertado && (
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grafite">
          {t.apertado}
        </p>
      )}

      {/* Distribuição */}
      <h3 className="t-eyebrow mt-16 text-grafite">
        {t.distribuicao(pratos.length)}
      </h3>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-linha text-left">
              <th scope="col" className="py-3 pr-4 font-normal text-grafite">
                {t.refeicao}
              </th>
              <th scope="col" className="py-3 px-4 text-right font-normal text-grafite">
                kcal
              </th>
              <th scope="col" className="py-3 px-4 text-right font-normal text-grafite">
                {t.proteina}
              </th>
              <th scope="col" className="py-3 px-4 text-right font-normal text-grafite">
                {t.carboidrato}
              </th>
              <th scope="col" className="py-3 pl-4 text-right font-normal text-grafite">
                {t.gorduraMacro}
              </th>
            </tr>
          </thead>
          <tbody>
            {pratos.map((r, i) => (
              <tr key={`${r.nome}-${i}`} className="border-b border-linha">
                <th scope="row" className="py-3.5 pr-4 text-left font-normal text-grafite">
                  {r.nome}
                </th>
                <td className="py-3.5 px-4 text-right font-display text-lg text-ouro-profundo">
                  {num(r.kcal)}
                </td>
                <td className="py-3.5 px-4 text-right text-grafite">{r.proteina} g</td>
                <td className="py-3.5 px-4 text-right text-grafite">{r.carboidrato} g</td>
                <td className="py-3.5 pl-4 text-right text-grafite">{r.gordura} g</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="py-3.5 pr-4 text-left text-xs uppercase tracking-[0.13em] text-grafite">
                {t.total}
              </th>
              <td className="py-3.5 px-4 text-right font-display text-lg text-grafite">
                {num(plano.alvo)}
              </td>
              <td className="py-3.5 px-4 text-right text-grafite">{macros.proteina.g} g</td>
              <td className="py-3.5 px-4 text-right text-grafite">{macros.carboidrato.g} g</td>
              <td className="py-3.5 pl-4 text-right text-grafite">{macros.gordura.g} g</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grafite">
        {t.proteinaNota}
      </p>

      {/* Ponte para a consultoria */}
      <div className="mt-14 border-t border-linha pt-9">
        <p className="max-w-xl leading-relaxed text-grafite">{t.ponte}</p>
        <a
          href={rotaIdioma(idioma, `${rotas.consultoria}?de=calculadora`)}
          className={`mt-7 ${buttonClass("consultoria")}`}
        >
          {t.comecar}
          <Arrow />
        </a>
      </div>
      </motion.div>
      )}
    </div>
  );
}

/* ── peças ──────────────────────────────────────────────────── */

function Numeral({
  rotulo,
  valor,
  nota,
  num,
  destaque = false,
}: {
  rotulo: string;
  valor: number;
  nota: string;
  num: Fmt["num"];
  destaque?: boolean;
}) {
  return (
    <div className={`p-7 ${destaque ? "bg-grafite" : "bg-porcelana"}`}>
      <dt
        className={`text-xs uppercase tracking-[0.13em] ${
          destaque ? "text-ouro" : "text-grafite"
        }`}
      >
        {rotulo}
      </dt>
      <dd
        className={`mt-3 font-display text-4xl leading-none sm:text-5xl ${
          destaque ? "text-porcelana" : "text-grafite"
        }`}
      >
        <motion.span
          key={valor}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.3 }}
        >
          {num(valor)}
        </motion.span>
        <span
          className={`ml-2.5 font-sans text-sm tracking-wide ${
            destaque ? "text-porcelana/70" : "text-grafite"
          }`}
        >
          kcal
        </span>
      </dd>
      <dd
        className={`mt-3.5 text-xs leading-relaxed ${
          destaque ? "text-porcelana/70" : "text-grafite"
        }`}
      >
        {nota}
      </dd>
    </div>
  );
}

function Macro({
  rotulo,
  dados,
  num,
  pct,
}: {
  rotulo: string;
  dados: { g: number; kcal: number; pct: number };
  num: Fmt["num"];
  pct: TextosCalorias["calc"]["pctCalorias"];
}) {
  return (
    <div className="bg-porcelana p-6">
      <dt className="text-xs uppercase tracking-[0.13em] text-grafite">{rotulo}</dt>
      <dd className="mt-3 font-display text-3xl text-grafite">
        {num(dados.g)}
        <span className="ml-1.5 font-sans text-sm text-grafite">g</span>
      </dd>
      {/* barra da proporção — ouro como ponto de direção */}
      <dd className="mt-4">
        <span aria-hidden className="block h-px w-full bg-linha">
          <span
            className="block h-px bg-ouro transition-[width] duration-500"
            style={{ width: `${dados.pct}%` }}
          />
        </span>
        <span className="mt-2.5 block text-xs text-grafite">
          {pct(dados.pct, num(dados.kcal))}
        </span>
      </dd>
    </div>
  );
}

function Traco({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.13em] text-grafite">{rotulo}</p>
      <p className="mt-1.5 font-display text-xl text-grafite">{valor}</p>
    </div>
  );
}

type TipoIcone =
  | "pessoa"
  | "alvo"
  | "grafico"
  | "recomendado"
  | "historico"
  | "medicao";

/** Ícones lineares, sem dependência externa, para orientar sem competir com o texto. */
function Icone({ tipo }: { tipo: TipoIcone }) {
  const caminhos: Record<TipoIcone, React.ReactNode> = {
    pessoa: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 20c.6-4.1 2.8-6 6.5-6s5.9 1.9 6.5 6" />
      </>
    ),
    alvo: (
      <>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
        <path d="m14 10 5-5m0 0v3m0-3h-3" />
      </>
    ),
    grafico: (
      <>
        <path d="M4 19V5m0 14h16" />
        <path d="m7 15 4-4 3 2 5-6" />
      </>
    ),
    recomendado: (
      <>
        <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 3Z" />
      </>
    ),
    historico: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2M5.5 5.5 3 5V2" />
      </>
    ),
    medicao: (
      <>
        <path d="M5 19a7 7 0 1 1 14 0H5Z" />
        <path d="m12 12 3-3M8 17h8" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {caminhos[tipo]}
    </svg>
  );
}

function Numero({
  id,
  rotulo,
  unidade,
  dica,
  valor,
  set,
}: {
  id: string;
  rotulo: string;
  unidade: string;
  dica: string;
  valor: string;
  set: (v: string) => void;
}) {
  return (
    <div>
      <Rotulo htmlFor={id}>{rotulo}</Rotulo>
      <div className="flex items-baseline gap-2 border-b border-linha transition-colors focus-within:border-ouro">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={dica}
          value={valor}
          onChange={(e) => set(e.target.value.replace(/[^\d.,]/g, "").slice(0, 6))}
          className={`${campoBase} border-0 focus:border-0`}
        />
        <span className="shrink-0 pb-3 text-xs text-grafite">{unidade}</span>
      </div>
    </div>
  );
}
