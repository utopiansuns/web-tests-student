import { test, expect } from '../../fixtures/index.js';
import { CreateAdPage } from '../../pages/createAdPage.js';
import { LoginPage } from '../../pages/loginPage.js';

test('C3: гостевой доступ к созданию', async ({ page }) => {
  const createAdPage = new CreateAdPage(page);
  const loginPage = new LoginPage(page);

  await page.goto(createAdPage.path);

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(loginPage.heading).toBeVisible();
  await expect(loginPage.heading).toHaveText('Вход в аккаунт');
});
