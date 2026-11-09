import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Comprar } from "@/components/Comprar";
import { Footer } from "@/components/Footer";
import { GaleriaTransformacoes } from "@/components/GaleriaTransformacoes";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Programa } from "@/components/Programa";
import { PrecoDinamico, SeletorMoeda } from "@/components/SeletorMoeda";
import { Arrow, Container, Eyebrow, Section } from "@/components/ui";
import { credenciais, marca, resultados, rotas, sobre } from "@/lib/content";
import { moedaPorPais, precoEmReais, type Moeda } from "@/lib/produto";
import { listarFigurasDeShape } from "@/lib/programa-figuras";

const titulo =
  "Reset Metabólico 21 Dias — Desinche, controle a fome e destrave a queima de gordura com ciência";

export const metadata: Metadata = {
  title: titulo,
  description:
    "O protocolo científico de 21 dias dividido em 3 semanas para desinflamar, estabilizar a glicemia e acelerar a perda de gordura sem cortar carboidratos. Simule seu plano em 7 passos.",
  alternates: { canonical: rotas.programa },
  openGraph: {
    type: "website",
    url: `${marca.site}${rotas.programa}`,
    title: `Reset Metabólico 21 Dias | ${marca.nome}`,
    description:
      "3 semanas estruturadas pela Ciência de Alimentos para tirar o seu metabolismo da inércia — calculado para o seu corpo.",
    images: [
      {
        url: "/brand/reset-metabolico-21d.jpg",
        width: 1024,
        height: 512,
        alt: `Reset Metabólico 21D — Emagrecimento com Método | ${marca.nome}`,
      },
    ],
  },
};

const SEMANAS_RESET = [
  {
    semana: "Semana 01",
    dias: "Dias 1 a 7",
    titulo: "Descompressão Glicêmica & Desinchaço",
    subtitulo: "O corte imediato da retenção hídrica e dos picos de fome noturna",
    mecanismo:
      "Ajustamos a distribuição de proteínas por refeição, a densidade de fibras e a cinética dos carboidratos. Em 5 a 7 dias a insulina basal estabiliza, o volume abdominal cede visivelmente e aquela vontade descontrolada por doce à noite desaparece.",
    entregavel:
      "Meta do Dia 7: Redução de 1 a 2,5 kg (água intracelular/glicogênio + início da lipólise) e fome sob controle.",
    progresso: "33%",
  },
  {
    semana: "Semana 02",
    dias: "Dias 8 a 14",
    titulo: "Oxidação Lipídica & Sinal Mecânico",
    subtitulo: "Queima real de gordura preservando 100% da sua massa magra",
    mecanismo:
      "Com a glicemia estável e sem fome de rebote, o déficit calórico calculado sobre a sua Taxa Metabólica Basal obriga o corpo a oxidar tecido adiposo. O treino calibrado por Repetições em Reserva (RIR) sinaliza ao corpo que o músculo não pode ser gasto.",
    entregavel:
      "Meta do Dia 14: Redução visível na linha de cintura, roupas folgando e progressão de carga no treino.",
    progresso: "66%",
  },
  {
    semana: "Semana 03",
    dias: "Dias 15 a 21",
    titulo: "Blindagem Metabólica & Mapa do Dia 22",
    subtitulo: "Recalibração sobre o peso novo para evitar o efeito platô",
    mecanismo:
      "Na terceira semana recalculamos os macros para o seu novo peso corporal, evitando a termogênese adaptativa precoce. Você encerra o ciclo com autonomia alimentar e recebe a rota exata de transição para o Dia 22 em diante.",
    entregavel:
      "Meta do Dia 21: Fotos comparativas (Dia 1 vs. Dia 21), cintura aferida e plano de continuidade pronto.",
    progresso: "100%",
  },
] as const;

const SINTOMAS = [
  {
    numero: "01",
    titulo: "Acorda bem, mas termina o dia estufado",
    texto:
      "Má combinação de volume alimentar, baixa ingestão estratégica de água/fibras e picos glicêmicos que geram retenção e distensão abdominal todos os dias.",
  },
  {
    numero: "02",
    titulo: "Perde o controle da fome no fim da tarde",
    texto:
      "Não é falta de força de vontade: é erro na cinética proteica do almoço e do lanche. Quando a glicemia despenca às 18h, o cérebro exige caloria rápida.",
  },
  {
    numero: "03",
    titulo: "Treina há meses e vê sempre o mesmo corpo",
    texto:
      "Treinar sem controle de volume e longe da proximidade correta da falha (RIR), somado a calorias no chute, mantém você cansado e exatamente no mesmo lugar.",
  },
  {
    numero: "04",
    titulo: "Já fez dietas restritivas e recuperou tudo",
    texto:
      "Cortar arroz, pão e frutas derruba a leptina, destrói massa magra e garante a compulsão na segunda semana. O Reset usa comida brasileira de verdade.",
  },
] as const;

