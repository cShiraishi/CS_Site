import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROTA = "/calculadora-de-gordura-corporal";

type Pagina = import("@playwright/test").Page;

/**
 * Os rótulos trazem a unidade em texto só para leitor de tela ("Cintura em
 * cm"), então o nome acessível não é exato — daí a âncora de início.
 */
const campo = (page: Pagina, nome: string) =>
  page.getByRole("textbox", { name: new RegExp(`^${nome}`) });

/** A fita não é mais o padrão: quem quer o método preciso escolhe. */
async function escolherFita(page: Pagina) {
  await page.getByRole("radio", { name: /Tenho fita métrica/ }).click();
}

/** Homem de 176 cm, pescoço 38, cintura 88 → 19 % pela equação da Marinha. */
async function preencherHomem(page: Pagina) {
  await escolherFita(page);
  await campo(page, "Idade").fill("32");
  await campo(page, "Peso").fill("78");
  await campo(page, "Altura").fill("176");
  await campo(page, "Pescoço").fill("38");
  await campo(page, "Cintura").fill("88");
}

test("estima o percentual e mostra a faixa de erro", async ({ page }) => {
  await page.goto(ROTA);
  await preencherHomem(page);

  await expect(
    page.locator("#bf-resultado").getByText("19 %", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("#bf-resultado")).toContainText("15,5 % a 22,5 %");
  await expect(page.getByText("Média saudável").first()).toBeVisible();
});

test("do alvo escolhido saem calorias, macros e prazo", async ({ page }) => {
  await page.goto(ROTA);
  await preencherHomem(page);

  // 19 % cai no degrau "Médio"; o alvo sugerido é o de cima, "Barriga plana".
  await expect(
    page.getByText("03 / O que separa você desse ponto"),
  ).toBeVisible();

  await page.locator("#bf-alvo").getByRole("radio", { name: /Definido/ }).click();
  await expect(page.getByText("Calorias por dia")).toBeVisible();
  await expect(page.getByText("Tempo estimado")).toBeVisible();
  await expect(page.getByText("Proteína")).toBeVisible();

  // Meta mais magra que a atual: o plano tem de ser de perda.
  await expect(page.getByText(/a perder/)).toBeVisible();
});

test("o CTA leva ao formulário com a origem da campanha preservada", async ({
  page,
}) => {
  await page.goto(
    `${ROTA}?utm_source=metads&utm_campaign=cea_10euros&utm_content=cv02`,
  );
  await preencherHomem(page);

  const href = await page
    .getByRole("link", { name: /Quero esse plano comigo/ })
    .getAttribute("href");

  expect(href).toContain("leadconnectorhq.com");
  expect(href).toContain("utm_source=metads");
  expect(href).toContain("utm_campaign=cea_10euros");
  expect(href).toContain("utm_content=cv02");
  // contexto do lead, para o CRM saber o que a pessoa calculou…
  expect(href).toContain("cs_bf=19");
  // …e de qual dos dois botões ela saiu
  expect(href).toContain("cs_cta=final");
});

test("sem origem na URL, o link ganha a atribuição padrão do site", async ({
  page,
}) => {
  await page.goto(ROTA);
  await preencherHomem(page);

  const href = await page
    .getByRole("link", { name: /Quero esse plano comigo/ })
    .getAttribute("href");

  expect(href).toContain("utm_medium=calculadora-bf");
  expect(href).not.toContain("fbclid");
});

/**
 * Anúncio do Meta sem UTM manual entrega só `?fbclid=…`. O lead não pode
 * chegar ao CRM sem `utm_source` por causa disso — cairia como tráfego
 * direto, que é justamente o que a atribuição existe para evitar.
 */
test("um fbclid sozinho não apaga a atribuição padrão", async ({ page }) => {
  await page.goto(`${ROTA}?fbclid=PAVERabc123`);
  await preencherHomem(page);

  const href = await page
    .getByRole("link", { name: /Quero esse plano comigo/ })
    .getAttribute("href");

  expect(href).toContain("fbclid=PAVERabc123");
  expect(href).toContain("utm_source=site");
  expect(href).toContain("utm_medium=calculadora-bf");
});

test("altura em metros é recusada, não vira um resultado de 75 %", async ({
  page,
}) => {
  await page.goto(ROTA);
  await escolherFita(page);
  await campo(page, "Altura").fill("1,76");
  await campo(page, "Pescoço").fill("38");
  await campo(page, "Cintura").fill("88");

  await expect(page.getByText(/176, não 1,76/).first()).toBeVisible();
  await expect(page.locator("#bf-resultado")).toHaveCount(0);
});

test("cintura menor que o pescoço explica qual medida refazer", async ({
  page,
}) => {
  await page.goto(ROTA);
  await preencherHomem(page);
  await campo(page, "Pescoço").fill("45");
  await campo(page, "Cintura").fill("42");

  await expect(page.getByText(/menor que o pescoço/)).toBeVisible();
  await expect(page.locator("#bf-resultado")).toHaveCount(0);
});

/**
 * A equação da Marinha não usa peso nem idade: dá para chegar ao percentual
 * sem eles, e o plano inteiro — com o CTA — sumia sem explicação nenhuma.
 */
test("quem mede com fita e não informa peso é avisado do que falta", async ({
  page,
}) => {
  await page.goto(ROTA);
  await escolherFita(page);
  await campo(page, "Altura").fill("176");
  await campo(page, "Pescoço").fill("38");
  await campo(page, "Cintura").fill("88");

  await expect(page.locator("#bf-resultado")).toBeVisible();
  await expect(page.getByText(/para montar o plano/)).toBeVisible();

  await campo(page, "Peso").fill("78");
  await campo(page, "Idade").fill("32");
  await expect(page.getByText("Calorias por dia")).toBeVisible();
});

test("a mulher precisa do quadril, e a tela diz isso", async ({ page }) => {
  await page.goto(ROTA);
  await page.getByRole("radio", { name: "feminino" }).click();
  await escolherFita(page);
  await campo(page, "Altura").fill("165");
  await campo(page, "Pescoço").fill("32");
  await campo(page, "Cintura").fill("75");

  await expect(page.getByText(/Falta o quadril/)).toBeVisible();

  await campo(page, "Quadril").fill("98");
  await expect(page.locator("#bf-resultado")).toBeVisible();
});

test("a página não rola para o lado em nenhuma etapa", async ({ page }) => {
  await page.goto(ROTA);

  const estoura = async () =>
    page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );

  expect(await estoura()).toBe(false);
  await preencherHomem(page);
  await expect(page.getByText("Calorias por dia")).toBeVisible();
  expect(await estoura()).toBe(false);
});

