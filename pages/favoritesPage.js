import { BasePage } from './basePage.js';
import { AdCard } from '../components/adCard.js';

export class FavoritesPage extends BasePage {
  constructor(page) {
    super(page);
    this.main = page.locator('main');
    this.title = page.locator('[data-marker="favorites-title"]');
    this.searchInput = page.locator('[data-marker="favorites-search"]');
    this.sortSelect = page.locator('[data-marker="favorites-sort"]');
    this.cards = AdCard.all(this.main);
    this.emptyStateTitle = this.main.locator('h3:not([data-marker])');
  }

  async open() {
    await super.open('/favorites');
    await this.title.waitFor();
  }

  async reload() {
    await this.page.reload();
    await this.title.waitFor();
  }

  cardById(id) {
    return AdCard.byId(this.main, id);
  }

  async search(query) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async sortBy(label) {
    await this.sortSelect.selectOption({ label });
  }

  async getCardIds() {
    const hrefs = await this.cards.locator('a[href^="/advertisements/"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    return hrefs.map((href) => href.replace('/advertisements/', ''));
  }
}
