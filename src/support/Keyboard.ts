import { getDriver } from "./driver";
import webdriver, { WebDriver } from "selenium-webdriver";

class Keyboard {
  async copy() {
    throw new Error("Not implement copy");
  }
  async paste() {
    throw new Error("Not implement paste");
  }
  async keyUp() {
    throw new Error("Not implement paste");
  }
  async keyDown() {
    throw new Error("Not implement paste");
  }
}

export default new Keyboard();

// const Keyboard = getDriver().actions();

// export default Keyboard;
