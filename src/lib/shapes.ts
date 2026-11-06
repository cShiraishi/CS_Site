/**
 * A escala visual do corpo — do que a pessoa é hoje ao que ela quer ser.
 *
 * O funil não pergunta percentual de gordura: ninguém sabe o próprio. Ele
 * mostra oito silhuetas e deixa a pessoa apontar. O número vem depois, por
 * trás, a partir da figura escolhida.
 *
 * Os centros das faixas seguem as referências do American Council on
 * Exercise, que é o que dá sentido aos rótulos:
 *
 *   homens   · atleta 6–13 · em forma 14–17 · aceitável 18–24 · acima 25+
 *   mulheres · atleta 14–20 · em forma 21–24 · aceitável 25–31 · acima 32+
 *
 * Duas decisões que valem registro:
 *
 *  1. A escala vai muito além das figuras de `public/gordura/`, que param
 *     em 17 % (h) e 25 % (m). Aquelas servem a calculadora de gordura,
 *     onde a pessoa compara para se estimar — todas magras, porque é a
 *     faixa onde o olho erra mais. Aqui o trabalho é outro: a maioria de
 *     quem entra no funil está ACIMA do topo daquela escala, e uma escala
 *     que não contém a pessoa não a deixa dizer onde está.
 *
 *  2. Os rótulos descrevem o que se vê, não o que se diagnostica. "Acima
 *     do peso" é informação; "obeso" é uma consulta médica que esta tela
 *     não teve. O funil que ofende na segunda pergunta não chega na quinta.
 */

import type { Sexo } from "./calorias";

export type Nivel = {
  /** id curto e estável — entra na URL do funil e no nome do arquivo */
  id: string;
  /** percentual de gordura no centro da faixa que a figura representa */
  gordura: number;
  /** o que a pessoa reconhece ao olhar, sem jargão */
  rotulo: string;
};

/**
 * Oito níveis por sexo. Oito é o maior número que ainda cabe em duas
 * linhas de quatro no telemóvel sem a figura ficar pequena demais para
 * se reconhecer nela — e reconhecimento é a única coisa que esta tela faz.
 */
export const ESCALA: Record<Sexo, readonly Nivel[]> = {
  masculino: [
    { id: "h1", gordura: 8, rotulo: "Definido" },
    { id: "h2", gordura: 12, rotulo: "Atlético" },
    { id: "h3", gordura: 16, rotulo: "Em forma" },
    { id: "h4", gordura: 20, rotulo: "Normal" },
    { id: "h5", gordura: 25, rotulo: "Leve excesso" },
    { id: "h6", gordura: 30, rotulo: "Abdômen saliente" },
    { id: "h7", gordura: 35, rotulo: "Acima do peso" },
    { id: "h8", gordura: 40, rotulo: "Bem acima do peso" },
  ],
  feminino: [
    { id: "m1", gordura: 16, rotulo: "Definida" },
    { id: "m2", gordura: 20, rotulo: "Atlética" },
    { id: "m3", gordura: 24, rotulo: "Em forma" },
    { id: "m4", gordura: 28, rotulo: "Normal" },
    { id: "m5", gordura: 32, rotulo: "Leve excesso" },
    { id: "m6", gordura: 36, rotulo: "Excesso moderado" },
    { id: "m7", gordura: 42, rotulo: "Acima do peso" },
    { id: "m8", gordura: 48, rotulo: "Bem acima do peso" },
  ],
} as const;

export function nivel(sexo: Sexo, id: string): Nivel | null {
  return ESCALA[sexo].find((n) => n.id === id) ?? null;
}

/** Caminho da figura. O arquivo pode não existir ainda — ver `figurasDisponiveis`. */
export function figura(id: string): string {
  return `/programa/shapes/${id}.webp`;
}

/**
 * Distância entre dois níveis, em passos da escala.
 *
 * Negativo = quer emagrecer (sobe na escala, para um id menor). O sinal
 * importa: o mesmo salto de três passos é um corte ou um bulk, e as duas
 * coisas não se planejam igual.
 */
export function passos(sexo: Sexo, de: string, para: string): number | null {
  const lista = ESCALA[sexo];
  const i = lista.findIndex((n) => n.id === de);
  const j = lista.findIndex((n) => n.id === para);
  if (i < 0 || j < 0) return null;
  return j - i;
}

/* ============================================================
   DO SHAPE DESEJADO AO PESO QUE ELE IMPLICA
   ============================================================ */

/**
 * Qual peso corresponde ao shape que a pessoa escolheu.
 *
 * A conta assume massa magra constante, o que é a hipótese conservadora:
 *
 *     massa magra = peso × (1 − %GC / 100)
 *     peso no alvo = massa magra ÷ (1 − %GC alvo / 100)
 *
 * Isso existe porque o funil pergunta duas coisas que podem discordar — a
 * silhueta desejada e o peso desejado. "Quero 60 kg" e "quero este corpo"
 * costumam ser metas diferentes, e quase sempre é o peso que está errado:
 * a pessoa escolheu um número que ouviu, e a silhueta é o que ela de fato
 * quer. Sem esta conta, o programa persegue o número e entrega outro corpo.
 *
 * Com treino de força a massa magra sobe, então o peso real no alvo tende
 * a ficar ACIMA deste — e é por isso que o resultado se mede na cintura e
 * na foto, não na balança.
 */
export function pesoNoAlvo(
  peso: number,
  gorduraAtual: number,
  gorduraAlvo: number,
): number | null {
  if (!(peso > 0)) return null;
  if (!(gorduraAtual > 0) || gorduraAtual >= 70) return null;
  if (!(gorduraAlvo > 0) || gorduraAlvo >= 70) return null;

  const massaMagra = peso * (1 - gorduraAtual / 100);
  return Math.round((massaMagra / (1 - gorduraAlvo / 100)) * 10) / 10;
}

/* ============================================================
   COERÊNCIA ENTRE O QUE SE VÊ E O QUE SE PESA
   ============================================================ */

/**
 * A pessoa informa peso e altura, e separadamente aponta uma silhueta. As
 * duas coisas podem se contradizer — alguém de IMC 22 que se aponta no
 * nível mais pesado da escala, ou o contrário.
 *
 * Isto não é erro de digitação a ser recusado: é percepção corporal, e ela
 * é exatamente o que o programa vai trabalhar. Mas vale saber, porque o
 * plano deve ancorar no número medido e não na autoimagem — e porque a
 * página de resultado fala diferente com quem se vê pior do que está.
 */
export type Leitura = "coerente" | "severa" | "branda";

export function conferir(
  sexo: Sexo,
  idNivel: string,
  peso: number,
  altura: number,
  idade: number,
): Leitura {
  const n = nivel(sexo, idNivel);
  if (!n || !(peso > 0) || !(altura > 0) || !(idade > 0)) return "coerente";

  // Deurenberg, a mesma estimativa grosseira de `gordura.ts`. Serve aqui
  // porque a pergunta é "a ordem de grandeza bate?", não "quanto é?".
  const imc = peso / (altura / 100) ** 2;
  const estimada =
    1.2 * imc + 0.23 * idade - 10.8 * (sexo === "masculino" ? 1 : 0) - 5.4;

  // Uma faixa larga de propósito: o erro da própria Deurenberg é de ~5
  // pontos, e dois níveis da escala distam 4 a 6. Menos que isso e metade
  // das pessoas receberia um aviso que é ruído do método.
  const folga = 8;
  if (n.gordura > estimada + folga) return "severa";
  if (n.gordura < estimada - folga) return "branda";
  return "coerente";
}
