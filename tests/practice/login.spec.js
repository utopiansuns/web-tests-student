import { test, expect } from '@playwright/test';
import { MainPage } from '../../pages/mainPage.js';
import { LoginPopupPage } from '../../pages/loginPopupPage.js';
import { RegisterPage } from '../../pages/registerPage.js';
import { studentEmail } from '../../helpers/studentEmail.js';

test.describe('Форма входа', () => {
  let loginPopup;

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.openLoginForm();
    loginPopup = new LoginPopupPage(page);
  });

  test('пустая форма показывает ошибки email и пароля', async () => {
    await loginPopup.submit();

    await expect(loginPopup.emailError).toHaveText('Email обязателен');
    await expect(loginPopup.passwordError).toHaveText('Пароль обязателен');
  });

  test('поле email хранит введённый учебный email', async () => {
    const email = studentEmail();

    await loginPopup.fillEmail(email);

    await expect(loginPopup.emailInput).toHaveValue(email);
  });

  test('ссылка регистрации открывает страницу регистрации', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await loginPopup.goToRegistration();

    await expect(page).toHaveURL(/\/auth\/register$/);
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.heading).toHaveText('Регистрация');
  });
});
