/**
 * Percentual de gordura corporal — cálculo puro, sem interface.
 *
 * Duas estimativas, nesta ordem de preferência:
 *
 *  · Circunferências (Hodgdon & Beckett, 1984 — o método da Marinha dos
 *    EUA). Fita métrica em casa, erro padrão de 3 a 4 pontos percentuais
 *    contra pesagem hidrostática. É o melhor que se consegue sem
 *    equipamento.
 *  · IMC (Deurenberg, 1991) — só para quem não tem fita à mão. Erro maior,
 *    e sistemático: subestima em quem tem muita massa magra e superestima
 *    em quem tem pouca. Está aqui para não perder a pessoa na porta, com o
 *    aviso de que é a estimativa fraca.
 *
 * As duas devolvem **faixa, não número**. Dizer "23,4 %" a partir de uma
 * fita métrica é fingir uma precisão que o método não tem — e é
 * exatamente o que as calculadoras da internet fazem.
 */

import type { Sexo } from "./calorias";

export type Metodo = "fita" | "imc";

/** Erro padrão da estimativa, em pontos percentuais. */
const ERRO = { fita: 3.5, imc: 5 } as const;

export type Medidas = {
  sexo: Sexo;
  /** anos — usado apenas na estimativa por IMC */
  idade: number;
  /** quilogramas */
  peso: number;
  /** centímetros */
  altura: number;
  /** centímetros, na parte mais estreita, abaixo do pomo de adão */
  pescoco?: number;
  /** centímetros, na altura do umbigo */
  cintura?: number;
  /** centímetros, na parte mais larga — só na equação feminina */
  quadril?: number;
};

export type Estimativa = {
  metodo: Metodo;
  /** percentual, uma casa decimal */
  valor: number;
  min: number;
  max: number;
};

const log10 = Math.log10;

/** Arredonda para uma casa e prende a resultados fisiologicamente possíveis. */
function fechar(bf: number, metodo: Metodo): Estimativa | null {
  if (!Number.isFinite(bf)) return null;

  const uma = (n: number) => Math.round(Math.max(2, Math.min(75, n)) * 10) / 10;
  const erro = ERRO[metodo];

  return {
    metodo,
    valor: uma(bf),
    min: uma(bf - erro),
    max: uma(bf + erro),
  };
}

/**
 * Método da Marinha dos EUA. A equação feminina inclui o quadril porque a
 * distribuição de gordura difere — sem essa medida ela não vale.
 */
export function estimarPorFita(m: Medidas): Estimativa | null {
  const { sexo, altura, pescoco, cintura, quadril } = m;

  if (!(altura > 0) || !(pescoco && pescoco > 0) || !(cintura && cintura > 0))
    return null;

  if (sexo === "masculino") {
    // Cintura menor que o pescoço quebra o logaritmo — e é sempre erro de
    // medição, não anatomia.
    const circ = cintura - pescoco;
    if (circ <= 0) return null;

    return fechar(
      495 / (1.0324 - 0.19077 * log10(circ) + 0.15456 * log10(altura)) - 450,
      "fita",
    );
  }

  if (!(quadril && quadril > 0)) return null;
  const circ = cintura + quadril - pescoco;
  if (circ <= 0) return null;

  return fechar(
    495 / (1.29579 - 0.35004 * log10(circ) + 0.221 * log10(altura)) - 450,
    "fita",
  );
}

/** Deurenberg — a saída de emergência para quem não tem fita métrica. */
export function estimarPorImc(m: Medidas): Estimativa | null {
  const { sexo, idade, peso, altura } = m;
  if (!(peso > 0) || !(altura > 0) || !(idade > 0)) return null;

  const imc = peso / (altura / 100) ** 2;
  return fechar(
    1.2 * imc + 0.23 * idade - 10.8 * (sexo === "masculino" ? 1 : 0) - 5.4,
    "imc",
  );
}

export function estimar(m: Medidas, metodo: Metodo): Estimativa | null {
  return metodo === "fita" ? estimarPorFita(m) : estimarPorImc(m);
}

/* ============================================================
   VALIDAÇÃO — o que a equação não consegue recusar sozinha
   ============================================================ */

