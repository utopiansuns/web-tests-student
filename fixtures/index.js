import { test as base, expect } from '@playwright/test';
import { environment, getSellerCredentials } from '../configs/environment.js';
import { TestboardApi } from '../helpers/testboardApi.js';
import { buildAdvertisement } from '../helpers/testData.js';

export const test = base.extend({
  sellerApi: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const api = new TestboardApi(request, environment.apiURL);
    await api.login(getSellerCredentials());
    await use(api);
    await request.dispose();
  },

  createdAdIds: async ({ sellerApi }, use) => {
    const ids = new Set();
    await use(ids);

    const errors = [];
    for (const id of ids) {
      try {
        await sellerApi.deleteOwnAdvertisement(id);
      } catch (error) {
        errors.push(error.message);
      }
    }
    if (errors.length) {
      throw new Error(`Очистка объявлений завершилась с ошибками:\n${errors.join('\n')}`);
    }
  },

  createAdvertisement: async ({ sellerApi, createdAdIds }, use) => {
    await use(async (overrides = {}) => {
      const data = buildAdvertisement(overrides);
      const created = await sellerApi.createAdvertisement(data);
      createdAdIds.add(created.id);
      return { ...data, id: created.id };
    });
  },
});

export const sellerTest = test.extend({
  storageState: async ({ sellerApi }, use) => {
    await use(sellerApi.storageStateFor(environment.baseURL));
  },
});

export { expect };
