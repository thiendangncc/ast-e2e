import { BaseComponent } from "./BaseComponent";
import { HTMLElement } from "./controls/HtmlElement";
import { HtmlElementCollection } from "./controls/HtmlElementCollection";

class SideBar extends BaseComponent {
  logo = HTMLElement.by('[data-test-id="logo"]');
  menuItems = HtmlElementCollection.by('[data-test-id="menu-item"]');
  subMenuItems = HtmlElementCollection.by('[data-test-id="sub-menu-item"]');

  async clickToLogo() {
    await this.logo.click
  }

  async clickMenu(name: string) {
    await this.menuItems.findElementByText(name).click();
  }

  async clickSubMenu(name: string) {
    await this.subMenuItems.findElementByText(name).click();
  }
}

export default new SideBar();