/**
 * Faixas plausíveis por campo, em unidades humanas.
 *
 * O clamp de `fechar()` protege a aritmética, mas transforma erro de
 * digitação em resultado convincente: altura em metros (1,76 em vez de 176)
 * atravessa a equação da Marinha e sai como "75,0 %" com faixa, categoria e
 * plano de perder cinquenta quilos. Um número absurdo tem de ser recusado
 * antes de virar diagnóstico.
 */
export const LIMITES = {
  idade: [14, 100],
  peso: [30, 300],
  altura: [120, 230],
  pescoco: [20, 70],
  cintura: [40, 200],
  quadril: [50, 220],
} as const satisfies Record<string, readonly [number, number]>;

export type Campo = keyof typeof LIMITES;

/** Campo vazio não é campo errado — só o preenchido fora da faixa é. */
export function foraDaFaixa(campo: Campo, valor: number): boolean {
  if (!Number.isFinite(valor) || valor === 0) return false;
  const [min, max] = LIMITES[campo];
  return valor < min || valor > max;
}

export type Impedimento =
  | { tipo: "faltam-medidas"; campos: Campo[] }
  | { tipo: "fora-da-faixa"; campos: Campo[] }
  | { tipo: "cintura-menor-que-pescoco" };

/**
 * Por que ainda não há resultado.
 *
 * `estimarPorFita` devolve `null` tanto para "faltou um campo" quanto para
 * "cintura menor que o pescoço", e a interface não consegue distinguir os
 * dois: quem mede errado recebe "preencha os campos" com os campos todos
 * preenchidos, e fica sem saber o que refazer.
 */
export function diagnosticar(m: Medidas, metodo: Metodo): Impedimento | null {
  const obrigatorios: Campo[] =
    metodo === "fita"
      ? [
          "altura",
          "pescoco",
          "cintura",
          ...(m.sexo === "feminino" ? (["quadril"] as Campo[]) : []),
        ]
      : ["idade", "peso", "altura"];

  const valor = (c: Campo) => m[c as keyof Medidas] as number | undefined;

  const errados = (Object.keys(LIMITES) as Campo[]).filter((c) =>
    foraDaFaixa(c, valor(c) ?? 0),
  );
  if (errados.length) return { tipo: "fora-da-faixa", campos: errados };

  const faltando = obrigatorios.filter((c) => !(Number(valor(c)) > 0));
  if (faltando.length) return { tipo: "faltam-medidas", campos: faltando };

  if (metodo === "fita" && m.cintura && m.pescoco && m.cintura <= m.pescoco) {
    return { tipo: "cintura-menor-que-pescoco" };
  }

  return null;
}

/** O que ainda falta para montar o plano, além da estimativa em si. */
export function faltaParaOPlano(m: Medidas): Campo[] {
  return (["peso", "idade"] as Campo[]).filter(
    (c) => !((m[c as keyof Medidas] as number) > 0),
  );
}

export const NOME_DO_CAMPO: Record<Campo, string> = {
  idade: "a idade",
  peso: "o peso",
  altura: "a altura",
  pescoco: "o pescoço",
  cintura: "a cintura",
  quadril: "o quadril",
};

/* ============================================================
   CLASSIFICAÇÃO — faixas do American Council on Exercise
   ============================================================ */

export type Categoria = {
  id: string;
  nome: string;
  /** limite superior da faixa; o último é aberto */
  ate: number;
  nota: string;
};

