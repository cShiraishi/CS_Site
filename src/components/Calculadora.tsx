"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
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
import { calculadora } from "@/lib/content";
import { CapturaPlano, type Parametros } from "./CapturaPlano";
import { Arrow, Rotulo, campoBase } from "./ui";

const num = (n: number) => n.toLocaleString("pt-BR");
const dec = (s: string) => Number(s.replace(",", "."));

export function Calculadora() {
  const id = useId();

  const [sexo, setSexo] = useState<Sexo>("masculino");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [gordura, setGordura] = useState("");
  const [pesoAlvo, setPesoAlvo] = useState("");
  const [atividade, setAtividade] = useState<Atividade>("moderado");
  const [formula, setFormula] = useState<Formula>("mifflin");
  const [refeicoes, setRefeicoes] = useState(4);

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
      pratos: distribuir(plano.alvo, m, refeicoes),
      parametros,
    };
  }, [sexo, idade, peso, altura, gordura, pesoAlvo, formula, atividade, refeicoes]);

  const faltaGordura = formula === "katch" && !gordura;

  return (
    <div className="space-y-20">
      {/* ── 1. Dados ──────────────────────────────────────────── */}
      <form onSubmit={(e) => e.preventDefault()} aria-label="Seus dados">
        <p className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
          <span aria-hidden className="rule-gold inline-block h-px w-8" />
          01 / Seus dados
        </p>

        <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-3">
          <fieldset className="lg:col-span-3">
            <legend className="t-eyebrow text-grafite/50">Sexo biológico</legend>
            <div className="mt-3 inline-flex rounded-full border border-linha p-1">
              {(["masculino", "feminino"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSexo(s)}
                  aria-pressed={sexo === s}
                  className={`rounded-full px-6 py-2 text-sm capitalize transition-colors duration-300 ${
                    sexo === s
                      ? "bg-grafite text-porcelana"
                      : "text-grafite/60 hover:text-grafite"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-grafite/45">
              As equações foram derivadas com esta variável — não é uma pergunta
              sobre identidade.
            </p>
          </fieldset>

          <Numero id={`${id}-idade`} rotulo="Idade" unidade="anos" dica="32" valor={idade} set={setIdade} />
          <Numero id={`${id}-peso`} rotulo="Peso atual" unidade="kg" dica="78" valor={peso} set={setPeso} />
          <Numero id={`${id}-altura`} rotulo="Altura" unidade="cm" dica="176" valor={altura} set={setAltura} />

          <div className="lg:col-span-2">
            <Rotulo htmlFor={`${id}-atividade`}>Nível de atividade</Rotulo>
            <select
              id={`${id}-atividade`}
              value={atividade}
              onChange={(e) => setAtividade(e.target.value as Atividade)}
              className={`${campoBase} appearance-none`}
            >
              {ATIVIDADES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} — {a.nota}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Rotulo htmlFor={`${id}-formula`}>Equação</Rotulo>
            <select
              id={`${id}-formula`}
              value={formula}
              onChange={(e) => setFormula(e.target.value as Formula)}
              className={`${campoBase} appearance-none`}
            >
              {FORMULAS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
            <p className="mt-2.5 text-xs text-grafite/50">
              {FORMULAS.find((f) => f.id === formula)?.nota}
            </p>
          </div>

          {formula === "katch" && (
            <div className="lg:col-span-3">
              <div className="max-w-xs">
                <Numero
                  id={`${id}-gordura`}
                  rotulo="Gordura corporal"
                  unidade="%"
                  dica="18"
                  valor={gordura}
                  set={setGordura}
                />
              </div>
              <p className="mt-2.5 text-xs text-grafite/50">
                Use um valor medido (bioimpedância, adipômetro ou DEXA). Chute
                não melhora o resultado — piora.
              </p>
            </div>
          )}
        </div>
      </form>

      {/* ── 2. Objetivo ───────────────────────────────────────── */}
      <form onSubmit={(e) => e.preventDefault()} aria-label="Seu objetivo">
        <p className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
          <span aria-hidden className="rule-gold inline-block h-px w-8" />
          02 / Onde você quer chegar
        </p>

        <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-3">
          <Numero
            id={`${id}-alvo`}
            rotulo="Peso desejado"
            unidade="kg"
            dica="72"
            valor={pesoAlvo}
            set={setPesoAlvo}
          />

          <div className="lg:col-span-2">
            <Rotulo htmlFor={`${id}-refeicoes`}>Refeições por dia</Rotulo>
            <div
              id={`${id}-refeicoes`}
              role="radiogroup"
              aria-label="Refeições por dia"
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
                      : "text-grafite/60 hover:text-grafite"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-grafite/45">
              O número de refeições não muda o resultado — muda a sua adesão.
              Escolha o que cabe na rotina.
            </p>
          </div>
        </div>
      </form>

      {/* ── 3. Resultado ──────────────────────────────────────── */}
      <div aria-live="polite">
        {dados ? (
          <Resultado {...dados} />
        ) : (
          <div className="border-t border-linha-ouro pt-10">
            <span aria-hidden className="rule-gold h-px w-16" />
            <p className="mt-7 max-w-sm font-display text-2xl leading-snug text-grafite/45">
              {faltaGordura
                ? "Informe também o percentual de gordura para usar a Katch-McArdle."
                : "Preencha idade, peso e altura para ver o plano."}
            </p>
          </div>
        )}
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

function Resultado({ base, plano, macros, pratos, parametros }: DadosCalculados) {
  const rumo =
    plano.direcao === "perder"
      ? "Emagrecimento"
      : plano.direcao === "ganhar"
        ? "Ganho de massa"
        : "Manutenção";

  return (
    <div className="border-t border-linha-ouro pt-12">
      <p className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
        <span aria-hidden className="rule-gold inline-block h-px w-8" />
        03 / Seu plano
      </p>

      {/* Números principais */}
      <dl className="mt-10 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-3">
        <Numeral
          rotulo="Metabolismo basal"
          valor={base.tmb}
          nota={calculadora.explicaTmb}
        />
        <Numeral
          rotulo="Gasto total no dia"
          valor={base.get}
          nota="Basal multiplicado pelo seu nível de atividade."
        />
        <Numeral
          rotulo={`Alvo — ${rumo.toLowerCase()}`}
          valor={plano.alvo}
          nota={
            plano.direcao === "manter"
              ? "Peso estável no gasto atual."
              : `${plano.ajuste > 0 ? "+" : ""}${num(plano.ajuste)} kcal por dia.`
          }
          destaque
        />
      </dl>

      {/* Trajetória */}
      {plano.direcao !== "manter" && (
        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-l border-linha-ouro pl-7">
          <Traco rotulo="Diferença" valor={`${plano.diferenca.toFixed(1).replace(".", ",")} kg`} />
          <Traco
            rotulo="Ritmo seguro"
            valor={`${plano.ritmoSemanal.toFixed(2).replace(".", ",")} kg por semana`}
          />
          <Traco
            rotulo="Prazo estimado"
            valor={`${plano.semanas} semanas`}
          />
        </div>
      )}

      {plano.limitado && (
        <p className="mt-7 max-w-2xl border-l-2 border-ouro pl-5 text-sm leading-relaxed text-grafite/75">
          O ritmo foi reduzido de propósito. Chegar mais rápido exigiria um
          déficit que cai abaixo do seu metabolismo basal — exatamente a dieta
          extrema que não se sustenta e que devolve o peso depois.
        </p>
      )}

      {/* Macros */}
      <h3 className="t-eyebrow mt-16 text-grafite/50">Macronutrientes no alvo</h3>
      <dl className="mt-6 grid gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-3">
        <Macro rotulo="Proteína" dados={macros.proteina} />
        <Macro rotulo="Gordura" dados={macros.gordura} />
        <Macro rotulo="Carboidrato" dados={macros.carboidrato} />
      </dl>

      {macros.apertado && (
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grafite/70">
          Sobrou pouco espaço para carboidrato. Num alvo assim, ou o déficit é
          agressivo demais, ou o gasto precisa subir — treinar mais rende melhor
          que comer menos.
        </p>
      )}

      {/* Distribuição */}
      <h3 className="t-eyebrow mt-16 text-grafite/50">
        Distribuição em {pratos.length} refeições
      </h3>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-linha text-left">
              <th scope="col" className="py-3 pr-4 font-normal text-grafite/50">
                Refeição
              </th>
              <th scope="col" className="py-3 px-4 text-right font-normal text-grafite/50">
                kcal
              </th>
              <th scope="col" className="py-3 px-4 text-right font-normal text-grafite/50">
                Proteína
              </th>
              <th scope="col" className="py-3 px-4 text-right font-normal text-grafite/50">
                Carboidrato
              </th>
              <th scope="col" className="py-3 pl-4 text-right font-normal text-grafite/50">
                Gordura
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
                <td className="py-3.5 px-4 text-right text-grafite/70">{r.proteina} g</td>
                <td className="py-3.5 px-4 text-right text-grafite/70">{r.carboidrato} g</td>
                <td className="py-3.5 pl-4 text-right text-grafite/70">{r.gordura} g</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="py-3.5 pr-4 text-left text-xs uppercase tracking-[0.13em] text-grafite/50">
                Total
              </th>
              <td className="py-3.5 px-4 text-right font-display text-lg text-grafite">
                {num(plano.alvo)}
              </td>
              <td className="py-3.5 px-4 text-right text-grafite/70">{macros.proteina.g} g</td>
              <td className="py-3.5 px-4 text-right text-grafite/70">{macros.carboidrato.g} g</td>
              <td className="py-3.5 pl-4 text-right text-grafite/70">{macros.gordura.g} g</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grafite/60">
        A proteína foi dividida por igual de propósito: o estímulo de síntese
        responde à dose por refeição, não ao total jogado de uma vez. Já os
        carboidratos você pode concentrar em volta do treino — é aí que rendem
        mais.
      </p>

      {/* Captura — a pessoa já viu tudo; agora pode levar por escrito */}
      <CapturaPlano parametros={parametros} />

      {/* Ponte para a consultoria */}
      <div className="mt-14 border-t border-linha pt-9">
        <p className="max-w-xl leading-relaxed text-grafite/70">{calculadora.ponte}</p>
        <Link
          href="/#contato"
          className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-grafite px-7 py-3.5 text-sm font-medium tracking-wide text-porcelana transition-all duration-300 hover:bg-ouro-profundo"
        >
          Solicitar avaliação
          <Arrow />
        </Link>
      </div>
    </div>
  );
}

/* ── peças ──────────────────────────────────────────────────── */

function Numeral({
  rotulo,
  valor,
  nota,
  destaque = false,
}: {
  rotulo: string;
  valor: number;
  nota: string;
  destaque?: boolean;
}) {
  return (
    <div className={`p-7 ${destaque ? "bg-grafite" : "bg-porcelana"}`}>
      <dt
        className={`text-xs uppercase tracking-[0.13em] ${
          destaque ? "text-ouro" : "text-grafite/55"
        }`}
      >
        {rotulo}
      </dt>
      <dd
        className={`mt-3 font-display text-4xl leading-none sm:text-5xl ${
          destaque ? "text-porcelana" : "text-grafite"
        }`}
      >
        {num(valor)}
        <span
          className={`ml-2.5 font-sans text-sm tracking-wide ${
            destaque ? "text-porcelana/45" : "text-grafite/40"
          }`}
        >
          kcal
        </span>
      </dd>
      <dd
        className={`mt-3.5 text-xs leading-relaxed ${
          destaque ? "text-porcelana/55" : "text-grafite/55"
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
}: {
  rotulo: string;
  dados: { g: number; kcal: number; pct: number };
}) {
  return (
    <div className="bg-porcelana p-6">
      <dt className="text-xs uppercase tracking-[0.13em] text-grafite/55">{rotulo}</dt>
      <dd className="mt-3 font-display text-3xl text-grafite">
        {num(dados.g)}
        <span className="ml-1.5 font-sans text-sm text-grafite/40">g</span>
      </dd>
      {/* barra da proporção — ouro como ponto de direção */}
      <dd className="mt-4">
        <span aria-hidden className="block h-px w-full bg-linha">
          <span
            className="block h-px bg-ouro transition-[width] duration-500"
            style={{ width: `${dados.pct}%` }}
          />
        </span>
        <span className="mt-2.5 block text-xs text-grafite/50">
          {dados.pct}% das calorias · {num(dados.kcal)} kcal
        </span>
      </dd>
    </div>
  );
}

function Traco({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.13em] text-grafite/50">{rotulo}</p>
      <p className="mt-1.5 font-display text-xl text-grafite">{valor}</p>
    </div>
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
        <span className="shrink-0 pb-3 text-xs text-grafite/40">{unidade}</span>
      </div>
    </div>
  );
}
