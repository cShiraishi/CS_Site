"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { gravarArmazenado, lerJson, useArmazenado } from "@/lib/useArmazenado";
import { marca, rotas } from "@/lib/content";
import type { Protocolo } from "@/lib/protocolos";
import { montar, type Perfil, type Programa as Plano } from "@/lib/programa";
import { CATALOGO_RECEITAS } from "@/lib/receitas";

type Aba =
  | "inicio"
  | "aulas"
  | "alimentar"
  | "treinos"
  | "receitas"
  | "calendario"
  | "diario"
  | "materiais"
  | "comunidade";

const AULAS_21D: {
  dia: number;
  semana: string;
  subtituloSemana: string;
  tituloAula: string;
  duracao: string;
  resumoAula: string;
  pontosChave: string[];
  treinoDia: string;
}[] = [
  {
    dia: 1,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Organização, descompressão glicêmica e primeiros treinos",
    tituloAula: "O ponto zero: como medir sem mentir para si mesmo",
    duracao: "3 min",
    resumoAula:
      "Peso em jejum, medida da linha umbilical e fotos sob a mesma luz. O que não é medido no Dia 1 não pode ser celebrado no Dia 21.",
    pontosChave: [
      "Pese-se em jejum logo após ir ao banheiro.",
      "Meça a cintura exatamente na linha do umbigo, sem encolher o abdômen.",
      "Monte as 3 refeições base do seu bloco 1 antes das 12h.",
    ],
    treinoDia: "Treino A – Full Body / Base Mecânica",
  },
  {
    dia: 2,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Organização, descompressão glicêmica e primeiros treinos",
    tituloAula: "A regra dos 30g de proteína na primeira refeição",
    duracao: "3 min",
    resumoAula:
      "Por que começar o dia apenas com café e pão dispara a grelina às 18h — e como blindar sua saciedade logo pela manhã.",
    pontosChave: [
      "Inclua ovos, iogurte proteico, queijo magro ou whey logo na refeição 1.",
      "Beba 500 ml de água nos primeiros 30 minutos acordado.",
      "Mantenha o RIR 2–3 no treino: técnica perfeita antes de carga.",
    ],
    treinoDia: "Caminhada Ativa 30 min + Mobilidade",
  },
  {
    dia: 3,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Organização, descompressão glicêmica e primeiros treinos",
    tituloAula: "Cinética glicêmica: comer carboidrato sem estufar",
    duracao: "4 min",
    resumoAula:
      "A ordem dos alimentos no prato altera o pico de glicose e insulina em até 40%. Aprenda a sequência fibra → proteína → carboidrato.",
    pontosChave: [
      "Comece o almoço e o jantar pela salada/hortícolas.",
      "Nunca coma carboidrato isolado no lanche da tarde.",
      "Observe a redução do sono pós-almoço já no terceiro dia.",
    ],
    treinoDia: "Treino B – Força & Estabilidade",
  },
  {
    dia: 4,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Organização, alimentação e primeiros treinos",
    tituloAula: "Disciplina sem extremismos",
    duracao: "3 min",
    resumoAula:
      "Nenhum protocolo meu depende de você ser perfeito. Se uma refeição sair do script, a próxima volta ao plano — sem compensação maluca.",
    pontosChave: [
      "Regra das 24 horas: nunca erre duas refeições seguidas.",
      "Use as receitas doces < 100 kcal quando bater vontade de açúcar à noite.",
      "Anote as cargas usadas hoje para superar na Semana 2.",
    ],
    treinoDia: "Treino A – Full Body (Duração: 20–30 min)",
  },
  {
    dia: 5,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Organização, alimentação e primeiros treinos",
    tituloAula: "Estratégia de fim de semana sem perder a semana",
    duracao: "4 min",
    resumoAula:
      "Três dias de descontrole apagam cinco dias de déficit. Como fazer refeição livre mantendo o saldo calórico semanal negativo.",
    pontosChave: [
      "Mantenha a meta de proteína alta no sábado e no domingo.",
      "Prefira cortes magros e evite beliscar entradas calóricas.",
      "Hidratação: 35 a 45 ml de água por quilo de peso.",
    ],
    treinoDia: "Treino C – Metabólico & Core",
  },
  {
    dia: 6,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Organização, alimentação e primeiros treinos",
    tituloAula: "Desinchaço intracelular: sódio, potássio e água",
    duracao: "3 min",
    resumoAula:
      "Por que cortar sal demais piora a retenção e como o equilíbrio água + potássio deixa a pele mais fina em 48 horas.",
    pontosChave: [
      "Inclua fontes de potássio (vegetais verdes, frutas, batata/abóbora na cota).",
      "Evite ultraprocessados ricos em sódio oculto no sábado.",
      "30 minutos de caminhada em passo rápido.",
    ],
    treinoDia: "Cardio Moderado / Recuperação Ativa",
  },
  {
    dia: 7,
    semana: "Semana 1 – RESET",
    subtituloSemana: "Fechamento da Semana 1 e 1ª Aferição",
    tituloAula: "Checklist do Dia 7: o que já mudou no seu corpo",
    duracao: "3 min",
    resumoAula:
      "Hora de subir na balança em jejum e medir a cintura. Entenda quanto foi glicogênio/água e prepare o corpo para a Semana 2 de Lipólise.",
    pontosChave: [
      "Registre peso e cintura no Diário de Progresso.",
      "Deixe as compras da Semana 2 organizadas.",
      "Sono reparador: 7 a 8 horas para baixar o cortisol.",
    ],
    treinoDia: "Descanso Ativo & Aferição Semanal",
  },
];

