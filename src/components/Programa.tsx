"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ATIVIDADES, type Atividade, type Sexo } from "@/lib/calorias";
import { DURACAO_PADRAO, montar, type Perfil, type Programa as Plano } from "@/lib/programa";
import { ESCALA, figura as caminhoDaFigura, type Nivel } from "@/lib/shapes";
import { precoEmReais } from "@/lib/produto";
import { DIAS_POSSIVEIS, type Experiencia, type Local } from "@/lib/treino";
import { TEXTO_PROGRAMA, type TextoPrograma } from "@/lib/i18n/programa";
import { ATIVIDADE_TRAD, numeroIdioma, rotuloNivel } from "@/lib/i18n/programa-motor";
import type { Idioma } from "@/lib/rotas-idioma";
import { Comprar } from "./Comprar";
import { PrecoDinamico, SeletorMoeda } from "./SeletorMoeda";
import { Arrow, Container, Rotulo, campoBase } from "./ui";

/**
 * O funil do Programa 90 Dias.
 *
 * Desenhado para o telemóvel primeiro, que é de onde vem o tráfego do
 * Instagram. Três decisões vêm daí e explicam quase tudo neste arquivo:
 *
 *  1. MODO FOCO. A apresentação da página (`abertura`) e o texto de apoio
 *     (`rodape`) só aparecem no passo 1. Do segundo em diante o funil fica
 *     sozinho na tela. Mantê-los visíveis obrigava a pessoa a rolar o
 *     mesmo título e os mesmos dois parágrafos a cada passo — sete vezes
 *     até o fim.
 *
 *  2. UMA PERGUNTA POR TELA. Sete passos curtos em vez de quatro longos.
 *     No telemóvel, uma tela com quatro grupos de opções vira um rolo de
 *     três alturas de ecrã, e o que está no fim não é respondido.
 *
 *  3. ESCOLHA ÚNICA AVANÇA SOZINHA. Onde a resposta é um toque — sexo e as
 *     duas silhuetas — tocar já avança. Pedir "escolha" e depois
 *     "confirme" é um toque a mais em metade do funil, e a pessoa já
 *     disse o que queria.
 *
 * A ordem das perguntas é de conversão, não de formulário: os toques vêm
 * primeiro, os números depois. Quem já respondeu três coisas digita o
 * peso; quem é recebido por um formulário de oito campos fecha a aba.
 */

const TOTAL_PASSOS = 7;

/**
 * Espera entre o toque e o avanço: tempo de ver o cartão acender.
 *
 * Durante ela o grupo deixa de receber toques. Os passos 2 e 3 mostram as
 * MESMAS oito silhuetas, e sem a trava o dedo que ainda descia quando a
 * tela trocou respondia o passo seguinte sozinho — a pessoa escolhia a
 * silhueta de hoje e descobria no fim que também tinha escolhido a meta,
 * sem ter visto a pergunta.
 */
const RESPIRO = 420;

/**
 * Número com vírgula decimal (ponto em inglês).
 *
 * "86.6 kg" numa página em português é erro de acabamento — a calculadora
 * de gordura ao lado já escreve "15,5 %". À mão em vez de
 * `toLocaleString` para o valor não depender do locale do ambiente.
 */
const n1 = numeroIdioma;

type Estado = {
  sexo: Sexo | null;
  shapeAtual: string | null;
  shapeAlvo: string | null;
  idade: string;
  altura: string;
  peso: string;
  pesoAlvo: string;
  atividade: Atividade;
  local: Local;
  diasPedidos: number;
  experiencia: Experiencia;
  refeicoes: number;
};

const INICIAL: Estado = {
  sexo: null,
  shapeAtual: null,
  shapeAlvo: null,
  idade: "",
  altura: "",
  peso: "",
  pesoAlvo: "",
  atividade: "leve",
  local: "academia",
  diasPedidos: 3,
  experiencia: "voltando",
  refeicoes: 4,
};

