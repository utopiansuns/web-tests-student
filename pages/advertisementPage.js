import { BasePage } from './basePage.js';

export class AdvertisementPage extends BasePage {
  constructor(page) {
    super(page);
    this.root = page.locator('[data-marker="ad-detail-page"]');
    this.title = this.root.locator('[data-marker="ad-title"]');
    this.description = this.root.locator('[data-marker="ad-description"]');
    this.price = this.root.locator('[data-marker="ad-price"]');
    this.quantity = this.root.locator('[data-marker="ad-quantity"]');
    this.photo = this.root.locator('img').first();
    this.favoriteButton = this.root.locator('[data-marker="favorite-button"]');
  }

  async open(id) {
    await super.open(`/advertisements/${id}`);
    await this.title.waitFor();
  }

  async toggleFavorite() {
    await this.favoriteButton.click();
  }
}
