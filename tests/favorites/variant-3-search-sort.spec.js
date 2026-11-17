import { test, expect } from '../../fixtures/index.js';
import { MainPage } from '../../pages/mainPage.js';
import { FavoritesPage } from '../../pages/favoritesPage.js';

test.describe('Вариант 3', () => {
  test('V3.1: поиск по существующему названию', async ({ page, createAdvertisement }) => {
    const searchedAd = await createAdvertisement();
    const otherAd = await createAdvertisement();
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    for (const ad of [searchedAd, otherAd]) {
      const catalogCard = await mainPage.findAdvertisement(ad);
      await catalogCard.toggleFavorite();
      await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    }

    await favoritesPage.open();
    await favoritesPage.search(searchedAd.title);

    await expect(favoritesPage.cardById(searchedAd.id).root).toBeVisible();
    await expect(favoritesPage.cardById(searchedAd.id).title).toHaveText(searchedAd.title);
    await expect(favoritesPage.cardById(otherAd.id).root).toHaveCount(0);
    await expect(favoritesPage.cards).toHaveCount(1);

    await favoritesPage.clearSearch();
    await expect(favoritesPage.cardById(searchedAd.id).root).toBeVisible();
    await expect(favoritesPage.cardById(otherAd.id).root).toBeVisible();
    await expect(favoritesPage.cards).toHaveCount(2);
  });

  test('V3.2: сортировка по цене', async ({ page, createAdvertisement }) => {
    const expensiveAd = await createAdvertisement({ price: 7777 });
    const cheapAd = await createAdvertisement({ price: 1111 });
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    for (const ad of [expensiveAd, cheapAd]) {
      const catalogCard = await mainPage.findAdvertisement(ad);
      await catalogCard.toggleFavorite();
      await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    }

    await favoritesPage.open();
    await expect(favoritesPage.cards).toHaveCount(2);

    await favoritesPage.sortBy('Сначала дорогие');
    await expect.poll(() => favoritesPage.getCardIds()).toEqual([expensiveAd.id, cheapAd.id]);

    await favoritesPage.sortBy('Сначала дешёвые');
    await expect.poll(() => favoritesPage.getCardIds()).toEqual([cheapAd.id, expensiveAd.id]);
  });
});