export function Programa({
  figuras = [],
  abertura,
  rodape,
  vendaAberta = false,
  idioma = "pt",
}: {
  figuras?: string[];
  /** idioma dos textos do funil e do plano gerado */
  idioma?: Idioma;
  /** Checkout configurado no servidor (token do Mercado Pago, segredo do
      webhook e chave de serviço do Supabase). Sem isso, a oferta troca o
      botão de compra pelo caminho da consultoria. */
  vendaAberta?: boolean;
  /** Apresentação da página — visível apenas no primeiro passo. */
  abertura?: ReactNode;
  /** Texto de apoio abaixo do funil — idem. */
  rodape?: ReactNode;
}) {
  const t = TEXTO_PROGRAMA[idioma];
  const f = t.funil;
  const [passo, setPasso] = useState(0);
  const [e, setE] = useState<Estado>(INICIAL);
  const [avancando, setAvancando] = useState(false);

  const topo = useRef<HTMLDivElement>(null);
  const estreou = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const disponivel = useMemo(() => new Set(figuras), [figuras]);
  const campo = <K extends keyof Estado>(k: K, v: Estado[K]) =>
    setE((atual) => ({ ...atual, [k]: v }));

  const escala = e.sexo ? ESCALA[e.sexo] : [];

  /*
   * Trocar de passo leva o topo do cartão para o alto do ecrã. Sem isto,
   * quem responde um passo longo fica no meio do passo seguinte, lendo a
   * pergunta pela metade — ou sem a ver.
   *
   * O primeiro render não rola: a pessoa acabou de chegar à página e
   * pode estar a ler a apresentação acima.
   */
  useEffect(() => {
    if (!estreou.current) {
      estreou.current = true;
      return;
    }

    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topo.current?.scrollIntoView({
      behavior: parado ? "auto" : "smooth",
      block: "start",
    });
  }, [passo]);

  /** Limpa o avanço agendado se o componente sair antes de ele disparar. */
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const plano: Plano | null = useMemo(() => {
    const idade = Number(e.idade);
    const altura = Number(e.altura);
    const peso = Number(e.peso);
    const pesoAlvo = Number(e.pesoAlvo);

    if (!e.sexo || !e.shapeAtual || !e.shapeAlvo) return null;
    if (!(idade > 0) || !(altura > 0) || !(peso > 0) || !(pesoAlvo > 0)) return null;

    const perfil: Perfil = {
      sexo: e.sexo,
      idade,
      altura,
      peso,
      pesoAlvo,
      shapeAtual: e.shapeAtual,
      shapeAlvo: e.shapeAlvo,
      atividade: e.atividade,
      local: e.local,
      diasPedidos: e.diasPedidos,
      experiencia: e.experiencia,
      refeicoes: e.refeicoes,
    };

    return montar(perfil, DURACAO_PADRAO, "mifflin", idioma) ?? null;
  }, [e, idioma]);

  const avancar = () => setPasso((p) => Math.min(TOTAL_PASSOS, p + 1));

  /** Toque que já responde: marca a escolha e segue sozinho. */
  const responder = (alterar: () => void) => {
    if (avancando) return;
    alterar();
    setAvancando(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAvancando(false);
      avancar();
    }, RESPIRO);
  };

  const podeAvancar = (() => {
    switch (passo) {
      case 0:
        return Boolean(e.sexo);
      case 1:
        return Boolean(e.shapeAtual);
      case 2:
        return Boolean(e.shapeAlvo);
      case 3:
        return Number(e.idade) > 0 && Number(e.altura) > 0 && Number(e.peso) > 0;
      case 4:
        return Number(e.pesoAlvo) > 0;
      default:
        return true;
    }
  })();

  const noResultado = passo >= TOTAL_PASSOS;

  return (
    <>
      {/* A apresentação sai de cena assim que o funil começa. */}
      {passo === 0 && abertura}

      <div
        id="simulador"
        ref={topo}
        /*
         * Sem a apresentação acima, o funil encosta no topo do documento e
         * fica por baixo do cabeçalho fixo (83 px) — e aí não há rolagem
         * que o salve, porque já se está no zero. O respiro tem de ser
         * dele.
         */
        className={`scroll-mt-28 bg-branco pb-8 sm:scroll-mt-32 sm:pb-14 ${
          passo === 0 ? "pt-8 sm:pt-14" : "pt-28 sm:pt-32"
        }`}
      >
        <Container>
        {passo === 0 && !noResultado && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="t-eyebrow text-[#00ff66]">{f.eyebrow}</p>
              <p className="mt-2 font-display text-2xl text-grafite sm:text-3xl">
                {f.titulo}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff66]/45 bg-[#00ff66]/10 px-4 py-1.5 text-xs font-bold text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.18)]">
              <span aria-hidden className="pulso size-2 rounded-full bg-[#00ff66]" />
              {f.selo}
            </span>
          </div>
        )}
        {noResultado ? (
          <Resultado
            plano={plano}
            disponivel={disponivel}
            vendaAberta={vendaAberta}
            idioma={idioma}
            t={t}
            onVoltar={() => setPasso(TOTAL_PASSOS - 1)}
          />
        ) : (
          <div className="surface-elevated overflow-hidden rounded-xl border border-[#00ff66]/30 bg-branco shadow-[0_0_50px_rgba(0,255,102,0.08)]">
            <Progresso passo={passo} rotulo={f.passo(passo + 1, TOTAL_PASSOS)} />

            <div
              className={`p-6 sm:p-10 lg:p-12 ${avancando ? "pointer-events-none" : ""}`}
              aria-busy={avancando}
            >
              {passo === 0 && (
                <Tela
                  rotuloPasso={f.passo(1, TOTAL_PASSOS)}
                  titulo={f.sexo.titulo}
                  nota={f.sexo.nota}
                >
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {(
                      [
                        ["masculino", f.sexo.homem],
                        ["feminino", f.sexo.mulher],
                      ] as const
                    ).map(([valor, rotulo]) => (
                      <Opcao
                        key={valor}
                        ativo={e.sexo === valor}
                        onClick={() =>
                          responder(() =>
                            /*
                             * Trocar de sexo invalida as silhuetas: os ids
                             * são distintos por sexo (h1…h8, m1…m8), e um
                             * id da outra escala faria `nivel()` devolver
                             * null sem avisar — plano sem gordura estimada
                             * e sem nenhuma pista do motivo.
                             */
                            setE((atual) => ({
                              ...atual,
                              sexo: valor,
                              shapeAtual: null,
                              shapeAlvo: null,
                            })),
                          )
                        }
                      >
                        <span className="font-display text-xl">{rotulo}</span>
                      </Opcao>
                    ))}
                  </div>
                </Tela>
              )}

              {passo === 1 && (
                <Tela
                  rotuloPasso={f.passo(2, TOTAL_PASSOS)}
                  titulo={f.atual.titulo}
                  nota={f.atual.nota}
                >
                  <Silhuetas
                    escala={escala}
                    valor={e.shapeAtual}
                    onEscolher={(id) => responder(() => campo("shapeAtual", id))}
                    disponivel={disponivel}
                    rotuloGrupo={f.atual.grupo}
                    idioma={idioma}
                  />
                </Tela>
              )}

              {passo === 2 && (
                <Tela
                  rotuloPasso={f.passo(3, TOTAL_PASSOS)}
                  titulo={f.alvo.titulo}
                  nota={f.alvo.nota}
                >
                  <Silhuetas
                    escala={escala}
                    valor={e.shapeAlvo}
                    onEscolher={(id) => responder(() => campo("shapeAlvo", id))}
                    disponivel={disponivel}
                    rotuloGrupo={f.alvo.grupo}
                    idioma={idioma}
                    aqui={e.shapeAtual}
                  />
                </Tela>
              )}

              {passo === 3 && (
                <Tela
                  rotuloPasso={f.passo(4, TOTAL_PASSOS)}
                  titulo={f.numeros.titulo}
                  nota={f.numeros.nota}
                >
                  <div className="grid gap-7 sm:grid-cols-3">
                    <Numero
                      id="prog-idade"
                      rotulo={f.numeros.idade}
                      unidade={f.numeros.anos}
                      valor={e.idade}
                      onChange={(v) => campo("idade", v)}
                      placeholder="32"
                      autoFoco
                    />
                    <Numero
                      id="prog-altura"
                      rotulo={f.numeros.altura}
                      unidade="cm"
                      valor={e.altura}
                      onChange={(v) => campo("altura", v)}
                      placeholder="175"
                    />
                    <Numero
                      id="prog-peso"
                      rotulo={f.numeros.peso}
                      unidade="kg"
                      valor={e.peso}
                      onChange={(v) => campo("peso", v)}
                      placeholder="82"
                      decimal
                    />
                  </div>
                </Tela>
              )}

              {passo === 4 && (
                <Tela
                  rotuloPasso={f.passo(5, TOTAL_PASSOS)}
                  titulo={f.pesoAlvo.titulo}
                  nota={f.pesoAlvo.nota}
                >
                  <div className="max-w-xs">
                    <Numero
                      id="prog-peso-alvo"
                      rotulo={f.pesoAlvo.rotulo}
                      unidade="kg"
                      valor={e.pesoAlvo}
                      onChange={(v) => campo("pesoAlvo", v)}
                      placeholder="74"
                      decimal
                      autoFoco
                    />
                  </div>
                </Tela>
              )}

              {passo === 5 && (
                <Tela
                  rotuloPasso={f.passo(6, TOTAL_PASSOS)}
                  titulo={f.rotina.titulo}
                  nota={f.rotina.nota}
                >
                  <fieldset>
                    <legend className="t-eyebrow text-grafite">{f.rotina.seuDia}</legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {ATIVIDADES.map((a) => (
                        <Opcao
                          key={a.id}
                          ativo={e.atividade === a.id}
                          onClick={() => campo("atividade", a.id)}
                        >
                          <span className="font-display text-base">
                            {idioma === "pt" ? a.nome : ATIVIDADE_TRAD[idioma][a.id].nome}
                          </span>
                          <span className="mt-1 block text-xs text-grafite/80">
                            {idioma === "pt" ? a.nota : ATIVIDADE_TRAD[idioma][a.id].nota}
                          </span>
                        </Opcao>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-9">
                    <legend className="t-eyebrow text-grafite">{f.rotina.onde}</legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["academia", ...f.rotina.academia],
                          ["casa", ...f.rotina.casa],
                        ] as const
                      ).map(([valor, nome, nota]) => (
                        <Opcao
                          key={valor}
                          ativo={e.local === valor}
                          onClick={() => campo("local", valor)}
                        >
                          <span className="font-display text-base">{nome}</span>
                          <span className="mt-1 block text-xs text-grafite/80">{nota}</span>
                        </Opcao>
                      ))}
                    </div>
                  </fieldset>
                </Tela>
              )}

              {passo === 6 && (
                <Tela
                  rotuloPasso={f.passo(7, TOTAL_PASSOS)}
                  titulo={f.treino.titulo}
                  nota={f.treino.nota}
                >
                  <fieldset>
                    <legend className="t-eyebrow text-grafite">{f.treino.experiencia}</legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {(
                        [
                          ["nunca", ...f.treino.nunca],
                          ["voltando", ...f.treino.voltando],
                          ["constante", ...f.treino.constante],
                        ] as const
                      ).map(([valor, nome, nota]) => (
                        <Opcao
                          key={valor}
                          ativo={e.experiencia === valor}
                          onClick={() => {
                            /*
                             * Cada experiência comporta uma faixa de dias.
                             * Trocar para "nunca treinei" com 6 dias
                             * escolhidos deixaria um botão aceso que o
                             * motor ignora — a pessoa veria o programa
                             * montar 3 dias sem ter mudado nada.
                             */
                            const possiveis = DIAS_POSSIVEIS[valor];
                            setE((atual) => ({
                              ...atual,
                              experiencia: valor,
                              diasPedidos: possiveis.includes(atual.diasPedidos)
                                ? atual.diasPedidos
                                : possiveis[possiveis.length - 1],
                            }));
                          }}
                        >
                          <span className="font-display text-base">{nome}</span>
                          <span className="mt-1 block text-xs text-grafite/80">{nota}</span>
                        </Opcao>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-9">
                    <legend className="t-eyebrow text-grafite">{f.treino.dias}</legend>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {DIAS_POSSIVEIS[e.experiencia].map((d) => (
                        <Pastilha
                          key={d}
                          ativo={e.diasPedidos === d}
                          rotulo={f.treino.diasAria(d)}
                          onClick={() => campo("diasPedidos", d)}
                        >
                          {d}
                        </Pastilha>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-9">
                    <legend className="t-eyebrow text-grafite">{f.treino.refeicoes}</legend>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {[2, 3, 4, 5, 6].map((r) => (
                        <Pastilha
                          key={r}
                          ativo={e.refeicoes === r}
                          rotulo={f.treino.refeicoesAria(r)}
                          onClick={() => campo("refeicoes", r)}
                        >
                          {r}
                        </Pastilha>
                      ))}
                    </div>
                  </fieldset>
                </Tela>
              )}
            </div>

            {/*
             * A barra de ação cola no fundo do ecrã.
             *
             * Em telas longas — a das atividades, a dos dias — o botão
             * ficava abaixo da dobra, e a pessoa respondia tudo sem ver
             * como seguir. Colada, a saída está sempre à mão, e o polegar
             * alcança sem reposicionar o telemóvel.
             */}
            <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-linha bg-branco/95 px-6 py-4 backdrop-blur-sm sm:px-10 sm:py-5 lg:px-12">
              <button
                type="button"
                onClick={() => setPasso((p) => Math.max(0, p - 1))}
                disabled={passo === 0}
                className="-m-3 p-3 text-sm text-grafite transition-colors hover:text-ouro-profundo disabled:opacity-40"
              >
                {f.voltar}
              </button>

              <button
                type="button"
                onClick={avancar}
                disabled={!podeAvancar}
                className="group inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-[#00ff66] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_25px_rgba(0,255,102,0.4)] transition-all duration-300 hover:bg-[#4be283] hover:shadow-[0_0_38px_rgba(0,255,102,0.6)] disabled:opacity-40 disabled:shadow-none sm:px-8"
              >
                {passo === TOTAL_PASSOS - 1 ? f.verPrograma : f.continuar}
                <Arrow />
              </button>
            </div>
          </div>
        )}
        </Container>
      </div>

      {passo === 0 && rodape}
    </>
  );
}

/* ============================================================
   PEÇAS DO FUNIL
   ============================================================ */

function Progresso({ passo, rotulo }: { passo: number; rotulo: string }) {
  const pct = Math.round(((passo + 1) / TOTAL_PASSOS) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={passo + 1}
      aria-valuemin={1}
      aria-valuemax={TOTAL_PASSOS}
      aria-label={rotulo}
      className="h-1.5 w-full bg-porcelana"
    >
      <div
        className="h-full bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro shadow-[0_0_16px_rgba(0,255,102,0.6)] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * O título encolhe no telemóvel de propósito.
 *
 * `t-title` é desenhado para cabeçalho de secção, e no ecrã pequeno uma
 * pergunta de duas linhas em corpo grande, seguida da nota, empurrava as
 * opções toda para baixo da dobra — a pessoa chegava ao passo sem ver o
 * que havia para escolher.
 */
function Tela({
  rotuloPasso,
  titulo,
  nota,
  children,
}: {
  /** "Passo 1 de 7" */
  rotuloPasso: string;
  titulo: string;
  nota: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="t-eyebrow text-[#00ff66]">{rotuloPasso}</p>
      <h2 className="mt-3 font-display text-2xl leading-tight text-balance text-grafite sm:mt-4 sm:text-4xl">
        {titulo}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-grafite sm:mt-4 sm:text-base">
        {nota}
      </p>
      <div className="mt-7 sm:mt-9">{children}</div>
    </div>
  );
}

function Opcao({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`min-h-14 cursor-pointer rounded-lg border p-4 text-left transition-all duration-300 active:scale-[0.99] sm:p-5 ${
        ativo
          ? "border-[#00ff66] bg-[#00ff66]/12 shadow-[0_0_24px_rgba(0,255,102,0.18)]"
          : "border-linha bg-branco hover:border-[#00ff66]/55 hover:bg-[#00ff66]/[0.05]"
      }`}
    >
      {children}
    </button>
  );
}

/** Botão redondo de número. O alvo tem 56 px — o mínimo confortável ao polegar. */
function Pastilha({
  ativo,
  rotulo,
  onClick,
  children,
}: {
  ativo: boolean;
  rotulo: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      aria-label={rotulo}
      onClick={onClick}
      className={`size-14 cursor-pointer rounded-full border font-display text-lg transition-all duration-300 ${
        ativo
          ? "border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.25)]"
          : "border-linha text-grafite hover:border-[#00ff66]/60"
      }`}
    >
      {children}
    </button>
  );
}

function Numero({
  id,
  rotulo,
  unidade,
  valor,
  onChange,
  placeholder,
  decimal = false,
  autoFoco = false,
}: {
  id: string;
  rotulo: string;
  unidade: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  decimal?: boolean;
  /** abre o teclado numérico ao entrar no passo */
  autoFoco?: boolean;
}) {
  return (
    <div>
      <Rotulo htmlFor={id}>
        {rotulo} ({unidade})
      </Rotulo>
      <input
        id={id}
        type="number"
        inputMode={decimal ? "decimal" : "numeric"}
        step={decimal ? "0.1" : "1"}
        value={valor}
        placeholder={placeholder}
        autoFocus={autoFoco}
        onChange={(ev) => onChange(ev.target.value)}
        /*
         * `text-base` não é estética: abaixo de 16 px o Safari do iPhone
         * dá zoom ao focar o campo, e a página fica desalinhada para o
         * resto do funil.
         */
        className={`${campoBase} text-base`}
      />
    </div>
  );
}

/**
 * A escala de silhuetas.
 *
 * Grelha de duas colunas no telemóvel, nunca carrossel. O carrossel
 * mostrava duas silhuetas e meia das oito: a pessoa não sabia que havia
 * mais, e comparar — que é a única coisa que esta tela faz — exigia
 * arrastar para a frente e para trás. Duas colunas mostram seis de
 * relance e as outras duas a um polegar de distância.
 */
function Silhuetas({
  escala,
  valor,
  onEscolher,
  disponivel,
  rotuloGrupo,
  aqui,
  idioma,
}: {
  idioma: Idioma;
  escala: readonly Nivel[];
  valor: string | null;
  onEscolher: (id: string) => void;
  disponivel: Set<string>;
  rotuloGrupo: string;
  /** o nível já escolhido como "atual", marcado na tela do alvo */
  aqui?: string | null;
}) {
  const f = TEXTO_PROGRAMA[idioma].funil;
  return (
    <div
      role="radiogroup"
      aria-label={rotuloGrupo}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {escala.map((n) => {
        const ativo = valor === n.id;
        const estaAqui = aqui === n.id;
        const src = caminhoDaFigura(n.id);
        const temFigura = disponivel.has(src);

        return (
          <button
            key={n.id}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onEscolher(n.id)}
            className={`group flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition-all duration-300 active:scale-[0.99] ${
              ativo
                ? "border-[#00ff66] bg-[#00ff66]/12 shadow-[0_0_24px_rgba(0,255,102,0.2)]"
                : "border-linha bg-branco hover:border-[#00ff66]/55 hover:bg-[#00ff66]/[0.04]"
            }`}
          >
            {/*
                Sem a figura, o cartão guarda só um número: em 3/4 ele ocupa
                a altura de uma fotografia de corpo inteiro para mostrar
                "25 %", e cabiam duas linhas no ecrã. Mais baixo, a escala
                aparece quase toda de uma vez — e volta a 3/4 no dia em que
                a imagem existir.
            */}
            <span
              className={`relative block w-full overflow-hidden bg-porcelana ${
                temFigura ? "aspect-3/4" : "aspect-4/3"
              }`}
            >
              {temFigura ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 45vw, 220px"
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                /*
                 * Sem a figura, o cartão ainda precisa ser escolhível e
                 * ordenável a olho — por isso o número grande, que é o que
                 * ordena a escala enquanto as imagens não existem.
                 */
                <span className="flex h-full items-center justify-center font-display text-3xl text-ouro-profundo">
                  {n.gordura}%
                </span>
              )}

              {estaAqui && (
                <span className="absolute inset-x-0 top-0 bg-grafite/85 px-2 py-1 text-center text-[0.6rem] uppercase tracking-[0.14em] text-porcelana">
                  {f.voceEstaAqui}
                </span>
              )}
            </span>

            {/* O percentual aparece uma vez só: no cartão sem figura ele já
                está no lugar da imagem, e repeti-lo aqui era ruído. */}
            <span className="flex flex-1 flex-col p-3">
              <span className="font-display text-base leading-tight text-grafite">
                {rotuloNivel(n, idioma)}
              </span>
              {temFigura && (
                <span className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-ouro-profundo">
                  {f.deGordura(n.gordura)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   RESULTADO
   ============================================================ */

function Resultado({
  plano,
  disponivel,
  vendaAberta,
  idioma,
  t,
  onVoltar,
}: {
  plano: Plano | null;
  disponivel: Set<string>;
  vendaAberta: boolean;
  idioma: Idioma;
  t: TextoPrograma;
  onVoltar: () => void;
}) {
  const r = t.resultado;
  const n = (valor: number) => n1(valor, idioma);
  if (!plano) {
    return (
      <div className="surface-elevated bg-branco p-6 sm:p-10">
        <h2 className="t-title">{r.faltouTitulo}</h2>
        <p className="mt-4 max-w-md leading-relaxed text-grafite">{r.faltouTexto}</p>
        <button
          type="button"
          onClick={onVoltar}
          className="mt-7 text-sm text-grafite underline decoration-ouro underline-offset-4"
        >
          {r.voltar}
        </button>
      </div>
    );
  }

  const { viabilidade: v, perfil } = plano;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="surface-elevated overflow-hidden bg-branco">
        <div className="h-1 bg-linear-to-r from-ouro-profundo via-ouro to-transparent" />
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="t-eyebrow text-ouro-profundo">{r.eyebrow(plano.duracao)}</p>
          <h2 className="mt-3 font-display text-2xl leading-tight text-balance text-grafite sm:mt-4 sm:text-4xl">
            {v.modo === "recomposicao"
              ? r.tituloRecomp
              : v.cabe
                ? r.tituloCabe(plano.duracao)
                : r.tituloNaoCabe(plano.duracao)}
          </h2>

          <Comparacao plano={plano} disponivel={disponivel} idioma={idioma} t={t} />

          <div className="mt-8 grid grid-cols-2 gap-5 border-t border-linha pt-7 sm:grid-cols-3 sm:gap-6">
            <Metrica
              rotulo={r.hoje}
              valor={`${n(perfil.peso)} kg`}
              nota={plano.gorduraAtual !== null ? r.gorduraAprox(plano.gorduraAtual) : ""}
            />
            <Metrica
              rotulo={r.noDia(plano.duracao)}
              valor={`${n(v.pesoProjetado)} kg`}
              nota={v.modo === "recomposicao" ? r.balancaPouco : r.diferenca(n(v.entregue))}
              destaque
            />
            <Metrica
              rotulo={r.treino}
              valor={r.porSemana(plano.dias)}
              nota={perfil.local === "casa" ? r.emCasa : r.naAcademia}
            />
          </div>
        </div>
      </div>

      {plano.avisos.length > 0 && (
        <div className="rounded-sm border border-linha border-l-2 border-l-ouro bg-porcelana p-6 shadow-(--shadow-soft) sm:p-10">
          <p className="t-eyebrow text-ouro-profundo">{r.precisaSaber}</p>
          <ul className="mt-5 space-y-5">
            {plano.avisos.map((aviso, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-grafite sm:gap-4 sm:text-base">
                <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-ouro sm:w-6" />
                <span>{aviso}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {plano.blocos.map((b) => (
          <article key={b.etapa.bloco} className="surface-elevated bg-branco p-6 sm:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <div>
                <p className="t-eyebrow text-ouro-profundo">
                  {r.bloco(b.etapa.bloco, b.etapa.intervalo)}
                </p>
                <h3 className="mt-2 font-display text-2xl text-grafite sm:text-3xl">
                  {b.titulo}
                </h3>
              </div>
              <p className="font-display text-xl text-grafite sm:text-2xl">
                {n(b.etapa.pesoInicial)} → {n(b.etapa.pesoFinal)} kg
              </p>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-grafite sm:mt-5 sm:text-base">
              {b.foco}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-linha pt-6 sm:grid-cols-4 sm:gap-6 sm:pt-7">
              <Metrica rotulo={r.calorias} valor={`${b.etapa.alvoKcal}`} nota={r.kcalDia} />
              <Metrica rotulo={r.proteina} valor={`${b.macros.proteina.g} g`} nota={`${b.macros.proteina.pct}%`} />
              <Metrica rotulo={r.carboidrato} valor={`${b.macros.carboidrato.g} g`} nota={`${b.macros.carboidrato.pct}%`} />
              <Metrica rotulo={r.gordura} valor={`${b.macros.gordura.g} g`} nota={`${b.macros.gordura.pct}%`} />
            </div>

            <details className="group mt-7 border-t border-linha pt-6 sm:pt-7">
              <summary className="-m-2 cursor-pointer list-none p-2 text-sm font-medium text-grafite transition-colors hover:text-ouro-profundo">
                {r.semanaTreino(b.treino.length, b.volume)}
                <span aria-hidden className="ml-2 inline-block transition-transform group-open:rotate-90">
                  →
                </span>
              </summary>

              <div className="mt-6 space-y-7">
                {b.treino.map((sessao) => (
                  <div key={sessao.nome}>
                    <p className="t-eyebrow text-grafite">{sessao.nome}</p>
                    <ul className="mt-4 space-y-3">
                      {sessao.itens.map((item, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-linha pb-3 text-sm"
                        >
                          <span className="text-grafite">
                            {item.exercicio}
                            {item.alternativa && (
                              <span className="block text-xs text-grafite/70">
                                {r.maisFacil} {item.alternativa}
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 text-xs text-grafite/80 sm:text-sm">
                            {item.series} × {item.reps} · RIR {item.rir} · {item.descanso}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>

            <p className="mt-7 border-t border-linha pt-6 text-sm leading-relaxed text-grafite sm:pt-7">
              <span className="t-eyebrow block text-ouro-profundo">{r.ultimoDia}</span>
              <span className="mt-2 block">{b.marco}</span>
            </p>
          </article>
        ))}
      </div>

      <Oferta plano={plano} vendaAberta={vendaAberta} idioma={idioma} t={t} />

      <button
        type="button"
        onClick={onVoltar}
        className="-m-2 p-2 text-sm text-grafite underline decoration-ouro underline-offset-4"
      >
        {r.ajustar}
      </button>
    </div>
  );
}

/**
 * As duas silhuetas lado a lado.
 *
 * É a tela que a pessoa veio ver, e o único lugar do produto onde o antes
 * e o depois aparecem juntos. Importa que sejam as figuras genéricas da
 * escala, escolhidas por ela: um "depois" gerado a partir da foto da
 * própria pessoa seria um antes/depois fabricado — barrado nos anúncios de
 * saúde e peso, e indefensável como promessa.
 */
function Comparacao({
  plano,
  disponivel,
  idioma,
  t,
}: {
  plano: Plano;
  disponivel: Set<string>;
  idioma: Idioma;
  t: TextoPrograma;
}) {
  const { perfil } = plano;
  const atual = ESCALA[perfil.sexo].find((n) => n.id === perfil.shapeAtual);
  const alvo = ESCALA[perfil.sexo].find((n) => n.id === perfil.shapeAlvo);
  if (!atual || !alvo) return null;

  return (
    <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:mt-9 sm:gap-8">
      <Lado nivel={atual} rotulo={t.resultado.hoje} disponivel={disponivel} idioma={idioma} t={t} />
      <span aria-hidden className="font-display text-2xl text-ouro-profundo sm:text-4xl">
        →
      </span>
      <Lado
        nivel={alvo}
        rotulo={t.resultado.dia(plano.duracao)}
        disponivel={disponivel}
        idioma={idioma}
        t={t}
        destaque
      />
    </div>
  );
}

function Lado({
  nivel,
  rotulo,
  disponivel,
  idioma,
  t,
  destaque = false,
}: {
  nivel: Nivel;
  rotulo: string;
  disponivel: Set<string>;
  idioma: Idioma;
  t: TextoPrograma;
  destaque?: boolean;
}) {
  const src = caminhoDaFigura(nivel.id);

  return (
    <figure className="text-center">
      <div
        className={`relative mx-auto aspect-3/4 w-full max-w-[14rem] overflow-hidden rounded-sm border ${
          destaque ? "border-ouro-profundo bg-ouro/10" : "border-linha bg-porcelana"
        }`}
      >
        {disponivel.has(src) ? (
          <Image src={src} alt="" fill sizes="(max-width: 640px) 40vw, 220px" className="object-contain p-2" />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-2xl text-ouro-profundo sm:text-3xl">
            {nivel.gordura}%
          </span>
        )}
      </div>
      <figcaption className="mt-3 sm:mt-4">
        <span className="t-eyebrow block text-ouro-profundo">{rotulo}</span>
        <span className="mt-1 block font-display text-base text-grafite sm:text-lg">
          {rotuloNivel(nivel, idioma)}
        </span>
        <span className="text-xs text-grafite/80">{t.resultado.gorduraAprox(nivel.gordura)}</span>
      </figcaption>
    </figure>
  );
}

function Metrica({
  rotulo,
  valor,
  nota,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  nota?: string;
  destaque?: boolean;
}) {
  return (
    <div>
      <p className="t-eyebrow text-grafite">{rotulo}</p>
      <p
        className={`mt-2 font-display text-xl sm:text-2xl ${
          destaque ? "text-ouro-profundo" : "text-grafite"
        }`}
      >
        {valor}
      </p>
      {nota && <p className="mt-1 text-xs text-grafite/80">{nota}</p>}
    </div>
  );
}

/**
 * A oferta.
 *
 * O diagnóstico inteiro é entregue de graça, e isto não é generosidade: o
 * que se vende depois não é a informação — é a estrutura, o acompanhamento
 * e o registro dos 90 dias. Quem já viu o plano todo decide com a conta na
 * mão, e esse é o único tipo de compra que não volta como pedido de
 * reembolso.
 *
 * `surface-elevated` não entra aqui: é regra fora de `@layer` e vence
 * qualquer utility `bg-*`, o que punha texto porcelana sobre fundo branco.
 * O padrão de cartão escuro do projeto está em CalculadoraGordura.tsx.
 *
 * O perfil segue junto com o pedido. É o que permite entregar, depois do
 * pagamento, exatamente o plano que esta pessoa viu nesta tela — e não um
 * plano genérico que ela teria de reconstruir respondendo tudo outra vez.
 */
function Oferta({
  plano,
  vendaAberta,
  idioma,
  t,
}: {
  plano: Plano;
  vendaAberta: boolean;
  idioma: Idioma;
  t: TextoPrograma;
}) {
  const o = t.oferta;
  const diasAfericao = plano.blocos
    .map((b) => b.etapa.bloco * Math.round(plano.duracao / plano.blocos.length))
    .join(", ");

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#00ff66]/65 bg-[#0c140f] text-grafite shadow-[0_0_60px_rgba(0,255,102,0.18)]">
      <div className="h-1.5 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />
      <div className="p-6 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="t-eyebrow text-[#00ff66]">{o.eyebrow(plano.duracao)}</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <SeletorMoeda idioma={idioma} />
            <span className="rounded-full border border-[#00ff66]/50 bg-[#00ff66]/15 px-3.5 py-1 text-xs font-extrabold tracking-wider uppercase text-[#00ff66]">
              {o.entrada} <PrecoDinamico />
            </span>
          </div>
        </div>

        <div className="mt-5 max-w-sm overflow-hidden rounded-xl border border-[#39ff14]/35 bg-[#030b05] p-1.5 shadow-[0_0_30px_rgba(57,255,20,0.18)]">
          <Image
            src="/brand/reset-metabolico-21d.jpg"
            alt={o.alt}
            width={1024}
            height={512}
            sizes="(max-width: 640px) 85vw, 380px"
            className="h-auto w-full rounded-lg object-cover"
          />
        </div>

        <h3 className="mt-5 font-display text-2xl leading-tight text-balance text-grafite sm:mt-6 sm:text-4xl">
          {o.titulo}
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-grafite/85 sm:mt-5 sm:text-base">
          {o.texto(plano.duracao, plano.blocos.length, diasAfericao)}
        </p>

        <ul className="mt-6 grid gap-2.5 text-sm text-grafite/90 sm:grid-cols-2">
          <li className="flex items-center gap-2.5">
            <span className="font-bold text-[#00ff66]">✓</span>
            {o.itemPrescricao(plano.duracao)}
          </li>
          <li className="flex items-center gap-2.5">
            <span className="font-bold text-[#00ff66]">✓</span>
            {o.itemNutricao}
          </li>
          <li className="flex items-center gap-2.5">
            <span className="font-bold text-[#00ff66]">✓</span>
            {o.itemTreino(plano.perfil.local === "casa")}
          </li>
          <li className="flex items-center gap-2.5">
            <span className="font-bold text-[#00ff66]">✓</span>
            {o.itemGuia}
          </li>
        </ul>

        <div className="mt-8 border-t border-white/12 pt-7">
          {vendaAberta ? (
            <Comprar
              plano={{ perfil: plano.perfil, duracao: plano.duracao, modo: plano.modo }}
              preco={precoEmReais()}
              idioma={idioma}
            />
          ) : (
            /* Sem checkout configurado, o botão de compra só daria erro.
               Quem chegou até aqui é lead quente: vai para a consultoria. */
            <a
              href="/consultoria?de=programa-90-dias"
              className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#00ff66] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[#041208] shadow-[0_0_30px_rgba(0,255,102,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4be283] hover:shadow-[0_0_45px_rgba(0,255,102,0.65)]"
            >
              {o.consultoria}
              <Arrow />
            </a>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/12 pt-5 text-xs leading-relaxed text-grafite/75">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#00ff66]">
            {o.garantia}
          </span>
          <span>·</span>
          <span>
            {o.assinatura}
          </span>
        </div>
      </div>
    </div>
  );
}

export { DURACAO_PADRAO };
