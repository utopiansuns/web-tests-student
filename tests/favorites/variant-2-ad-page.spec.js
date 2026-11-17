import { test, expect } from '../../fixtures/index.js';
import { AdvertisementPage } from '../../pages/advertisementPage.js';
import { FavoritesPage } from '../../pages/favoritesPage.js';

test.describe('Вариант 2', () => {
  test('V2.1: добавление из объявления', async ({ page, createAdvertisement }) => {
    const ad = await createAdvertisement();
    const advertisementPage = new AdvertisementPage(page);
    const favoritesPage = new FavoritesPage(page);

    await advertisementPage.open(ad.id);
    await expect(advertisementPage.title).toHaveText(ad.title);
    await advertisementPage.toggleFavorite();

    await expect(advertisementPage.favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(advertisementPage.favoriteButton).toHaveAttribute('data-favorited', 'true');

    await favoritesPage.open();
    const favoriteCard = favoritesPage.cardById(ad.id);
    await expect(favoriteCard.root).toBeVisible();
    await expect(favoriteCard.title).toHaveText(ad.title);
  });

  test('V2.2: согласованность состояния', async ({ page, createAdvertisement }) => {
    const ad = await createAdvertisement();
    const advertisementPage = new AdvertisementPage(page);
    const favoritesPage = new FavoritesPage(page);

    await advertisementPage.open(ad.id);
    await advertisementPage.toggleFavorite();
    await expect(advertisementPage.favoriteButton).toHaveAttribute('aria-pressed', 'true');

    await favoritesPage.open();
    const favoriteCard = favoritesPage.cardById(ad.id);
    await expect(favoriteCard.root).toBeVisible();
    await favoriteCard.toggleFavorite();
    await expect(favoriteCard.root).toHaveCount(0);

    await advertisementPage.open(ad.id);
    await expect(advertisementPage.title).toHaveText(ad.title);
    await expect(advertisementPage.favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(advertisementPage.favoriteButton).toHaveAttribute('data-favorited', 'false');
  });
});
