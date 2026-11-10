"use client";

import Image from "next/image";
import { useState } from "react";
import { Player, type Selecao } from "./CanalEla";
import type { TrilhaEla, VideoEla } from "@/lib/canal-ela";
import { FASES, UI_GESTACAO, faseDaSemana, trimestreDa, videoDaSemana } from "@/lib/gestacao";
import type { Idioma } from "@/lib/i18n";
import { gravarArmazenado, lerJson, useArmazenado } from "@/lib/useArmazenado";

/**
 * Linha do tempo da gestação: escolha a semana (ou a data da última
 * menstruação), veja onde está e estude fase a fase — bebê, corpo,
 * cuidados e um vídeo por semana.
 *
 * A semana fica só no localStorage (dado de saúde: nada sai do aparelho)
 * e avança sozinha com o calendário. A página NÃO rola sozinha ao abrir:
 * só quando a pessoa define a semana.
 */

const CHAVE = "cs_gestacao";
type Salvo = { dum?: string; semana?: number; em?: string };

const DIA = 86_400_000;

function semanaAtual(s: Salvo | null): number | null {
  if (!s) return null;
  const hoje = Date.now();
  let n: number | null = null;
  if (s.dum) {
    const dum = Date.parse(`${s.dum}T00:00:00`);
    if (!Number.isNaN(dum)) n = Math.floor((hoje - dum) / DIA / 7) + 1;
  } else if (s.semana && s.em) {
    const em = Date.parse(s.em);
    n = s.semana + (Number.isNaN(em) ? 0 : Math.floor((hoje - em) / DIA / 7));
  }
  if (n === null || n < 1) return null;
  return Math.min(n, 40);
}

/** Semanas seguidas com o mesmo vídeo viram um cartão só ("Semanas 1–4"). */
function semanasAgrupadas(idioma: Idioma, de: number, ate: number) {
  const grupos: { de: number; ate: number; video: VideoEla }[] = [];
  for (let n = de; n <= ate; n++) {
    const video = videoDaSemana(idioma, n);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.video.id === video.id) ultimo.ate = n;
    else grupos.push({ de: n, ate: n, video });
  }
  return grupos;
}