const ENTREGAVEIS = [
  {
    codigo: "MÓDULO 01 · PRESCRIÇÃO",
    titulo: "Plano Individual Calculado para as 3 Semanas",
    descricao:
      "Suas calorias exatas, gramas de proteína, carboidrato e gordura por dia e por refeição, recalculadas a cada bloco de 7 dias conforme o peso desce.",
    destaque: "Personalizado no simulador",
  },
  {
    codigo: "MÓDULO 02 · NUTRIÇÃO (PDF)",
    titulo: "Protocolo de Nutrição em Comida Real",
    descricao:
      "Como converter suas metas calóricas em comida de verdade (arroz, feijão, carnes, ovos, pão, frutas) — no restaurante ou em casa, sem depender de balança.",
    destaque: "Tabela de substituições inclusa",
  },
  {
    codigo: "MÓDULO 03 · TREINO (PDF)",
    titulo: "Periodização de Treino: Casa ou Academia",
    descricao:
      "Sua semana completa exercício por exercício, ajustada ao seu nível (iniciante, retornando ou avançado) e aos dias que você realmente tem disponíveis.",
    destaque: "Com alternativas de exercícios",
  },
  {
    codigo: "MÓDULO 04 · EXECUÇÃO (PDF)",
    titulo: "Guia dos Primeiros 7 Dias + Protocolo de Aferição",
    descricao:
      "O passo a passo diário da primeira semana para cortar o inchaço logo na largada e o manual de como medir cintura, peso e fotos sem distorção.",
    destaque: "Checklist de execução diária",
  },
] as const;

const PERGUNTAS_RESET = [
  {
    p: "Por que 21 dias funciona sem ser mais uma 'dieta milagrosa'?",
    r: "Porque não prometemos mudar a sua vida inteira em 3 semanas, e sim executar uma intervenção fisiológica precisa: 7 dias para estabilizar glicemia e cortar retenção hídrica, 7 dias para acelerar a oxidação de gordura com proteção muscular e 7 dias para consolidar o ritmo e entregar o mapa do Dia 22.",
  },
  {
    p: "Vou precisar cortar carboidratos, arroz ou pão?",
    r: "De forma alguma. Cortar carboidratos a zero só esvazia glicogênio e água muscular, derrubando seu rendimento no treino e gerando rebote. O Reset Metabólico controla a carga glicêmica combinando carboidratos com proteínas e fibras na proporção certa.",
  },
  {
    p: "Serve para quem treina em casa ou nunca fez academia?",
    r: "Sim. No simulador você escolhe se vai treinar em casa (com o peso do corpo e uma cadeira) ou na academia, além do seu nível atual. O programa monta o volume exato para a sua realidade.",
  },
  {
    p: "Como recebo o acesso após o pagamento?",
    r: "O pagamento é processado em ambiente seguro (Pix/Cartão no Brasil ou Cartão/MB Way em Portugal e Europa). Assim que confirmado, você acessa sua plataforma CS Performance no site com o seu e-mail para abrir seu calendário de 21 dias, missões diárias, receitas e protocolos em PDF.",
  },
  {
    p: "E se eu achar que o programa não é para mim?",
    r: "Você tem 7 dias de garantia incondicional. Pode entrar, ver toda a prescrição, baixar os PDFs e aplicar a primeira semana inteira. Se não ficar satisfeito por qualquer motivo, basta solicitar o reembolso e devolvemos 100% do seu dinheiro.",
  },
] as const;

const btnNeon =
  "group inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#00ff66] px-7 py-4 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-[#041208] shadow-[0_0_35px_rgba(0,255,102,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4be283] hover:shadow-[0_0_50px_rgba(0,255,102,0.7)] whitespace-nowrap";

const btnOutlineNeon =
  "group inline-flex items-center justify-center gap-2.5 rounded-lg border border-[#00ff66]/55 bg-[#00ff66]/10 px-7 py-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#00ff66] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00ff66] hover:bg-[#00ff66]/20 whitespace-nowrap";

/**
 * Hero de vendas de alto impacto visual com estética Verde Neon — aparece
 * antes de o usuário avançar para o passo 2 do simulador.
 */
