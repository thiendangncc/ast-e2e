"use strict";

import { BusinessPage } from "./BusinessPage";
import { HTMLElement } from "./components/controls/HtmlElement";
import { HtmlElementCollection } from "./components/controls/HtmlElementCollection";

export class LoginPage extends BusinessPage {
  errorLabel = HtmlElementCollection.by(".ant-form-item-explain-error");
  loginButton = HTMLElement.by(".ant-btn-lg");
  emailField = HTMLElement.by('#username');
  passwordField = HTMLElement.by('#password');

  constructor() {
    super('login');
  }
  // actions
  async signIn() {
    await this.loginButton.click();
  }

  async enterUserEmail(emailText) {
    await this.emailField.type(emailText);
  }

  async enterUserPassword(password) {
    await this.passwordField.type(password);
  }

  async login(username: string, password: string) {
    await this.enterUserEmail(username);
    await this.enterUserPassword(password);
    await this.signIn();
  }

  // get information
  async getErrorTexts() {
    return await this.errorLabel.getTexts();
  }
}

export default new LoginPage();