export function GestacaoSemanas({ idioma, fechar }: { idioma: Idioma; fechar: string }) {
  const ui = UI_GESTACAO[idioma];
  const salvo = lerJson<Salvo>(useArmazenado(CHAVE));
  const semana = semanaAtual(salvo);
  const [selecao, setSelecao] = useState<Selecao | null>(null);

  function irPara(n: number) {
    // Só rola por pedido explícito da pessoa.
    window.setTimeout(() => {
      document.getElementById(`semana-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  /* `rolar` só nos gestos de navegação (régua, Enter); no − / + e durante
     a digitação a página fica parada e só o texto atualiza. */
  function definirSemana(n: number, rolar = false) {
    const s = Math.max(1, Math.min(40, Math.round(n)));
    gravarArmazenado(CHAVE, JSON.stringify({ semana: s, em: new Date().toISOString() }));
    if (rolar) irPara(s);
  }

  // Rascunho do campo enquanto a pessoa digita ("2" antes de "22").
  const [rascunho, setRascunho] = useState<string | null>(null);

  function definirDum(data: string) {
    if (!data) return;
    const s = semanaAtual({ dum: data });
    gravarArmazenado(CHAVE, JSON.stringify({ dum: data }));
    if (s) irPara(s);
  }

  const faseAtual = semana ? faseDaSemana(semana) : null;

  return (
    <div>
      <h2 className="t-title max-w-2xl text-balance text-grafite">{ui.titulo}</h2>
      <p className="mt-5 max-w-2xl leading-relaxed text-grafite/70">{ui.texto}</p>

      {/* ── Onde você está ─────────────────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-destaque/40 bg-destaque/[0.06] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-destaque">{ui.perguntaSemana}</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => definirSemana((semana ?? 1) - 1)}
              aria-label="−1"
              className="flex size-11 items-center justify-center rounded-full border border-linha text-lg text-grafite transition-colors hover:border-destaque hover:text-destaque"
            >
              −
            </button>
            <label className="sr-only" htmlFor="gestacao-semana">
              {ui.perguntaSemana}
            </label>
            <input
              id="gestacao-semana"
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              value={rascunho ?? semana ?? ""}
              placeholder="—"
              onChange={(e) => {
                setRascunho(e.target.value);
                const n = Number(e.target.value);
                if (n >= 1 && n <= 40) definirSemana(n);
              }}
              onBlur={() => setRascunho(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && semana) {
                  setRascunho(null);
                  irPara(semana);
                }
              }}
              className="h-11 w-20 rounded-xl border border-linha bg-transparent text-center text-base font-semibold text-grafite focus:border-destaque focus:outline-none"
            />
            <button
              type="button"
              onClick={() => definirSemana((semana ?? 0) + 1)}
              aria-label="+1"
              className="flex size-11 items-center justify-center rounded-full border border-linha text-lg text-grafite transition-colors hover:border-destaque hover:text-destaque"
            >
              +
            </button>
          </div>
          <span className="pb-3 text-xs uppercase tracking-[0.14em] text-grafite/45">{ui.ouDum}</span>
          <label className="flex flex-col gap-1 text-xs text-grafite/60">
            {ui.dum}
            <input
              type="date"
              value={salvo?.dum ?? ""}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => definirDum(e.target.value)}
              className="h-11 rounded-xl border border-linha bg-transparent px-3 text-base text-grafite [color-scheme:dark] focus:border-destaque focus:outline-none"
            />
          </label>
          {salvo && (
            <button
              type="button"
              onClick={() => gravarArmazenado(CHAVE, "")}
              className="h-11 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-grafite/50 hover:text-destaque"
            >
              {ui.limpar}
            </button>
          )}
        </div>

        {semana && faseAtual && (
          <p className="mt-4 text-base font-semibold text-destaque">
            {ui.voceEsta(semana, faseAtual.mes, trimestreDa(semana))}
          </p>
        )}

        {/* Régua das 40 semanas, com os três trimestres. */}
        <div className="mt-5">
          <div className="flex gap-[3px]" role="list" aria-label={ui.titulo}>
            {Array.from({ length: 40 }, (_, i) => i + 1).map((n) => {
              const passada = semana !== null && n < semana;
              const atual = n === semana;
              return (
                <button
                  key={n}
                  type="button"
                  role="listitem"
                  title={ui.semana(n)}
                  aria-label={ui.semana(n)}
                  onClick={() => definirSemana(n, true)}
                  className={`h-3 flex-1 rounded-[2px] transition-colors ${
                    atual
                      ? "bg-destaque ring-2 ring-destaque/50 ring-offset-1 ring-offset-porcelana"
                      : passada
                      ? "bg-destaque/55"
                      : "bg-grafite/12 hover:bg-destaque/30"
                  }`}
                />
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-[13fr_14fr_13fr] text-[0.62rem] font-bold uppercase tracking-[0.14em] text-grafite/45">
            <span>{ui.trimestre(1)}</span>
            <span className="text-center">{ui.trimestre(2)}</span>
            <span className="text-right">{ui.trimestre(3)}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-grafite/45">{ui.privacidade}</p>
      </div>

      {/* ── As nove fases ──────────────────────────────────────── */}
      <ol className="mt-14 space-y-6">
        {FASES.map((fase) => {
          const ativa = faseAtual?.mes === fase.mes;
          const extras = fase.videos[idioma];
          const grupos = semanasAgrupadas(idioma, fase.de, fase.ate);
          const trilha: TrilhaEla = {
            id: `mes-${fase.mes}`,
            nome: `${ui.mes(fase.mes)} · ${fase.titulo[idioma]}`,
            descricao: "",
            videos: [...extras, ...grupos.map((g) => g.video)],
          };

          return (
            <li
              key={fase.mes}
              id={`mes-${fase.mes}`}
              className={`scroll-mt-28 rounded-2xl border p-5 transition-colors sm:p-7 ${
                ativa ? "border-destaque/70 bg-destaque/[0.05]" : "border-linha"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-bold uppercase tracking-[0.16em]">
                <span className="rounded-full bg-destaque px-2.5 py-1 text-[#0b0a09]">{ui.mes(fase.mes)}</span>
                <span className="text-grafite/60">{ui.semanas(fase.de, fase.ate)}</span>
                <span className="text-destaque">{ui.trimestre(trimestreDa(fase.de))}</span>
              </div>
              <h3 className="mt-3 font-display text-3xl uppercase leading-none text-grafite sm:text-4xl">
                {fase.titulo[idioma]}
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-destaque">{ui.bebe}</p>
                  <p className="mt-2 text-sm leading-relaxed text-grafite/80">{fase.bebe[idioma]}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-destaque">{ui.mae}</p>
                  <p className="mt-2 text-sm leading-relaxed text-grafite/80">{fase.mae[idioma]}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-destaque">{ui.cuidados}</p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-grafite/80">
                    {fase.cuidados[idioma].map((c) => (
                      <li key={c} className="flex gap-2">
                        <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-destaque" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {extras.length > 0 && (
                <div className="mt-7">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-grafite/55">{ui.videosDoMes}</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {extras.map((video, i) => (
                      <li key={video.id}>
                        <button
                          type="button"
                          onClick={() => setSelecao({ trilha, indice: i })}
                          className="group flex w-full items-center gap-3 rounded-xl border border-linha p-2 text-left transition-colors hover:border-destaque/60"
                        >
                          <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-papel">
                            <Image
                              src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                              alt=""
                              fill
                              sizes="112px"
                              className="object-cover"
                            />
                            <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 text-[0.6rem] font-semibold tabular-nums text-white">
                              {video.duracao}
                            </span>
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-snug text-grafite group-hover:text-destaque">
                              {video.titulo}
                            </span>
                            <span className="mt-0.5 block text-xs text-grafite/55">{video.canal}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-7">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-grafite/55">{ui.videoDaSemana}</p>
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                  {grupos.map((g, i) => {
                    const aqui = semana !== null && semana >= g.de && semana <= g.ate;
                    const rotulo = g.de === g.ate ? ui.semana(g.de) : ui.semanas(g.de, g.ate);
                    return (
                      <li key={g.de} id={`semana-${g.de}`} className="scroll-mt-28">
                        {/* Âncoras das semanas agrupadas, para a régua achar. */}
                        {Array.from({ length: g.ate - g.de }, (_, k) => (
                          <span key={k} id={`semana-${g.de + k + 1}`} aria-hidden />
                        ))}
                        <button
                          type="button"
                          onClick={() => setSelecao({ trilha, indice: extras.length + i })}
                          aria-label={`${rotulo} — ${g.video.canal}`}
                          className={`group relative block w-full overflow-hidden rounded-xl border text-left transition-colors ${
                            aqui ? "border-destaque ring-2 ring-destaque/40" : "border-linha hover:border-destaque/60"
                          }`}
                        >
                          <span className="relative block aspect-video bg-papel">
                            <Image
                              src={`https://i.ytimg.com/vi/${g.video.id}/mqdefault.jpg`}
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                              className="object-cover opacity-85 transition-opacity group-hover:opacity-100"
                            />
                            <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 text-[0.6rem] font-semibold tabular-nums text-white">
                              {g.video.duracao}
                            </span>
                            {aqui && (
                              <span className="absolute left-1.5 top-1.5 rounded-full bg-destaque px-2 py-0.5 text-[0.55rem] font-extrabold uppercase tracking-[0.06em] text-[#0b0a09]">
                                {ui.aquiVoce}
                              </span>
                            )}
                          </span>
                          <span
                            className={`block px-2.5 py-2 text-xs font-bold uppercase tracking-[0.1em] ${
                              aqui ? "text-destaque" : "text-grafite/80 group-hover:text-destaque"
                            }`}
                          >
                            {rotulo}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <Player selecao={selecao} ui={{ fechar }} aoTrocar={setSelecao} aoFechar={() => setSelecao(null)} />
    </div>
  );
}
