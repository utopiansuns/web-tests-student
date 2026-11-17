export class AdCard {
  constructor(root) {
    this.root = root;
    this.link = root.locator('a[href^="/advertisements/"]');
    this.title = root.locator('[data-marker="ad-card-title"]');
    this.price = root.locator('[data-marker="ad-card-price"]');
    this.favoriteButton = root.locator('[data-marker="favorite-button"]');
  }

  static all(scope) {
    return scope.locator('[data-marker="advertisement-card"]');
  }

  static byId(scope, id) {
    return new AdCard(
      AdCard.all(scope).filter({ has: scope.page().locator(`a[href="/advertisements/${id}"]`) }),
    );
  }

  async toggleFavorite() {
    await this.favoriteButton.click();
  }
}
