"use strict";
import { AppConfig } from '../app.config';
import { getDriver } from './driver';
require("chromedriver");

const fs = require("fs");
const { Before, After, BeforeAll, AfterAll } = require("@cucumber/cucumber");
const { writeFile } = require("fs").promises;

const TEST_REPORTS_FOLDER_PATH = "test-reports";
const RESULTS_FOLDER_PATH = "test-reports/results";
const SCREENSHOT_FOLDER_PATH = "test-reports/screenshots";

const EVENTS = {
  EXIT: "exit",
  UNCAUGHTEXCEPTION: "uncaughtException",
};

process.on(EVENTS.EXIT, exitHandler);
process.on(EVENTS.UNCAUGHTEXCEPTION, exitHandler);

createTestResultFolderIfNeeded();

async function exitHandler() {
  process.exit();
}

function createTestResultFolderIfNeeded() {
  if (!fs.existsSync(TEST_REPORTS_FOLDER_PATH)) {
    fs.mkdirSync(TEST_REPORTS_FOLDER_PATH);
  }
  if (!fs.existsSync(RESULTS_FOLDER_PATH)) {
    fs.mkdirSync(RESULTS_FOLDER_PATH);
  }
  if (!fs.existsSync(SCREENSHOT_FOLDER_PATH)) {
    fs.mkdirSync(SCREENSHOT_FOLDER_PATH);
  }
}

async function tryAttachScreenshot(world, scenario) {
  try {
    const screenshot = await getDriver().takeScreenshot();
    world.attach(screenshot, 'image/png');
    await writeFile(
      `${SCREENSHOT_FOLDER_PATH}/${scenario.pickle.name.toLowerCase().replaceAll(' ', '_')}.png`,
      screenshot,
      "base64"
    );
  } catch (error) {
    console.warn("Unable to capture screenshot.");
  }
}

BeforeAll(async () => {
  console.log("Before All Navigating to: " + AppConfig.appUrl);
  await getDriver().navigate().to(AppConfig.appUrl);
});


Before(async function (scenario) {

});

After(async function (scenario) {
  console.log(`Scenario - ${scenario.pickle.name} - ${scenario.result.status}`);
  if (scenario.result.status === "FAILED") {
    await tryAttachScreenshot(this, scenario);
    console.log(`Scenario - ${scenario.pickle.name} - FAILED`);
  }
});

AfterAll(async function () {
  // perform some shared teardown
  await getDriver().manage().deleteAllCookies();
  await getDriver().quit();
});
