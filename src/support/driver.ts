"use strict";

import webdriver, { WebDriver } from "selenium-webdriver";
import phantomjs from "phantomjs-prebuilt";
import { setDefaultTimeout } from "@cucumber/cucumber";
import { AppConfig } from '../app.config';
const chrome = require("selenium-webdriver/chrome");

let driver: WebDriver;
setDefaultTimeout(20 * 5000);

const buildFirefoxDriver = () => {
  return new webdriver.Builder().forBrowser("firefox").build();
};

const buildChromeDriver = () => {
  var options = new chrome.Options();
  options.setPageLoadStrategy("eager");
  options.addArguments("--disable-gpu");
  options.addArguments("--incognito");
  options.addArguments("--start-maximized");

  return new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  // return new webdriver.Builder().forBrowser("chrome").build();
};

/**  const buildChromeDriver = () => {
  var service = new chrome.ServiceBuilder(path).build();
  chrome.setDefaultService(service);
  var driver = new webdriver.Builder().forBrowser('chrome').withCapabilities(options.toCapabilities()).build();
  driver.manage().timeouts().implicitlyWait(20000);
  return driver;
};
*/
const buildChromeHeadlessDriver = () => {
  var chrome = require("selenium-webdriver/chrome");
  // var path = require('chromedriver').path;
  // var service = new chrome.ServiceBuilder(path).build();
  // chrome.setDefaultService(service);
  const chromeCapabilities = webdriver.Capabilities.chrome();
  chromeCapabilities.set("chromeOptions", {
    args: [
      "--headless",
      "--start-maximized",
      "disable-infobars",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-extensions",
      "--ignore-certificate-errors",
      "--disable-dev-shm-usage",
      "--verbose",
      "--backtrace",
      "--log-level=3",
      "--log-path=chromedriver.log"
    ]
  });
  var chromeOptions = new chrome.Options();

  chromeOptions.addArguments("test-type");
  chromeOptions.addArguments("--disable-infobars");
  chromeOptions.addArguments("--headless");
  chromeOptions.addArguments("--window-size=1920,1080");
  chromeOptions.addArguments("--ignore-certificate-errors");
  chromeOptions.addArguments("--no-sandbox");
  chromeOptions.addArguments("--disable-extensions");
  chromeOptions.addArguments("--disable-gpu");
  chromeOptions.addArguments("--disable-dev-shm-usage");
  chromeOptions.addArguments("--verbose");
  chromeOptions.addArguments("--log-level=3");
  chromeOptions.addArguments("--log-path=chromedriver.log");
  chromeOptions.addArguments("--incognito");
  chromeOptions.setPageLoadStrategy("eager");

  // driver.manage().timeouts().implicitlyWait(20000) ;
  return new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();
};

const buildPhantomJsDriver = () => {
  console.log("Initilizing phantomjs WebDriver");
  return new webdriver.Builder()
    .withCapabilities({
      "phantomjs.binary.path": phantomjs.path,
      "phantomjs.cli.args": [
        "--web-security=false",
        "--ignore-ssl-errors=true"
      ]
    })
    .forBrowser("phantomjs")
    .build();
};

const getCapabilities = (env) => {
  return {
    browserName: env.browserName,
    browser_version: env.browser_version,
    os: env.os,
    os_version: env.os_version,
    "browserstack.user": env.user,
    "browserstack.key": env.key
  };
};

const buildBrowserStackDriver = (env) => {
  const capabilities = getCapabilities(env);
  return new webdriver.Builder()
    .usingServer("http://hub.browserstack.com/wd/hub")
    .withCapabilities(capabilities)
    .build();
};

const buildDriver = () => {
  const browser = AppConfig.browserName;
  console.log(browser.toLowerCase());
  switch (browser.toLowerCase()) {
    case "firefox":
      driver = buildFirefoxDriver();
      break;
    case "phantomjs":
      driver = buildPhantomJsDriver();
      break;
    case "chrome":
      driver = buildChromeDriver();
      break;
    case "chrome-headless":
      driver = buildChromeHeadlessDriver();
      break;
    case "browserstack":// todo
      // driver = buildBrowserStackDriver(env);
      break;
  }
  setDriverTimeout();
};

const setDriverTimeout = async (implicit?, pageLoad?) => {
  await driver.manage().setTimeouts({
    implicit: implicit ?? AppConfig.implicitWait,
    pageLoad: pageLoad ?? AppConfig.pageLoadWait// render time, prevent issues page load too long
  });
};

/**
 * @return The WebDriver instance
 */
const getDriver = (): WebDriver => {
  if (!driver) buildDriver();
  return driver;
};

export { getDriver, buildDriver, setDriverTimeout };
