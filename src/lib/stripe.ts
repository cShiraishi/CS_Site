import "server-only";

/**
 * Stripe — cobranças recorrentes montadas à mão no painel interno.
 *
 * Mesma escolha do Mercado Pago: API REST, sem SDK. São quatro endpoints
 * (produto, preço, link, assinaturas) e o SDK seria uma dependência a mais.
 *
 * O formato é o Payment Link e não a Checkout Session: a sessão expira em
 * 24 h, e um link que se manda por WhatsApp precisa de sobreviver ao dia em
 * que o cliente o abre. O link fica ativo até ser desativado aqui.
 */

const API = "https://api.stripe.com/v1";

function chave(): string | null {
  return process.env.STRIPE_SECRET_KEY ?? null;
}

/** "teste" com sk_test_/rk_test_, "real" com as chaves live. */
export function modoStripe(): "teste" | "real" | null {
  const k = chave();
  if (!k) return null;
  return k.includes("_test_") ? "teste" : "real";
}

type Params = Record<string, unknown>;

/** Achata `{ a: { b: [1] } }` em `a[b][0]=1`, o formato que a Stripe aceita. */
function codificar(obj: Params, prefixo = "", saida = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    const nome = prefixo ? `${prefixo}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === "object" && item !== null) codificar(item as Params, `${nome}[${i}]`, saida);
        else saida.append(`${nome}[${i}]`, String(item));
      });
    } else if (typeof v === "object") {
      codificar(v as Params, nome, saida);
    } else {
      saida.append(nome, String(v));
    }
  }
  return saida;
}

async function stripe<T>(
  metodo: "GET" | "POST",
  caminho: string,
  params: Params = {},
): Promise<T | { erro: string }> {
  const k = chave();
  if (!k) return { erro: "STRIPE_SECRET_KEY não configurada no .env.local" };

  const corpo = codificar(params).toString();
  const url = metodo === "GET" && corpo ? `${API}${caminho}?${corpo}` : `${API}${caminho}`;

  try {
    const r = await fetch(url, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${k}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: metodo === "POST" ? corpo : undefined,
      cache: "no-store",
    });
    const json = await r.json();
    if (!r.ok) return { erro: json?.error?.message ?? `Stripe respondeu ${r.status}` };
    return json as T;
  } catch (e) {
    return { erro: e instanceof Error ? e.message : "falha de rede com a Stripe" };
  }
}

export type Intervalo = "day" | "week" | "month" | "year";

export type NovaCobranca = {
  nome: string;
  descricao?: string;
  valorCentavos: number;
  moeda: "eur" | "brl";
  intervalo: Intervalo;
  aCada: number;
  cliente?: string;
  email?: string;
};

export type LinkCriado = { id: string; url: string; urlComEmail: string };

/**
 * Produto → preço recorrente → Payment Link.
 *
 * Um produto por cobrança: cada cliente acaba com valor e periodicidade
 * próprios, e assim o painel da Stripe mostra o nome certo em cada fatura.
 */
export async function criarCobrancaRecorrente(c: NovaCobranca): Promise<LinkCriado | { erro: string }> {
  const metadata = { origem: "painel-cs", cliente: c.cliente, email: c.email };

  const produto = await stripe<{ id: string }>("POST", "/products", {
    name: c.nome,
    description: c.descricao,
    metadata,
  });
  if ("erro" in produto) return produto;

  const preco = await stripe<{ id: string }>("POST", "/prices", {
    product: produto.id,
    currency: c.moeda,
    unit_amount: c.valorCentavos,
    recurring: { interval: c.intervalo, interval_count: c.aCada },
    metadata,
  });
  if ("erro" in preco) return preco;

  const link = await stripe<{ id: string; url: string }>("POST", "/payment_links", {
    line_items: [{ price: preco.id, quantity: 1 }],
    metadata,
    subscription_data: { metadata, description: c.descricao },
    after_completion: {
      type: "hosted_confirmation",
      hosted_confirmation: {
        custom_message: "Pagamento confirmado. Obrigado — falo com você em breve. Carlos Seiti",
      },
    },
  });
  if ("erro" in link) return link;

  const urlComEmail = c.email
    ? `${link.url}?prefilled_email=${encodeURIComponent(c.email)}`
    : link.url;
  return { id: link.id, url: link.url, urlComEmail };
}

export type LinkResumo = {
  id: string;
  url: string;
  ativo: boolean;
  cliente: string | null;
  email: string | null;
  produto: string;
  valor: string;
};

function formatarValor(centavos: number | null, moeda: string, intervalo?: string, aCada?: number) {
  const valor = new Intl.NumberFormat("pt-BR", { style: "currency", currency: moeda.toUpperCase() })
    .format((centavos ?? 0) / 100);
  if (!intervalo) return valor;
  const nomes: Record<string, [string, string]> = {
    day: ["dia", "dias"], week: ["semana", "semanas"], month: ["mês", "meses"], year: ["ano", "anos"],
  };
  const [um, varios] = nomes[intervalo] ?? [intervalo, intervalo];
  return `${valor} / ${aCada && aCada > 1 ? `${aCada} ${varios}` : um}`;
}

type PrecoStripe = {
  unit_amount: number | null;
  currency: string;
  recurring?: { interval: string; interval_count: number } | null;
  product: { name: string } | string;
};

/** Os links criados por este painel, mais recentes primeiro. */
export async function listarCobrancas(): Promise<LinkResumo[] | { erro: string }> {
  const r = await stripe<{
    data: { id: string; url: string; active: boolean; metadata: Record<string, string> }[];
  }>("GET", "/payment_links", { limit: 30 });
  if ("erro" in r) return r;

  const doPainel = r.data.filter((l) => l.metadata?.origem === "painel-cs");

  // A listagem não traz os itens; vão buscar-se link a link (são poucos).
  return Promise.all(
    doPainel.map(async (l) => {
      const itens = await stripe<{ data: { price: PrecoStripe }[] }>(
        "GET",
        `/payment_links/${l.id}/line_items`,
        { expand: ["data.price.product"] },
      );
      const preco = "erro" in itens ? null : itens.data[0]?.price;
      return {
        id: l.id,
        url: l.url,
        ativo: l.active,
        cliente: l.metadata.cliente ?? null,
        email: l.metadata.email ?? null,
        produto: preco && typeof preco.product === "object" ? preco.product.name : "—",
        valor: preco
          ? formatarValor(preco.unit_amount, preco.currency, preco.recurring?.interval, preco.recurring?.interval_count)
          : "—",
      };
    }),
  );
}

export async function desativarCobranca(id: string) {
  return stripe<{ id: string }>("POST", `/payment_links/${encodeURIComponent(id)}`, { active: false });
}

export type AssinaturaResumo = {
  id: string;
  estado: string;
  cliente: string;
  valor: string;
  proxima: string | null;
};

/** Quem já assinou — para ver se o link mandado virou cobrança de verdade. */
export async function listarAssinaturas(): Promise<AssinaturaResumo[] | { erro: string }> {
  const r = await stripe<{
    data: {
      id: string;
      status: string;
      customer: { email: string | null; name: string | null } | string;
      items: { data: { price: PrecoStripe; current_period_end?: number }[] };
    }[];
  }>("GET", "/subscriptions", { limit: 20, status: "all", expand: ["data.customer"] });
  if ("erro" in r) return r;

  return r.data.map((s) => {
    const item = s.items.data[0];
    const cli = typeof s.customer === "object" ? s.customer : null;
    return {
      id: s.id,
      estado: s.status,
      cliente: cli?.name || cli?.email || String(s.customer),
      valor: item
        ? formatarValor(item.price.unit_amount, item.price.currency, item.price.recurring?.interval, item.price.recurring?.interval_count)
        : "—",
      proxima: item?.current_period_end
        ? new Date(item.current_period_end * 1000).toLocaleDateString("pt-BR")
        : null,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Venda avulsa do Reset 21D — Checkout Session + webhook              */
/* ------------------------------------------------------------------ */

/**
 * Abre o checkout de pagamento único.
 *
 * Aqui é Checkout Session, e não Payment Link: cada sessão nasce presa a um
 * pedido nosso (`client_reference_id`), e é essa referência que o webhook
 * usa para liberar o acesso. A expiração de 24 h não incomoda — quem clica
 * em "comprar" paga na hora ou desiste.
 *
 * Os meios de pagamento (cartão, Pix, boleto) vêm do painel da Stripe
 * (pagamentos dinâmicos), por isso não são fixados aqui. O parcelamento no
 * cartão só aparece se a conta brasileira o tiver ativo.
 */
export async function criarSessaoCheckout(d: {
  referencia: string;
  email: string;
  nome: string;
  descricao: string;
  valorCentavos: number;
  moeda: string;
  urlSucesso: string;
  urlCancelar: string;
}): Promise<{ id: string; url: string } | { erro: string }> {
  const r = await stripe<{ id: string; url: string }>("POST", "/checkout/sessions", {
    mode: "payment",
    customer_email: d.email,
    client_reference_id: d.referencia,
    metadata: { referencia: d.referencia },
    payment_intent_data: { metadata: { referencia: d.referencia } },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: d.moeda.toLowerCase(),
          unit_amount: d.valorCentavos,
          product_data: { name: d.nome, description: d.descricao },
        },
      },
    ],
    payment_method_options: { card: { installments: { enabled: true } } },
    locale: "pt-BR",
    success_url: d.urlSucesso,
    cancel_url: d.urlCancelar,
  });
  if ("erro" in r) return r;
  return { id: r.id, url: r.url };
}

/**
 * Confere a assinatura `Stripe-Signature` (HMAC-SHA256 de `t.corpo`) com o
 * segredo do endpoint. Sem isto, qualquer POST na rota liberaria o produto.
 * Recusa eventos com mais de 5 minutos, para um corpo capturado não poder
 * ser reenviado depois.
 */
export async function eventoStripeValido(corpo: string, cabecalho: string | null): Promise<boolean> {
  const segredo = process.env.STRIPE_WEBHOOK_SECRET;
  if (!segredo || !cabecalho) return false;

  const partes = Object.fromEntries(
    cabecalho.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    }),
  ) as Record<string, string>;
  const t = Number(partes.t);
  const assinaturas = cabecalho
    .split(",")
    .filter((p) => p.trim().startsWith("v1="))
    .map((p) => p.trim().slice(3));
  if (!t || assinaturas.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - t) > 300) return false;

  const { createHmac, timingSafeEqual } = await import("node:crypto");
  const esperado = createHmac("sha256", segredo).update(`${t}.${corpo}`).digest();
  return assinaturas.some((a) => {
    const b = Buffer.from(a, "hex");
    return b.length === esperado.length && timingSafeEqual(b, esperado);
  });
}
