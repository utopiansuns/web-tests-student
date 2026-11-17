import { BasePage } from './basePage.js';

const CREATE_AD_API = /\/api\/v1\/advertisement(\?|$)/;

export class CreateAdPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/advertisements/create';
    this.form = page.locator('[data-marker="create-ad-form"]');
    this.titleInput = this.form.locator('[data-marker="title-input"]');
    this.descriptionInput = this.form.locator('[data-marker="description-input"]');
    this.priceInput = this.form.locator('[data-marker="price-input"]');
    this.photoInput = this.form.locator('[data-marker="photo-input"]');
    this.photoPreviews = this.form.locator('[data-marker^="new-photo-preview-"]');
    this.quantityToggle = this.form.locator('[data-marker="quantity-toggle"]');
    this.quantityInput = this.form.locator('[data-marker="quantity-input"]');
    this.submitButton = this.form.locator('[data-marker="submit-button"]');

    this.titleError = this.form.locator('[data-marker="title-error"]');
    this.descriptionError = this.form.locator('[data-marker="description-error"]');
    this.photoError = this.form.locator('[data-marker="photo-error"]');
    this.priceError = this.form.locator('[data-marker="price-error"]');
    this.quantityError = this.form.locator('[data-marker="quantity-error"]');
  }

  async open() {
    await super.open(this.path);
    await this.form.waitFor();
  }

  async fill({ title, description, price, quantity, photoPath }) {
    if (title !== undefined) await this.titleInput.fill(title);
    if (description !== undefined) await this.descriptionInput.fill(description);
    if (price !== undefined) await this.priceInput.fill(String(price));
    if (photoPath !== undefined) await this.photoInput.setInputFiles(photoPath);
    if (quantity !== undefined) {
      await this.quantityToggle.click();
      await this.quantityInput.fill(String(quantity));
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async submitAndWaitForCreation() {
    const responsePromise = this.page.waitForResponse(
      (response) => response.request().method() === 'POST' && CREATE_AD_API.test(response.url()),
    );
    await this.submit();
    const response = await responsePromise;
    return { status: response.status(), body: await response.json() };
  }

  trackCreateRequests() {
    const requests = [];
    this.page.on('request', (request) => {
      if (request.method() === 'POST' && CREATE_AD_API.test(request.url())) {
        requests.push(request.url());
      }
    });
    return requests;
  }
}
