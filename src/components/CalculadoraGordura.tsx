"use client";

import Image from "next/image";
import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ATIVIDADES,
  type Atividade,
  type Sexo,
  calcular,
  macros as calcularMacros,
  planejar,
} from "@/lib/calorias";
import { hrefConsultoria } from "@/lib/campanha";
import { gordura as copy } from "@/lib/content";
import {
  type Campo,
  NIVEIS,
  NOME_DO_CAMPO,
  type Metodo,
  type Nivel,
  classificar,
  diagnosticar,
  estimar,
  faixasDe,
  faltaParaOPlano,
  foraDaFaixa,
  gorduraAPerder,
  nivelDe,
  pesoParaBf,
} from "@/lib/gordura";
import { Arrow } from "./ui";

const dec = (s: string) => Number(s.replace(",", "."));

/** "o peso", "o peso e a idade", "o peso, a idade e a altura" */
function listar(campos: Campo[]): string {
  const nomes = campos.map((c) => NOME_DO_CAMPO[c]);
  if (nomes.length <= 1) return nomes[0] ?? "";
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

const num = (n: number) => n.toLocaleString("pt-BR");
const pct = (n: number) =>
  `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} %`;

/** Fim visual da régua, por sexo — acima disso a barra não diz mais nada. */
const TETO = { masculino: 45, feminino: 50 } as const;

export function CalculadoraGordura({ figuras = [] }: { figuras?: string[] }) {
  const id = useId();
  const disponivel = useMemo(() => new Set(figuras), [figuras]);

  const [sexo, setSexo] = useState<Sexo>("masculino");
  /* Sem fita é o padrão: quem chega de um anúncio não tem uma à mão,
     e pedir equipamento antes de mostrar qualquer coisa perde a
     pessoa na porta. Quem tem troca em um toque. */
  const [metodo, setMetodo] = useState<Metodo>("imc");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [pescoco, setPescoco] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [atividade, setAtividade] = useState<Atividade>("moderado");
  const [alvoId, setAlvoId] = useState<string | null>(null);

  /* A origem da visita (os utm_* do anúncio) só existe no navegador. Ler
     por `useSyncExternalStore` dá ao servidor uma string vazia e ao
     cliente a query real, sem divergência de hidratação — e sem assinar
     nada, porque a URL não muda enquanto a página vive. */
  const busca = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );

  const medidas = {
    sexo,
    idade: dec(idade),
    peso: dec(peso),
    altura: dec(altura),
    pescoco: pescoco ? dec(pescoco) : undefined,
    cintura: cintura ? dec(cintura) : undefined,
    quadril: quadril ? dec(quadril) : undefined,
  };

  const estimativa = estimar(medidas, metodo);
  /* Por que ainda não há resultado — para a tela poder dizer o que refazer
     em vez de repetir "preencha os campos" com os campos preenchidos. */
  const impedimento = diagnosticar(medidas, metodo);
  const invalido = (c: Campo) => foraDaFaixa(c, medidas[c] ?? 0);

  /* A equação devolve número para qualquer entrada que não quebre o
     logaritmo — altura em metros inclusive. Só há resultado quando o
     diagnóstico não tem nada a apontar. */
  const valeu = estimativa && !impedimento ? estimativa : null;

  const escala = NIVEIS[sexo];
  const atual = valeu ? nivelDe(valeu.valor, sexo) : null;

  /* Sugestão de alvo: um degrau mais magro que o de hoje. É a meta que a
     pessoa costuma conseguir manter — e o padrão importa, porque quase
     ninguém mexe no que já vem escolhido. */
  const sugerido = atual
    ? escala[Math.max(0, escala.findIndex((n) => n.id === atual.id) - 1)]
    : null;

  const alvo: Nivel | null = escala.find((n) => n.id === alvoId) ?? sugerido;

  /* Sem `useMemo`: é aritmética de microssegundos sobre estado local, e
     memorizar custaria uma lista de dependências para manter em dia. */
  const plano = (() => {
    if (!valeu || !alvo) return null;

    const pesoAtual = dec(peso);
    const pesoAlvo = pesoParaBf(pesoAtual, valeu.valor, alvo.bf);
    if (pesoAlvo === null) return null;

    /* Mifflin, e não Katch-McArdle, mesmo tendo o percentual em mãos: o
       %GC aqui é estimado com 3 a 4 pontos de erro, e a Katch propagaria
       esse erro para dentro do metabolismo. Peso, altura e idade são
       medidos — a equação que usa só isso erra menos. */
    const base = calcular(
      { sexo, idade: dec(idade), peso: pesoAtual, altura: dec(altura) },
      "mifflin",
      atividade,
    );
    if (!base) return null;

    const p = planejar(base.get, base.tmb, pesoAtual, pesoAlvo);
    if (!p) return null;

    return {
      base,
      p,
      pesoAlvo,
      macros: calcularMacros(p.alvo, pesoAtual, p.direcao),
      kg: gorduraAPerder(pesoAtual, valeu.valor, alvo.bf) ?? 0,
    };
  })();

  /**
   * Prazo exibido — o mesmo que `planejar()` calcula. Já houve aqui um
   * desconto de seis semanas só na tela; saiu porque o prazo deixava de
   * bater com o déficit ao lado e quem seguisse à risca chegaria depois do
   * que leu. É a ferramenta que os Reels levam a abrir: o número tem de
   * aguentar a conferência.
   */
  const prazo = (() => {
    const semanas = Math.max(1, plano?.p.semanas ?? 0);
    const kg = Math.abs(plano?.kg ?? 0);
    return { semanas, ritmo: Math.round((kg / semanas) * 100) / 100 };
  })();

  /* Os dois CTAs vão para o mesmo formulário, mas carimbam de qual botão
     saíram: sem isso não há como saber se a barra fixa do celular converte,
     que é a decisão de desenho mais cara desta página. */
  const href = (origem: "final" | "barra") =>
    hrefConsultoria(
      origem,
      { bf: valeu?.valor, meta: alvo?.bf, sexo, kcal: plano?.p.alvo },
      busca,
    );

  const figuraDe = (n: Nivel) =>
    n.figura && disponivel.has(n.figura) ? n.figura : null;

  /* O que falta para o plano existir, além da estimativa: a equação da
     Marinha não usa peso nem idade, então quem mede com fita chega ao
     percentual sem eles — e o plano, o CTA e a barra fixa sumiriam sem
     nenhuma pista do motivo. */
  const faltaPlano = faltaParaOPlano(medidas);

  /* Um empurrão até o resultado, uma vez só: no celular ele nasce embaixo
     do teclado aberto e nada indica que apareceu. */
  const jaRolou = useRef(false);
  useEffect(() => {
    if (!valeu || jaRolou.current) return;
    jaRolou.current = true;
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    document
      .getElementById("bf-resultado")
      ?.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "start" });
  }, [valeu]);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ── 01 · Medidas ─────────────────────────────────────── */}
      <form
        id="bf-medidas"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Suas medidas"
        className="surface-card scroll-mt-24 p-5 sm:p-8 lg:p-10"
      >
        <h2 className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
          <span aria-hidden className="rule-gold inline-block h-px w-8" />
          01 / Suas medidas
        </h2>

        {/* `role="radio"` em botões, e não `<input type="radio">`.
            A escolha continua anunciada como única e obrigatória para o
            leitor de tela, mas sem o efeito colateral do rádio nativo: com
            o foco nele, as setas do teclado trocam a opção em vez de rolar
            a página. Numa página longa como esta, quem clica num cartão e
            desce com a seta vê a seleção andar sozinha até a última opção
            sem ter pedido nada. */}
        <fieldset className="mt-7">
          <legend className="t-eyebrow text-grafite">Sexo biológico</legend>
          <div
            role="radiogroup"
            aria-label="Sexo biologico"
            className="mt-3 grid grid-cols-2 gap-2 sm:inline-flex sm:gap-0 sm:rounded-full sm:border sm:border-linha sm:p-1"
          >
            {(["masculino", "feminino"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sexo === s}
                onClick={() => {
                  setSexo(s);
                  setAlvoId(null);
                }}
                className={`flex min-h-12 cursor-pointer items-center justify-center rounded-full border px-6 text-sm capitalize transition-all duration-200 active:scale-[0.98] sm:border-0 ${
                  sexo === s
                    ? "border-ouro-profundo bg-grafite text-porcelana"
                    : "border-linha text-grafite/80 hover:border-ouro/60 hover:bg-ouro/8 hover:text-grafite"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-grafite/80">
            As equações usam esta variável — não é sobre identidade.
          </p>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="t-eyebrow text-grafite">Como vamos medir</legend>
          <div
            role="radiogroup"
            aria-label="Como vamos medir"
            className="mt-3 grid gap-2 sm:grid-cols-2"
          >
            {copy.metodos.map(({ id: mid, titulo, nota }) => (
              <button
                key={mid}
                type="button"
                role="radio"
                aria-checked={metodo === mid}
                onClick={() => setMetodo(mid)}
                className={`group block min-h-16 w-full cursor-pointer rounded-sm border p-4 text-left transition-all duration-200 active:scale-[0.995] ${
                  metodo === mid
                    ? "border-ouro-profundo bg-ouro/10"
                    : "border-linha bg-branco hover:border-ouro/60 hover:bg-ouro/[0.04]"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.95rem] font-medium text-grafite">
                    {titulo}
                  </span>
                  {/* O ponto do meio já existe sempre: no hover ele
                      aparece a meio tom, e ao escolher fica cheio. É o que
                      diz "dá para clicar aqui" antes do clique. */}
                  <span
                    aria-hidden
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                      metodo === mid
                        ? "border-ouro-profundo"
                        : "border-grafite/30 group-hover:border-ouro-profundo"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full bg-ouro-profundo transition-all duration-200 ${
                        metodo === mid
                          ? "scale-100 opacity-100"
                          : "scale-50 opacity-0 group-hover:scale-75 group-hover:opacity-45"
                      }`}
                    />
                  </span>
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-grafite/80">
                  {nota}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
          <Numero
            id={`${id}-idade`}
            rotulo="Idade"
            unidade="anos"
            dica="32"
            valor={idade}
            set={setIdade}
            erro={invalido("idade") ? "Entre 14 e 100 anos." : undefined}
          />
          <Numero
            id={`${id}-peso`}
            rotulo="Peso"
            unidade="kg"
            dica="78"
            valor={peso}
            set={setPeso}
            erro={invalido("peso") ? "Entre 30 e 300 kg." : undefined}
          />
          <Numero
            id={`${id}-altura`}
            rotulo="Altura"
            unidade="cm"
            dica="176"
            valor={altura}
            set={setAltura}
            erro={
              invalido("altura") ? "Em centímetros: 176, não 1,76." : undefined
            }
          />
        </div>

        {metodo === "fita" && (
          <div className="mt-8 border-t border-linha pt-8">
            <p className="t-eyebrow text-grafite/80">Com a fita métrica</p>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
              <Numero
                id={`${id}-pescoco`}
                rotulo="Pescoço"
                unidade="cm"
                dica="38"
                valor={pescoco}
                set={setPescoco}
                erro={invalido("pescoco") ? "Entre 20 e 70 cm." : undefined}
                ajuda={copy.comoMedir.pescoco}
              />
              <Numero
                id={`${id}-cintura`}
                rotulo="Cintura"
                unidade="cm"
                dica="88"
                valor={cintura}
                set={setCintura}
                erro={invalido("cintura") ? "Entre 40 e 200 cm." : undefined}
                ajuda={copy.comoMedir.cintura}
              />
              {sexo === "feminino" && (
                <Numero
                  id={`${id}-quadril`}
                  rotulo="Quadril"
                  unidade="cm"
                  dica="98"
                  valor={quadril}
                  set={setQuadril}
                  erro={invalido("quadril") ? "Entre 50 e 220 cm." : undefined}
                  ajuda={copy.comoMedir.quadril}
                />
              )}
            </div>
          </div>
        )}

        {/* Lista aberta, e não um <select>: no celular o menu nativo esconde
            as cinco opções atrás de um toque, e sem a seta ele ainda se
            parecia com um campo de texto. Aqui a escolha e o que ela
            significa estão à vista de uma vez. */}
        {/* A linha divisória fica no <div>, não no <fieldset>: a borda de um
            fieldset passa por trás da legenda e sai cortada dos dois lados. */}
        <div className="mt-8 border-t border-linha pt-7">
          <fieldset>
            <legend className="t-eyebrow text-grafite">
              Nível de atividade
            </legend>
            <div
              role="radiogroup"
              aria-label="Nivel de atividade"
              className="mt-3 grid gap-2 sm:grid-cols-2"
            >
              {ATIVIDADES.map((a) => {
                const escolhido = atividade === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={escolhido}
                    onClick={() => setAtividade(a.id)}
                    className={`group flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-left transition-all duration-200 active:scale-[0.995] ${
                      escolhido
                        ? "border-ouro-profundo bg-ouro/10"
                        : "border-linha bg-branco hover:border-ouro/60 hover:bg-ouro/[0.04]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        escolhido
                          ? "border-ouro-profundo"
                          : "border-grafite/30 group-hover:border-ouro-profundo"
                      }`}
                    >
                      <span
                        className={`size-2 rounded-full bg-ouro-profundo transition-all duration-200 ${
                          escolhido
                            ? "scale-100 opacity-100"
                            : "scale-50 opacity-0 group-hover:scale-75 group-hover:opacity-45"
                        }`}
                      />
                    </span>
                    <span>
                      <span className="block text-[0.95rem] font-medium text-grafite">
                        {a.nome}
                      </span>
                      <span className="block text-xs leading-snug text-grafite/80">
                        {a.nota}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {impedimento && (
          <p
            aria-live="polite"
            className="mt-7 border-l-2 border-ouro pl-4 text-[0.9rem] leading-relaxed text-grafite/80"
          >
            {impedimento.tipo === "cintura-menor-que-pescoco" ? (
              <>
                A cintura ficou menor que o pescoço, e isso é sempre erro de
                medição. A cintura é na altura do umbigo, em pé e relaxado — sem
                prender a barriga.
              </>
            ) : impedimento.tipo === "fora-da-faixa" ? (
              <>
                Confira {listar(impedimento.campos)}: o valor está fora do que a
                equação consegue usar. Altura e circunferências vão em
                centímetros — 176, não 1,76.
              </>
            ) : (
              <>Falta {listar(impedimento.campos)} para ver o resultado.</>
            )}
          </p>
        )}
      </form>

      {/* ── Resultado ────────────────────────────────────────── */}
      {valeu && atual && (
        <section id="bf-resultado" aria-live="polite" className="scroll-mt-24">
          <div className="overflow-hidden rounded-sm border border-grafite bg-grafite text-porcelana shadow-(--shadow-floating)">
            <div className="p-6 sm:p-10">
              <p className="t-eyebrow text-ouro">Seu percentual estimado</p>

              <p className="mt-5 font-display text-6xl leading-none sm:text-7xl">
                {pct(valeu.valor)}
              </p>

              <p className="mt-4 text-[0.95rem] text-porcelana/75">
                Faixa provável:{" "}
                <strong className="font-medium text-porcelana">
                  {pct(valeu.min)} a {pct(valeu.max)}
                </strong>
                {valeu.metodo === "imc" && " — estimativa fraca, pelo IMC"}
              </p>

              <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-ouro/40 px-4 py-2 text-sm text-ouro">
                {classificar(valeu.valor, sexo).nome}
              </p>
              <p className="mt-4 max-w-xl text-[0.92rem] leading-relaxed text-porcelana/70">
                {classificar(valeu.valor, sexo).nota}
              </p>
            </div>

            <Regua
              bf={valeu.valor}
              min={valeu.min}
              max={valeu.max}
              sexo={sexo}
            />
          </div>

          <p className="mt-5 border-l-2 border-ouro pl-4 text-[0.86rem] leading-relaxed text-grafite/80">
            {copy.avisos[metodo]}
          </p>
        </section>
      )}

      {/* ── 02 · Onde quer chegar ────────────────────────────── */}
      {valeu && atual && (
        <section id="bf-alvo" className="scroll-mt-24">
          <h2 className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
            <span aria-hidden className="rule-gold inline-block h-px w-8" />
            02 / {copy.alvo.titulo}
          </h2>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-grafite/75">
            {copy.alvo.texto}
          </p>

          <div
            role="radiogroup"
            aria-label="Percentual desejado"
            className="-mx-6 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {escala.map((n) => {
              const ativo = alvo?.id === n.id;
              const aqui = atual.id === n.id;
              const figura = figuraDe(n);

              return (
                <button
                  key={n.id}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => setAlvoId(n.id)}
                  className={`group flex h-full w-[42vw] shrink-0 snap-start cursor-pointer flex-col rounded-sm border text-left transition-all duration-300 active:scale-[0.99] sm:w-full ${
                    ativo
                      ? "border-ouro-profundo bg-ouro/10"
                      : "border-linha bg-branco hover:border-ouro/60 hover:bg-ouro/[0.04]"
                  }`}
                >
                  <span className="relative block aspect-3/4 w-full overflow-hidden rounded-t-sm bg-porcelana">
                    {figura ? (
                      <Image
                        src={figura}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 42vw, (max-width: 1024px) 30vw, 250px"
                        className="object-cover object-[center_55%] transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span className="flex h-full flex-col items-center justify-center">
                        <span className="font-display text-3xl text-ouro-profundo">
                          {n.bf}%
                        </span>
                        <span className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-grafite/80">
                          {n.de}–{n.ate} %
                        </span>
                      </span>
                    )}
                    {aqui && (
                      <span className="absolute inset-x-0 top-0 bg-grafite/85 px-2 py-1 text-center text-[0.6rem] uppercase tracking-[0.14em] text-porcelana">
                        Você está aqui
                      </span>
                    )}
                  </span>

                  <span className="flex flex-1 flex-col p-3.5">
                    <span className="text-[0.6rem] uppercase tracking-[0.14em] text-ouro-profundo">
                      {n.de}–{n.ate} %
                    </span>
                    <span className="mt-1 font-display text-lg leading-tight text-grafite">
                      {n.nome}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Uma descrição só, a do degrau escolhido: repetida nos oito
              cartões ela empilhava seis telas de leitura no celular. */}
          <p className="mt-5 text-[0.95rem] leading-relaxed text-grafite">
            <strong className="font-medium">{alvo?.nome}:</strong>{" "}
            {alvo?.descricao}{" "}
            <span className="text-grafite/80">{copy.alvo.nota}</span>
          </p>

          {/* Sem isto o plano simplesmente não nasce, e a página termina
              numa escala bonita sem resposta nem CTA. */}
          {faltaPlano.length > 0 && (
            <p
              aria-live="polite"
              className="mt-7 border-l-2 border-ouro pl-4 text-[0.9rem] leading-relaxed text-grafite/80"
            >
              Falta {listar(faltaPlano)} para montar o plano —{" "}
              <a
                href="#bf-medidas"
                className="border-b border-linha-ouro pb-0.5 text-ouro-profundo"
              >
                voltar às medidas
              </a>
              .
            </p>
          )}
        </section>
      )}

      {/* ── 03 · O plano ─────────────────────────────────────── */}
      {valeu && alvo && plano && (
        <section
          id="bf-plano"
          className="scroll-mt-24 border-t border-linha-ouro pt-12"
        >
          <h2 className="t-eyebrow flex items-center gap-3 text-ouro-profundo">
            <span aria-hidden className="rule-gold inline-block h-px w-8" />
            03 / {copy.plano.titulo}
          </h2>

          {plano.p.direcao === "manter" ? (
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-grafite/80">
              Você já está onde escolheu estar. O plano aqui não é perder — é
              manter enquanto se treina para mudar a composição por dentro:
              mesma balança, outra proporção entre músculo e gordura.
            </p>
          ) : (
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-grafite/80">
              De <strong className="font-medium">{pct(valeu.valor)}</strong>{" "}
              para <strong className="font-medium">{pct(alvo.bf)}</strong> são{" "}
              <strong className="font-medium">
                {num(Math.abs(plano.kg))} kg
              </strong>{" "}
              {plano.p.direcao === "perder" ? "a perder" : "a ganhar"} —
              chegando a{" "}
              <strong className="font-medium">{num(plano.pesoAlvo)} kg</strong>{" "}
              com a massa magra preservada.
            </p>
          )}

          <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-linha sm:grid-cols-3">
            <Tile
              rotulo="Calorias por dia"
              valor={num(plano.p.alvo)}
              unidade="kcal"
              nota={`Gasto estimado: ${num(plano.base.get)} kcal`}
            />
            <Tile
              rotulo={plano.p.direcao === "manter" ? "Ritmo" : "Tempo estimado"}
              valor={plano.p.direcao === "manter" ? "—" : String(prazo.semanas)}
              unidade={plano.p.direcao === "manter" ? "" : "semanas"}
              nota={
                plano.p.direcao === "manter"
                  ? "Sem prazo: é rotina, não projeto"
                  : `${num(prazo.ritmo)} kg por semana`
              }
            />
            <Tile
              rotulo="Peso alvo"
              valor={num(plano.pesoAlvo)}
              unidade="kg"
              nota={`Massa magra mantida em ${num(Math.round(plano.pesoAlvo * (1 - alvo.bf / 100) * 10) / 10)} kg`}
            />
          </dl>

          <h3 className="t-eyebrow mt-10 text-grafite/80">
            A distribuição dos macros
          </h3>
          <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-linha">
            <Tile
              rotulo="Proteína"
              valor={num(plano.macros.proteina.g)}
              unidade="g"
              nota={`${plano.macros.proteina.pct} % das calorias`}
            />
            <Tile
              rotulo="Carboidrato"
              valor={num(plano.macros.carboidrato.g)}
              unidade="g"
              nota={`${plano.macros.carboidrato.pct} % das calorias`}
            />
            <Tile
              rotulo="Gordura"
              valor={num(plano.macros.gordura.g)}
              unidade="g"
              nota={`${plano.macros.gordura.pct} % das calorias`}
            />
          </dl>

          {/* Avisos — o que a matemática impôs, dito na cara */}
          <div className="mt-8 space-y-4">
            {alvo.temporario && (
              <Aviso>
                <strong className="font-medium">
                  {alvo.nome} é condição de palco.
                </strong>{" "}
                Atletas chegam lá por algumas semanas, com acompanhamento, e
                saem depois. Como meta para o ano inteiro, cobra libido, humor,
                sono e treino. Se o objetivo é uma foto, faz sentido; se é viver
                assim, escolha um degrau acima.
              </Aviso>
            )}
            {plano.p.limitado && (
              <Aviso>
                <strong className="font-medium">
                  O ritmo foi reduzido de propósito.
                </strong>{" "}
                O déficit que essa meta pediria passaria de 25 % do seu gasto,
                ou cairia abaixo do seu metabolismo basal. O prazo acima já é o
                caminho mais rápido que ainda protege massa magra.
              </Aviso>
            )}
            {plano.macros.apertado && (
              <Aviso>
                <strong className="font-medium">
                  Sobrou pouco carboidrato.
                </strong>{" "}
                Com proteína e gordura nos mínimos, o que resta de energia é
                pequeno — sinal de que a meta é agressiva para o seu gasto
                atual. Treinar pesado com esse valor é difícil.
              </Aviso>
            )}
          </div>

          {/* ── Ponte para a consultoria ─────────────────────────
              Em grafite, como o card do resultado: são os dois momentos
              em que a página para de informar e afirma alguma coisa. */}
          <div className="mt-14 overflow-hidden rounded-sm border border-grafite bg-grafite text-porcelana shadow-(--shadow-floating)">
            {/* Em duas colunas a partir de lg: o argumento à esquerda, a
                prova à direita. No celular a foto entra entre os itens e o
                botão — quem chega ali já leu o porquê e está a um toque de
                decidir. */}
            <div className="grid gap-9 p-7 sm:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
              <div>
                <p className="t-eyebrow flex items-center gap-3 text-ouro">
                  <span
                    aria-hidden
                    className="rule-gold inline-block h-px w-8"
                  />
                  {copy.plano.fecho.eyebrow}
                </p>

                <h3 className="t-title mt-6 text-balance text-porcelana">
                  {copy.plano.fecho.titulo}
                </h3>

                {/* O número que a pessoa acabou de gerar, dito de volta: um
                  convite genérico depois de um diagnóstico específico soa
                  como anúncio. */}
                {plano.p.direcao !== "manter" && (
                  <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-porcelana sm:text-xl">
                    Entre você e {pct(alvo.bf)} estão{" "}
                    <strong className="font-medium text-ouro">
                      {num(Math.abs(plano.kg))} kg
                    </strong>{" "}
                    e{" "}
                    <strong className="font-medium text-ouro">
                      {prazo.semanas} semanas
                    </strong>
                    . O plano existe para que essas semanas não virem dois anos.
                  </p>
                )}

                <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-porcelana/75">
                  {copy.plano.fecho.texto}
                </p>

                <ul className="mt-8 space-y-3">
                  {copy.plano.fecho.itens.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3.5 text-[0.95rem] leading-relaxed text-porcelana/90"
                    >
                      <Arrow className="mt-1 shrink-0 text-ouro" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* A prova. A arte é uma peça fechada, com o próprio título e a
                assinatura — por isso entra emoldurada sobre o grafite, como
                um objeto posto ali, e não sangrando no fundo do card. */}
              <figure>
                <Image
                  src={copy.plano.fecho.prova.imagem}
                  alt={copy.plano.fecho.prova.alt}
                  width={copy.plano.fecho.prova.largura}
                  height={copy.plano.fecho.prova.altura}
                  sizes="(max-width: 1024px) 92vw, 420px"
                  loading="eager"
                  className="w-full rounded-sm border border-ouro/25 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)]"
                />
                <figcaption className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-porcelana/70">
                  <span
                    aria-hidden
                    className="rule-gold mt-2 h-px w-5 shrink-0"
                  />
                  {copy.plano.fecho.prova.legenda}
                </figcaption>
              </figure>

              <div className="lg:col-span-2">
                {/* Botão em ouro e de largura cheia no celular: é a única
                  ação da página, e no telefone divide espaço com nada. */}
                <a
                  href={href("final")}
                  className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-verde px-8 text-[0.85rem] font-bold uppercase tracking-[0.14em] text-[#06140b] shadow-[0_10px_30px_rgba(31,193,91,0.3)] transition-colors duration-300 hover:bg-verde-claro sm:w-auto sm:self-start"
                >
                  {copy.plano.fecho.cta}
                  <Arrow />
                </a>

                <p className="mt-5 flex items-center gap-2.5 text-sm text-ouro">
                  <span aria-hidden className="rule-gold h-px w-6 shrink-0" />
                  {copy.plano.fecho.urgencia}
                </p>

                <p className="mt-4 text-xs leading-relaxed text-porcelana/70">
                  {copy.plano.fecho.nota}
                  <br />
                  {/* Verdade verificável — a página não faz uma requisição
                    sequer — e é o medo de quem digita peso e cintura vindo
                    de um anúncio. */}
                  {copy.plano.fecho.privacidade}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Barra fixa no celular: o CTA acompanha a rolagem do resultado. */}
      {valeu && plano && (
        <div className="sticky bottom-0 z-30 -mx-6 border-t border-linha bg-branco/95 px-6 py-3 backdrop-blur-sm sm:hidden">
          <div className="flex items-center gap-4">
            <p className="flex-1 text-xs leading-tight text-grafite/80">
              <strong className="block font-display text-lg text-grafite">
                {num(plano.p.alvo)} kcal
              </strong>
              {alvo ? `meta de ${pct(alvo.bf)}` : ""}
            </p>
            <a
              href={href("barra")}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-grafite px-5 text-sm font-medium text-porcelana"
            >
              Quero o plano
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Peças
   ============================================================ */

/**
 * `inputMode="decimal"` abre o teclado numérico no celular, e o corpo em
 * 16 px evita o zoom automático do Safari em iOS ao focar o campo — abaixo
 * disso a página inteira salta de escala.
 */
/** Deixa passar um separador decimal só — "1,2,3" viraria NaN silencioso. */
function soNumero(bruto: string): string {
  const limpo = bruto.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const [inteira, ...resto] = limpo.split(",");
  return resto.length ? `${inteira},${resto.join("")}` : inteira;
}

function Numero({
  id,
  rotulo,
  unidade,
  dica,
  valor,
  set,
  ajuda,
  erro,
}: {
  id: string;
  rotulo: string;
  unidade: string;
  dica: string;
  valor: string;
  set: (v: string) => void;
  ajuda?: string;
  /** faixa plausível violada — o número foi digitado, mas não serve */
  erro?: string;
}) {
  const descrito = [ajuda && `${id}-ajuda`, erro && `${id}-erro`]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={id} className="t-eyebrow block text-grafite">
        {rotulo}
        {/* A unidade só existe no adorno à direita, que é decorativo: sem
            isto, quem usa leitor de tela não sabe se o campo é em cm ou em
            polegadas — num formulário que depende disso. */}
        <span className="sr-only"> em {unidade}</span>
      </label>
      {/* Campo com fundo, e não só a linha inferior do resto do site.
          Aqui a página inteira depende de a pessoa digitar: uma linha
          solta não se lê como "escreva aqui", e o formulário parecia
          pronto quando ainda estava vazio. A linha de baixo continua,
          acendendo em ouro no foco. */}
      <div
        className={`mt-2 flex items-baseline gap-2 rounded-sm bg-papel-claro px-3.5 transition-colors border-b-2 focus-within:border-ouro focus-within:bg-papel ${
          erro ? "border-ouro-profundo" : "border-linha"
        }`}
      >
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="next"
          placeholder={dica}
          value={valor}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descrito || undefined}
          onChange={(e) => set(soNumero(e.target.value))}
          className="w-full bg-transparent py-3 text-base text-grafite placeholder:text-grafite/35 focus:outline-none"
        />
        <span aria-hidden className="shrink-0 text-xs text-grafite/80">
          {unidade}
        </span>
      </div>
      {erro && (
        <p
          id={`${id}-erro`}
          className="mt-2 text-xs font-medium text-ouro-profundo"
        >
          {erro}
        </p>
      )}
      {ajuda && (
        <p
          id={`${id}-ajuda`}
          className="mt-2 text-xs leading-relaxed text-grafite/80"
        >
          {ajuda}
        </p>
      )}
    </div>
  );
}

function Tile({
  rotulo,
  valor,
  unidade,
  nota,
}: {
  rotulo: string;
  valor: string;
  unidade: string;
  nota: string;
}) {
  return (
    <div className="bg-porcelana p-5 sm:p-6">
      <dt className="text-xs uppercase tracking-[0.14em] text-grafite/80">
        {rotulo}
      </dt>
      {/* A nota vive dentro do <dd>: uma lista de definição só aceita
          dt/dd como filhos, e um <p> solto aqui invalida a marcação. */}
      <dd>
        <span className="mt-3 block font-display text-4xl leading-none text-grafite">
          {valor}
          {unidade && (
            <span className="ml-1.5 text-base text-grafite/80">{unidade}</span>
          )}
        </span>
        <span className="mt-3 block text-xs leading-relaxed text-grafite/80">
          {nota}
        </span>
      </dd>
    </div>
  );
}

function Aviso({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-2xl border-l-2 border-ouro pl-5 text-[0.9rem] leading-relaxed text-grafite/80">
      {children}
    </p>
  );
}

/** Régua das faixas do ACE, com a posição da pessoa e a banda de erro. */
function Regua({
  bf,
  min,
  max,
  sexo,
}: {
  bf: number;
  min: number;
  max: number;
  sexo: Sexo;
}) {
  const teto = TETO[sexo];
  const faixas = faixasDe(sexo);
  const posicao = (v: number) => Math.max(0, Math.min(100, (v / teto) * 100));

  /* Cada faixa começa onde a anterior termina — as do ACE são contíguas,
     então o início sai do vizinho, sem acumulador mutável. */
  const segmentos = faixas.map((f, i) => {
    const de = i === 0 ? 0 : Math.min(faixas[i - 1].ate, teto);
    const ate = Math.min(f.ate, teto);
    return {
      id: f.id,
      de: (de / teto) * 100,
      largura: ((ate - de) / teto) * 100,
      i,
    };
  });

  return (
    <div className="border-t border-porcelana/15 p-6 sm:p-10">
      {/* O desenho inteiro é decorativo, mas o que ele diz não é: sem um
          rótulo, quem usa leitor de tela perde a posição na escala. */}
      <div
        role="img"
        aria-label={`${pct(bf)} de gordura corporal, faixa provável de ${pct(min)} a ${pct(max)}, classificado como ${classificar(bf, sexo).nome}.`}
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-porcelana/10"
      >
        {segmentos.map((s) => (
          <span
            key={s.id}
            aria-hidden
            className="absolute inset-y-0 bg-ouro"
            style={{
              left: `${s.de}%`,
              width: `${s.largura}%`,
              // do mais claro ao mais escuro, na direção do aumento
              opacity: 0.25 + s.i * 0.14,
            }}
          />
        ))}

        {/* banda de erro: a faixa provável, não o ponto */}
        <span
          aria-hidden
          className="absolute inset-y-0 border-x border-porcelana/70 bg-porcelana/25"
          style={{
            left: `${posicao(min)}%`,
            width: `${posicao(max) - posicao(min)}%`,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-y-[-4px] w-0.5 bg-porcelana"
          style={{ left: `${posicao(bf)}%` }}
        />
      </div>

      <ul className="mt-3 flex justify-between text-[0.6rem] uppercase tracking-[0.1em] text-porcelana/70">
        <li>0 %</li>
        <li>{teto} %</li>
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-porcelana/70">
        A barra clara é a sua faixa provável; o traço, o valor central.
      </p>
    </div>
  );
}
