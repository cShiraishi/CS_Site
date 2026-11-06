/**
 * Fecho da home — a porta da consultoria.
 *
 * Aqui vivia um formulário de três etapas que gravava o lead no Supabase.
 * O funil de verdade é o do CRM, e ter duas caixas de entrada significava
 * responder metade das pessoas de um lado e metade do outro. Esta seção
 * mantém a promessa e o `id="contato"` — links antigos já partilhados
 * continuam a cair no lugar certo — e entrega o clique a `/consultoria`.
 *
 * As dúvidas também terminam aqui, com o `id="duvidas"` que antes era de
 * uma seção inteira no meio da página. Objeção lida longe do pedido não
 * desbloqueia nada: ela só atrasa a descida. Ao lado do botão, cada uma
 * delas é o último argumento antes do clique — e continua a alimentar o
 * FAQPage dos dados estruturados, com as perguntas visíveis na página.
 */
import { contato, duvidas, rotas } from "@/lib/content";

import { FAQ } from "./FAQ";
import { Arrow, Eyebrow, Section, buttonClass } from "./ui";

export function Aplicar() {
  return (
    <Section id="contato" tone="branco">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <Eyebrow>{contato.eyebrow}</Eyebrow>
          <h2 className="t-title mt-7 whitespace-pre-line text-balance">
            {contato.titulo}
          </h2>
          <p className="mt-7 max-w-md text-pretty leading-relaxed text-grafite">
            {contato.texto}
          </p>

          <div className="mt-11">
            <a
              href={`${rotas.consultoria}?de=fecho`}
              className={buttonClass("consultoria")}
            >
              {contato.cta}
              <Arrow />
            </a>
          </div>

          <p className="mt-8 flex items-center gap-2.5 text-xs text-grafite">
            <span aria-hidden className="rule-gold h-px w-6" />
            {contato.nota}
          </p>
        </div>

        {/* Os três passos: o que acontece depois do clique, em ordem. */}
        <ol className="space-y-px border-t border-linha">
          {contato.passos.map((passo) => (
            <li
              key={passo.numero}
              className="flex items-start gap-6 border-b border-linha py-7"
            >
              <span className="font-display text-2xl leading-none text-ouro-profundo">
                {passo.numero}
              </span>
              <span>
                <span className="block text-base text-grafite">
                  {passo.titulo}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-grafite/70">
                  {passo.nota}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* As dúvidas que ainda travam o clique. */}
      <div
        id="duvidas"
        className="mt-24 grid scroll-mt-24 gap-10 lg:grid-cols-[0.5fr_1.5fr] lg:gap-24"
      >
        <p className="t-eyebrow text-grafite">{duvidas.titulo}</p>
        <FAQ itens={duvidas.itens} />
      </div>
    </Section>
  );
}
