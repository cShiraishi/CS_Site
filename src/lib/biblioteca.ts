/**
 * A biblioteca.
 *
 * Para adicionar um livro, acrescente um item em LIVROS. Nada mais
 * precisa ser tocado — as trilhas são montadas a partir da `trilha`
 * de cada livro, na ordem em que aparecem em TRILHAS.
 *
 * `capa` é opcional: sem imagem, o site desenha uma capa tipográfica
 * na identidade da marca. Para usar arte real, coloque o arquivo em
 * `public/biblioteca/` e aponte aqui (ex.: "/biblioteca/burn.jpg").
 */

export type Trilha =
  | "fundamentos"
  | "nutricao"
  | "treino"
  | "comportamento";

export type Livro = {
  slug: string;
  titulo: string;
  autor: string;
  ano?: number;
  trilha: Trilha;
  /** Uma linha: o que este livro resolve. */
  chamada: string;
  /** Por que ele está aqui, na primeira pessoa. */
  porque: string;
  nivel: "Introdução" | "Intermediário" | "Técnico";
  capa?: string;
  link?: string;
  /** Destaque da página — só um livro deve ter isto. */
  destaque?: boolean;
};

export const TRILHAS: { id: Trilha; nome: string; descricao: string }[] = [
  {
    id: "fundamentos",
    nome: "Fundamentos",
    descricao: "A base fisiológica. Sem isso, o resto é opinião.",
  },
  {
    id: "nutricao",
    nome: "Nutrição aplicada",
    descricao: "Do laboratório para o prato.",
  },
  {
    id: "treino",
    nome: "Treino e hipertrofia",
    descricao: "O outro lado da equação.",
  },
  {
    id: "comportamento",
    nome: "Comportamento e adesão",
    descricao: "O que realmente decide se o plano sobrevive.",
  },
];

