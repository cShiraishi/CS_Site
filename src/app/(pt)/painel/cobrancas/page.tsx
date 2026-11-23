import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Assinatura } from "@/components/Logo";
import { painelConfigurado, painelLiberado } from "@/lib/painel";
import { listarAssinaturas, listarCobrancas, modoStripe } from "@/lib/stripe";

import { desativar, sairDoPainel } from "./actions";
import { FormCobranca, FormEntrar } from "./Formularios";

/**
 * Painel interno de cobranças recorrentes (Stripe).
 *
 * Não tem link em lugar nenhum do site, não está no sitemap e pede aos
 * buscadores que não indexem. Também não entra no `robots.txt`: listar o
 * caminho lá seria anunciá-lo. A proteção real é a senha.
 */
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

const ESTADOS: Record<string, { rotulo: string; cor: string }> = {
  active: { rotulo: "ativa", cor: "text-destaque-profundo" },
  trialing: { rotulo: "em teste", cor: "text-destaque-profundo" },
  past_due: { rotulo: "em atraso", cor: "text-red-300" },
  unpaid: { rotulo: "não paga", cor: "text-red-300" },
  canceled: { rotulo: "cancelada", cor: "text-grafite/45" },
  incomplete: { rotulo: "incompleta", cor: "text-grafite/60" },
  incomplete_expired: { rotulo: "expirou", cor: "text-grafite/45" },
  paused: { rotulo: "pausada", cor: "text-grafite/60" },
};

/** Placa da marca: a mesma superfície elevada com filete de ouro do login. */
function Placa({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`surface-elevated overflow-hidden bg-white ${className}`}>
      <div className="h-1 bg-linear-to-r from-ouro-profundo via-ouro to-transparent" />
      <div className="p-7 sm:p-10">{children}</div>
    </section>
  );
}

function Secao({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="t-eyebrow text-destaque-profundo">{numero}</span>
      <h2 className="font-display text-2xl uppercase tracking-wide text-grafite">{titulo}</h2>
    </div>
  );
}

export default async function PainelCobrancas() {
  if (!painelConfigurado()) notFound();

  if (!(await painelLiberado())) {
    return (
      <main className="grid min-h-screen place-items-center bg-porcelana px-5 py-24">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center">
            <Assinatura priority />
          </div>
          <Placa>
            <p className="t-eyebrow text-ouro-profundo">Acesso restrito</p>
            <h1 className="t-title mt-4 text-grafite">Painel</h1>
            <div className="mt-8">
              <FormEntrar />
            </div>
          </Placa>
        </div>
      </main>
    );
  }

  const modo = modoStripe();
  const [links, assinaturas] = modo
    ? await Promise.all([listarCobrancas(), listarAssinaturas()])
    : [[], []];

  return (
    <main className="min-h-screen bg-porcelana px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-linha pb-8">
          <Assinatura priority />
          <div className="flex items-center gap-5">
            {modo === "teste" && (
              <span className="rounded-full border border-linha-ouro px-3.5 py-1.5 t-eyebrow text-destaque-profundo">
                Stripe · modo teste
              </span>
            )}
            {modo === "real" && (
              <span className="rounded-full bg-ouro px-3.5 py-1.5 t-eyebrow text-porcelana">Stripe · real</span>
            )}
            <form action={sairDoPainel}>
              <button className="text-sm text-grafite/70 underline decoration-ouro/60 underline-offset-4 hover:text-grafite">
                Sair
              </button>
            </form>
          </div>
        </header>

        <div className="mt-14">
          <p className="t-eyebrow text-ouro-profundo">Painel interno</p>
          <h1 className="t-title mt-4 text-grafite">
            Cobranças <span className="font-serif italic normal-case text-destaque-profundo">recorrentes</span>
          </h1>
          <div className="rule-gold mt-6 h-px w-24" />
        </div>

        {!modo && (
          <p className="mt-10 border-l-2 border-ouro bg-ouro/10 px-5 py-4 text-sm leading-relaxed text-grafite">
            Falta a <code className="text-destaque-profundo">STRIPE_SECRET_KEY</code> no{" "}
            <code className="text-destaque-profundo">.env.local</code> — painel Stripe → Developers → API keys.
          </p>
        )}

        <Placa className="mt-12">
          <Secao numero="01" titulo="Nova cobrança" />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-grafite/70">
            Gera um link da Stripe. O cliente cadastra o cartão uma vez e é cobrado automaticamente em cada período,
            até a assinatura ser cancelada.
          </p>
          <div className="mt-9">
            <FormCobranca />
          </div>
        </Placa>

        <section className="mt-16">
          <Secao numero="02" titulo="Assinaturas" />
          {"erro" in assinaturas ? (
            <p className="mt-5 text-sm text-red-300">{assinaturas.erro}</p>
          ) : assinaturas.length === 0 ? (
            <p className="mt-5 text-sm text-grafite/60">Nenhuma assinatura ainda.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-linha-ouro">
                  <tr className="t-eyebrow text-grafite/60">
                    <th className="py-3 pr-4 font-bold">Cliente</th>
                    <th className="pr-4 font-bold">Valor</th>
                    <th className="pr-4 font-bold">Estado</th>
                    <th className="font-bold">Próxima</th>
                  </tr>
                </thead>
                <tbody>
                  {assinaturas.map((a) => {
                    const e = ESTADOS[a.estado] ?? { rotulo: a.estado, cor: "text-grafite/60" };
                    return (
                      <tr key={a.id} className="border-b border-linha">
                        <td className="py-3.5 pr-4 text-grafite">{a.cliente}</td>
                        <td className="whitespace-nowrap pr-4 text-grafite">{a.valor}</td>
                        <td className={`pr-4 ${e.cor}`}>{e.rotulo}</td>
                        <td className="text-grafite/70">{a.proxima ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-16">
          <Secao numero="03" titulo="Links gerados" />
          {"erro" in links ? (
            <p className="mt-5 text-sm text-red-300">{links.erro}</p>
          ) : links.length === 0 ? (
            <p className="mt-5 text-sm text-grafite/60">Nenhum link ainda.</p>
          ) : (
            <ul className="mt-6 divide-y divide-linha border-y border-linha">
              {links.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
                  <div className="min-w-0">
                    <p className="text-grafite">
                      {l.cliente ?? "Sem nome"} <span className="text-destaque-profundo">· {l.valor}</span>
                    </p>
                    <p className="mt-1 truncate text-grafite/55">
                      {l.produto}
                      {l.email ? ` · ${l.email}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {l.ativo ? (
                      <>
                        <a href={l.url} target="_blank" rel="noreferrer" className="text-grafite underline decoration-ouro/60 underline-offset-4">
                          abrir
                        </a>
                        <form action={desativar}>
                          <input type="hidden" name="id" value={l.id} />
                          <button className="text-red-300 underline decoration-red-300/50 underline-offset-4">desativar</button>
                        </form>
                      </>
                    ) : (
                      <span className="t-eyebrow text-grafite/40">desativado</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-20 border-t border-linha pt-6 text-xs text-grafite/40">
          Página interna · não indexada · carlosseiti.com
        </footer>
      </div>
    </main>
  );
}
