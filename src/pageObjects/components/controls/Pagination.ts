import { BaseComponent } from "../BaseComponent";
import { HTMLElement } from "./HtmlElement";

export class Pagination extends BaseComponent {
  parent: HTMLElement;
  get activePage() {
    return this.parent.findElement('.ant-pagination-item-active');
  }
  get pageItems() {
    return this.parent.findElements('.ant-pagination-item');
  }
  get prevBtn() {
    return this.parent.findElement('.ant-pagination-prev');
  }
  get nextBtn() {
    return this.parent.findElement('.ant-pagination-next');
  }

  constructor(parentElement: HTMLElement) {
    super();
    this.parent = parentElement;
  }
  async clickPrevBtn() {
    await this.prevBtn.click();
  }

  async clickNextBtn() {
    await this.nextBtn.click();
  }

  async goToPage(pageNumber: number) {
    await this.pageItems.get(pageNumber - 1).click();
  }

  async getActivePage() {
    return await this.activePage.getText();
  }
}
