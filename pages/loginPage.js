import { BasePage } from './basePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.form = page.locator('form[data-marker="login-form"]');
  }
}
