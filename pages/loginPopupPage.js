export class LoginPopupPage {
  constructor(page) {
    this.page = page;
    this.form = page.locator('[data-marker="login-form"]');
    this.emailInput = this.form.locator('[data-marker="email-input"]');
    this.passwordInput = this.form.locator('[data-marker="password-input"]');
    this.submitButton = this.form.locator('[data-marker="login-submit-button"]');
    this.emailError = this.form.locator('[data-marker="email-error"]');
    this.passwordError = this.form.locator('[data-marker="password-error"]');
    this.registerLink = page.locator('[data-marker="login-modal-register-link"]');
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
  }

  async goToRegistration() {
    await this.registerLink.click();
  }
}
