import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home não tem violações automáticas graves de acessibilidade", async ({ page }) => {
  await page.goto("/");
  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(resultado.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
});

test("a home leva à consultoria e responde a dúvida no mesmo fecho", async ({ page }) => {
  await page.goto("/#contato");

  // O fecho é um pedido só: um botão, que sai para /consultoria.
  const pedido = page.locator("#contato").getByRole("link", { name: "Começar minha avaliação" });
  await expect(pedido).toBeVisible();
  await expect(pedido).toHaveAttribute("href", /\/consultoria/);

  // E as dúvidas vivem aqui, não numa seção no meio da página.
  const duvida = page.getByRole("button", { name: "Preciso morar perto para fazer a consultoria?" });
  await duvida.click();
  await expect(page.getByText("Todo o acompanhamento é online")).toBeVisible();
});

test("a home mostra cinco seções, com os resultados dentro do programa", async ({ page }) => {
  await page.goto("/");

  for (const id of ["topo", "metodo", "programa", "resultados", "sobre", "contato"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }

  // O que saiu da home continua a ter porta: no menu e no botão do hero.
  await expect(
    page.getByRole("link", { name: "Calcular meu % de gordura" }),
  ).toBeVisible();
});

test("calculadora gera plano a partir dos dados básicos", async ({ page }) => {
  await page.goto("/calculadora-de-calorias");
  await expect(page.locator('[data-interactive="true"]')).toBeVisible();
  await page.getByRole("textbox", { name: "Idade", exact: true }).fill("32");
  await page.getByRole("textbox", { name: "Peso atual", exact: true }).fill("78");
  await page.getByRole("textbox", { name: "Altura", exact: true }).fill("176");
  await page.getByRole("textbox", { name: "Peso desejado", exact: true }).fill("72");

  await page.getByRole("textbox", { name: "Nome", exact: true }).fill("Cliente Teste");
  await page.getByRole("textbox", { name: "E-mail", exact: true }).fill("cliente@teste.com");
  await page.getByRole("textbox", { name: "WhatsApp", exact: true }).fill("11999999999");
  await page.getByRole("button", { name: "Liberar meu plano" }).click();

  await expect(page.getByText("Metabolismo basal", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("03 / Seu plano")).toBeVisible();
});
