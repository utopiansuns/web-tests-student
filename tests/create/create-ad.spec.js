import { sellerTest as test, expect } from '../../fixtures/index.js';
import { CreateAdPage } from '../../pages/createAdPage.js';
import { AdvertisementPage } from '../../pages/advertisementPage.js';
import { buildAdvertisement, formatPrice } from '../../helpers/testData.js';

test.describe('Создание объявления', () => {
  test('C1: успешное создание объявления', async ({ page, createdAdIds }) => {
    const ad = buildAdvertisement({
      description: 'Описание объявления, созданного через форму UI',
      price: 4321,
      quantity: 3,
    });
    const createAdPage = new CreateAdPage(page);
    const advertisementPage = new AdvertisementPage(page);

    await createAdPage.open();
    await createAdPage.fill(ad);
    const { status, body: created } = await createAdPage.submitAndWaitForCreation();
    createdAdIds.add(created.id);

    expect(status).toBe(201);
    await expect(page).toHaveURL(/\/my\/advertisements/);

    await advertisementPage.open(created.id);
    await expect(advertisementPage.title).toHaveText(ad.title);
    await expect(advertisementPage.description).toHaveText(ad.description);
    await expect(advertisementPage.price).toHaveText(formatPrice(ad.price));
    await expect(advertisementPage.quantity).toHaveText(`В наличии ${ad.quantity} шт.`);
    await expect(advertisementPage.photo).toBeVisible();
    await expect(advertisementPage.photo).toHaveAttribute('alt', `${ad.title} - фото 1`);
    await expect
      .poll(() => advertisementPage.photo.evaluate((img) => img.complete && img.naturalWidth))
      .toBeGreaterThan(0);
  });
});