const ACE: Record<Sexo, Categoria[]> = {
  masculino: [
    {
      id: "essencial",
      nome: "Gordura essencial",
      ate: 6,
      nota: "Abaixo do mínimo fisiológico. Não é um alvo — é um estado de risco.",
    },
    {
      id: "atleta",
      nome: "Atleta",
      ate: 14,
      nota: "Faixa de quem treina há anos com dieta controlada.",
    },
    {
      id: "fitness",
      nome: "Em forma",
      ate: 18,
      nota: "Silhueta definida, sustentável o ano inteiro.",
    },
    {
      id: "aceitavel",
      nome: "Média saudável",
      ate: 25,
      nota: "Dentro do normal para a população adulta.",
    },
    {
      id: "acima",
      nome: "Acima da faixa",
      ate: Infinity,
      nota: "Associada a risco cardiometabólico aumentado.",
    },
  ],
  feminino: [
    {
      id: "essencial",
      nome: "Gordura essencial",
      ate: 14,
      nota: "Abaixo do mínimo fisiológico. Costuma vir com perda de ciclo menstrual.",
    },
    {
      id: "atleta",
      nome: "Atleta",
      ate: 21,
      nota: "Faixa de quem treina há anos com dieta controlada.",
    },
    {
      id: "fitness",
      nome: "Em forma",
      ate: 25,
      nota: "Silhueta definida, sustentável o ano inteiro.",
    },
    {
      id: "aceitavel",
      nome: "Média saudável",
      ate: 32,
      nota: "Dentro do normal para a população adulta.",
    },
    {
      id: "acima",
      nome: "Acima da faixa",
      ate: Infinity,
      nota: "Associada a risco cardiometabólico aumentado.",
    },
  ],
};

export function classificar(bf: number, sexo: Sexo): Categoria {
  const faixas = ACE[sexo];
  return faixas.find((c) => bf < c.ate) ?? faixas[faixas.length - 1];
}

/** A régua inteira, para desenhar a posição da pessoa na escala. */
export function faixasDe(sexo: Sexo): Categoria[] {
  return ACE[sexo];
}

/* ============================================================
   ESCALA VISUAL — onde a pessoa quer chegar
   ============================================================ */

export type Nivel = {
  id: string;
  /** o percentual que representa o nível, usado como alvo do plano */
  bf: number;
  de: number;
  ate: number;
  nome: string;
  /** o que se vê nesse percentual, sem promessa */
  descricao: string;
  /**
   * Arquivo em `public/gordura/`. Sem ele, a interface desenha um cartão
   * tipográfico no lugar — a escala funciona antes das fotos existirem.
   */
  figura?: string;
  /** condição de palco: possível, mas não é para se manter o ano todo */
  temporario?: boolean;
};

/**
 * Os degraus, do mais magro ao mais alto. Os cortes acompanham as faixas
 * do ACE acima — a escala visual e a classificação de saúde precisam
 * contar a mesma história, senão a ferramenta se contradiz.
 *
 * Os seis primeiros degraus masculinos são os seis painéis da tira de
 * referência, com o percentual que cada um de fato representa (de ~7 % a
 * ~17 %). Os dois últimos existem porque é onde está boa parte de quem
 * chega aqui: sem eles, ninguém acima de 19 % se reconheceria na escala.
 * Ainda não têm foto correspondente — e um cartão tipográfico honesto é
 * melhor que rotular um corpo de 16 % como se fosse de 27 %.
 */
