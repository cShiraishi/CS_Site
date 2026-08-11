#!/usr/bin/env python
"""
Prepara um PDF para o leitor online.

    python scripts/preparar-livro.py caminho/do/arquivo.pdf meu-livro \
        --titulo "Título" --subtitulo "Uma linha"

Converte cada página em WebP, extrai o texto (para leitores de tela e
para o Ctrl+F do navegador) e escreve um manifesto. Depois disso o
livro já aparece em /leitura/meu-livro — nenhum código precisa mudar.

Por que imagens e não pdf.js: renderizar PDF no navegador custa cerca
de 1 MB de JavaScript. Aqui as páginas são imagens comuns, passam pela
otimização do next/image (AVIF/WebP) e o bundle não cresce um byte.

Requer PyMuPDF:  pip install pymupdf
"""

import argparse
import json
import shutil
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Falta o PyMuPDF. Instale com:  pip install pymupdf")


RAIZ = Path(__file__).resolve().parent.parent


def preparar(
    pdf: Path,
    slug: str,
    titulo: str | None,
    subtitulo: str | None,
    largura_alvo: int,
    qualidade: int,
    com_download: bool,
) -> None:
    if not pdf.is_file():
        sys.exit(f"Não encontrei o arquivo: {pdf}")

    destino = RAIZ / "public" / "leitura" / slug
    if destino.exists():
        shutil.rmtree(destino)
    destino.mkdir(parents=True)

    doc = fitz.open(pdf)
    if doc.page_count == 0:
        sys.exit("O PDF não tem páginas.")

    primeira = doc[0].rect
    proporcao = primeira.width / primeira.height

    # Páginas em paisagem viram folheto de página única: duas lado a
    # lado dariam algo como 32:9, largo demais para ler.
    modo = "unico" if proporcao > 1.05 else "duplo"

    paginas = []
    for i, pagina in enumerate(doc):
        escala = largura_alvo / pagina.rect.width
        pix = pagina.get_pixmap(matrix=fitz.Matrix(escala, escala), alpha=False)

        nome = f"p-{i + 1:03d}.webp"
        pix.pil_save(destino / nome, format="WEBP", quality=qualidade, method=6)

        texto = " ".join(pagina.get_text().split())
        paginas.append({"arquivo": nome, "texto": texto})

        tamanho = (destino / nome).stat().st_size / 1024
        print(f"  {nome}  {pix.width}×{pix.height}  {tamanho:>6.0f} KB")

    arquivo_pdf = None
    if com_download:
        arquivo_pdf = f"{slug}.pdf"
        shutil.copy2(pdf, destino / arquivo_pdf)

    manifesto = {
        "slug": slug,
        "titulo": titulo or pdf.stem.replace("_", " "),
        "subtitulo": subtitulo,
        "modo": modo,
        "proporcao": round(proporcao, 4),
        "largura": largura_alvo,
        "altura": round(largura_alvo / proporcao),
        "total": len(paginas),
        "pdf": arquivo_pdf,
        "paginas": paginas,
    }

    (destino / "livro.json").write_text(
        json.dumps(manifesto, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    peso = sum(f.stat().st_size for f in destino.iterdir()) / 1024 / 1024
    print(
        f"\nPronto: {len(paginas)} páginas, modo '{modo}', {peso:.1f} MB no total."
        f"\nDisponível em /leitura/{slug}"
    )
    if peso > 8:
        print(
            "\nAviso: passou de 8 MB. Considere --largura 1400 ou --qualidade 75 "
            "para não pesar no carregamento."
        )


def main() -> None:
    p = argparse.ArgumentParser(description="Prepara um PDF para o leitor online.")
    p.add_argument("pdf", type=Path, help="caminho do PDF")
    p.add_argument("slug", help="identificador na URL, ex.: guia-de-macros")
    p.add_argument("--titulo", help="título exibido no leitor")
    p.add_argument("--subtitulo", help="uma linha abaixo do título")
    p.add_argument("--largura", type=int, default=1600, help="largura em px (padrão 1600)")
    p.add_argument("--qualidade", type=int, default=82, help="qualidade WebP (padrão 82)")
    p.add_argument(
        "--sem-download",
        action="store_true",
        help="não copiar o PDF original para download",
    )
    a = p.parse_args()

    preparar(
        a.pdf, a.slug, a.titulo, a.subtitulo, a.largura, a.qualidade, not a.sem_download
    )


if __name__ == "__main__":
    main()
