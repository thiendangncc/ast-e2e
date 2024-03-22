import { By, WebElementPromise, WebElement } from "selenium-webdriver";
import { getDriver } from "../../../support/driver";
import { BaseElement } from "./BaseElement";
import { HtmlElementCollection } from "./HtmlElementCollection";
const AsyncFunction = (async () => {}).constructor;

export class HTMLElement extends BaseElement {
  public findElementFn: () => WebElementPromise | WebElement;
  constructor(selector, findElementFn: () => WebElementPromise | WebElement) {
    super(selector);
    this.findElementFn = findElementFn;
  }

  get webElement(): WebElementPromise | WebElement {
    return this.getCurrentElement();
  }

  getCurrentElement(): WebElementPromise | WebElement {
    const item = this.findElementFn();
    // if promise
    if (this.findElementFn instanceof AsyncFunction === true) {
      return new WebElementPromise( this.driver, item );
    }

    return item;
  }

  // find inner
  findElement(selectorFn) {
    // todo more info for debug
    return new HTMLElement(`${this.selector} // ${selectorFn}`, async () => {
      return this.webElement.findElement(selectorFn);
    })
  }

  findElements(selectorFn) {
    return HtmlElementCollection.create(() => {
      return this.webElement.findElements(selectorFn);
    });
  }

  // interaction
  async click() {
    await this.wait(async() => {
      const element = this.getCurrentElement();
      // in case need move cursor to element to display
      if (!(await this.isDisplayedNoWait())) {
        await this.driver
        .actions()
        .move({ origin: element })
        .perform();
      }

      if(await this.isDisplayedNoWait() && await this.isEnabledNoWait()) {
        // click
        await element.click();
        console.log(`click to ${this.selector}`);

        return true;
      }

      return false;
    }, "can not click to element");
  }
  // input, editable field
  async type(text) {
    await this.waitVisible();
    await this.clear();
    await this.webElement.sendKeys(text);
    console.log(`Type ${text} to ${this.selector}`);
  }

  async clear() {
    await this.webElement.clear();
  }

  // upload, file upload input
  async upload(filePath) {
    await this.driver.executeScript(
      "document.querySelector(\"input[type='file']\").removeAttribute('style');"
    );
    console.log(process.cwd());
    let filePathUrl =
      process.cwd().replace(/\\/g, "/") + `/upload/${filePath}`;
    console.log("FILE PATH " + filePathUrl);
    await this.webElement.type(filePathUrl);
  }

  async hover() {
    await this.driver.actions().move({ origin: this.webElement }).perform();
  }

  // information
  async isSelected() {
    try {
      await this.wait(() => this.webElement.isSelected(), "the element is not selected");
      return true;
    } catch (error) {
      return false;
    }
  }

  async isDisplayedNoWait() {
    try {
      console.log('this.webElement', this.selector, await this.webElement.getText());

      return await this.webElement.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async isDisplayed() {
    try {
      await this.wait(() => this.isDisplayedNoWait(), "the element is not displayed");
      return true;
    } catch (error) {
      return false;
    }
  }

  async isEnabledNoWait() {
    try {
      return await this.webElement.isEnabled();
    } catch (error) {
      return false;
    }
  }

  async isEnabled() {
    try {
      await this.wait(() => this.isEnabledNoWait(), "the element is not displayed");
      return true;
    } catch (error) {
      return false;
    }
  }

  async getText(_allowEmpty = false) {
    // await this.waitVisible();
    let text;
    await this.wait(async () => {
      text = await this.webElement.getText();

      if (_allowEmpty) {
        return typeof text !== 'undefined';
      }
      return !!text;// need value
    }, "can not find the element to get text");

    return text;
  }

  async getTagName() {
    await this.waitVisible();
    return await this.webElement.getTagName();
  }

  async getAttribute(key: string) {
    await this.waitVisible();
    return await this.webElement.getAttribute(key);
  }

  async getRect() {
    await this.waitVisible();
    return await this.webElement.getRect();
  }

  async getCssValue() {
    await this.waitVisible();
    return await this.webElement.getCssValue();
  }

  // utils
  async waitVisible() {
    console.log(`wait ${this.selector} visible`);
    await this.wait(() => this.isDisplayedNoWait(), "the element is not visible");
  }

  static create(selectorFn) {
    return new this(selectorFn.toString(), () => {
      return getDriver().findElement(selectorFn)
    })
  }

  static by(cssSelector) {
    return new this(cssSelector, () => {
      return getDriver().findElement(By.css(cssSelector))
    })
  }

  static byXpath(xpathSelector) {
    return new this(xpathSelector, () => {
      return getDriver().findElement(By.xpath(xpathSelector))
    })
  }
}
