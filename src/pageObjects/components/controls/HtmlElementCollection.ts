import { By, WebElement } from "selenium-webdriver";
import { BaseElement } from "./BaseElement";
import { HTMLElement } from "./HtmlElement";
const AsyncFunction = (async () => {}).constructor;

export class HtmlElementCollection extends BaseElement {
  public byFn: Function;
  constructor(selector, byFn) {
    super(selector);
    this.byFn = byFn;
  }

  get webElements() {
    return this.findElements();
  }

  private findElements(): Promise<Array<WebElement>> {
    return this.driver.findElements(this.byFn(this.selector));
  }

  get(index) {
    return this.findElementByIndex(index);
  }

  findElementByIndex(index) {
    return new HTMLElement(`${this.selector} // ${index}`, async () => {
      const elements = await this.findElements();
      return elements[index];
    })
  }

  findElementByText(text) {
    return new HTMLElement(`${this.selector} // ${text}`, async () => {
      let element = null;
      let elements = await this.findElements();

      for (const item of elements) {
        const textItem = (await item.getText()).trim();
        if (textItem.includes(text)) {
          element = item;
          break;
        }
      }

      if (!element) {
        // throw new Error(`${this.selector} // ${text} not found`)
        return new WebElement(this.driver, `${this.selector} // ${text} not found`);
      };

      return element;
    })
  }

  // utils
  async getIndexByText(text: string) {
    let elements = await this.findElements();
    for (const item of elements) {
      const textItem = (await item.getText()).trim();

      if (textItem.includes(text)) {
        return elements.indexOf(item);
      }
    }

    throw new Error(`${this.selector} // ${text} not found`);
  }
  async getTexts() {
    const texts = [];
    const elements = await this.findElements();
    for (const index in elements) {
      const item = this.get(index);
      texts.push(((await item.getText()) as never))
    }

    return texts;
  }
  // init functions
  static create(selectorFn) {
    return new HtmlElementCollection(selectorFn.toString(), selectorFn);
  }

  static by(cssSelector) {
    return new HtmlElementCollection(cssSelector, By.css);
  }

  static byXpath(xpathSelector) {
    return new HtmlElementCollection(xpathSelector, By.xpath);
  }

  // todo check
  // static byText(text) {
  //   return () => new HtmlElementCollection(text, By.linkText);
  // }
}
