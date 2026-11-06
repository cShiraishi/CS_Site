#!/usr/bin/env python3
"""
Gera as figuras da escala corporal do Programa 90 Dias com o gpt-image-1.

Por que pré-gerar, e não gerar na hora:

  · Latência. O seletor de silhueta é a segunda tela do funil. Uma chamada
    de geração de imagem leva dezenas de segundos — é o funil inteiro
    perdido ali.
  · Custo. Seria uma geração por visita, para mostrar sempre a mesma coisa.
  · Consistência, que é a razão de fundo. O valor do seletor vem de as
    figuras parecerem o MESMO corpo em níveis diferentes de gordura. Isso
    só se consegue com um conjunto fechado, revisado a olho e versionado
    junto com o código. Gerado na hora, cada visitante veria oito corpos
    de oito pessoas diferentes, e a comparação — que é a única coisa que a
    tela faz — deixaria de existir.

A escala NÃO é definida aqui. Ela vive em `src/lib/shapes.ts`, e este
script a lê de lá: se alguém acrescentar um nível no TypeScript sem
descrever o corpo aqui, o script falha em vez de gerar silenciosamente um
conjunto incompleto.

Uso:
    export OPENAI_API_KEY=sk-...
    python scripts/gerar-shapes.py --ensaio          # só imprime os prompts
    python scripts/gerar-shapes.py --so h4           # um nível
    python scripts/gerar-shapes.py                   # o que falta
    python scripts/gerar-shapes.py --forcar          # regera tudo

Nada é sobrescrito sem `--forcar`: as figuras aprovadas a olho são o
produto, e uma regeração acidental troca o conjunto todo por outro.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

# O console do Windows abre em cp1252 e troca os acentos por "?" no meio
# das mensagens. Nada a ver com os arquivos gerados — só com a legibilidade
# de quem está a olhar para o terminal.
for fluxo in (sys.stdout, sys.stderr):
    if hasattr(fluxo, "reconfigure"):
        fluxo.reconfigure(encoding="utf-8", errors="replace")

RAIZ = Path(__file__).resolve().parent.parent
ESCALA_TS = RAIZ / "src" / "lib" / "shapes.ts"
DESTINO = RAIZ / "public" / "programa" / "shapes"

API = "https://api.openai.com/v1/images/generations"
MODELO = "gpt-image-1"

# Retrato: o corpo inteiro em pé não cabe num quadrado sem sobrar vazio dos
# lados, e o vazio é o que faz a figura parecer pequena no telemóvel.
TAMANHO = "1024x1536"


# ============================================================
# O PROMPT
# ============================================================

# A parte invariável. Tudo que define "o mesmo corpo" mora aqui, e é
# repetido palavra por palavra em todas as figuras: pose, enquadramento,
# material, luz, fundo. A única coisa que muda entre dois níveis é a frase
# de composição corporal — é isso que faz a escala ser uma escala.
#
# "Featureless mannequin" não é pudor: é o que mantém a figura como
# instrumento de medida em vez de foto do corpo de outra pessoa. Um avatar
# com rosto convida à comparação com um estranho; sem rosto, a pessoa se
# projeta nele.
BASE = (
    "A single 3D-rendered anatomical human body figure, {sexo}, standing in a neutral "
    "frontal A-pose, arms held slightly away from the torso, palms facing inward, feet "
    "shoulder-width apart, weight evenly distributed. "
    "The figure is a smooth matte clay sculpture in uniform dark graphite grey (#3A3734), "
    "like an artist's anatomical reference figure or a shop mannequin: completely "
    "featureless — no facial features, no hair, no nipples, no genitalia, no clothing, "
    "no skin texture or detail. Abstract anatomical form only, not a photograph of a person. "
    "Soft three-point studio lighting from the upper left, gentle falloff, subtle rim light "
    "on the right edge, soft contact shadow under the feet. "
    "Full body from the top of the head to the soles of the feet, perfectly centered, "
    "vertical framing, the figure occupying 88 percent of the frame height with even margins. "
    "Fully transparent background. Editorial product-photography quality, neutral and clinical. "
    "No text, no watermark, no measurement lines, no grid, no props, no second figure. "
    "Body composition: {corpo}."
)

SEXO = {
    "h": "adult male, average height, broad shoulders relative to hips",
    "m": "adult female, average height, hips slightly wider than shoulders",
}

# Uma descrição por id da escala de `shapes.ts`.
#
# A progressão segue onde a gordura realmente se deposita, e os dois sexos
# diferem nisso: no masculino o acúmulo é abdominal e troncular; no
# feminino vai primeiro para quadril, coxa e glúteo, e o abdômen avança
# depois. Uma escala feminina que só engrossa a barriga não é reconhecida
# por ninguém.
CORPOS = {
    # --- masculino -------------------------------------------------
    "h1": (
        "very lean and athletic at about 8 percent body fat, fully visible six-pack "
        "abdominal definition, sharp separation between shoulder, chest and arm muscles, "
        "visible serratus and obliques, forearm veins, narrow waist"
    ),
    "h2": (
        "athletic and clearly defined at about 12 percent body fat, abdominal muscles "
        "visible but with softer edges, defined chest and shoulders, flat lower abdomen, "
        "narrow waist"
    ),
    "h3": (
        "fit and healthy at about 16 percent body fat, flat abdomen with no visible "
        "six-pack, moderate overall muscle tone, slight softness at the lower abdomen"
    ),
    "h4": (
        "average build at about 20 percent body fat, no muscle definition, a slightly "
        "soft and rounded lower abdomen that sits level with the chest, fuller waist"
    ),
    "h5": (
        "noticeably soft at about 25 percent body fat, a modest belly projecting slightly "
        "past the chest line, thicker waist, mild fat over the chest, softer upper arms"
    ),
    "h6": (
        "overweight at about 30 percent body fat, clearly protruding rounded abdomen, "
        "thick waist with fat over the lower back and flanks, wider torso, fuller chest "
        "and upper arms"
    ),
    "h7": (
        "substantially overweight at about 35 percent body fat, large rounded abdomen "
        "projecting well forward, thick waist and flanks, heavy upper back, fuller arms "
        "and thighs, neck noticeably thicker"
    ),
    "h8": (
        "heavily overweight at about 40 percent body fat, very large rounded abdomen "
        "projecting far forward and hanging slightly, broad thick torso with no waist "
        "taper, substantial fat over the chest and upper back, thick limbs"
    ),
    # --- feminino --------------------------------------------------
    "m1": (
        "very lean and athletic at about 16 percent body fat, visible abdominal "
        "definition, defined shoulders and arms, narrow waist with clear taper, "
        "lean hips and thighs, athletic glutes"
    ),
    "m2": (
        "athletic and toned at about 20 percent body fat, flat abdomen with a faint "
        "centre line, defined shoulders, clear waist-to-hip taper, firm thighs and glutes"
    ),
    "m3": (
        "fit and healthy at about 24 percent body fat, flat abdomen without definition, "
        "soft natural curves, moderate tone, slightly fuller hips and thighs"
    ),
    "m4": (
        "average build at about 28 percent body fat, slightly rounded lower abdomen, "
        "fuller hips, thighs and glutes, soft upper arms, waist still narrower than hips"
    ),
    "m5": (
        "noticeably soft at about 32 percent body fat, rounded lower abdomen, "
        "clearly fuller hips and outer thighs, softer upper arms, waist beginning to "
        "thicken, pear-shaped distribution"
    ),
    "m6": (
        "overweight at about 36 percent body fat, rounded protruding abdomen, "
        "substantially fuller hips, thighs and glutes, thicker waist with soft flanks, "
        "fuller upper arms and bust"
    ),
    "m7": (
        "substantially overweight at about 42 percent body fat, large rounded abdomen, "
        "wide hips and heavy thighs, thick waist with little taper, heavy upper arms, "
        "fuller upper back"
    ),
    "m8": (
        "heavily overweight at about 48 percent body fat, very large rounded abdomen "
        "projecting forward and hanging slightly, very wide hips and thick thighs that "
        "touch, no waist definition, substantial fat over the upper arms, bust and back"
    ),
}


def montar_prompt(id_nivel: str) -> str:
    corpo = CORPOS[id_nivel]
    sexo = SEXO[id_nivel[0]]
    return BASE.format(sexo=sexo, corpo=corpo)


# ============================================================
# A ESCALA, LIDA DO TYPESCRIPT
# ============================================================


def ler_escala() -> list[tuple[str, int]]:
    """
    Extrai (id, gordura) de `ESCALA` em shapes.ts, na ordem em que aparecem.

    Ler o TypeScript em vez de repetir a lista aqui é deliberado: duas
    cópias de uma escala divergem na primeira vez que alguém mexe só numa
    delas, e o sintoma seria uma figura faltando em produção.
    """
    if not ESCALA_TS.exists():
        sys.exit(f"não encontrei {ESCALA_TS}")

    texto = ESCALA_TS.read_text(encoding="utf-8")
    pares = re.findall(
        r'\{\s*id:\s*"([a-z0-9]+)"\s*,\s*gordura:\s*(\d+)', texto
    )
    if not pares:
        sys.exit(f"não achei nenhum nível em {ESCALA_TS} — o formato de ESCALA mudou?")

    return [(i, int(g)) for i, g in pares]


def conferir(escala: list[tuple[str, int]]) -> None:
    """Todo nível do TypeScript precisa de um corpo descrito aqui, e vice-versa."""
    ids_ts = {i for i, _ in escala}
    ids_py = set(CORPOS)

    if faltam := ids_ts - ids_py:
        sys.exit(
            "estes níveis existem em shapes.ts e não têm descrição em CORPOS: "
            + ", ".join(sorted(faltam))
        )
    if sobram := ids_py - ids_ts:
        sys.exit(
            "estes níveis têm descrição em CORPOS e não existem mais em shapes.ts: "
            + ", ".join(sorted(sobram))
        )


# ============================================================
# A CHAMADA
# ============================================================


def chave() -> str:
    if valor := os.environ.get("OPENAI_API_KEY"):
        return valor

    # Conveniência: a chave também é aceita no .env.local do projeto, que é
    # onde as outras já estão. O arquivo está no .gitignore.
    env = RAIZ / ".env.local"
    if env.exists():
        for linha in env.read_text(encoding="utf-8").splitlines():
            if linha.strip().startswith("OPENAI_API_KEY="):
                return linha.split("=", 1)[1].strip().strip("\"'")

    sys.exit(
        "falta a OPENAI_API_KEY. Exporte no ambiente ou acrescente ao .env.local:\n"
        "  OPENAI_API_KEY=sk-..."
    )


def gerar(prompt: str, qualidade: str, token: str) -> tuple[bytes, dict]:
    corpo = json.dumps(
        {
            "model": MODELO,
            "prompt": prompt,
            "n": 1,
            "size": TAMANHO,
            "quality": qualidade,
            # Fundo transparente deixa a figura assentar sobre o porcelana
            # da página sem um retângulo visível em volta — e sobre o
            # grafite, quando ela aparece em cima do escuro.
            "background": "transparent",
            "output_format": "webp",
            # A figura é um manequim anatômico sem rosto e sem detalhe. Com
            # a moderação no padrão, parte das descrições de corpo cai no
            # filtro sem motivo.
            "moderation": "low",
        }
    ).encode("utf-8")

    pedido = urllib.request.Request(
        API,
        data=corpo,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(pedido, timeout=300) as resposta:
            dados = json.load(resposta)
    except urllib.error.HTTPError as erro:
        detalhe = erro.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {erro.code}: {detalhe[:600]}") from erro
    except urllib.error.URLError as erro:
        raise RuntimeError(f"rede: {erro.reason}") from erro

    item = dados["data"][0]
    if "b64_json" not in item:
        raise RuntimeError(f"resposta sem imagem: {json.dumps(item)[:400]}")

    return base64.b64decode(item["b64_json"]), dados.get("usage") or {}


# ============================================================


def main() -> int:
    ap = argparse.ArgumentParser(description="Gera as figuras da escala corporal.")
    ap.add_argument("--ensaio", action="store_true", help="só imprime os prompts")
    ap.add_argument("--so", metavar="ID", help="gera apenas este nível, ex. h4")
    ap.add_argument("--forcar", action="store_true", help="regera o que já existe")
    ap.add_argument(
        "--qualidade",
        default="high",
        choices=("low", "medium", "high"),
        help="qualidade da geração (padrão: high)",
    )
    args = ap.parse_args()

    escala = ler_escala()
    conferir(escala)

    alvos = [(i, g) for i, g in escala if not args.so or i == args.so]
    if args.so and not alvos:
        sys.exit(f"nível '{args.so}' não existe na escala")

    if args.ensaio:
        for id_nivel, gordura in alvos:
            print(f"\n{'=' * 70}\n{id_nivel} — {gordura}% de gordura\n{'=' * 70}")
            print(montar_prompt(id_nivel))
        print(f"\n{len(alvos)} prompt(s). Nada foi gerado: isto é um ensaio.")
        return 0

    DESTINO.mkdir(parents=True, exist_ok=True)
    token = chave()

    feitos, pulados, falhas = 0, 0, []

    for id_nivel, gordura in alvos:
        arquivo = DESTINO / f"{id_nivel}.webp"

        if arquivo.exists() and not args.forcar:
            print(f"  ·  {id_nivel}  já existe, pulando (use --forcar para regerar)")
            pulados += 1
            continue

        print(f"  →  {id_nivel}  ({gordura}% de gordura) … ", end="", flush=True)
        try:
            imagem, uso = gerar(montar_prompt(id_nivel), args.qualidade, token)
        except RuntimeError as erro:
            print("FALHOU")
            print(f"       {erro}")
            falhas.append(id_nivel)
            continue

        arquivo.write_bytes(imagem)
        kb = len(imagem) / 1024
        tokens = uso.get("total_tokens")
        print(f"ok  ({kb:.0f} kB{f', {tokens} tokens' if tokens else ''})")
        feitos += 1

    print(f"\n{feitos} gerada(s), {pulados} pulada(s), {len(falhas)} falha(s)")
    if falhas:
        print("falharam: " + ", ".join(falhas))
        print("Repita só nelas com --so <id>. O filtro de conteúdo às vezes recusa")
        print("uma descrição que passa na tentativa seguinte, sem nada mudar.")
        return 1

    print(f"\nFiguras em {DESTINO.relative_to(RAIZ)}")
    print("Confira as oito de cada sexo lado a lado antes de publicar: o conjunto")
    print("precisa parecer o mesmo corpo em níveis diferentes, e é isso que a")
    print("geração automática erra com mais frequência.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
