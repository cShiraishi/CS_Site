import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROTA = "/programa-90-dias";

type Pagina = import("@playwright/test").Page;

/**
 * Os campos são `input type="number"`, que tem role "spinbutton" e não
 * "textbox" — e o rótulo traz a unidade ("Peso (kg)"), então o nome
 * acessível não é exato. Daí a âncora de início.
 */
const campo = (page: Pagina, nome: string) =>
  page.getByRole("spinbutton", { name: new RegExp(`^${nome}`) });

const continuar = (page: Pagina) =>
  page.getByRole("button", { name: /^Continuar/ }).click();

/**
 * Espera o passo trocar.
 *
 * Os passos 2 e 3 mostram as mesmas oito silhuetas: sem esperar, o clique
 * seguinte cai no passo anterior e responde a pergunta errada — que é
 * exatamente o toque fantasma que a trava do componente evita.
 */
const noPasso = (page: Pagina, n: number) =>
  page.getByText(`Passo ${n} de 7`).waitFor();

/**
 * Homem de 95 kg que quer 78 — 17 kg, que não cabem em 90 dias no ritmo
 * seguro. É o caso que exercita a recusa honesta, que é a razão de ser
 * daquela tela.
 *
 * Sexo e silhuetas não levam clique em "Continuar": escolha única avança
 * sozinha, e é justamente isso que os três primeiros passos verificam.
 */
async function percorrerHomem(page: Pagina) {
  await page.goto(ROTA);

  await page.getByRole("button", { name: "Homem" }).click();
  await noPasso(page, 2);
  await page.getByRole("radio", { name: /Abdômen saliente/ }).click();
  await noPasso(page, 3);
  await page.getByRole("radio", { name: /Em forma/ }).click();
  await noPasso(page, 4);

  await campo(page, "Idade").fill("35");
  await campo(page, "Altura").fill("178");
  await campo(page, "Peso").fill("95");
  await continuar(page);

  await campo(page, "Peso desejado").fill("78");
  await continuar(page);

  await page.getByRole("button", { name: /Moderadamente ativo/ }).click();
  await page.getByRole("button", { name: /^Academia/ }).click();
  await continuar(page);

  await page.getByRole("button", { name: /Estou voltando/ }).click();
  await page.getByRole("button", { name: "4 dias de treino por semana" }).click();

  await page.getByRole("button", { name: /Ver meu programa/ }).click();
}

test("escolha única avança sozinha, sem pedir confirmação", async ({ page }) => {
  await page.goto(ROTA);

  await expect(page.getByText("Passo 1 de 7")).toBeVisible();
  await page.getByRole("button", { name: "Homem" }).click();

  // Sem tocar em "Continuar": o toque na opção já é a resposta.
  await expect(page.getByText("Passo 2 de 7")).toBeVisible();

  await page.getByRole("radio", { name: /Abdômen saliente/ }).click();
  await expect(page.getByText("Passo 3 de 7")).toBeVisible();
});

test("a apresentação sai de cena assim que o funil começa", async ({ page }) => {
  await page.goto(ROTA);

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();

  await page.getByRole("button", { name: "Homem" }).click();
  await expect(page.getByText("Passo 2 de 7")).toBeVisible();

  /*
   * Do segundo passo em diante o funil fica sozinho: nem a apresentação
   * acima nem o texto de apoio abaixo. Era isso que obrigava a rolar a
   * mesma coisa a cada passo no telemóvel.
   */
  await expect(h1).toHaveCount(0);
  await expect(
    page.getByText("Por que 21 dias é a janela exata para destravar o metabolismo."),
  ).toHaveCount(0);
});

test("as oito silhuetas aparecem juntas, sem carrossel", async ({ page }) => {
  await page.goto(ROTA);
  await page.getByRole("button", { name: "Homem" }).click();

  const grupo = page.getByRole("radiogroup", { name: "Silhueta atual" });
  await expect(grupo.getByRole("radio")).toHaveCount(8);

  // Todas visíveis na grelha — nenhuma escondida atrás de scroll lateral.
  for (const nome of ["Definido", "Bem acima do peso"]) {
    await expect(grupo.getByRole("radio", { name: new RegExp(nome) })).toBeVisible();
  }
});

test("o funil leva do sexo ao programa montado", async ({ page }) => {
  await percorrerHomem(page);

  await expect(page.getByText("Seu programa de 21 dias")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Fundação" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Carga" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Definição" })).toBeVisible();

  await expect(page.getByText("95 kg", { exact: true })).toBeVisible();
  await expect(page.getByText("93 kg", { exact: true })).toBeVisible();
});

test("a meta que não cabe em 21 dias é recusada com número", async ({ page }) => {
  await percorrerHomem(page);

  const avisos = page.getByText("O que você precisa saber").locator("..");
  await expect(avisos).toContainText("não cabem em 21 dias");
  await expect(avisos).toContainText("2 kg");

  // No corte, o preço de acelerar é massa magra — e não gordura.
  await expect(avisos).toContainText("massa magra");
});

test("as duas silhuetas aparecem lado a lado no resultado", async ({ page }) => {
  await percorrerHomem(page);

  await expect(page.getByText("Hoje").first()).toBeVisible();
  await expect(page.getByText("Dia 21").first()).toBeVisible();
  await expect(page.getByText("Abdômen saliente").first()).toBeVisible();
  await expect(page.getByText("Em forma").first()).toBeVisible();
});

test("a semana de treino do bloco abre com exercícios e séries", async ({ page }) => {
  await percorrerHomem(page);

  await page
    .getByRole("group")
    .filter({ hasText: /A semana de treino deste bloco/ })
    .first()
    .getByText(/A semana de treino deste bloco/)
    .click();

  await expect(page.getByText("Supino reto com halteres").first()).toBeVisible();
  await expect(page.getByText(/RIR/).first()).toBeVisible();
});

test("quem nunca treinou não recebe mais dias do que sustenta", async ({ page }) => {
  await page.goto(ROTA);

  await page.getByRole("button", { name: "Mulher" }).click();
  await noPasso(page, 2);
  await page.getByRole("radio", { name: /Normal/ }).click();
  await noPasso(page, 3);
  await page.getByRole("radio", { name: /Atlética/ }).click();
  await noPasso(page, 4);

  await campo(page, "Idade").fill("28");
  await campo(page, "Altura").fill("165");
  await campo(page, "Peso").fill("62");
  await continuar(page);

  await campo(page, "Peso desejado").fill("58");
  await continuar(page);
  await continuar(page);

  await page.getByRole("button", { name: /Nunca treinei/ }).click();

  /*
   * "Nunca treinei" admite 2 ou 3 dias. O botão do 5 não deve nem existir
   * na tela — deixar um botão aceso que o motor depois ignora é pior que
   * não o oferecer.
   */
  await expect(
    page.getByRole("button", { name: "5 dias de treino por semana" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "6 dias de treino por semana" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: /Ver meu programa/ }).click();
  await expect(page.getByText("3× / semana")).toBeVisible();
});

test("o resultado não tem violação de acessibilidade séria", async ({ page }) => {
  await percorrerHomem(page);
  await expect(page.getByText("Seu programa de 21 dias")).toBeVisible();

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const graves = violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    graves.map(
      (v) => `${v.id}: ${v.help} -> ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
    ),
  ).toEqual([]);
});
