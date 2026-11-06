import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { marca } from "@/lib/content";
import { criarPreferencia } from "@/lib/pagamento";
import { criarPedido } from "@/lib/pedidos";
import { PROGRAMA } from "@/lib/produto";
import { criarSupabaseServer } from "@/lib/supabase/server";

/**
 * Abre o checkout: cria o pedido pendente e devolve o endereço de
 * pagamento.
 *
 * Repare no que o corpo da requisição NÃO traz: preço. Ele vem de
 * `produto.ts`, no servidor. Aceitar o valor do cliente é o erro clássico
 * de loja — e o navegador pode mandar `1`.
 *
 * O pedido é gravado antes de a pessoa sair do site. Se o checkout falhar
 * no meio, fica o registo de quem tentou comprar e não conseguiu, que é
 * uma das listas mais valiosas que existem.
 */
export const dynamic = "force-dynamic";

const Entrada = z.object({
  email: z.string().trim().email("e-mail inválido").max(160),
  /* O perfil que gerou o plano — guardado para a entrega sair igual ao
     que a pessoa viu antes de pagar. Opcional e sem forma fixa: o motor
     evolui, e um pedido antigo não deve impedir um deploy. */
  plano: z.unknown().optional(),
  /* Armadilha para robô: campo escondido no formulário, que só um
     preenchedor automático preenche.

     O schema aceita qualquer texto aqui de propósito. Validá-lo como
     "tem de estar vazio" faria o parse recusar com 400 — o robô
     aprenderia que foi apanhado, e o tratamento silencioso lá embaixo
     nunca chegaria a correr. */
  empresa: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "corpo inválido" }, { status: 400 });
  }

  const entrada = Entrada.safeParse(corpo);
  if (!entrada.success) {
    return NextResponse.json(
      { erro: entrada.error.issues[0]?.message ?? "dados inválidos" },
      { status: 400 },
    );
  }

  if (entrada.data.empresa) {
    // Silêncio de propósito: o robô recebe 200 e vai embora achando que
    // funcionou, sem aprender qual campo o denunciou.
    return NextResponse.json({ ok: true });
  }

  // Se já estiver autenticado, o pedido nasce ligado à conta.
  const supabase = await criarSupabaseServer();
  const userId = supabase
    ? (await supabase.auth.getUser()).data.user?.id ?? null
    : null;

  const pedido = await criarPedido({
    produto: PROGRAMA.slug,
    email: entrada.data.email,
    valorCentavos: PROGRAMA.precoCentavos,
    moeda: PROGRAMA.moeda,
    plano: entrada.data.plano,
    userId,
  });

  if ("erro" in pedido) {
    console.error("[checkout] pedido:", pedido.erro);
    return NextResponse.json(
      { erro: "não consegui abrir o pagamento agora" },
      { status: 500 },
    );
  }

  const preferencia = await criarPreferencia({
    referencia: pedido.referencia,
    email: entrada.data.email,
    titulo: PROGRAMA.nome,
    descricao: PROGRAMA.descricao,
    valorCentavos: PROGRAMA.precoCentavos,
    moeda: PROGRAMA.moeda,
    urlBase: marca.site,
    slug: PROGRAMA.slug,
  });

  if ("erro" in preferencia) {
    console.error("[checkout] preferência:", preferencia.erro);
    return NextResponse.json(
      { erro: "não consegui abrir o pagamento agora" },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: preferencia.url, referencia: pedido.referencia });
}
