import { sleepTime } from "../../../utils";
import { getDriver } from "../../../support/driver";
import { AppConfig } from '../../../app.config';
import { BaseComponent } from '../BaseComponent';
const AsyncFunction = (async () => {}).constructor;

export class BaseElement extends BaseComponent {
  public selector: any;
  constructor(selector) {
    super();
    this.selector = selector;
  }

  // utils
  async sleep(waitTime) {
    await sleepTime(waitTime);
  }

  async wait(condition, msg) {// wait for element render
    return this.driver.wait(async () => {
      try {
        if (condition instanceof AsyncFunction === true) {
          return await (condition as Function)();
        }
        return condition();
      } catch (error: any) {
        // case error
        console.error(error.message);
        return false;
      }
    }, AppConfig.pageLoadWait, `${msg} (selector ${this.selector})`, AppConfig.waitInterval)
  }
}
