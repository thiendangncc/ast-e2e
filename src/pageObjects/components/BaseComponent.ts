import { getDriver } from "@/support/driver";
import webdriver, { WebDriver } from "selenium-webdriver";

export class BaseComponent {
  get driver(): WebDriver {
    return getDriver();
  }
}
