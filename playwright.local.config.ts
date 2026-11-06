import { defineConfig, devices } from "@playwright/test";

/**
 * Config para rodar a suíte contra o dev server deste projeto.
 *
 * A config principal usa a porta 3210 com `reuseExistingServer`, e quando
 * outro projeto já está nessa porta o Playwright testa o site errado sem
 * reclamar. Aqui a porta é a 3000, a do próprio `npm run dev`: se ele já
 * estiver de pé, a suíte o reaproveita; se não, sobe um. O Next 16 recusa
 * dois dev servers na mesma pasta, então reaproveitar é a única via.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: "list",
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
