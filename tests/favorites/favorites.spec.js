import { test, expect } from '../../fixtures/index.js';
import { MainPage } from '../../pages/mainPage.js';
import { FavoritesPage } from '../../pages/favoritesPage.js';
import { AdvertisementPage } from '../../pages/advertisementPage.js';
import { uniqueSuffix } from '../../helpers/testData.js';

test.describe('Избранное', () => {
  test('F1: пустое избранное', async ({ page }) => {
    const favoritesPage = new FavoritesPage(page);

    await favoritesPage.open();

    await expect(favoritesPage.title).toHaveText('Избранное');
    await expect(favoritesPage.emptyStateTitle).toHaveText('В избранном пока пусто');
    await expect(favoritesPage.cards).toHaveCount(0);
  });

  test('F2: добавление из каталога', async ({ page, createAdvertisement }) => {
    const ad = await createAdvertisement();
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    const catalogCard = await mainPage.findAdvertisement(ad);
    await catalogCard.toggleFavorite();

    await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(catalogCard.favoriteButton).toHaveAttribute('data-favorited', 'true');

    await favoritesPage.open();
    const favoriteCard = favoritesPage.cardById(ad.id);
    await expect(favoriteCard.root).toBeVisible();
    await expect(favoriteCard.title).toHaveText(ad.title);
    await expect(favoriteCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('F3: сохранение после обновления', async ({ page, createAdvertisement }) => {
    const ad = await createAdvertisement();
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    const catalogCard = await mainPage.findAdvertisement(ad);
    await catalogCard.toggleFavorite();
    await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');

    await favoritesPage.open();
    await expect(favoritesPage.cardById(ad.id).root).toBeVisible();
    await favoritesPage.reload();

    const favoriteCard = favoritesPage.cardById(ad.id);
    await expect(favoriteCard.root).toBeVisible();
    await expect(favoriteCard.title).toHaveText(ad.title);
    await expect(favoriteCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(favoriteCard.favoriteButton).toHaveAttribute('data-favorited', 'true');
  });

  test('F4: удаление из избранного', async ({ page, createAdvertisement }) => {
    const ad = await createAdvertisement();
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);
    const advertisementPage = new AdvertisementPage(page);

    await mainPage.open();
    const catalogCard = await mainPage.findAdvertisement(ad);
    await catalogCard.toggleFavorite();
    await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');

    await favoritesPage.open();
    const favoriteCard = favoritesPage.cardById(ad.id);
    await expect(favoriteCard.root).toBeVisible();
    await favoriteCard.toggleFavorite();

    await expect(favoriteCard.root).toHaveCount(0);
    await expect(favoritesPage.cards).toHaveCount(0);
    await expect(favoritesPage.emptyStateTitle).toHaveText('В избранном пока пусто');

    await advertisementPage.open(ad.id);
    await expect(advertisementPage.title).toHaveText(ad.title);
    await expect(advertisementPage.favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(advertisementPage.favoriteButton).toHaveAttribute('data-favorited', 'false');
  });

  test('F5: поиск без совпадений', async ({ page, createAdvertisement }) => {
    const firstAd = await createAdvertisement();
    const secondAd = await createAdvertisement();
    const missingQuery = `нет-совпадений-${uniqueSuffix()}`;
    const mainPage = new MainPage(page);
    const favoritesPage = new FavoritesPage(page);

    await mainPage.open();
    for (const ad of [firstAd, secondAd]) {
      const catalogCard = await mainPage.findAdvertisement(ad);
      await catalogCard.toggleFavorite();
      await expect(catalogCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    }

    await favoritesPage.open();
    await expect(favoritesPage.cards).toHaveCount(2);

    await favoritesPage.search(missingQuery);
    await expect(favoritesPage.cards).toHaveCount(0);
    await expect(favoritesPage.emptyStateTitle).toHaveText('В избранном пока пусто');

    await favoritesPage.clearSearch();
    await expect(favoritesPage.searchInput).toHaveValue('');
    for (const ad of [firstAd, secondAd]) {
      const favoriteCard = favoritesPage.cardById(ad.id);
      await expect(favoriteCard.root).toBeVisible();
      await expect(favoriteCard.title).toHaveText(ad.title);
      await expect(favoriteCard.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(favoritesPage.cards).toHaveCount(2);
  });
});
