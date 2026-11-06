import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Quais figuras da escala já existem em `public/gordura/`.
 *
 * A escala é desenhada com ou sem as fotos: onde o arquivo ainda não
 * existe, a interface põe um cartão tipográfico no lugar. Perguntar ao
 * disco em vez de tentar carregar e falhar evita 404 no console e imagem
 * quebrada na tela — e deixa as fotos entrarem uma a uma, sem tocar em
 * código.
 */
const PASTA = path.join(process.cwd(), "public", "gordura");

export async function listarFigurasDeGordura(): Promise<string[]> {
  try {
    const itens = await readdir(PASTA, { withFileTypes: true });
    return itens
      .filter((i) => i.isFile() && /\.(png|jpe?g|webp|avif)$/i.test(i.name))
      .map((i) => `/gordura/${i.name}`);
  } catch {
    return [];
  }
}
