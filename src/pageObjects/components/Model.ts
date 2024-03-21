import { BaseComponent } from "./BaseComponent";
import { HTMLElement } from "./controls/HtmlElement";
import { HtmlElementCollection } from "./controls/HtmlElementCollection";

class Model extends BaseComponent {
  title = HTMLElement.by('.ant-modal-title');
  closeIcon = HTMLElement.by('.ant-modal-close-x');

  async close() {
    await this.closeIcon.click()
  }

  async getTitle() {
    return await this.title.getText();
  }
}

export default new Model();
