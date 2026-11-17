import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const RETRIES = { maxRetries: 2 };

export class TestboardApi {
  constructor(request, apiURL) {
    this.request = request;
    this.apiURL = apiURL;
    this.token = null;
    this.user = null;
  }

  get authHeaders() {
    if (!this.token) {
      throw new Error('Сначала выполните login()');
    }
    return { Authorization: `Bearer ${this.token}` };
  }

  async login({ email, password }) {
    const response = await this.request.post(`${this.apiURL}/auth/login`, {
      data: { email, password },
      ...RETRIES,
    });
    await this.#ensureOk(response, 'Вход продавца через API');
    const { token, user } = await response.json();
    this.token = token;
    this.user = user;
    return user;
  }

  async createAdvertisement({ title, description, price, quantity, photoPath }) {
    const response = await this.request.post(`${this.apiURL}/advertisement`, {
      headers: this.authHeaders,
      multipart: {
        title,
        description,
        price: String(price),
        quantity: String(quantity),
        photos: {
          name: basename(photoPath),
          mimeType: 'image/png',
          buffer: await readFile(photoPath),
        },
      },
    });
    await this.#ensureOk(response, `Создание объявления «${title}»`);
    return response.json();
  }

  async findAdvertisement(id) {
    const response = await this.request.get(`${this.apiURL}/advertisement`, {
      params: { id },
      ...RETRIES,
    });
    if (response.status() === 404) {
      return null;
    }
    await this.#ensureOk(response, `Получение объявления ${id}`);
    return response.json();
  }

  async deleteOwnAdvertisement(id) {
    const advertisement = await this.findAdvertisement(id);
    if (!advertisement) {
      return true;
    }
    if (advertisement.user_id !== this.user.id) {
      throw new Error(`Объявление ${id} принадлежит другому пользователю, удаление пропущено`);
    }

    const response = await this.request.delete(`${this.apiURL}/advertisement`, {
      headers: this.authHeaders,
      params: { id },
      ...RETRIES,
    });
    if (response.status() === 404) {
      return true;
    }
    await this.#ensureOk(response, `Удаление объявления ${id}`);
    return true;
  }

  storageStateFor(baseURL) {
    return {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [
            { name: 'auth_token', value: this.token },
            {
              name: 'auth-storage',
              value: JSON.stringify({ state: { user: this.user, token: this.token }, version: 0 }),
            },
          ],
        },
      ],
    };
  }

  async #ensureOk(response, action) {
    if (!response.ok()) {
      throw new Error(`${action}: HTTP ${response.status()} ${await response.text()}`);
    }
  }
}
