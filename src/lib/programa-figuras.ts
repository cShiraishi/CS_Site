import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Quais figuras da escala corporal já existem em `public/programa/shapes/`.
 *
 * Mesmo princípio de `gordura-figuras.ts`: o funil é desenhado com ou sem
 * as imagens, e onde o arquivo ainda não existe a interface põe um cartão
 * tipográfico no lugar. Perguntar ao disco em vez de tentar carregar e
 * falhar evita 404 na consola e imagem quebrada na tela.
 *
 * Aqui isso vale ainda mais: as 16 figuras saem do `scripts/gerar-shapes.py`
 * uma a uma, e algumas vão precisar de duas ou três tentativas até o
 * conjunto parecer o mesmo corpo. O funil tem de estar de pé e vendável no
 * meio desse processo.
 */
const PASTA = path.join(process.cwd(), "public", "programa", "shapes");

export async function listarFigurasDeShape(): Promise<string[]> {
  try {
    const itens = await readdir(PASTA, { withFileTypes: true });
    return itens
      .filter((i) => i.isFile() && /\.(webp|png|jpe?g|avif)$/i.test(i.name))
      .map((i) => `/programa/shapes/${i.name}`);
  } catch {
    return [];
  }
}
