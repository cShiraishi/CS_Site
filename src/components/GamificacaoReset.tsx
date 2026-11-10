import { calcularJogo, type DiarioParaJogo } from "@/lib/gamificacao";

/**
 * Painel de jogo do Reset 21D: nível, pontos, sequência e conquistas.
 * Só mostra — quem pontua é o diário (ver `gamificacao.ts`).
 */
export function GamificacaoReset({ diario }: { diario: DiarioParaJogo }) {
  const jogo = calcularJogo(diario);
  const pct = Math.round(jogo.progressoNivel * 100);

  return (
    <section
      aria-label="Seu progresso no jogo"
      className="rounded-2xl border border-[#7dff1a]/30 bg-[#111715] p-5 shadow-xl sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg uppercase text-white">Nível e conquistas</h2>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-white/80">
          {jogo.feitas} de {jogo.conquistas.length} conquistas
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#0b100e] p-4 sm:col-span-2">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#7dff1a]">
                Nível {jogo.nivel.numero}
              </p>
              <p className="font-display text-2xl uppercase leading-tight text-white">
                {jogo.nivel.nome}
              </p>
            </div>
            <p className="font-display text-2xl text-[#7dff1a]">
              {jogo.xp} <span className="text-sm text-white/70">XP</span>
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso até o próximo nível"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-[#7dff1a] to-[#39ff14] shadow-[0_0_14px_#7dff1a] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/70">
            {jogo.proximo
              ? `Faltam ${jogo.proximo.falta} XP para ${jogo.proximo.nome}.`
              : "Nível máximo. Você chegou ao topo."}
          </p>
        </div>

        <div className="rounded-xl border border-[#ff8c42]/35 bg-[#16100b] p-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#ff8c42]">
            Sequência
          </p>
          <p className="font-display text-3xl leading-tight text-white">
            🔥 {jogo.sequencia.atual}{" "}
            <span className="text-sm text-white/70">
              {jogo.sequencia.atual === 1 ? "dia" : "dias"}
            </span>
          </p>
          <p className="mt-2 text-xs text-white/70">Recorde: {jogo.sequencia.melhor}</p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {jogo.conquistas.map((c) => (
          <li
            key={c.id}
            className={`rounded-xl border p-3 transition-colors ${
              c.feita
                ? "border-[#7dff1a]/60 bg-[#0d1911] shadow-[0_0_18px_rgba(125,255,26,0.15)]"
                : "border-white/10 bg-[#0b100e]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={`text-2xl leading-none ${c.feita ? "" : "opacity-40 grayscale"}`}
              >
                {c.icone}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-xs font-bold leading-tight ${
                    c.feita ? "text-white" : "text-white/75"
                  }`}
                >
                  {c.nome}
                </p>
                <p className="text-[0.68rem] leading-tight text-white/60">{c.descricao}</p>
              </div>
            </div>
            {c.feita ? (
              <p className="mt-2 text-[0.65rem] font-extrabold uppercase tracking-wider text-[#7dff1a]">
                ✓ Conquistada
              </p>
            ) : (
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/45"
                  style={{ width: `${Math.round(c.progresso * 100)}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[0.68rem] leading-relaxed text-white/55">
        Dia concluído vale 100 XP, missão marcada 15 XP e cada medida registrada 50 XP.
      </p>
    </section>
  );
}