test("os campos abrem teclado numérico e não disparam zoom no iOS", async ({
  page,
}) => {
  await page.goto(ROTA);
  await escolherFita(page);

  const cintura = campo(page, "Cintura");
  await expect(cintura).toHaveAttribute("inputmode", "decimal");

  // Abaixo de 16 px o Safari amplia a página inteira ao focar o campo.
  const tamanho = await cintura.evaluate((el) =>
    parseFloat(getComputedStyle(el).fontSize),
  );
  expect(tamanho).toBeGreaterThanOrEqual(16);
});

/** A escolha é única e obrigatória, e o leitor de tela precisa saber. */
test("os grupos de escolha são radiogroups", async ({ page }) => {
  await page.goto(ROTA);
  await preencherHomem(page);

  await expect(page.getByRole("radio", { name: "masculino" })).toBeChecked();
  await expect(page.locator("#bf-alvo").getByRole("radio")).toHaveCount(8);
  await expect(page.getByRole("radiogroup")).toHaveCount(4);
});

/**
 * Com `<input type="radio">` as setas trocavam a opção em vez de rolar a
 * página: bastava clicar num cartão e descer com a seta para a seleção
 * andar sozinha até a última. Por isso são botões com `role="radio"`.
 */
test("as setas rolam a página e não trocam a opção escolhida", async ({
  page,
}) => {
  await page.goto(ROTA);

  const grupo = page.locator('[aria-label="Nivel de atividade"]');
  const escolhido = () =>
    grupo.locator('[role="radio"][aria-checked="true"]').innerText();

  const terceiro = grupo.locator('[role="radio"]').nth(2);
  await terceiro.scrollIntoViewIfNeeded();
  await terceiro.click();
  const antes = await escolhido();

  const y = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150);

  expect(await escolhido()).toBe(antes);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(y);
});

test("a estimativa sem fita é a que já vem escolhida", async ({ page }) => {
  await page.goto(ROTA);

  await expect(page.getByRole("radio", { name: /Não tenho fita/ })).toBeChecked();
  await expect(page.getByRole("radio", { name: /Tenho fita/ })).not.toBeChecked();

  // e sem fita ninguém precisa medir pescoço nem cintura
  await expect(campo(page, "Cintura")).toHaveCount(0);

  await campo(page, "Idade").fill("32");
  await campo(page, "Peso").fill("92");
  await campo(page, "Altura").fill("176");
  await expect(page.locator("#bf-resultado")).toContainText("estimativa fraca");
});

test("não tem violações automáticas graves de acessibilidade", async ({
  page,
}) => {
  await page.goto(ROTA);
  await preencherHomem(page);

  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(
    resultado.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    ),
  ).toEqual([]);
});
