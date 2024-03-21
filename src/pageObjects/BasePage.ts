const { util } = require("chai");
import { AppConfig } from '../app.config';
import { BaseComponent } from './components/BaseComponent';

// base includes layout element and common method
export class BasePage extends BaseComponent {
  public baseUrl: string;
  public path: string;
  // define all element in layout
  constructor(baseUrl, path = "") {
    super();
    this.baseUrl = baseUrl;
    this.path = path;
  }

  get fullUrl() {
    return `${this.baseUrl}${this.path}`;
  }
  // navigate functions
  async go(isClearCookies) {
    console.log(`Go to base url ${this.fullUrl}`);
    if (isClearCookies) {
      await this.clearCookies();
    }
    await this.driver.navigate().to(`${this.fullUrl}`);
  }

  async navigateTo(url) {
    await this.driver.navigate().to(url);
  }

  async refresh() {
    await this.driver.navigate().refresh();
  }
  // js functions
  async openNewTab(url) {// open in new tab
    const scriptJsText = `window.open('${url}','_blank');`;
    await this.executeScript(scriptJsText);
  }

  async scrollTo(x, y) {
    const scroll = `window.scrollTo(${x},${y});`;
    await this.executeScript(scroll);
  }

  async executeScript(script) {
    console.log('Executing javascript "' + script + '"');
    await this.driver.executeScript(script);
  }

  async clearCookies() {
    console.log('Clearing cookies visible on "' + await this.getCurrentUrl() + '"');
    await this.driver.manage().deleteAllCookies();
    await this.refresh();
  }

  // tab, window handler
  async getWindowHandle() {
    const handle = await this.driver.getWindowHandle();
    console.log('Retrieving the current window handle "' + handle + '"');
    return handle;
  }

  async getAllWindowHandles() {
    const handles = await this.driver.getAllWindowHandles();
    console.log(
      'Retrieving the current list of window handles "' + handles + '"'
    );
    return handles;
  }

  async switchToFrame(frame) {
    console.log('Switching to frame "' + frame + '"');
    await this.driver.switchTo().frame(frame);
  }

  async switchToWindow(window) {
    console.log('Switching to window "' + window + '"');
    await this.driver.switchTo().window(window);
  }

  // utils
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async sleep(waitTime) {
    console.log(`wait in page ${this.path} in ${waitTime}`);
    await this.driver.sleep(waitTime);
  }

  async waitUrlLoaded(expectedUrl) {
    return await this.wait(
      () => {
        return this.driver
          .getCurrentUrl()
          .then((url) => {
            return url.includes(expectedUrl);
          });
      },
      `Wait URL ${expectedUrl} show`
    );
  }

  async wait(waitCondition, msg) {
    return await this.driver.wait(
      () => {
        return waitCondition();
      },
      AppConfig.pageLoadWait,
      `${msg}`,
      AppConfig.waitInterval
    );

  }
  // condition methods
  async waitPageRendered() {// todo implement each page

  }

  async waitPageLoaded() {
    await this.waitUrlLoaded(this.fullUrl);
    await this.waitPageRendered();
  }
}
