import type { Leitura } from "@/lib/leituras";
import type { Idioma } from "@/lib/rotas-idioma";

/**
 * Textos da Biblioteca, da página de leitura e do Leitor nos três idiomas.
 * Sem imports de Node: o Leitor (cliente) também lê daqui.
 *
 * Os livros em si são imagens de páginas em português — não há o que
 * traduzir dentro deles. Traduzimos a interface e, por slug, o título e o
 * subtítulo de cada livro.
 */

type TextosBiblioteca = {
  // ── Biblioteca ─────────────────────────────
  seoTitulo: string;
  seoDescricao: string;
  ogDescricao: string;
  ogAlt: string;
  voceEstaEm: string;
  inicio: string;
  biblioteca: string;
  eyebrow: (livros: number, paginas: number) => string;
  tituloLinhas: [string, string];
  sub: string;
  comecePorEste: string;
  lerAsPaginas: (total: number) => string;
  capaDe: (titulo: string) => string;
  todosOsTitulos: string;
  ponteTitulo: string;
  ponteTexto: string;
  comecarConsultoria: string;
  calcularCalorias: string;
  /** Nota discreta: o livro está em português. Vazia em PT. */
  notaIdioma: string;
  /** Nota no topo da biblioteca. Vazia em PT. */
  notaIdiomaGeral: string;
  jsonLdNome: string;
  jsonLdDescricao: string;

  // ── Leitura ────────────────────────────────
  leituraNaoEncontrada: string;
  leituraSeoTitulo: (titulo: string) => string;
  leituraDescricaoComSub: (subtitulo: string, total: number) => string;
  leituraDescricaoSemSub: (titulo: string, total: number) => string;
  leituraEyebrow: (total: number) => string;
  leuAteAqui: string;
  proximoPasso: string;
  voltarBiblioteca: string;

  // ── Leitor ─────────────────────────────────
  rotuloCapa: (total: number) => string;
  rotuloPaginas: (a: number, b: number | null, total: number) => string;
  rotuloPagina: (n: number, total: number) => string;
  paginaAnterior: string;
  proximaPagina: string;
  irParaPagina: string;
  telaCheia: string;
  sairTelaCheia: string;
  baixarPdf: string;
  dica: string;
};

