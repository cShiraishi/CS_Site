/**
 * Rota curta da consultoria — /consultoria manda direto ao formulário.
 *
 * Existe por dois motivos. O primeiro é humano: o endereço do LeadConnector
 * (`api.leadconnectorhq.com/widget/survey/x7MW…`) não se dita num Reel nem
 * cabe numa bio; "carlosseiti.vercel.app/consultoria" cabe. O segundo é de
 * manutenção: com o destino num lugar só, trocar de CRM amanhã é editar
 * `marca.formulario` — e não caçar botão por botão pelo site.
 */
import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_ATRIBUICAO, linkDoFormulario } from "@/lib/campanha";
import { marca } from "@/lib/content";

/* A query e o cookie mudam a cada visita; cachear a rota serviria o primeiro
   clique a toda a gente, junto com a atribuição de quem chegou primeiro. */
export const dynamic = "force-dynamic";

/** Números que o site já calculou e que o lead pode levar consigo. */
function numero(req: NextRequest, chave: string): number | undefined {
  const bruto = req.nextUrl.searchParams.get(chave);
  if (!bruto) return undefined;
  const n = Number(bruto);
  return Number.isFinite(n) ? n : undefined;
}

export function GET(req: NextRequest) {
  /*
   * A query desta chamada vence, o cookie entra quando ela não traz nada:
   * quem clica num link interno chega aqui sem utm nenhum, e é aí que o
   * anúncio que trouxe a pessoa há três páginas ainda precisa contar.
   */
  const daVisita = req.nextUrl.search;
  const doCookie = req.cookies.get(COOKIE_ATRIBUICAO)?.value ?? "";
  const entrada = new URLSearchParams(doCookie);
  for (const [chave, valor] of new URLSearchParams(daVisita)) {
    if (valor) entrada.set(chave, valor);
  }

  const destino = linkDoFormulario(marca.formulario, entrada.toString(), {
    medium: "link-direto",
    /* `?de=hero` diz qual botão do site levou até aqui, sem gastar um utm_ —
       os utm_ pertencem à campanha que trouxe a pessoa de fora. */
    cta: req.nextUrl.searchParams.get("de") ?? undefined,
    bf: numero(req, "bf"),
    meta: numero(req, "meta"),
    kcal: numero(req, "kcal"),
    sexo: req.nextUrl.searchParams.get("sexo") ?? undefined,
  });

  /* 307, não 308: o destino é o CRM da vez, não uma verdade permanente que
     valha a pena um navegador guardar em cache para sempre. */
  return NextResponse.redirect(destino, 307);
}
