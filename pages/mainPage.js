import { BasePage } from './basePage.js';
import { AdCard } from '../components/adCard.js';

export class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginButton = page.locator('[data-marker="login-button-desktop"]');
    this.searchInput = page.locator('[data-marker="search-input"]');
    this.cards = AdCard.all(page.locator('main'));
  }

  async open() {
    await super.open('/');
  }

  async openLoginForm() {
    await this.loginButton.click();
  }

  async search(query) {
    await this.searchInput.fill(query);
  }

  cardById(id) {
    return AdCard.byId(this.page.locator('main'), id);
  }

  async findAdvertisement({ id, title }) {
    await this.search(title);
    const card = this.cardById(id);
    await card.root.waitFor();
    return card;
  }
}