function Abertura({ moedaServidor }: { moedaServidor?: Moeda }) {
  return (
    <section className="relative overflow-hidden bg-porcelana pb-12 pt-24 sm:pb-16 sm:pt-32">
      <div
        aria-hidden
        className="diagonals pointer-events-none absolute -right-24 top-10 size-[34rem] opacity-45 [mask-image:radial-gradient(circle,black,transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 size-[28rem] rounded-full bg-[#00ff66]/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-32 size-[24rem] rounded-full bg-[#00ff66]/10 blur-[120px]"
      />

      <Container className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <nav aria-label="Você está em">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-grafite/75">
              <li>
                <Link href="/" className="transition-colors hover:text-[#00ff66]">
                  Início
                </Link>
              </li>
              <li aria-hidden>·</li>
              <li aria-current="page" className="font-semibold text-[#00ff66]">
                Reset Metabólico 21 Dias
              </li>
            </ol>
          </nav>

          {/* Seletor de Moeda Automático por Região / VPN */}
          <SeletorMoeda moedaServidor={moedaServidor} />
        </div>

        <div className="mt-7 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* Coluna Esquerda: Logo Oficial 21D + Promessa + Bullets + CTAs */}
          <div className="rise">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#39ff14]/55 bg-[#39ff14]/12 px-4 py-1.5 shadow-[0_0_25px_rgba(57,255,20,0.22)]">
              <span aria-hidden className="pulso size-2.5 rounded-full bg-[#39ff14] shadow-[0_0_12px_#39ff14]" />
              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#39ff14]">
                Emagrecimento com Método · Com Science
              </span>
            </div>

            {/* Emblema Oficial Reset Metabólico 21D */}
            <div className="relative mt-6 max-w-xl overflow-hidden rounded-2xl border border-[#39ff14]/40 bg-[#030b05] p-2 shadow-[0_0_55px_rgba(57,255,20,0.22)]">
              <Image
                src="/brand/reset-metabolico-21d.jpg"
                alt="Reset Metabólico 21D — Emagrecimento com Método"
                width={1024}
                height={512}
                priority
                sizes="(max-width: 1024px) 95vw, 560px"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>

            <h1 className="mt-6 font-display text-3xl uppercase leading-tight text-balance text-grafite sm:text-5xl">
              Destrave seu metabolismo em{" "}
              <span className="text-[#39ff14] drop-shadow-[0_0_24px_rgba(57,255,20,0.4)]">
                21 Dias.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-grafite sm:text-lg">
              Desinche o abdômen na{" "}
              <strong className="font-semibold text-[#39ff14]">Semana 1</strong>, acelere a
              queima real de gordura na{" "}
              <strong className="font-semibold text-[#39ff14]">Semana 2</strong> e elimine a
              fome de rebote na{" "}
              <strong className="font-semibold text-[#39ff14]">Semana 3</strong> — com calorias,
              macros e treinos calculados para a sua biologia.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                "⚡ Sem cortar carboidratos",
                "🍽️ Comida real (BR & PT)",
                "🏋️ Treino em Casa ou Academia",
                "💻 Plataforma Interativa + PDFs",
              ].map((selo) => (
                <span
                  key={selo}
                  className="rounded-md border border-[#00ff66]/30 bg-[#0d1410] px-3 py-1.5 text-xs font-medium text-grafite"
                >
                  {selo}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#simulador" className={btnNeon}>
                Simular meu plano de 21 dias
                <span aria-hidden>↓</span>
              </a>
              <a href="#oferta-direta" className={btnOutlineNeon}>
                Garantir acesso direto · <PrecoDinamico moedaServidor={moedaServidor} />
                <Arrow />
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-grafite/75">
              <span aria-hidden className="text-[#00ff66]">★</span>
              Desenvolvido por <strong className="font-medium text-grafite">Carlos Seiti</strong> —
              2× Mestre e Doutorando em Ciência de Alimentos.
            </p>
          </div>

          {/* Coluna Direita: Painel Visual "Cronograma Fisiológico 21 Dias" */}
          <div className="rise relative overflow-hidden rounded-2xl border-2 border-[#00ff66]/55 bg-[#0c140f] shadow-[0_0_65px_rgba(0,255,102,0.16)]">
            <div className="h-1.5 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-4">
                <div>
                  <p className="t-eyebrow text-[#00ff66]">Arquitetura da Intervenção</p>
                  <p className="mt-1 font-display text-2xl text-grafite">
                    O que muda em 3 semanas
                  </p>
                </div>
                <span className="rounded-lg border border-[#00ff66]/50 bg-[#00ff66]/15 px-3.5 py-1.5 text-right shadow-[0_0_20px_rgba(0,255,102,0.2)]">
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-grafite/80">
                    Acesso Único
                  </span>
                  <span className="font-display text-xl text-[#00ff66]">
                    <PrecoDinamico moedaServidor={moedaServidor} />
                  </span>
                </span>
              </div>

              <ol className="mt-5 space-y-3.5">
                {SEMANAS_RESET.map((s, idx) => (
                  <li
                    key={s.semana}
                    className="rounded-xl border border-[#00ff66]/25 bg-[#0b0a09]/85 p-4 transition-all hover:border-[#00ff66]/70"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#00ff66]">
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#00ff66] text-[0.68rem] font-extrabold text-[#041208]">
                          {idx + 1}
                        </span>
                        {s.semana} · {s.dias}
                      </span>
                      <span className="rounded-full bg-[#00ff66]/15 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-[#00ff66]">
                        Fase {idx + 1}/3
                      </span>
                    </div>
                    <p className="mt-2 font-display text-lg text-grafite">{s.titulo}</p>
                    <p className="mt-1 text-xs leading-relaxed text-grafite/75">{s.subtitulo}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-[#00ff66]/30 bg-[#0b0a09] p-3.5 text-center">
                <div>
                  <p className="font-display text-xl text-[#00ff66]">21 Dias</p>
                  <p className="text-[0.68rem] text-grafite/75">3 blocos de 7 dias</p>
                </div>
                <div className="border-x border-white/12">
                  <p className="font-display text-xl text-grafite">100%</p>
                  <p className="text-[0.68rem] text-grafite/75">Calculado p/ você</p>
                </div>
                <div>
                  <p className="font-display text-xl text-[#00ff66]">7 Dias</p>
                  <p className="text-[0.68rem] text-grafite/75">Garantia blindada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Todas as seções persuasivas e visuais da página de vendas do Reset Metabólico 21 Dias.
 */
function PaginaDeVendas({
  vendaAberta,
  moedaServidor,
}: {
  vendaAberta: boolean;
  moedaServidor?: Moeda;
}) {
  return (
    <>
      {/* ============================================================
         1. DIAGNÓSTSTICO DE SINTOMAS — PARA QUEM É O RESET
         ============================================================ */}
      <Section tone="porcelana" denso className="border-t border-linha">
        <div className="max-w-2xl">
          <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
            <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
            Por que o seu corpo estagnou
          </p>
          <h2 className="t-title mt-5 text-balance">
            O problema não é a sua genética. É tentar emagrecer no escuro.
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-grafite/80">
            Se você se reconhece em pelo menos um dos quatro sinais abaixo, o seu metabolismo
            não precisa de mais restrição — precisa de um{" "}
            <strong className="text-[#00ff66]">Reset estruturado de 21 dias</strong>.
          </p>
        </div>

        <div className="stagger mt-12 grid gap-5 sm:grid-cols-2">
          {SINTOMAS.map((item) => (
            <div
              key={item.numero}
              className="surface-card group relative overflow-hidden rounded-xl border border-linha p-6 transition-all duration-300 hover:border-[#00ff66]/60 hover:shadow-[0_0_35px_rgba(0,255,102,0.1)] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-[#00ff66]">{item.numero}</span>
                <span className="rounded-full border border-[#00ff66]/40 bg-[#00ff66]/10 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-[#00ff66]">
                  Sinal de Alerta
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-grafite">{item.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-grafite/80">{item.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================
         2. CRONOGRAMA CIENTÍFICO — AS 3 SEMANAS DO RESET
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
              <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
              Ciência de Alimentos Aplicada
            </p>
            <h2 className="t-title mt-5 text-balance">
              Por que 21 dias é a janela exata para destravar o metabolismo.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-grafite/75">
            Esqueça os desafios de internet baseados em passar fome. Aqui cada bloco de 7 dias
            atua em um mecanismo fisiológico real do seu corpo.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {SEMANAS_RESET.map((fase, i) => (
            <article
              key={fase.semana}
              className="surface-elevated relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#00ff66]/30 bg-porcelana p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#00ff66] hover:shadow-[0_0_40px_rgba(0,255,102,0.14)]"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="t-eyebrow text-[#00ff66]">
                    {fase.semana} · {fase.dias}
                  </span>
                  <span className="font-display text-3xl text-[#00ff66]/45">0{i + 1}</span>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-branco">
                  <div
                    className="h-full bg-linear-to-r from-[#00ff66] to-[#4be283] shadow-[0_0_12px_#00ff66]"
                    style={{ width: fase.progresso }}
                  />
                </div>

                <h3 className="mt-6 font-display text-2xl text-grafite">{fase.titulo}</h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#00ff66]">
                  {fase.subtitulo}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-grafite/80">{fase.mecanismo}</p>
              </div>

              <div className="mt-7 rounded-lg border border-[#00ff66]/35 bg-[#00ff66]/10 p-4">
                <p className="text-xs leading-relaxed text-grafite">
                  <strong className="block font-extrabold uppercase tracking-wider text-[#00ff66]">
                    Resultado esperado na sexta-feira:
                  </strong>
                  <span className="mt-1 block">{fase.entregavel}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ============================================================
         3. POR DENTRO DA PLATAFORMA INTERATIVA CS PERFORMANCE 21D
         ============================================================ */}
      <Section tone="porcelana" denso className="border-t border-linha">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
              <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
              Por Dentro da Plataforma CS Performance
            </p>
            <h2 className="t-title mt-5 text-balance">
              Você não recebe um PDF solto. Você entra num painel de execução de 21 dias.
            </h2>
            <p className="mt-4 leading-relaxed text-grafite/80">
              Assim que o seu pagamento é confirmado, o seu acesso abre o painel interativo{" "}
              <strong className="text-[#00ff66]">CS Performance · Reset Metabólico 21D</strong> direto no
              navegador do seu telemóvel ou computador:
            </p>

            <ul className="mt-6 space-y-3.5 text-sm text-grafite">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-xs font-extrabold text-[#041208]">
                  ✓
                </span>
                <span>
                  <strong>Missões diárias interativas (Dia 01 a Dia 21):</strong> marque cada tarefa
                  concluída e acompanhe sua barra de progresso subir em tempo real.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-xs font-extrabold text-[#041208]">
                  ✓
                </span>
                <span>
                  <strong>Aulas rápidas do dia (3 min):</strong> orientação direta e sem enrolação para
                  blindar a mente e a disciplina.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-xs font-extrabold text-[#041208]">
                  ✓
                </span>
                <span>
                  <strong>20 Receitas Práticas & Snacks &lt; 100 kcal:</strong> opções doces e salgadas
                  de alto volume proteico para matar a vontade de doce sem sair do plano.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-xs font-extrabold text-[#041208]">
                  ✓
                </span>
                <span>
                  <strong>Diário de Progresso integrado:</strong> registe peso, linha de cintura,
                  treinos concluídos e adesão alimentar.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`${rotas.programa}/area?demo=1`} className={btnNeon}>
                Testar a plataforma por dentro agora →
              </Link>
              <a href="#oferta-direta" className={btnOutlineNeon}>
                Garantir meu acesso · <PrecoDinamico moedaServidor={moedaServidor} />
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-[#00ff66]/55 bg-[#070b09] p-2.5 shadow-[0_0_70px_rgba(0,255,102,0.2)]">
            <Image
              src="/brand/plataforma-reset-21d.jpg"
              alt="Painel de membros CS Performance — Reset Metabólico 21D com calendário, missões diárias, plano alimentar e receitas"
              width={935}
              height={1024}
              sizes="(max-width: 1024px) 95vw, 540px"
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </Section>

      {/* ============================================================
         4. COMPARATIVO VISUAL — DESAFIOS COMUNS VS. RESET METABÓLICO CS
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
              <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
              A Diferença de Método
            </p>
          </div>
          <h2 className="t-title mt-5 text-balance">
            Por que os &ldquo;desafios de 21 dias&rdquo; comuns falham — e por que este funciona.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Coluna Negativa */}
          <div className="rounded-xl border border-linha bg-porcelana/70 p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-grafite/60">
              ❌ O que o mercado vende
            </p>
            <h3 className="mt-3 font-display text-2xl text-grafite/80">
              Dietas Detox & Cardápios Genéricos de Gaveta
            </h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-grafite/75">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-bold text-grafite/50">✕</span>
                <span>Mesma dieta de 1.200 kcal para uma mulher de 55 kg e um homem de 95 kg.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-bold text-grafite/50">✕</span>
                <span>Corta carboidratos a zero: você perde apenas água e massa muscular na primeira semana.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-bold text-grafite/50">✕</span>
                <span>Ingredientes caros e irreais que ninguém sustenta numa rotina de trabalho.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-bold text-grafite/50">✕</span>
                <span>No dia 22 você volta a comer normal e recupera o dobro do peso (efeito sanfona).</span>
              </li>
            </ul>
          </div>

          {/* Coluna Positiva em Verde Neon */}
          <div className="relative overflow-hidden rounded-xl border-2 border-[#00ff66]/65 bg-[#0c140f] p-7 shadow-[0_0_50px_rgba(0,255,102,0.14)] sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#00ff66]">
              ✓ Engenharia Alimentar Aplicada
            </p>
            <h3 className="mt-3 font-display text-2xl text-grafite">
              Reset Metabólico 21 Dias · Carlos Seiti
            </h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-grafite">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-extrabold text-[#00ff66]">✓</span>
                <span>
                  <strong>Calculado para o seu peso, altura, idade e rotina:</strong> déficit seguro que preserva seu metabolismo basal.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-extrabold text-[#00ff66]">✓</span>
                <span>
                  <strong>Cinética de nutrientes:</strong> proteína e fibras calibradas para desligar a fome noturna sem cortar arroz, pão ou fruta.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-extrabold text-[#00ff66]">✓</span>
                <span>
                  <strong>Treino integrado (Casa ou Academia):</strong> sinalização mecânica exata para obrigar o corpo a queimar gordura, não músculo.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 font-extrabold text-[#00ff66]">✓</span>
                <span>
                  <strong>Protocolo do Dia 22 incluso:</strong> você aprende exatamente como transicionar para manutenção ou continuar secando.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ============================================================
         5. O QUE VOCÊ RECEBE — VITRINE DE ENTREGÁVEIS
         ============================================================ */}
      <Section tone="porcelana" denso className="border-t border-linha">
        <div className="max-w-2xl">
          <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
            <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
            Acesso Imediato na Área de Membros
          </p>
          <h2 className="t-title mt-5 text-balance">
            Tudo o que você recebe ao destravar o seu Reset hoje.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-grafite/80">
            Nada de aulas intermináveis que você nunca assiste. Você recebe o seu painel interativo
            de 21 dias e os protocolos diretos em PDF para abrir no telemóvel na hora de comer e treinar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {ENTREGAVEIS.map((item) => (
            <div
              key={item.codigo}
              className="surface-card flex flex-col justify-between rounded-xl border border-linha p-7 transition-all duration-300 hover:border-[#00ff66]/55 hover:shadow-[0_0_35px_rgba(0,255,102,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="t-eyebrow text-[#00ff66]">{item.codigo}</span>
                  <span className="rounded-full border border-[#00ff66]/35 bg-[#00ff66]/12 px-3 py-1 text-[0.68rem] font-bold text-[#00ff66]">
                    {item.destaque}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl text-grafite">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grafite/80">{item.descricao}</p>
              </div>
              <div className="mt-6 border-t border-linha pt-4 text-xs font-bold text-[#00ff66]">
                ✓ Incluso no seu acesso de <PrecoDinamico moedaServidor={moedaServidor} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================
         6. PROVA SOCIAL + AUTORIDADE CIENTÍFICA CARLOS SEITI
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
              <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
              Resultados Reais da Metodologia
            </p>
            <h2 className="t-title mt-5 text-balance">
              Quem aplica direção científica muda o corpo de verdade.
            </h2>
          </div>
          <Link
            href={marca.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2.5 border-b border-[#00ff66]/50 pb-1.5 text-sm font-semibold text-[#00ff66] transition-colors hover:border-[#00ff66]"
          >
            {resultados.cta}
            <Arrow />
          </Link>
        </div>

        <GaleriaTransformacoes variante="neon" />

        {/* Bloco de Autoridade Carlos Seiti */}
        <div className="mt-16 rounded-2xl border border-[#00ff66]/30 bg-porcelana p-7 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
            <div className="relative mx-auto w-56 overflow-hidden rounded-xl border border-[#00ff66]/40 lg:mx-0 lg:w-full">
              <Image
                src="/sobre/carlos-seiti.png"
                alt="Carlos Seiti — Engenheiro Alimentar, Mestre e Doutorando em Ciência de Alimentos"
                width={1087}
                height={1448}
                sizes="(max-width: 1024px) 14rem, 16rem"
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                <p className="font-display text-lg text-[#f2ede5]">{marca.nome}</p>
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[#00ff66]">
                  MSc · PhD Cand. Ciência de Alimentos
                </p>
              </div>
            </div>

            <div>
              <Eyebrow>Quem criou o protocolo</Eyebrow>
              <h3 className="t-title mt-4 text-balance">
                Ciência de laboratório traduzida para o seu prato.
              </h3>
              <p className="mt-5 leading-relaxed text-grafite/85">{sobre.paragrafos[0]}</p>
              <p className="mt-4 leading-relaxed text-grafite/80">{sobre.paragrafos[1]}</p>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-linha pt-6 sm:grid-cols-4">
                {credenciais.map((c) => (
                  <div key={c.rotulo}>
                    <dt className="font-display text-3xl text-[#00ff66]">{c.valor}</dt>
                    <dd className="mt-1 text-xs text-grafite/75">{c.rotulo}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================
         7. OFERTA DIRETA + STACK DE VALOR + GARANTIA DE 7 DIAS (VERDE NEON)
         ============================================================ */}
      <Section id="oferta-direta" tone="porcelana" denso className="relative overflow-hidden border-t border-linha">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ff66]/10 blur-[150px]"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border-2 border-[#00ff66]/70 bg-[#0c140f] text-grafite shadow-[0_0_80px_rgba(0,255,102,0.22)]">
            <div className="h-2 bg-linear-to-r from-[#00ff66] via-[#4be283] to-ouro" />

            <div className="p-7 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff66]/50 bg-[#00ff66]/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00ff66]">
                  <span aria-hidden className="pulso size-2 rounded-full bg-[#00ff66]" />
                  Inscrição Aberta · Acesso Vitalício à Plataforma
                </span>
                <SeletorMoeda moedaServidor={moedaServidor} />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-md overflow-hidden rounded-xl border border-[#39ff14]/35 bg-[#030b05] p-1.5 shadow-[0_0_35px_rgba(57,255,20,0.18)]">
                  <Image
                    src="/brand/reset-metabolico-21d.jpg"
                    alt="Reset Metabólico 21D — Emagrecimento com Método"
                    width={1024}
                    height={512}
                    sizes="(max-width: 640px) 90vw, 420px"
                    className="h-auto w-full rounded-lg object-cover"
                  />
                </div>
                <Logo size={44} className="hidden ring-[#00ff66]/35 sm:inline-flex" />
              </div>

              <h2 className="mt-6 font-display text-3xl leading-tight text-balance text-grafite sm:text-5xl">
                Comece seu{" "}
                <span className="text-[#00ff66] drop-shadow-[0_0_24px_rgba(0,255,102,0.3)]">
                  Reset Metabólico 21D
                </span>{" "}
                agora.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-grafite/80 sm:text-base">
                Menos que o valor de uma única refeição fora de casa para ter as 3 semanas
                calculadas, acesso à plataforma CS Performance e todos os manuais práticos assinados por Carlos Seiti.
              </p>

              {/* Stack de Valor Ancorado */}
              <div className="mt-8 rounded-xl border border-[#00ff66]/30 bg-[#0b0a09]/90 p-5 sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00ff66]">
                  Resumo do que você leva hoje:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-grafite">
                  <li className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
                    <span>✓ Plataforma Interativa CS Performance 21D (Calendário, Missões & Diário)</span>
                    <span className="shrink-0 text-xs font-semibold text-[#00ff66]">Incluso</span>
                  </li>
                  <li className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
                    <span>✓ Prescrição Individual das 3 Semanas (Calorias, Macros e Refeições)</span>
                    <span className="shrink-0 text-xs font-semibold text-[#00ff66]">Incluso</span>
                  </li>
                  <li className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
                    <span>✓ Protocolo de Nutrição em Comida Real + 20 Receitas Práticas (PDF)</span>
                    <span className="shrink-0 text-xs font-semibold text-[#00ff66]">Incluso</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span>✓ Periodização de Treino Casa & Academia + Guia dos 7 Dias (PDF)</span>
                    <span className="shrink-0 text-xs font-semibold text-[#00ff66]">Incluso</span>
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-white/12 pt-5">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-grafite/70">
                      De{" "}
                      <span className="line-through">
                        <PrecoDinamico moedaServidor={moedaServidor} tipo="ancora" />
                      </span>{" "}
                      por apenas:
                    </span>
                    <p className="font-display text-4xl text-[#00ff66] drop-shadow-[0_0_20px_rgba(0,255,102,0.3)] sm:text-5xl">
                      <PrecoDinamico moedaServidor={moedaServidor} />{" "}
                      <span className="font-sans text-sm font-normal text-grafite/80">
                        pagamento único · sem mensalidade
                      </span>
                    </p>
                  </div>
                  <a
                    href="#simulador"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#00ff66] underline decoration-[#00ff66] underline-offset-4 hover:text-[#4be283]"
                  >
                    Quer personalizar antes? Suba para o simulador ↑
                  </a>
                </div>
              </div>

              {/* Checkout ou Consultoria */}
              <div className="mt-8">
                {vendaAberta ? (
                  <Comprar
                    moedaServidor={moedaServidor}
                    rotulo="Destravar meu Reset de 21 Dias"
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="/consultoria?de=reset-21-dias-oferta"
                      className={btnNeon}
                    >
                      Quero aplicar para o Reset / Consultoria ·{" "}
                      <PrecoDinamico moedaServidor={moedaServidor} />
                      <Arrow />
                    </a>
                    <Link
                      href={`${rotas.programa}/area?demo=1`}
                      className={btnOutlineNeon}
                    >
                      Ver plataforma por dentro (Preview) →
                    </Link>
                  </div>
                )}
              </div>

              {/* Selo de Garantia de 7 Dias */}
              <div className="mt-8 flex flex-col gap-4 rounded-xl border border-[#00ff66]/30 bg-[#0b0a09]/80 p-5 sm:flex-row sm:items-center">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#00ff66]/60 bg-[#00ff66]/15 font-display text-xl text-[#00ff66]">
                  7D
                </div>
                <div>
                  <p className="font-display text-lg text-[#00ff66]">
                    Garantia Blindada de 7 Dias — Risco Zero
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-grafite/80">
                    Entre na plataforma, baixe os protocolos em PDF e aplique toda a Semana 1
                    (Descompressão Glicêmica). Se não sentir seu abdômen desinchar e sua fome
                    estabilizar, basta pedir o reembolso em até 7 dias e devolvemos 100% do seu dinheiro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================
         8. PERGUNTAS FREQUENTES (FAQ)
         ============================================================ */}
      <Section tone="branco" denso className="border-t border-linha">
        <div className="mx-auto max-w-3xl">
          <p className="t-eyebrow flex items-center gap-3 text-[#00ff66]">
            <span aria-hidden className="inline-block h-px w-8 bg-[#00ff66]" />
            Dúvidas Frequentes
          </p>
          <h2 className="t-title mt-5 text-balance">
            Perguntas antes de começar os seus 21 dias.
          </h2>

          <div className="mt-10 divide-y divide-linha border-y border-linha">
            {PERGUNTAS_RESET.map((item) => (
              <details key={item.p} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-grafite transition-colors hover:text-[#00ff66]">
                  <span>{item.p}</span>
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#00ff66]/45 text-sm text-[#00ff66] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-grafite/80 sm:text-base">
                  {item.r}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-9 text-center text-sm text-grafite/75">
            Quer conferir apenas seus índices isolados? Use gratuitamente a{" "}
            <Link
              href={rotas.gordura}
              className="underline decoration-[#00ff66] underline-offset-4 transition-colors hover:text-[#00ff66]"
            >
              calculadora de gordura corporal
            </Link>{" "}
            ou a{" "}
            <Link
              href={rotas.calculadora}
              className="underline decoration-[#00ff66] underline-offset-4 transition-colors hover:text-[#00ff66]"
            >
              calculadora de calorias
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}

export default async function Page() {
  const figuras = await listarFigurasDeShape();

  /* Detecta o país pelo cabeçalho de IP (Vercel / Cloudflare / Proxy) quando
     presente; no cliente, o hook useMoeda também verifica fuso horário Europe/Lisbon
     e permite alternar em 1 clique. */
  const h = await headers();
  const paisIp =
    h.get("x-vercel-ip-country") ??
    h.get("cf-ipcountry") ??
    h.get("x-country") ??
    null;
  const moedaServidor: Moeda | undefined = paisIp ? moedaPorPais(paisIp) : undefined;

  /* A venda só abre com as três peças do checkout no ambiente. Faltando
     qualquer uma, o pagamento falharia (sem token, sem pedido) ou nunca
     seria confirmado (sem segredo, o webhook recusa tudo). */
  const vendaAberta = Boolean(
    process.env.MERCADOPAGO_ACCESS_TOKEN &&
      process.env.MERCADOPAGO_WEBHOOK_SECRET &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  return (
    <>
      <Header />

      <main>
        <Programa
          figuras={figuras}
          abertura={<Abertura moedaServidor={moedaServidor} />}
          rodape={
            <PaginaDeVendas
              vendaAberta={vendaAberta}
              moedaServidor={moedaServidor}
            />
          }
          vendaAberta={vendaAberta}
        />
      </main>

      <Footer />
    </>
  );
}
