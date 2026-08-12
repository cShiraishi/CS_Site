import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home não tem violações automáticas graves de acessibilidade", async ({ page }) => {
  await page.goto("/");
  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(resultado.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
});

test("aplicação avança somente com a etapa preenchida", async ({ page }) => {
  await page.goto("/#contato");
  await expect(page.locator('#contato [data-interactive="true"]')).toBeVisible();
  await page.getByLabel("Principal objetivo").selectOption("Emagrecer");
  await page.getByLabel("Em que momento você está?").selectOption("Já tentei outros planos");
  await page.getByLabel("Seu contexto").fill("Quero um plano consistente que funcione com minha rotina.");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Sua rotina" })).toBeVisible();
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