export const TEXTOS_BIBLIOTECA: Record<Idioma, TextosBiblioteca> = {
  pt: {
    seoTitulo: "Biblioteca — os livros que eu escrevi",
    seoDescricao:
      "Guias de nutrição, treino, postura e método escritos por Carlos Seiti. Leia online, sem download e sem cadastro.",
    ogDescricao: "Nutrição, treino, postura e método — para ler direto no navegador.",
    ogAlt: "Biblioteca",
    voceEstaEm: "Você está em",
    inicio: "Início",
    biblioteca: "Biblioteca",
    eyebrow: (l, p) => `Biblioteca · ${l} livros · ${p} páginas`,
    tituloLinhas: ["Escrevi para", "você ler agora."],
    sub: "Guias de nutrição, treino, postura e método — com referência onde há evidência e o aviso onde não há. Abrem no navegador, sem download e sem cadastro.",
    comecePorEste: "Comece por este",
    lerAsPaginas: (t) => `Ler as ${t} páginas`,
    capaDe: (t) => `Capa de ${t}`,
    todosOsTitulos: "Todos os títulos",
    ponteTitulo: "Ler ajuda. Aplicar ao seu corpo é outra conversa.",
    ponteTexto:
      "Nenhum destes livros foi escrito para você em específico. É esse o vão que a consultoria preenche.",
    comecarConsultoria: "Começar consultoria",
    calcularCalorias: "Calcular minhas calorias",
    notaIdioma: "",
    notaIdiomaGeral: "",
    jsonLdNome: "Biblioteca",
    jsonLdDescricao:
      "Guias de nutrição, treino, postura e método escritos por Carlos Seiti, para ler online.",

    leituraNaoEncontrada: "Leitura não encontrada",
    leituraSeoTitulo: (t) => `${t} — leitura online`,
    leituraDescricaoComSub: (s, t) =>
      `${s}. Leia online, ${t} páginas, sem download obrigatório.`,
    leituraDescricaoSemSub: (ti, t) =>
      `Leia ${ti} online — ${t} páginas, direto no navegador.`,
    leituraEyebrow: (t) => `Leitura online · ${t} páginas`,
    leuAteAqui: "Leu até aqui?",
    proximoPasso: "Se o assunto interessa, o próximo passo é aplicar ao seu caso.",
    voltarBiblioteca: "Voltar à biblioteca",

    rotuloCapa: (t) => `Capa — página 1 de ${t}`,
    rotuloPaginas: (a, b, t) => `Páginas ${a}${b !== null ? ` e ${b}` : ""} de ${t}`,
    rotuloPagina: (n, t) => `Página ${n} de ${t}`,
    paginaAnterior: "Página anterior",
    proximaPagina: "Próxima página",
    irParaPagina: "Ir para a página",
    telaCheia: "Tela cheia",
    sairTelaCheia: "Sair da tela cheia",
    baixarPdf: "Baixar o PDF",
    dica: "Use as setas do teclado, clique nas laterais da página ou arraste a barra.",
  },

  es: {
    seoTitulo: "Biblioteca — los libros que escribí",
    seoDescricao:
      "Guías de nutrición, entrenamiento, postura y método escritas por Carlos Seiti. Léelas online, sin descargas y sin registro.",
    ogDescricao: "Nutrición, entrenamiento, postura y método — para leer directo en el navegador.",
    ogAlt: "Biblioteca",
    voceEstaEm: "Estás en",
    inicio: "Inicio",
    biblioteca: "Biblioteca",
    eyebrow: (l, p) => `Biblioteca · ${l} libros · ${p} páginas`,
    tituloLinhas: ["Lo escribí para", "que lo leas ahora."],
    sub: "Guías de nutrición, entrenamiento, postura y método — con referencias donde hay evidencia y la advertencia donde no la hay. Se abren en el navegador, sin descargas y sin registro.",
    comecePorEste: "Empieza por este",
    lerAsPaginas: (t) => `Leer las ${t} páginas`,
    capaDe: (t) => `Portada de ${t}`,
    todosOsTitulos: "Todos los títulos",
    ponteTitulo: "Leer ayuda. Aplicarlo a tu cuerpo es otra historia.",
    ponteTexto:
      "Ninguno de estos libros fue escrito específicamente para ti. Ese es el vacío que llena la asesoría.",
    comecarConsultoria: "Empezar asesoría",
    calcularCalorias: "Calcular mis calorías",
    notaIdioma: "Libro en portugués",
    notaIdiomaGeral: "Los libros están en portugués.",
    jsonLdNome: "Biblioteca",
    jsonLdDescricao:
      "Guías de nutrición, entrenamiento, postura y método escritas por Carlos Seiti, para leer online.",

    leituraNaoEncontrada: "Lectura no encontrada",
    leituraSeoTitulo: (t) => `${t} — lectura online`,
    leituraDescricaoComSub: (s, t) =>
      `${s}. Léelo online, ${t} páginas, sin descargas obligatorias. Libro en portugués.`,
    leituraDescricaoSemSub: (ti, t) =>
      `Lee ${ti} online — ${t} páginas, directo en el navegador. Libro en portugués.`,
    leituraEyebrow: (t) => `Lectura online · ${t} páginas`,
    leuAteAqui: "¿Llegaste hasta aquí?",
    proximoPasso: "Si el tema te interesa, el siguiente paso es aplicarlo a tu caso.",
    voltarBiblioteca: "Volver a la biblioteca",

    rotuloCapa: (t) => `Portada — página 1 de ${t}`,
    rotuloPaginas: (a, b, t) => `Páginas ${a}${b !== null ? ` y ${b}` : ""} de ${t}`,
    rotuloPagina: (n, t) => `Página ${n} de ${t}`,
    paginaAnterior: "Página anterior",
    proximaPagina: "Página siguiente",
    irParaPagina: "Ir a la página",
    telaCheia: "Pantalla completa",
    sairTelaCheia: "Salir de pantalla completa",
    baixarPdf: "Descargar el PDF",
    dica: "Usa las flechas del teclado, haz clic en los lados de la página o arrastra la barra.",
  },

  en: {
    seoTitulo: "Library — the books I wrote",
    seoDescricao:
      "Nutrition, training, posture, and method guides written by Carlos Seiti. Read online — no download, no sign-up.",
    ogDescricao: "Nutrition, training, posture, and method — read right in your browser.",
    ogAlt: "Library",
    voceEstaEm: "You are here",
    inicio: "Home",
    biblioteca: "Library",
    eyebrow: (l, p) => `Library · ${l} books · ${p} pages`,
    tituloLinhas: ["I wrote these", "for you to read now."],
    sub: "Nutrition, training, posture, and method guides — with references where there's evidence and a warning where there isn't. They open in your browser, no download and no sign-up.",
    comecePorEste: "Start with this one",
    lerAsPaginas: (t) => `Read all ${t} pages`,
    capaDe: (t) => `Cover of ${t}`,
    todosOsTitulos: "All titles",
    ponteTitulo: "Reading helps. Applying it to your body is another story.",
    ponteTexto:
      "None of these books was written for you specifically. That's the gap coaching fills.",
    comecarConsultoria: "Start coaching",
    calcularCalorias: "Calculate my calories",
    notaIdioma: "Book in Portuguese",
    notaIdiomaGeral: "The books are in Portuguese.",
    jsonLdNome: "Library",
    jsonLdDescricao:
      "Nutrition, training, posture, and method guides written by Carlos Seiti, to read online.",

    leituraNaoEncontrada: "Book not found",
    leituraSeoTitulo: (t) => `${t} — read online`,
    leituraDescricaoComSub: (s, t) =>
      `${s}. Read online, ${t} pages, no download required. Book in Portuguese.`,
    leituraDescricaoSemSub: (ti, t) =>
      `Read ${ti} online — ${t} pages, right in your browser. Book in Portuguese.`,
    leituraEyebrow: (t) => `Read online · ${t} pages`,
    leuAteAqui: "Made it this far?",
    proximoPasso: "If the topic interests you, the next step is applying it to your case.",
    voltarBiblioteca: "Back to the library",

    rotuloCapa: (t) => `Cover — page 1 of ${t}`,
    rotuloPaginas: (a, b, t) => `Pages ${a}${b !== null ? ` and ${b}` : ""} of ${t}`,
    rotuloPagina: (n, t) => `Page ${n} of ${t}`,
    paginaAnterior: "Previous page",
    proximaPagina: "Next page",
    irParaPagina: "Go to page",
    telaCheia: "Full screen",
    sairTelaCheia: "Exit full screen",
    baixarPdf: "Download the PDF",
    dica: "Use your keyboard arrows, click the sides of the page, or drag the slider.",
  },
};

