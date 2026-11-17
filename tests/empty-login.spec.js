import { test, expect } from '@playwright/test';

test('пустая форма показывает ошибки email и пароля', async ({ page }) => {
  await page.goto('/');

  await page.locator('[data-marker="login-button-desktop"]').click();

  const loginForm = page.locator('[data-marker="login-form"]');
  await loginForm.locator('[data-marker="login-submit-button"]').click();

  await expect(loginForm.locator('[data-marker="email-error"]')).toHaveText('Email обязателен');
  await expect(loginForm.locator('[data-marker="password-error"]')).toHaveText('Пароль обязателен');
});
