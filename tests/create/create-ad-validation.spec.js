import { sellerTest as test, expect } from '../../fixtures/index.js';
import { CreateAdPage } from '../../pages/createAdPage.js';
import { buildAdvertisement } from '../../helpers/testData.js';

const MAX_PRICE = 1_000_000;
const MAX_QUANTITY = 100;

test.describe('Создание объявления: валидация', () => {
  let createAdPage;
  let createRequests;

  test.beforeEach(async ({ page }) => {
    createAdPage = new CreateAdPage(page);
    createRequests = createAdPage.trackCreateRequests();
    await createAdPage.open();
  });

  test('C2: обязательные поля', async ({ page }) => {
    await createAdPage.submit();

    await expect(createAdPage.titleError).toHaveText('Введите название объявления');
    await expect(createAdPage.descriptionError).toHaveText('Добавьте описание');
    await expect(createAdPage.photoError).toHaveText('Загрузите хотя бы одну фотографию');

    await expect(page).toHaveURL(/\/advertisements\/create$/);
    await expect(createAdPage.form).toBeVisible();
    expect(createRequests).toEqual([]);
  });

  test('C4: цена выше максимума', async ({ page }) => {
    const ad = buildAdvertisement({ price: MAX_PRICE + 1, quantity: 2 });

    await createAdPage.fill(ad);
    await createAdPage.submit();

    await expect(createAdPage.priceError).toHaveText('Цена не должна превышать 1 000 000 ₽');
    await expect(page).toHaveURL(/\/advertisements\/create$/);
    await expect(createAdPage.titleInput).toHaveValue(ad.title);
    await expect(createAdPage.descriptionInput).toHaveValue(ad.description);
    await expect(createAdPage.priceInput).toHaveValue(String(ad.price));
    await expect(createAdPage.quantityInput).toHaveValue(String(ad.quantity));
    await expect(createAdPage.photoPreviews).toHaveCount(1);
    await expect(createAdPage.quantityError).toHaveCount(0);
    expect(createRequests).toEqual([]);
  });

  test('C5: количество выше максимума', async ({ page }) => {
    const ad = buildAdvertisement({ price: 1234, quantity: MAX_QUANTITY + 1 });

    await createAdPage.fill(ad);
    await createAdPage.submit();

    await expect(createAdPage.quantityError).toHaveText('Количество не должно превышать 100');
    await expect(page).toHaveURL(/\/advertisements\/create$/);
    await expect(createAdPage.titleInput).toHaveValue(ad.title);
    await expect(createAdPage.descriptionInput).toHaveValue(ad.description);
    await expect(createAdPage.priceInput).toHaveValue(String(ad.price));
    await expect(createAdPage.quantityInput).toHaveValue(String(ad.quantity));
    await expect(createAdPage.photoPreviews).toHaveCount(1);
    await expect(createAdPage.priceError).toHaveCount(0);
    expect(createRequests).toEqual([]);
  });
});