/**
 * Título e subtítulo de cada livro em ES/EN, por slug. Em PT vale o que está
 * no `livro.json`; livro novo sem entrada aqui cai no título original.
 */
const LIVROS: Record<string, Partial<Record<"es" | "en", { titulo: string; subtitulo: string | null }>>> = {
  "macro-e-micro": {
    es: { titulo: "Macro y Micro", subtitulo: "La guía esencial de los nutrientes" },
    en: { titulo: "Macro & Micro", subtitulo: "The essential guide to nutrients" },
  },
  postura: {
    es: { titulo: "Postura", subtitulo: "Descubre tu patrón. Corrígelo en ocho semanas." },
    en: { titulo: "Posture", subtitulo: "Find your pattern. Fix it in eight weeks." },
  },
  "pre-treinos-naturais": {
    es: {
      titulo: "Pre-entrenos que funcionan",
      subtitulo: "Lo que la ciencia respalda y lo que la industria vende",
    },
    en: {
      titulo: "Pre-workouts that work",
      subtitulo: "What science supports and what the industry sells",
    },
  },
  "mente-em-foco": {
    es: {
      titulo: "Mente enfocada",
      subtitulo: "Suplementos para el rendimiento mental: qué funciona y qué es marketing",
    },
    en: {
      titulo: "Focused Mind",
      subtitulo: "Supplements for mental performance: what works and what's just marketing",
    },
  },
  "estude-menos": {
    es: {
      titulo: "Estudia menos. Aprende más.",
      subtitulo: "23 fichas para concentrarte, aprender y organizar tu rutina",
    },
    en: {
      titulo: "Study less. Learn more.",
      subtitulo: "23 worksheets to focus, learn, and organize your routine",
    },
  },
};

/** O livro com título/subtítulo no idioma pedido (PT volta intacto). */
export function livroNoIdioma<T extends Pick<Leitura, "slug" | "titulo" | "subtitulo">>(
  livro: T,
  idioma: Idioma,
): T {
  if (idioma === "pt") return livro;
  const t = LIVROS[livro.slug]?.[idioma];
  return t ? { ...livro, titulo: t.titulo, subtitulo: t.subtitulo } : livro;
}
