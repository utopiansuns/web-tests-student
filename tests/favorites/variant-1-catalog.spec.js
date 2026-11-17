import { test, expect } from '../../fixtures/index.js';
import { MainPage } from '../../pages/mainPage.js';
import { FavoritesPage } from '../../pages/favoritesPage.js';

test.describe('Вариант 1', () => {
  test('V1.1: повторное нажатие', async ({ page, createAdvertisement }) => {
    const ad = await createAdvertisement();
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    const catalogCard = await mainPage.findAdvertisement(ad);
    await catalogCard.toggleFavorite();
    await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');

    await catalogCard.toggleFavorite();
    await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(catalogCard.favoriteButton).toHaveAttribute('data-favorited', 'false');

    await favoritesPage.open();
    await expect(favoritesPage.emptyStateTitle).toHaveText('В избранном пока пусто');
    await expect(favoritesPage.cardById(ad.id).root).toHaveCount(0);
  });

  test('V1.2: два объявления', async ({ page, createAdvertisement }) => {
    const removedAd = await createAdvertisement();
    const keptAd = await createAdvertisement();
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    for (const ad of [removedAd, keptAd]) {
      const catalogCard = await mainPage.findAdvertisement(ad);
      await catalogCard.toggleFavorite();
      await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    }

    await favoritesPage.open();
    await expect(favoritesPage.cardById(removedAd.id).root).toBeVisible();
    await favoritesPage.cardById(removedAd.id).toggleFavorite();

    await expect(favoritesPage.cardById(removedAd.id).root).toHaveCount(0);
    const keptCard = favoritesPage.cardById(keptAd.id);
    await expect(keptCard.root).toBeVisible();
    await expect(keptCard.title).toHaveText(keptAd.title);
    await expect(keptCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });
});
