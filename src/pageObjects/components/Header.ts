import { BaseComponent } from "./BaseComponent";
import { HTMLElement } from "./controls/HtmlElement";

class Header extends BaseComponent {
  username = HTMLElement.by('[data-test-id="username"]');
  syncHrmBtn = HTMLElement.by('[data-test-id="sync-hrm-btn"]');
  logoutBtn = HTMLElement.by('[data-test-id="logout-btn"]');

  async logout() {
    await this.logoutBtn.click();
  }
  async syncHrm() {
    await this.syncHrmBtn.click();
  }
  async getUsername() {
    return await this.username.getText();
  }
}

export default new Header();