function obterAulaDoDia(dia: number) {
  const base = AULAS_21D.find((a) => a.dia === dia);
  if (base) return base;

  const semanaNum = dia <= 7 ? 1 : dia <= 14 ? 2 : 3;
  const nomeSemana =
    semanaNum === 1
      ? "Semana 1 – RESET"
      : semanaNum === 2
      ? "Semana 2 – OXIDAÇÃO & CARGA"
      : "Semana 3 – DEFINIÇÃO & AUTONOMIA";
  const subtitulo =
    semanaNum === 2
      ? "Lipólise acelerada e progressão mecânica no treino"
      : "Ajuste fino sobre o peso novo e preparação para o Dia 22";

  return {
    dia,
    semana: nomeSemana,
    subtituloSemana: subtitulo,
    tituloAula:
      semanaNum === 2
        ? `Dia ${dia}: Progressão de carga e proteção da massa magra`
        : `Dia ${dia}: Blindagem contra o efeito platô e consolidação`,
    duracao: "3 min",
    resumoAula:
      semanaNum === 2
        ? "Com a glicemia estável, o foco desta semana é adicionar 1 repetição ou 1–2 kg nos exercícios principais para sinalizar retenção muscular máxima."
        : "Na reta final dos 21 dias, seu gasto calórico ajusta-se ao novo peso. Mantenha a densidade proteica e cumpra as sessões até o Dia 21.",
    pontosChave: [
      `Cumprir 100% das refeições do Bloco ${semanaNum}.`,
      "Manter ingestão hídrica acima de 2,5 L no dia.",
      "Executar o treino previsto respeitando a faixa de RIR.",
    ],
    treinoDia: dia % 2 === 0 ? "Treino A – Força & Hipertrofia" : "Treino B – Densidade Metabólica",
  };
}

const PERFIL_PADRAO: Perfil = {
  sexo: "masculino",
  idade: 32,
  peso: 84,
  altura: 176,
  pesoAlvo: 78,
  shapeAtual: "h5",
  shapeAlvo: "h3",
  atividade: "moderado",
  local: "academia",
  diasPedidos: 4,
  experiencia: "voltando",
  refeicoes: 4,
};

type EstadoDiario = {
  diasConcluidos: number[];
  missoesPorDia: Record<number, boolean[]>;
  pesoAtual: string;
  cinturaAtual: string;
};

const CHAVE_STORAGE = "cs_performance_reset21d_v1";

/** No preview aberto (`?demo=1`) só a primeira semana abre; o resto é de quem comprou. */
const DIAS_PREVIEW = 7;

const DIARIO_INICIAL: EstadoDiario = {
  diasConcluidos: [1, 2, 3, 4],
  missoesPorDia: { 4: [true, false, false, false] },
  pesoAtual: "",
  cinturaAtual: "",
};