export const LIVROS: Livro[] = [
  {
    slug: "burn",
    titulo: "Burn",
    autor: "Herman Pontzer",
    ano: 2021,
    trilha: "fundamentos",
    nivel: "Introdução",
    destaque: true,
    chamada: "Por que exercício sozinho não emagrece.",
    porque:
      "Pontzer mediu gasto energético em caçadores-coletores e achou o que ninguém esperava: eles gastam quase o mesmo que um office worker. O livro desmonta a ideia de que dá para compensar dieta ruim com mais treino — e explica por que o corpo se adapta ao que você faz com ele.",
  },
  {
    slug: "fisiologia-do-exercicio",
    titulo: "Fisiologia do Exercício",
    autor: "McArdle, Katch & Katch",
    trilha: "fundamentos",
    nivel: "Técnico",
    chamada: "A referência. Densa, e vale cada página.",
    porque:
      "É o calhamaço que todo mundo da área cita e poucos leram inteiro. Não se lê de capa a capa — se consulta. Se você quer entender de onde vêm os números que as calculadoras cospem, a origem está aqui.",
  },
  {
    slug: "krause",
    titulo: "Krause: Alimentos, Nutrição e Dietoterapia",
    autor: "Mahan & Raymond",
    trilha: "fundamentos",
    nivel: "Técnico",
    chamada: "Nutrição clínica do começo ao fim.",
    porque:
      "Referência de curso de nutrição no mundo inteiro. Entra aqui porque emagrecimento raramente acontece no vácuo: tem tireoide, tem medicação, tem resistência à insulina. Saber onde a nutrição esportiva encosta na clínica evita besteira.",
  },
  {
    slug: "advanced-sports-nutrition",
    titulo: "Advanced Sports Nutrition",
    autor: "Dan Benardot",
    trilha: "nutricao",
    nivel: "Intermediário",
    chamada: "Timing, hidratação e periodização alimentar.",
    porque:
      "Benardot é dos poucos que trata disponibilidade energética com a seriedade que o tema merece. Bom para quem já entendeu o básico de calorias e quer saber o que fazer com a distribuição ao longo do dia.",
  },
  {
    slug: "piramide-nutricao",
    titulo: "The Muscle and Strength Pyramid: Nutrition",
    autor: "Eric Helms, Andy Morgan & Andrea Valdez",
    trilha: "nutricao",
    nivel: "Intermediário",
    chamada: "Hierarquia: o que importa primeiro.",
    porque:
      "A ideia central vale o livro inteiro: adesão na base, depois calorias, depois macros, depois timing, e suplemento no topo — o andar mais fino da pirâmide. É a estrutura mental que uso para decidir o que ajustar quando alguém trava.",
  },
  {
    slug: "piramide-treino",
    titulo: "The Muscle and Strength Pyramid: Training",
    autor: "Eric Helms, Andy Morgan & Andrea Valdez",
    trilha: "treino",
    nivel: "Intermediário",
    chamada: "A mesma lógica, aplicada ao treino.",
    porque:
      "Volume, intensidade e frequência na ordem certa de prioridade. Resolve a ansiedade de trocar de programa a cada dois meses procurando o método perfeito.",
  },
  {
    slug: "hipertrofia-schoenfeld",
    titulo: "Science and Development of Muscle Hypertrophy",
    autor: "Brad Schoenfeld",
    trilha: "treino",
    nivel: "Técnico",
    chamada: "O que a evidência diz sobre ganhar músculo.",
    porque:
      "Schoenfeld publicou boa parte da literatura que o livro revisa. É denso e ele mesmo aponta onde a evidência ainda é fraca — o que, para mim, é o melhor sinal de honestidade que um autor pode dar.",
  },
  {
    slug: "habitos-atomicos",
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    ano: 2018,
    trilha: "comportamento",
    nivel: "Introdução",
    chamada: "Sistemas ganham de força de vontade.",
    porque:
      "Nenhum protocolo funciona se a pessoa não consegue executá-lo numa terça-feira difícil. Este livro é sobre desenhar o ambiente para que o certo seja o caminho fácil — o que é metade do meu trabalho.",
  },
  {
    slug: "por-que-nos-dormimos",
    titulo: "Por Que Nós Dormimos",
    autor: "Matthew Walker",
    ano: 2017,
    trilha: "comportamento",
    nivel: "Introdução",
    chamada: "A variável que ninguém mede e todo mundo estraga.",
    porque:
      "Dormir mal aumenta fome, piora a recuperação e derruba a adesão. É a intervenção mais barata que existe e a primeira que eu olho quando o plano está certo e o resultado não vem. Leia com espírito crítico: algumas passagens foram contestadas depois da publicação.",
  },
  {
    slug: "rapido-e-devagar",
    titulo: "Rápido e Devagar",
    autor: "Daniel Kahneman",
    ano: 2011,
    trilha: "comportamento",
    nivel: "Intermediário",
    chamada: "Por que decidimos mal sobre comida.",
    porque:
      "Não é um livro de nutrição, e é por isso que está aqui. Entender viés de disponibilidade e aversão à perda explica metade das escolhas alimentares ruins — inclusive as minhas.",
  },
];

export const destaque = LIVROS.find((l) => l.destaque) ?? LIVROS[0];

export function porTrilha(id: Trilha) {
  return LIVROS.filter((l) => l.trilha === id);
}

/**
 * Capa tipográfica: um par de tons derivado do slug, para que cada
 * livro tenha a sua e ela não mude entre renderizações.
 */
export function tomDaCapa(slug: string) {
  const soma = [...slug].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const tons = [
    "linear-gradient(155deg, #2A2724 0%, #1D1B19 100%)",
    "linear-gradient(155deg, #3A3229 0%, #1D1B19 100%)",
    "linear-gradient(155deg, #8C673F 0%, #4A3826 100%)",
    "linear-gradient(155deg, #C7A06A 0%, #8C673F 100%)",
    "linear-gradient(155deg, #F7F5F2 0%, #DED9D6 100%)",
  ];
  const i = soma % tons.length;
  return { fundo: tons[i], claro: i === 4 };
}
