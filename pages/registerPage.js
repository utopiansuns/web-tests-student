import { BasePage } from './basePage.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/auth/register';
    this.heading = page.getByRole('heading', { level: 1 });
  }
}
