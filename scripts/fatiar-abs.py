# -*- coding: utf-8 -*-
"""Fatia a tira de níveis de abdômen em PNGs individuais, um por painel.

A tira vem com os painéis lado a lado, uma faixa preta no topo com os
números e fundo preto em volta de cada corpo. Aqui:

  1. corta a faixa dos números (a numeração é da montagem, não do site);
  2. divide em N colunas iguais;
  3. em cada coluna, enquadra o torso pelo que é pele, não pelo retângulo
     da célula — os corpos não estão centrados na tira, e recortar pela
     célula deixa tarja preta de um lado só;
  4. corta a altura logo abaixo do short, onde a imagem vira só preto.
"""
import sys
from PIL import Image

ORIGEM, DESTINO, PREFIXO = sys.argv[1], sys.argv[2], sys.argv[3]
PERCENTUAIS = [int(x) for x in sys.argv[4].split(",")]
N = len(PERCENTUAIS)

# Quanto se descarta de cada lado do painel. Quanto maior, mais fechado no
# abdômen — e menos chance de entrar o braço do vizinho. Quanto a montagem
# é apertada varia de tira para tira, por isso é argumento.
FOLGA = float(sys.argv[5]) if len(sys.argv) > 5 else 0.10

im = Image.open(ORIGEM).convert("RGB")
L, A = im.size
px = im.load()

LIMIAR = 70


def claro(x, y):
    r, g, b = px[x, y]
    return (r + g + b) / 3 > LIMIAR


def primeira_linha_de_pele():
    for y in range(A):
        if sum(1 for x in range(0, L, 4) if claro(x, y)) > (L / 4) * 0.55:
            return y
    return 0


topo = primeira_linha_de_pele()
largura = L / N
recortes = []

"""
Enquadramento horizontal: pelas divisórias reais, não pela célula teórica.

Duas tentativas mais simples falharam. Enquadrar pelo contorno da pele puxa
os braços junto e, como cada modelo tem uma largura, padronizar pelo maior
deixa tarja preta nos mais estreitos. Dividir em N partes iguais assume que
o corpo está centrado na sua célula — verdade na tira masculina, falso na
feminina, onde o recorte trouxe o braço do painel vizinho.

O que é estável nas duas: entre um painel e outro há uma coluna quase sem
pele. Procurando o mínimo de pele numa janela em torno de cada limite
teórico, acha-se a divisória onde ela de fato está, e a montagem pode ser
tão irregular quanto for.
"""
JANELA = 0.14  # busca ±14 % da largura de um painel em torno do limite teórico


def pele_na_coluna(x, y0, y1):
    return sum(1 for y in range(y0, y1, 3) if claro(x, y))


faixa_tronco = (topo + int((A - topo) * 0.10), topo + int((A - topo) * 0.45))

cortes = [0]
for i in range(1, N):
    alvo = i * largura
    janela = range(
        max(1, int(alvo - largura * JANELA)),
        min(L - 1, int(alvo + largura * JANELA)),
    )
    cortes.append(min(janela, key=lambda x: pele_na_coluna(x, *faixa_tronco)))
cortes.append(L)
print("divisorias:", [round(c) for c in cortes])

for i in range(N):
    cx0, cx1 = cortes[i], cortes[i + 1]

    """
    Fim do corte: o short.

    "Última linha com pele" não serve — na tira feminina as pernas
    continuam abaixo do short e o recorte ia até os joelhos. O short é a
    primeira faixa escura contínua depois do umbigo, e é onde a imagem
    deixa de dizer qualquer coisa sobre gordura abdominal.
    """
    larg_celula = cx1 - cx0
    miolo = [
        int(cx0 + larg_celula * 0.35),
        int(cx0 + larg_celula * 0.5),
        int(cx0 + larg_celula * 0.65),
    ]
    escuro_desde = None
    fim = A
    for y in range(topo + int((A - topo) * 0.35), A):
        if sum(1 for x in miolo if claro(x, y)) == 0:
            if escuro_desde is None:
                escuro_desde = y
            elif y - escuro_desde > (A - topo) * 0.06:
                fim = escuro_desde + int((A - topo) * 0.05)
                break
        else:
            escuro_desde = None

    recortes.append((cx0, cx1, fim))


def mediana(valores):
    v = sorted(valores)
    return v[len(v) // 2]


# Uma largura e uma altura só para todos, ambas pela mediana: os cartões
# precisam do mesmo tamanho para a grade não dançar, e um único painel
# medido torto — divisória fora do lugar, short que a busca não fecha —
# arrastaria os seis se o critério fosse o mínimo ou o máximo.
larg = int(mediana([b - a for a, b, _ in recortes]) * (1 - 2 * FOLGA))
alt = mediana([f - topo for _, _, f in recortes])

for i, (a, b, f) in enumerate(recortes):
    centro = (a + b) // 2
    x0 = max(0, min(L - larg, centro - larg // 2))
    painel = im.crop((x0, topo, x0 + larg, min(A, topo + alt)))
    nome = "%s/%s-%02d.png" % (DESTINO, PREFIXO, PERCENTUAIS[i])
    painel.save(nome, optimize=True)
    print(nome, painel.size)

# ── realce, só quando a tira de origem é pequena para o tamanho em que o
# cartão a exibe. Ampliar com Lanczos e aplicar máscara de nitidez não
# inventa detalhe, mas evita o borrão do upscale automático do navegador.
# Com uma tira em boa resolução isso não é preciso — e reamostrar de graça
# só perderia nitidez.
from PIL import ImageFilter  # noqa: E402
import glob, os  # noqa: E402

ALVO = 340  # largura suficiente para o cartão em telas de alta densidade

for arq in sorted(glob.glob(os.path.join(DESTINO, PREFIXO + "-*.png"))):
    im2 = Image.open(arq)
    if im2.width >= ALVO:
        print("sem realce (já tem resolução):", os.path.basename(arq), im2.size)
        continue
    fator = ALVO / im2.width
    im2 = im2.resize((round(im2.width * fator), round(im2.height * fator)), Image.LANCZOS)
    im2 = im2.filter(ImageFilter.UnsharpMask(radius=2.2, percent=110, threshold=3))
    im2.save(arq, optimize=True)
    print("realce:", os.path.basename(arq), im2.size)
