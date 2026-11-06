import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";

import { NextResponse, type NextRequest } from "next/server";

import { temAcesso } from "@/lib/pedidos";
import { PROGRAMA } from "@/lib/produto";
import { porArquivo } from "@/lib/protocolos";

/**
 * Serve um protocolo em PDF — só para quem comprou.
 *
 * Os ficheiros vivem em `protocolos/`, na raiz do projeto, e não em
 * `public/`. A diferença é a única coisa que separa um produto pago de um
 * produto de graça: tudo o que está em `public/` é servido pelo CDN sem
 * passar por código nenhum, e o endereço acaba por ser descoberto — por
 * um motor de busca, por um print partilhado, ou por alguém que leu o
 * HTML da área de entrega.
 *
 * Duas regras aqui, e nenhuma é opcional:
 *
 *  · O nome pedido NUNCA é usado para construir um caminho. Ele é
 *    procurado no catálogo, e o caminho é montado a partir do que o
 *    catálogo devolve. Sem isso, `..%2f..%2f.env.local` é um nome de
 *    ficheiro perfeitamente válido.
 *  · Quem decide se pode é `temAcesso()`, que lê a base de dados com a
 *    sessão do utilizador e deixa a política de RLS responder.
 */

export const dynamic = "force-dynamic";

/** A pasta dos protocolos, relativa à raiz do projeto. */
const PASTA = join(process.cwd(), "protocolos");

export async function GET(
  _req: NextRequest,
  contexto: { params: Promise<{ arquivo: string }> },
) {
  const { arquivo } = await contexto.params;

  /*
   * Primeiro o catálogo, e só depois a autenticação. A ordem importa
   * pouco para a segurança e muito para o diagnóstico: um 404 aqui quer
   * sempre dizer "este protocolo não existe", nunca "existe mas você não
   * pode" — e isso é o que se quer ler num registo de erros.
   */
  const protocolo = porArquivo(arquivo);
  if (!protocolo || !protocolo.pronto) {
    return NextResponse.json({ erro: "protocolo não encontrado" }, { status: 404 });
  }

  if (!(await temAcesso(PROGRAMA.slug))) {
    return NextResponse.json({ erro: "sem acesso" }, { status: 403 });
  }

  const caminho = join(PASTA, protocolo.arquivo);

  let tamanho: number;
  try {
    tamanho = (await stat(caminho)).size;
  } catch {
    /*
     * Marcado como pronto no catálogo mas ausente em disco. É falha
     * nossa, não do cliente: o 500 é deliberado para aparecer nos alertas
     * em vez de se disfarçar de 404.
     */
    console.error(`[protocolos] ${protocolo.arquivo} está no catálogo e não em disco`);
    return NextResponse.json({ erro: "protocolo indisponível" }, { status: 500 });
  }

  const corpo = Readable.toWeb(
    createReadStream(caminho),
  ) as unknown as ReadableStream<Uint8Array>;

  return new NextResponse(corpo, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(tamanho),
      // `inline` abre no leitor do navegador; o nome é o que aparece se a
      // pessoa guardar.
      "Content-Disposition": `inline; filename="${protocolo.arquivo}"`,
      // Nunca em cache partilhada: o CDN guardaria um PDF pago e passaria
      // a servi-lo sem consultar esta rota outra vez.
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
