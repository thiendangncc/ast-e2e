"use strict";
import { HTMLElement } from './components/controls/HtmlElement';
import { AppConfig } from '../app.config';
import { BasePage } from './BasePage';
import { HtmlElementCollection } from './components/controls/HtmlElementCollection';


export class BusinessPage extends BasePage {
  // buttons
  buttons = HtmlElementCollection.by('button');
  // test
  errorModel = HTMLElement.by('.ant-notification-notice-message');
  // loading
  loading = HTMLElement.by('.ant-spin.ant-spin-spinning');
  pageTitle = HTMLElement.by('.ant-page-header-heading-left');

  constructor(path = '') {
    super(AppConfig.appUrl, path);
  }
  // override
  async waitPageRendered() {// todo implement each page
    await this.wait(async () => {
      return !(await this.loading.isDisplayedNoWait());
    }, `wait all component in pages loaded`)
  }

  // common functions for all page
  async getErrorMessage() {
    return await this.errorModel.getText();
  }
  async getPageTitle() {
    return await this.pageTitle.getText();
  }

  async clickButtonByName(name: string) {
    return await this.buttons.findElementByText(name).click();
  }
}
