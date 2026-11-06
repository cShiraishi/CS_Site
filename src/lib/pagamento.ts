import "server-only";

import { assinaturaValida as verificar } from "./assinatura";

/**
 * Mercado Pago — Checkout Pro.
 *
 * Chamado pela API REST, sem SDK. São três endpoints e uma verificação de
 * assinatura; o SDK traria uma dependência a mais num projeto que tem
 * poucas, e esconderia justamente a parte que precisa de estar à vista —
 * a validação do webhook, que é o que separa "pago" de "alguém disse que
 * pagou".
 *
 * Checkout Pro e não Checkout Transparente: a pessoa paga no ambiente do
 * Mercado Pago e volta. Dados de cartão nunca tocam neste servidor, o que
 * tira o site inteiro do alcance das exigências de PCI, e o Pix — que é
 * como a maior parte deste público paga — vem incluído sem trabalho extra.
 */

const API = "https://api.mercadopago.com";

function token(): string | null {
  return process.env.MERCADOPAGO_ACCESS_TOKEN ?? null;
}

export type Preferencia = {
  /** para onde mandar a pessoa */
  url: string;
  id: string;
};

/**
 * Cria a preferência de pagamento e devolve o endereço do checkout.
 *
 * `valorCentavos` vem de `produto.ts`, nunca da requisição: é o servidor
 * que diz quanto custa.
 */
export async function criarPreferencia(dados: {
  referencia: string;
  email: string;
  titulo: string;
  descricao: string;
  valorCentavos: number;
  moeda: string;
  urlBase: string;
  /** usado como chave de idempotência e no retorno */
  slug: string;
}): Promise<Preferencia | { erro: string }> {
  const chave = token();
  if (!chave) return { erro: "MERCADOPAGO_ACCESS_TOKEN não configurado" };

  const retorno = `${dados.urlBase}/${dados.slug}/obrigado`;

  const corpo = {
    items: [
      {
        id: dados.slug,
        title: dados.titulo,
        description: dados.descricao,
        quantity: 1,
        currency_id: dados.moeda,
        // A API fala em unidades, não em centavos.
        unit_price: dados.valorCentavos / 100,
      },
    ],
    payer: { email: dados.email },
    /*
     * O fio que liga a notificação ao nosso pedido. Sem ele, o webhook
     * traria um pagamento aprovado sem dizer de quem — e teríamos de
     * adivinhar pelo e-mail, que a pessoa pode digitar diferente no
     * Mercado Pago.
     */
    external_reference: dados.referencia,
    back_urls: {
      success: `${retorno}?estado=sucesso`,
      pending: `${retorno}?estado=pendente`,
      failure: `${retorno}?estado=falhou`,
    },
    auto_return: "approved",
    notification_url: `${dados.urlBase}/api/pagamentos/mercadopago`,
    statement_descriptor: "CARLOSSEITI",
  };

  try {
    const resposta = await fetch(`${API}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
        // Se a pessoa carregar duas vezes no botão, é a mesma preferência.
        "X-Idempotency-Key": dados.referencia,
      },
      body: JSON.stringify(corpo),
    });

    const json = await resposta.json();
    if (!resposta.ok) {
      return { erro: `Mercado Pago ${resposta.status}: ${JSON.stringify(json).slice(0, 300)}` };
    }

    /*
     * `sandbox_init_point` é o checkout de teste. A escolha segue o tipo
     * da credencial: com token de teste, o init_point de produção recusa.
     */
    const ehTeste = chave.startsWith("TEST-");
    const url = ehTeste ? json.sandbox_init_point : json.init_point;
    if (!url) return { erro: "resposta sem init_point" };

    return { url, id: String(json.id) };
  } catch (erro) {
    return { erro: `rede: ${erro instanceof Error ? erro.message : String(erro)}` };
  }
}

export type Pagamento = {
  id: string;
  /** approved, pending, rejected, refunded, cancelled… */
  status: string;
  referencia: string | null;
  /** em centavos, como o provedor o cobrou de facto */
  valorCentavos: number;
  moeda: string;
  metodo: string | null;
  email: string | null;
};

/**
 * Consulta o pagamento na fonte.
 *
 * O webhook traz só um id. Tudo o que decide acesso — estado, valor,
 * referência — é lido daqui, com o nosso token, e não do corpo da
 * notificação: o corpo é o que chegou pela rede, isto é o que o Mercado
 * Pago afirma quando lhe perguntamos.
 */
export async function consultarPagamento(
  id: string,
): Promise<Pagamento | { erro: string }> {
  const chave = token();
  if (!chave) return { erro: "MERCADOPAGO_ACCESS_TOKEN não configurado" };

  try {
    const resposta = await fetch(`${API}/v1/payments/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${chave}` },
      cache: "no-store",
    });

    const json = await resposta.json();
    if (!resposta.ok) {
      return { erro: `Mercado Pago ${resposta.status}: ${JSON.stringify(json).slice(0, 300)}` };
    }

    return {
      id: String(json.id),
      status: String(json.status ?? ""),
      referencia: json.external_reference ? String(json.external_reference) : null,
      valorCentavos: Math.round(Number(json.transaction_amount ?? 0) * 100),
      moeda: String(json.currency_id ?? ""),
      metodo: json.payment_method_id ? String(json.payment_method_id) : null,
      email: json.payer?.email ? String(json.payer.email) : null,
    };
  } catch (erro) {
    return { erro: `rede: ${erro instanceof Error ? erro.message : String(erro)}` };
  }
}

/**
 * A notificação veio mesmo do Mercado Pago?
 *
 * O endereço do webhook é público: qualquer pessoa pode descobri-lo e
 * enviar-lhe um POST a anunciar um pagamento aprovado. Sem esta
 * verificação, o produto fica de graça para quem souber escrever um
 * `curl` — e não haveria nenhum sintoma, porque do lado de cá tudo
 * pareceria uma venda.
 *
 * A conta está em `assinatura.ts`, que é pura e testável; aqui só se
 * junta o segredo do ambiente.
 */
export function assinaturaValida(entrada: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  return verificar({ ...entrada, segredo: process.env.MERCADOPAGO_WEBHOOK_SECRET });
}
