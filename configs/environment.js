import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DEFAULT_BASE_URL = 'https://testboard.avito.com';
const envFile = fileURLToPath(new URL('../.env', import.meta.url));

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const baseURL = (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');

export const environment = {
  baseURL,
  apiURL: `${baseURL}/api/v1`,
};

export function getSellerCredentials() {
  const email = process.env.E2E_USER_EMAIL?.trim();
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Не заданы E2E_USER_EMAIL и E2E_USER_PASSWORD. ' +
        'Скопируйте .env.example в .env и укажите учётные данные учебного продавца.',
    );
  }

  return { email, password };
}