export const NIVEIS: Record<Sexo, Nivel[]> = {
  masculino: [
    {
      id: "h-palco",
      bf: 7,
      de: 4,
      ate: 8,
      nome: "Palco",
      descricao:
        "Abdômen completo e veias aparentes. Condição de competição.",
      figura: "/gordura/h-07.png",
      temporario: true,
    },
    {
      id: "h-seco",
      bf: 9,
      de: 8,
      ate: 10,
      nome: "Muito seco",
      descricao:
        "Oito gomos parado, sem retenção.",
      figura: "/gordura/h-09.png",
    },
    {
      id: "h-definido",
      bf: 11,
      de: 10,
      ate: 12,
      nome: "Definido",
      descricao:
        "Seis quadrados sem contrair, com o V do quadril.",
      figura: "/gordura/h-11.png",
    },
    {
      id: "h-atletico",
      bf: 13,
      de: 12,
      ate: 14,
      nome: "Atlético",
      descricao:
        "Abdômen visível com boa luz.",
      figura: "/gordura/h-13.png",
    },
    {
      id: "h-forma",
      bf: 15,
      de: 14,
      ate: 16,
      nome: "Em forma",
      descricao:
        "Parte de cima do abdômen à mostra.",
      figura: "/gordura/h-15.png",
    },
    {
      id: "h-plano",
      bf: 17,
      de: 16,
      ate: 19,
      nome: "Barriga plana",
      descricao:
        "Barriga lisa, sem sobra na cintura.",
      figura: "/gordura/h-17.png",
    },
    {
      id: "h-medio",
      bf: 22,
      de: 19,
      ate: 26,
      nome: "Médio",
      descricao:
        "Acúmulo à frente do abdômen.",
    },
    {
      id: "h-acima",
      bf: 30,
      de: 26,
      ate: 50,
      nome: "Acima",
      descricao:
        "Cintura maior que o tórax.",
    },
  ],
  feminino: [
    {
      id: "m-palco",
      bf: 13,
      de: 10,
      ate: 14.5,
      nome: "Palco",
      descricao:
        "Abdômen marcado e quadríceps separado. Condição de competição.",
      figura: "/gordura/m-13.png",
      temporario: true,
    },
    {
      id: "m-seca",
      bf: 16,
      de: 14.5,
      ate: 17.5,
      nome: "Muito seca",
      descricao: "Seis gomos parado, ombro desenhado.",
      figura: "/gordura/m-16.png",
    },
    {
      id: "m-definida",
      bf: 19,
      de: 17.5,
      ate: 20,
      nome: "Definida",
      descricao:
        "Parte de cima do abdômen e oblíquos à mostra.",
      figura: "/gordura/m-19.png",
    },
    {
      id: "m-atletica",
      bf: 21,
      de: 20,
      ate: 22,
      nome: "Atlética",
      descricao: "Linha central do abdômen, cintura marcada.",
      figura: "/gordura/m-21.png",
    },
    {
      id: "m-forma",
      bf: 23,
      de: 22,
      ate: 24,
      nome: "Em forma",
      descricao:
        "Barriga chapada, definição só contraindo.",
      figura: "/gordura/m-23.png",
    },
    {
      id: "m-plana",
      bf: 25,
      de: 24,
      ate: 27,
      nome: "Barriga plana",
      descricao:
        "Silhueta harmônica, sem sobra na cintura.",
      figura: "/gordura/m-25.png",
    },
    {
      id: "m-media",
      bf: 30,
      de: 27,
      ate: 34,
      nome: "Média",
      descricao: "Acúmulo em quadril e coxa.",
    },
    {
      id: "m-acima",
      bf: 38,
      de: 34,
      ate: 55,
      nome: "Acima",
      descricao:
        "Distribuição mais uniforme.",
    },
  ],
};

/** Em que degrau a pessoa está hoje — para marcar o ponto de partida. */
export function nivelDe(bf: number, sexo: Sexo): Nivel {
  const escala = NIVEIS[sexo];
  return (
    escala.find((n) => bf >= n.de && bf < n.ate) ??
    (bf < escala[0].de ? escala[0] : escala[escala.length - 1])
  );
}

/* ============================================================
   DO ALVO VISUAL AO PESO ALVO
   ============================================================ */

export function massaMagra(peso: number, bf: number): number {
  return peso * (1 - bf / 100);
}

/**
 * O peso que corresponde ao percentual desejado **mantendo a massa magra**.
 *
 * É a conta que quase nenhuma calculadora faz, e é a que muda a conversa:
 * a pessoa não quer pesar 70 kg, quer o abdômen que aparece aos 12 % — e
 * são coisas diferentes. Assumir massa magra constante é otimista de
 * propósito? Não: é o resultado de um corte bem conduzido, com proteína
 * alta e treino de força. Perder massa magra junto é o que acontece
 * quando o processo é mal feito, e não é o que se planeja.
 */
export function pesoParaBf(
  peso: number,
  bfAtual: number,
  bfAlvo: number,
): number | null {
  if (
    !(peso > 0) ||
    !(bfAtual > 0) ||
    !(bfAlvo > 0) ||
    bfAtual >= 100 ||
    bfAlvo >= 100
  ) {
    return null;
  }
  const magra = massaMagra(peso, bfAtual);
  return Math.round((magra / (1 - bfAlvo / 100)) * 10) / 10;
}

/** Quilos de gordura a perder (ou ganhar) entre dois percentuais. */
export function gorduraAPerder(
  peso: number,
  bfAtual: number,
  bfAlvo: number,
): number | null {
  const alvo = pesoParaBf(peso, bfAtual, bfAlvo);
  if (alvo === null) return null;
  return Math.round((peso - alvo) * 10) / 10;
}