export function PlataformaReset21D({
  emailUsuario,
  perfilSalvo,
  protocolos,
  modoDemo = false,
}: {
  emailUsuario: string;
  perfilSalvo?: Partial<Perfil> | null;
  protocolos: Protocolo[];
  modoDemo?: boolean;
}) {
  const [aba, setAba] = useState<Aba>("inicio");
  const [diaAtivo, setDiaAtivo] = useState<number>(4);
  const [modalAulaAberto, setModalAulaAberto] = useState(false);
  const [avisoPreview, setAvisoPreview] = useState(false);
  const diarioBruto = useArmazenado(CHAVE_STORAGE);
  const diario: EstadoDiario = useMemo(() => {
    const lido = lerJson<Partial<EstadoDiario>>(diarioBruto);
    if (!lido) return DIARIO_INICIAL;
    return {
      diasConcluidos: Array.isArray(lido.diasConcluidos)
        ? lido.diasConcluidos
        : DIARIO_INICIAL.diasConcluidos,
      missoesPorDia: lido.missoesPorDia ?? DIARIO_INICIAL.missoesPorDia,
      pesoAtual: lido.pesoAtual ?? "",
      cinturaAtual: lido.cinturaAtual ?? "",
    };
  }, [diarioBruto]);

  const salvarDiario = (atualizar: (atual: EstadoDiario) => EstadoDiario) => {
    gravarArmazenado(CHAVE_STORAGE, JSON.stringify(atualizar(diario)));
  };

  /** Devolve `false` quando o dia está fora do preview. */
  const escolherDia = (d: number) => {
    if (modoDemo && d > DIAS_PREVIEW) {
      setAvisoPreview(true);
      return false;
    }
    setAvisoPreview(false);
    setDiaAtivo(d);
    return true;
  };

  const perfil: Perfil = useMemo(
    () => ({
      ...PERFIL_PADRAO,
      ...(perfilSalvo ?? {}),
    }),
    [perfilSalvo],
  );

  const plano: Plano | null = useMemo(() => montar(perfil, 21), [perfil]);
  const aulaHoje = useMemo(() => obterAulaDoDia(diaAtivo), [diaAtivo]);

  const missoesHoje = diario.missoesPorDia[diaAtivo] ?? [false, false, false, false];
  const percentualConcluido = Math.round((diario.diasConcluidos.length / 21) * 100);

  const alternarMissao = (indice: number) => {
    salvarDiario((atual) => {
      const lista = [...(atual.missoesPorDia[diaAtivo] ?? [false, false, false, false])];
      lista[indice] = !lista[indice];
      const todasMarcadas = lista.every(Boolean);
      const jaConcluido = atual.diasConcluidos.includes(diaAtivo);
      const novosDias = todasMarcadas && !jaConcluido
        ? [...atual.diasConcluidos, diaAtivo].sort((a, b) => a - b)
        : atual.diasConcluidos;

      return {
        ...atual,
        missoesPorDia: { ...atual.missoesPorDia, [diaAtivo]: lista },
        diasConcluidos: novosDias,
      };
    });
  };

  const alternarDiaConcluido = (dia: number) => {
    salvarDiario((atual) => {
      const existe = atual.diasConcluidos.includes(dia);
      return {
        ...atual,
        diasConcluidos: existe
          ? atual.diasConcluidos.filter((d) => d !== dia)
          : [...atual.diasConcluidos, dia].sort((a, b) => a - b),
      };
    });
  };

  const blocoAtual = plano?.blocos[diaAtivo <= 7 ? 0 : diaAtivo <= 14 ? 1 : 2] ?? plano?.blocos[0];
  const nomeExibicao = emailUsuario.split("@")[0] || "Participante";

  const MENU_LATERAL: { id: Aba; label: string; icone: string }[] = [
    { id: "inicio", label: "Início", icone: "🏠" },
    { id: "aulas", label: "Aulas & Missões", icone: "🎬" },
    { id: "alimentar", label: "Plano Alimentar", icone: "🍽️" },
    { id: "treinos", label: "Treinos", icone: "🏋️" },
    { id: "receitas", label: "Receitas", icone: "👨‍🍳" },
    { id: "calendario", label: "Calendário 21D", icone: "📅" },
    { id: "diario", label: "Diário de Progresso", icone: "📊" },
    { id: "materiais", label: "Materiais de Apoio", icone: "📚" },
    { id: "comunidade", label: "Comunidade", icone: "👥" },
  ];

  return (
    <div className="min-h-screen bg-[#070b09] text-[#f2ede5]">
      {/* Barra de aviso caso esteja em Modo Demonstração */}
      {modoDemo && (
        <div className="border-b border-[#7dff1a]/40 bg-[#0d1911] px-4 py-2.5 text-center text-xs text-[#f2ede5]">
          <span className="mr-2 rounded-full bg-[#7dff1a] px-2.5 py-0.5 font-extrabold uppercase text-[#041208]">
            Modo Preview
          </span>
          Você está visualizando a plataforma interativa <strong>CS Performance · Reset Metabólico 21D</strong>.{" "}
          <Link
            href={rotas.programa}
            className="ml-2 font-bold text-[#7dff1a] underline decoration-[#7dff1a] underline-offset-4"
          >
            Voltar para a Página de Vendas →
          </Link>
          {avisoPreview && (
            <p role="status" className="mt-2 font-bold text-[#7dff1a]">
              O preview mostra só os {DIAS_PREVIEW} primeiros dias. Do dia {DIAS_PREVIEW + 1} ao 21 é
              conteúdo de quem tem o Reset 21D.
            </p>
          )}
        </div>
      )}

      {/* Layout Principal: Sidebar Esquerda + Conteúdo Central + Coluna Direita */}
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        {/* ============================================================
           SIDEBAR ESQUERDA (CS PERFORMANCE)
           ============================================================ */}
        <aside className="w-full shrink-0 border-b border-white/10 bg-[#0b100e] lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-6 py-5 lg:block">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg border border-[#7dff1a]/60 bg-[#7dff1a]/15 font-display text-xl text-[#7dff1a] shadow-[0_0_18px_rgba(125,255,26,0.3)]">
                  CS
                </span>
                <div>
                  <span className="block font-display text-lg tracking-wider uppercase text-white">
                    CS Performance
                  </span>
                  <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#7dff1a]">
                    Reset Metabólico 21D
                  </span>
                </div>
              </div>
            </Link>

            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 lg:hidden">
              Olá, {nomeExibicao}
            </span>
          </div>

          {/* Navegação Horizontal no Mobile / Vertical no Desktop */}
          <nav
            aria-label="Menu da plataforma"
            className="flex gap-1.5 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-4 lg: pb-8 [scrollbar-width:none]"
          >
            {MENU_LATERAL.map((item) => {
              const ativo = aba === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAba(item.id)}
                  className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                    ativo
                      ? "bg-linear-to-r from-[#80ff1a] to-[#39ff14] font-extrabold text-[#041208] shadow-[0_0_24px_rgba(125,255,26,0.4)]"
                      : "text-white/75 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  <span aria-hidden className="text-base">{item.icone}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ============================================================
           ÁREA CENTRAL + COLUNA DIREITA
           ============================================================ */}
        <div className="flex-1">
          {/* Topbar Superior */}
          <header className="hidden items-center justify-between border-b border-white/10 bg-[#0b100e]/80 px-8 py-4 backdrop-blur-md lg:flex">
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7dff1a]/40 bg-[#7dff1a]/10 px-3 py-1 font-bold text-[#7dff1a]">
                <span aria-hidden className="size-1.5 rounded-full bg-[#7dff1a]" />
                Acesso Ativo · 21 Dias
              </span>
              <span>·</span>
              <span>
                Meta atual: <strong className="text-white">{blocoAtual?.etapa.alvoKcal ?? 2000} kcal/dia</strong> ({blocoAtual?.macros.proteina.g ?? 160}g Proteína)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAba("calendario")}
                className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm hover:border-[#7dff1a]"
                aria-label="Notificações e metas do dia"
              >
                🔔
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[#7dff1a]" />
              </button>
              <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#7dff1a] font-bold uppercase text-[#041208]">
                  {nomeExibicao.slice(0, 1)}
                </span>
                <span>Olá, {nomeExibicao}!</span>
              </div>
            </div>
          </header>

          {/* Conteúdo Dinâmico + Coluna Lateral Direita */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Banner Hero Oficial DIA 0 vs DIA 21 */}
            <div className="relative overflow-hidden rounded-2xl border border-[#7dff1a]/35 bg-[#050a07] shadow-[0_0_50px_rgba(57,255,20,0.15)]">
              <Image
                src="/brand/banner-dia0-dia21.jpg"
                alt="CS Performance — Reset Metabólico 21D: O teu plano prático para perder gordura em 21 dias (Dia 0 vs Dia 21)"
                width={767}
                height={228}
                priority
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_21rem]">
              {/* ============================================================
                 COLUNA PRINCIPAL ESQUERDA
                 ============================================================ */}
              <div className="space-y-7">
                {aba === "inicio" && (
                  <>
                    <div>
                      <h1 className="font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                        O teu desafio começa aqui!
                      </h1>
                      <p className="mt-1 text-sm text-white/70">
                        Segue o plano, conclui as missões diárias e vê a tua evolução.
                      </p>
                    </div>

                    {/* Card Principal: HOJE · DIA X */}
                    <section className="rounded-2xl border border-white/12 bg-[#111715] p-5 shadow-xl sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="overflow-hidden rounded-xl border-2 border-[#7dff1a] bg-[#090d0b] text-center shadow-[0_0_24px_rgba(125,255,26,0.28)]">
                            <span className="block bg-[#7dff1a] px-3 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-[#041208]">
                              Hoje
                            </span>
                            <div className="px-3.5 py-2">
                              <span className="block text-[0.65rem] uppercase tracking-widest text-white/70">
                                Dia
                              </span>
                              <span className="font-display text-3xl leading-none text-white">
                                {String(diaAtivo).padStart(2, "0")}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h2 className="font-display text-xl uppercase text-white sm:text-2xl">
                              {aulaHoje.semana}
                            </h2>
                            <p className="text-xs text-white/70 sm:text-sm">
                              {aulaHoje.subtituloSemana}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => alternarDiaConcluido(diaAtivo)}
                          className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
                            diario.diasConcluidos.includes(diaAtivo)
                              ? "border border-[#7dff1a] bg-[#7dff1a]/15 text-[#7dff1a]"
                              : "border border-white/20 bg-white/5 text-white/80 hover:border-[#7dff1a]"
                          }`}
                        >
                          {diario.diasConcluidos.includes(diaAtivo)
                            ? `✓ Dia ${diaAtivo} Concluído`
                            : `Marcar Dia ${diaAtivo} Concluído`}
                        </button>
                      </div>

                      {/* Box da Aula do Dia */}
                      <div className="mt-5 grid items-center gap-5 rounded-xl border border-white/10 bg-[#0b100e] p-4 sm:grid-cols-[13rem_1fr]">
                        <button
                          type="button"
                          onClick={() => setModalAulaAberto(true)}
                          className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border border-white/15 bg-black"
                        >
                          <Image
                            src="/sobre/carlos-seiti.png"
                            alt="Aula do Dia com Carlos Seiti"
                            width={320}
                            height={180}
                            className="h-full w-full object-cover object-top opacity-80 transition-transform duration-300 group-hover:scale-105"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="flex size-11 items-center justify-center rounded-full border-2 border-[#7dff1a] bg-black/75 text-base text-[#7dff1a] shadow-[0_0_20px_rgba(125,255,26,0.5)] transition-transform group-hover:scale-110">
                              ▶
                            </span>
                          </span>
                        </button>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#7dff1a]">
                            Aula do Dia ({aulaHoje.duracao})
                          </p>
                          <h3 className="mt-1 font-display text-xl text-white">
                            {aulaHoje.tituloAula}
                          </h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/75">
                            {aulaHoje.resumoAula}
                          </p>
                          <button
                            type="button"
                            onClick={() => setModalAulaAberto(true)}
                            className="mt-3.5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#7dff1a] px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_20px_rgba(125,255,26,0.4)] transition-all hover:bg-[#9aff4d]"
                          >
                            ▶ Ver Aula
                          </button>
                        </div>
                      </div>

                      {/* Checklist: Missões de Hoje */}
                      <div className="mt-5 rounded-xl border border-white/10 bg-[#0b100e] p-4 sm:p-5">
                        <h3 className="font-display text-lg uppercase text-white">
                          Missões de hoje (Dia {String(diaAtivo).padStart(2, "0")})
                        </h3>

                        <div className="mt-3.5 grid items-center gap-5 lg:grid-cols-[1fr_auto]">
                          <ul className="space-y-2.5">
                            {[
                              `Consultar o menu alimentar do Dia ${diaAtivo} (${blocoAtual?.etapa.alvoKcal ?? 2000} kcal)`,
                              `Realizar o ${aulaHoje.treinoDia}`,
                              "Incluir hortícolas / fibras em 2 refeições",
                              "Registar o progresso no Diário",
                            ].map((texto, idx) => {
                              const feito = Boolean(missoesHoje[idx]);
                              return (
                                <li key={texto}>
                                  <button
                                    type="button"
                                    onClick={() => alternarMissao(idx)}
                                    className="flex w-full cursor-pointer items-center gap-3 text-left text-sm transition-colors hover:text-[#7dff1a]"
                                  >
                                    <span
                                      className={`flex size-5 shrink-0 items-center justify-center rounded border text-xs font-bold transition-all ${
                                        feito
                                          ? "border-[#7dff1a] bg-[#7dff1a] text-[#041208] shadow-[0_0_12px_rgba(125,255,26,0.5)]"
                                          : "border-white/30 bg-transparent text-transparent"
                                      }`}
                                    >
                                      ✓
                                    </span>
                                    <span className={feito ? "text-white line-through opacity-75" : "text-white/90"}>
                                      {texto}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>

                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => setAba("alimentar")}
                              className="cursor-pointer rounded-xl border border-[#7dff1a]/35 bg-[#131d17] p-3 text-center transition-all hover:border-[#7dff1a]"
                            >
                              <span className="block text-2xl">🥗</span>
                              <span className="mt-1 block text-[0.65rem] font-bold uppercase text-[#7dff1a]">
                                Ver Prato
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setAba("treinos")}
                              className="cursor-pointer rounded-xl border border-[#7dff1a]/35 bg-[#131d17] p-3 text-center transition-all hover:border-[#7dff1a]"
                            >
                              <span className="block text-2xl">🏋️</span>
                              <span className="mt-1 block text-[0.65rem] font-bold uppercase text-[#7dff1a]">
                                Ver Treino
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Grid: Explora o Programa (8 Cards Visuais com Glow Verde Neon) */}
                    <section>
                      <h2 className="font-display text-2xl uppercase text-white">
                        Explora o Programa
                      </h2>

                      <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                        {[
                          {
                            titulo: "GUIA ALIMENTAR PRÁTICO",
                            sub: "Macros & Refeições",
                            icone: "📖",
                            acao: () => setAba("alimentar"),
                          },
                          {
                            titulo: "PLANO DE TREINOS R21",
                            sub: "Casa & Academia",
                            icone: "🏋️",
                            acao: () => setAba("treinos"),
                          },
                          {
                            titulo: "CALENDÁRIO DE EXECUÇÃO 21D",
                            sub: "Checklist 21 Dias",
                            icone: "📅",
                            acao: () => setAba("calendario"),
                          },
                          {
                            titulo: "20 RECEITAS PRÁTICAS",
                            sub: "Proteicas & Rápidas",
                            icone: "👨‍🍳",
                            acao: () => setAba("receitas"),
                          },
                          {
                            titulo: "RECEITAS COM MENOS DE 100 KCAL",
                            sub: "Doces & Salgadas Fit",
                            icone: "🌱",
                            acao: () => setAba("receitas"),
                          },
                          {
                            titulo: "DIÁRIO DE PROGRESSO",
                            sub: "Peso & Cintura",
                            icone: "📊",
                            acao: () => setAba("diario"),
                          },
                          {
                            titulo: "PRÓXIMOS 30 DIAS",
                            sub: "Consultoria Individual",
                            icone: "🔄",
                            acao: () => setAba("comunidade"),
                          },
                          {
                            titulo: "COMUNIDADE R21",
                            sub: "Grupo & Suporte",
                            icone: "💬",
                            acao: () => setAba("comunidade"),
                          },
                        ].map((card) => (
                          <button
                            key={card.titulo}
                            type="button"
                            onClick={card.acao}
                            className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-end overflow-hidden rounded-2xl border border-[#7dff1a]/40 bg-linear-to-b from-[#152119] via-[#0d1510] to-[#09120b] p-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7dff1a] hover:shadow-[0_0_30px_rgba(125,255,26,0.28)]"
                          >
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#7dff1a]/20 to-transparent"
                            />
                            <span className="mb-2 flex size-12 items-center justify-center rounded-full border border-[#7dff1a]/45 bg-[#7dff1a]/15 text-2xl shadow-[0_0_18px_rgba(125,255,26,0.25)] transition-transform group-hover:scale-110">
                              {card.icone}
                            </span>
                            <span className="relative font-display text-base leading-tight uppercase text-white">
                              {card.titulo}
                            </span>
                            <span className="relative mt-1 text-[0.68rem] font-semibold text-[#7dff1a]">
                              {card.sub}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {/* ============================================================
                   ABA: AULAS & MISSÕES (21 DIAS)
                   ============================================================ */}
                {aba === "aulas" && (
                  <section className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                    <h2 className="font-display text-2xl uppercase text-white">
                      Aulas & Missões Diárias (Dias 1 a 21)
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Pílulas diretas de 3 minutos para destravar cada fase do seu Reset Metabólico.
                    </p>

                    <div className="mt-6 space-y-3">
                      {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
                        const info = obterAulaDoDia(d);
                        const concluido = diario.diasConcluidos.includes(d);
                        return (
                          <div
                            key={d}
                            className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                              d === diaAtivo
                                ? "border-[#7dff1a] bg-[#0b140e]"
                                : "border-white/10 bg-[#0b100e]"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-base ${
                                  concluido
                                    ? "bg-[#7dff1a] text-[#041208]"
                                    : "border border-white/20 bg-white/5 text-white"
                                }`}
                              >
                                {String(d).padStart(2, "0")}
                              </span>
                              <div>
                                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#7dff1a]">
                                  {info.semana} · {info.duracao}
                                </p>
                                <h3 className="font-display text-lg text-white">
                                  {info.tituloAula}
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!escolherDia(d)) return;
                                  setModalAulaAberto(true);
                                }}
                                className="cursor-pointer rounded-lg bg-[#7dff1a] px-4 py-2 text-xs font-extrabold uppercase text-[#041208]"
                              >
                                ▶ Assistir
                              </button>
                              <button
                                type="button"
                                onClick={() => alternarDiaConcluido(d)}
                                className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 hover:border-[#7dff1a]"
                              >
                                {concluido ? "✓ Concluído" : "Concluir"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: PLANO ALIMENTAR (3 BLOCOS DE 7 DIAS)
                   ============================================================ */}
                {aba === "alimentar" && plano && (
                  <section className="space-y-6">
                    <div className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#7dff1a]">
                        Nutrição Calculada · Com Science
                      </span>
                      <h2 className="mt-1 font-display text-2xl uppercase text-white sm:text-3xl">
                        O Teu Plano Alimentar de 21 Dias
                      </h2>
                      <p className="mt-2 text-sm text-white/75">
                        Dividido em 3 fases de 7 dias. Use também a{" "}
                        <Link href={rotas.prato} className="font-bold text-[#7dff1a] underline">
                          Calculadora do Prato
                        </Link>{" "}
                        para montar combinações equivalentes em segundos.
                      </p>

                      <div className="mt-6 space-y-5">
                        {plano.blocos.map((b) => (
                          <div
                            key={b.etapa.bloco}
                            className="rounded-xl border border-[#7dff1a]/30 bg-[#0b100e] p-5"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                              <div>
                                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7dff1a]">
                                  Semana {b.etapa.bloco} · {b.etapa.intervalo}
                                </span>
                                <h3 className="font-display text-2xl text-white">{b.titulo}</h3>
                              </div>
                              <span className="font-display text-2xl text-[#7dff1a]">
                                {b.etapa.alvoKcal} kcal / dia
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-white/5 p-3.5 text-center">
                              <div>
                                <span className="block text-[0.68rem] uppercase text-white/65">
                                  Proteína
                                </span>
                                <span className="font-display text-xl text-[#7dff1a]">
                                  {b.macros.proteina.g} g
                                </span>
                              </div>
                              <div>
                                <span className="block text-[0.68rem] uppercase text-white/65">
                                  Carboidrato
                                </span>
                                <span className="font-display text-xl text-white">
                                  {b.macros.carboidrato.g} g
                                </span>
                              </div>
                              <div>
                                <span className="block text-[0.68rem] uppercase text-white/65">
                                  Gordura
                                </span>
                                <span className="font-display text-xl text-white">
                                  {b.macros.gordura.g} g
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                              {b.refeicoes.map((ref) => (
                                <div
                                  key={ref.nome}
                                  className="rounded-lg border border-white/10 bg-[#111715] p-3.5 text-xs"
                                >
                                  <div className="flex items-center justify-between font-bold text-white">
                                    <span>{ref.nome}</span>
                                    <span className="text-[#7dff1a]">{ref.kcal} kcal</span>
                                  </div>
                                  <p className="mt-1.5 text-white/70">
                                    {ref.proteina}g Prot · {ref.carboidrato}g Carb · {ref.gordura}g Gord
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: TREINOS R21
                   ============================================================ */}
                {aba === "treinos" && plano && (
                  <section className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#7dff1a]">
                      Sinalização Mecânica · {plano.dias}× por semana
                    </span>
                    <h2 className="mt-1 font-display text-2xl uppercase text-white sm:text-3xl">
                      Plano de Treinos R21 ({plano.perfil.local === "casa" ? "Em Casa" : "Academia"})
                    </h2>

                    <div className="mt-6 space-y-6">
                      {blocoAtual?.treino.map((sessao) => (
                        <div
                          key={sessao.nome}
                          className="rounded-xl border border-[#7dff1a]/30 bg-[#0b100e] p-5"
                        >
                          <h3 className="font-display text-xl uppercase text-[#7dff1a]">
                            {sessao.nome}
                          </h3>
                          <ul className="mt-4 divide-y divide-white/10">
                            {sessao.itens.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm"
                              >
                                <div>
                                  <span className="font-semibold text-white">{item.exercicio}</span>
                                  {item.alternativa && (
                                    <span className="block text-xs text-white/60">
                                      Alternativa: {item.alternativa}
                                    </span>
                                  )}
                                </div>
                                <span className="rounded-md bg-[#7dff1a]/15 px-2.5 py-1 text-xs font-bold text-[#7dff1a]">
                                  {item.series} × {item.reps} · RIR {item.rir} · {item.descanso}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: RECEITAS PRÁTICAS & < 100 KCAL
                   ============================================================ */}
                {aba === "receitas" && (
                  <section className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#7dff1a]">
                      Saciedade & Controle de Doce
                    </span>
                    <h2 className="mt-1 font-display text-2xl uppercase text-white sm:text-3xl">
                      Receitas Práticas & Opções &lt; 100 kcal
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Use estas receitas para matar a vontade de doce ou lanchar sem furar o déficit.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {CATALOGO_RECEITAS.slice(0, 12).map((rec) => (
                        <div
                          key={rec.id}
                          className="rounded-xl border border-white/10 bg-[#0b100e] p-4 transition-all hover:border-[#7dff1a]/50"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-[#7dff1a]/15 px-2.5 py-0.5 text-[0.68rem] font-extrabold text-[#7dff1a]">
                              {rec.macros.kcal} kcal · {rec.macros.proteina}g Prot
                            </span>
                            <span className="text-xs text-white/60">⏱ {rec.minutos} min</span>
                          </div>
                          <h3 className="mt-2.5 font-display text-lg text-white">{rec.titulo}</h3>
                          <p className="mt-1 text-xs text-white/70">{rec.subtitulo}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: CALENDÁRIO 21D
                   ============================================================ */}
                {aba === "calendario" && (
                  <section className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                    <h2 className="font-display text-2xl uppercase text-white">
                      Calendário de Execução · 21 Dias
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Toque em qualquer dia para abrir as missões ou marcar como concluído.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-7">
                      {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
                        const concluido = diario.diasConcluidos.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              if (!escolherDia(d)) return;
                              setAba("inicio");
                            }}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                              concluido
                                ? "border-[#7dff1a] bg-[#7dff1a]/20 text-[#7dff1a]"
                                : "border-white/12 bg-[#0b100e] text-white hover:border-[#7dff1a]/50"
                            }`}
                          >
                            <span className="text-[0.65rem] uppercase opacity-75">Dia</span>
                            <span className="font-display text-2xl">
                              {String(d).padStart(2, "0")}
                            </span>
                            <span className="mt-1 text-[0.65rem] font-bold">
                              {concluido ? "✓ Feito" : "Abrir"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: DIÁRIO DE PROGRESSO
                   ============================================================ */}
                {aba === "diario" && (
                  <section className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                    <h2 className="font-display text-2xl uppercase text-white">
                      Diário de Progresso (Aferições)
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Registre seu peso em jejum e sua circunferência de cintura nos Dias 1, 7, 14 e 21.
                    </p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/12 bg-[#0b100e] p-5">
                        <label htmlFor="diario-peso" className="block text-xs font-bold uppercase tracking-wider text-[#7dff1a]">
                          Peso Atual em Jejum (kg)
                        </label>
                        <input
                          id="diario-peso"
                          type="number"
                          step="0.1"
                          placeholder={String(perfil.peso)}
                          value={diario.pesoAtual}
                          onChange={(e) =>
                            salvarDiario((atual) => ({ ...atual, pesoAtual: e.target.value }))
                          }
                          className="mt-2 w-full rounded-lg border border-white/20 bg-[#111715] px-4 py-3 text-lg font-bold text-white focus:border-[#7dff1a] focus:outline-none"
                        />
                      </div>

                      <div className="rounded-xl border border-white/12 bg-[#0b100e] p-5">
                        <label htmlFor="diario-cintura" className="block text-xs font-bold uppercase tracking-wider text-[#7dff1a]">
                          Circunferência da Cintura (cm)
                        </label>
                        <input
                          id="diario-cintura"
                          type="number"
                          step="0.5"
                          placeholder="86"
                          value={diario.cinturaAtual}
                          onChange={(e) =>
                            salvarDiario((atual) => ({ ...atual, cinturaAtual: e.target.value }))
                          }
                          className="mt-2 w-full rounded-lg border border-white/20 bg-[#111715] px-4 py-3 text-lg font-bold text-white focus:border-[#7dff1a] focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: MATERIAIS DE APOIO (PDFS)
                   ============================================================ */}
                {aba === "materiais" && (
                  <section className="rounded-2xl border border-white/12 bg-[#111715] p-6">
                    <h2 className="font-display text-2xl uppercase text-white">
                      Materiais de Apoio & Protocolos em PDF
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Baixe os manuais práticos para consultar offline sempre que precisar.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {protocolos.map((p) => (
                        <div
                          key={p.codigo}
                          className="flex flex-col justify-between rounded-xl border border-white/12 bg-[#0b100e] p-5"
                        >
                          <div>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#7dff1a]">
                              Protocolo {p.codigo}
                            </span>
                            <h3 className="mt-2 font-display text-xl text-white">{p.titulo}</h3>
                            <p className="mt-2 text-xs leading-relaxed text-white/75">
                              {p.resumo}
                            </p>
                          </div>
                          <div className="mt-5 pt-3 border-t border-white/10">
                            {p.pronto && !modoDemo ? (
                              <a
                                href={`/api/protocolos/${p.arquivo}`}
                                target="_blank"
                                rel="noopener"
                                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7dff1a] hover:underline"
                              >
                                📄 Baixar PDF →
                              </a>
                            ) : (
                              <span className="text-xs font-semibold text-[#7dff1a]">
                                ✓ Disponível na sua conta ativa
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ============================================================
                   ABA: COMUNIDADE R21 & PRÓXIMOS 30 DIAS (UPSELL CONSULTORIA)
                   ============================================================ */}
                {aba === "comunidade" && (
                  <section className="space-y-6">
                    <div className="rounded-2xl border-2 border-[#7dff1a]/60 bg-[#0d1610] p-6 sm:p-8">
                      <span className="rounded-full bg-[#7dff1a] px-3 py-1 text-xs font-extrabold uppercase text-[#041208]">
                        Próximo Nível · Acompanhamento 1 a 1
                      </span>
                      <h2 className="mt-4 font-display text-3xl uppercase text-white">
                        Próximos 30 a 90 Dias: Consultoria Individual com Carlos Seiti
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                        O Reset 21D destrava o seu metabolismo. Se você quer que eu assuma pessoalmente
                        o ajuste quinzenal da sua dieta, exames e periodização de treino com suporte
                        direto no WhatsApp, aplique para uma vaga na Consultoria Individual.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-4">
                        <a
                          href={`${rotas.consultoria}?de=plataforma-r21`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#7dff1a] px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#041208] shadow-[0_0_25px_rgba(125,255,26,0.45)]"
                        >
                          Aplicar para a Consultoria Individual →
                        </a>
                        <a
                          href={marca.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-[#7dff1a]/50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7dff1a]"
                        >
                          💬 Falar com Suporte / Comunidade no WhatsApp
                        </a>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* ============================================================
                 COLUNA DIREITA (PROGRESSO, CALENDÁRIO 21D, PRÓXIMA AÇÃO, RESULTADOS)
                 ============================================================ */}
              <aside className="space-y-5">
                {/* 1. O teu progresso */}
                <div className="rounded-2xl border border-white/12 bg-[#111715] p-5">
                  <h2 className="font-display text-lg uppercase text-white">O teu progresso</h2>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-4xl text-[#7dff1a]">
                      {percentualConcluido}%
                    </span>
                    <span className="text-xs text-white/70">
                      {diario.diasConcluidos.length} de 21 dias concluídos
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#7dff1a] to-[#39ff14] shadow-[0_0_14px_#7dff1a] transition-all duration-500"
                      style={{ width: `${percentualConcluido}%` }}
                    />
                  </div>
                </div>

                {/* 2. Calendário do Desafio (01 a 21) */}
                <div className="rounded-2xl border border-white/12 bg-[#111715] p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg uppercase text-white">
                      Calendário do Desafio
                    </h2>
                    <span className="text-[0.68rem] text-white/60">Toque no dia</span>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
                      const concluido = diario.diasConcluidos.includes(d);
                      const selecionado = d === diaAtivo;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            if (!escolherDia(d)) return;
                            setAba("inicio");
                          }}
                          aria-label={`Dia ${d}`}
                          className={`flex size-9 cursor-pointer flex-col items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                            concluido
                              ? "bg-[#7dff1a] text-[#041208] shadow-[0_0_12px_rgba(125,255,26,0.5)]"
                              : selecionado
                              ? "border-2 border-[#7dff1a] bg-white/10 text-white"
                              : "border border-white/15 bg-white/5 text-white/75 hover:border-[#7dff1a]/60"
                          }`}
                        >
                          <span>{String(d).padStart(2, "0")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Próxima Ação */}
                <div className="rounded-2xl border border-white/12 bg-[#111715] p-5">
                  <h2 className="font-display text-lg uppercase text-white">Próxima Ação</h2>
                  <button
                    type="button"
                    onClick={() => setAba("treinos")}
                    className="mt-3 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#7dff1a]/55 bg-[#0b120e] p-3.5 text-left transition-all hover:border-[#7dff1a] hover:shadow-[0_0_20px_rgba(125,255,26,0.2)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-[#7dff1a]/15 text-lg text-[#7dff1a]">
                        🏋️
                      </span>
                      <div>
                        <span className="block text-xs font-extrabold text-white">
                          {aulaHoje.treinoDia}
                        </span>
                        <span className="block text-[0.68rem] text-white/65">
                          Duração: 20–30 min
                        </span>
                      </div>
                    </div>
                    <span className="text-[#7dff1a]">›</span>
                  </button>
                </div>

                {/* 4. Os teus resultados */}
                <div className="rounded-2xl border border-white/12 bg-[#111715] p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg uppercase text-white">
                      Os teus resultados
                    </h2>
                    <button
                      type="button"
                      onClick={() => setAba("diario")}
                      className="cursor-pointer text-[0.68rem] font-bold uppercase text-[#7dff1a] hover:underline"
                    >
                      Editar
                    </button>
                  </div>

                  <ul className="mt-3 divide-y divide-white/10 text-xs">
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-white/75">⚖️ Peso (opcional)</span>
                      <button
                        type="button"
                        onClick={() => setAba("diario")}
                        className="cursor-pointer font-bold text-white hover:text-[#7dff1a]"
                      >
                        {diario.pesoAtual ? `${diario.pesoAtual} kg` : `${perfil.peso} kg`} ›
                      </button>
                    </li>
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-white/75">📏 Cintura</span>
                      <button
                        type="button"
                        onClick={() => setAba("diario")}
                        className="cursor-pointer font-bold text-white hover:text-[#7dff1a]"
                      >
                        {diario.cinturaAtual ? `${diario.cinturaAtual} cm` : "-- cm"} ›
                      </button>
                    </li>
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-white/75">📊 Dias concluídos</span>
                      <span className="font-bold text-[#7dff1a]">
                        {diario.diasConcluidos.length} / 21
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-white/75">✅ Adesão alimentar</span>
                      <span className="font-bold text-[#7dff1a]">
                        {Math.min(100, Math.max(75, percentualConcluido + 60))}%
                      </span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Modal da Aula do Dia */}
      {modalAulaAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={aulaHoje.tituloAula}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-2xl border-2 border-[#7dff1a] bg-[#0d1410] p-6 shadow-[0_0_60px_rgba(125,255,26,0.3)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#7dff1a]">
                Dia {String(aulaHoje.dia).padStart(2, "0")} · {aulaHoje.semana}
              </span>
              <button
                type="button"
                onClick={() => setModalAulaAberto(false)}
                className="cursor-pointer rounded-full border border-white/20 px-2.5 py-1 text-xs text-white hover:border-[#7dff1a]"
              >
                ✕ Fechar
              </button>
            </div>

            <h3 className="mt-4 font-display text-2xl text-white">{aulaHoje.tituloAula}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{aulaHoje.resumoAula}</p>

            <div className="mt-5 rounded-xl border border-[#7dff1a]/30 bg-black/50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#7dff1a]">
                Diretrizes práticas para hoje:
              </p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-white/90">
                {aulaHoje.pontosChave.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="font-bold text-[#7dff1a]">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  alternarDiaConcluido(aulaHoje.dia);
                  setModalAulaAberto(false);
                }}
                className="cursor-pointer rounded-lg bg-[#7dff1a] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#041208]"
              >
                ✓ Marcar Aula & Dia Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
