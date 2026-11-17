import { BasePage } from './basePage.js';

export class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginButton = page.locator('[data-marker="login-button-desktop"]');
  }

  async open() {
    await super.open('/');
  }

  async openLoginForm() {
    await this.loginButton.click();
  }
}
