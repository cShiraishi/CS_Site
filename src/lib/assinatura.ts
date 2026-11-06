import crypto from "node:crypto";

/**
 * Verificação da assinatura do webhook do Mercado Pago — função pura.
 *
 * Vive separada de `pagamento.ts`, e recebe o segredo em vez de o ler do
 * ambiente, por uma razão prática: assim pode ser executada num teste.
 *
 * Isso importa mais do que parece. É fácil escrever uma verificação de
 * assinatura que recusa tudo — e os testes de segurança, que verificam
 * recusas, passam todos. O sintoma só aparece em produção, como
 * pagamentos aprovados que nunca libertam o produto, e é dos mais caros
 * de diagnosticar: do lado do cliente, o dinheiro saiu.
 *
 * O Mercado Pago assina o texto
 *
 *     id:<data.id>;request-id:<x-request-id>;ts:<ts>;
 *
 * com HMAC-SHA256 e a chave secreta do webhook, e envia o resultado no
 * cabeçalho `x-signature`, no formato `ts=...,v1=...`.
 */
export function assinaturaValida(entrada: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  segredo: string | undefined;
}): boolean {
  const { segredo, xSignature, xRequestId, dataId } = entrada;

  /*
   * Sem segredo configurado, recusa. É deliberado: entre recusar
   * pagamentos legítimos e libertar o produto a qualquer um que descubra
   * o endereço, recusar é o erro que se percebe e se corrige.
   */
  if (!segredo || !xSignature || !dataId) return false;

  let ts = "";
  let v1 = "";
  for (const parte of xSignature.split(",")) {
    const [nome, valor] = parte.split("=", 2);
    if (!nome || !valor) continue;
    const chave = nome.trim();
    if (chave === "ts") ts = valor.trim();
    else if (chave === "v1") v1 = valor.trim();
  }
  if (!ts || !v1) return false;

  // O id entra em minúsculas quando é alfanumérico — está na documentação
  // deles, e é a diferença entre validar e recusar tudo.
  const manifesto = `id:${dataId.toLowerCase()};request-id:${xRequestId ?? ""};ts:${ts};`;

  const esperado = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");

  /*
   * Comparação de tempo constante: `===` entre strings devolve assim que
   * encontra diferença, e o tempo que demora revela quantos caracteres
   * iniciais foram acertados — o suficiente para construir a assinatura
   * byte a byte.
   */
  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(v1, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** O texto que o Mercado Pago assina — exposto para teste e diagnóstico. */
export function manifesto(dataId: string, xRequestId: string, ts: string): string {
  return `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
}
