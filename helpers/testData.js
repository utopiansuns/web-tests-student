import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const TEST_PHOTO_PATH = fileURLToPath(new URL('../assets/test-photo.png', import.meta.url));

export function uniqueSuffix() {
  return `${Date.now().toString(36)}${randomBytes(4).toString('hex')}`;
}

export function uniqueTitle(prefix = 'UI-лаб') {
  return `${prefix} ${uniqueSuffix()}`.slice(0, 50);
}

export function buildAdvertisement(overrides = {}) {
  return {
    title: uniqueTitle(),
    description: 'Объявление подготовлено автотестом лабораторной работы',
    price: 1500,
    quantity: 1,
    photoPath: TEST_PHOTO_PATH,
    ...overrides,
  };
}

export function formatPrice(price) {
  return `${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
}
