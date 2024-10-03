"use strict";

import { BusinessPage } from "./BusinessPage";
import { HTMLElement } from "./components/controls/HtmlElement";
import { HtmlElementCollection } from "./components/controls/HtmlElementCollection";

export class LoginPage extends BusinessPage {
  errorLabel = HtmlElementCollection.by(".ant-form-item-explain-error");
  loginButton = HTMLElement.by("button[type='submit'].common-submit");
  emailField = HTMLElement.by('#email');
  passwordField = HTMLElement.by('#password');
  orgField = HTMLElement.by('[placeholder="契約ID"]')
  orgSubmitBtn = HTMLElement.by('[type="submit"]')

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

  async verifyOrg(orgId: string) {
    await this.orgField.type(orgId);
    await this.orgSubmitBtn.click();
  }

  async login(emailText: string, password: string) {
    await this.emailField.type(emailText);
    await this.passwordField.type(password);
    await this.loginButton.click();
  }

  // get information
  async getErrorTexts() {
    return await this.errorLabel.getTexts();
  }
}

export default new LoginPage();
