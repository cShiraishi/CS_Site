import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Cada livro é uma pasta em `public/leitura/<slug>/`, criada pelo
 * script `scripts/preparar-livro.py`. Nada aqui precisa ser editado
 * quando um livro novo entra — basta rodar o script.
 */

export type PaginaLivro = {
  arquivo: string;
  /** texto da página, para leitores de tela e busca do navegador */
  texto: string;
};

export type Leitura = {
  slug: string;
  titulo: string;
  subtitulo: string | null;
  /** "duplo" = página dupla de livro; "unico" = folheto de página única */
  modo: "duplo" | "unico";
  proporcao: number;
  largura: number;
  altura: number;
  total: number;
  pdf: string | null;
  paginas: PaginaLivro[];
};

const PASTA = path.join(process.cwd(), "public", "leitura");

export async function listarLeituras(): Promise<string[]> {
  try {
    const itens = await readdir(PASTA, { withFileTypes: true });
    return itens.filter((i) => i.isDirectory()).map((i) => i.name);
  } catch {
    // Sem nenhum livro preparado ainda — a rota simplesmente não existe.
    return [];
  }
}

export async function lerLeitura(slug: string): Promise<Leitura | null> {
  // O slug vem da URL: barra a fuga da pasta antes de tocar no disco.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  try {
    const cru = await readFile(path.join(PASTA, slug, "livro.json"), "utf-8");
    return JSON.parse(cru) as Leitura;
  } catch {
    return null;
  }
}

export async function todasAsLeituras(): Promise<Leitura[]> {
  const slugs = await listarLeituras();
  const livros = await Promise.all(slugs.map(lerLeitura));
  return livros.filter((l): l is Leitura => l !== null);
}
