"use strict";
import { BeforeStep, setWorldConstructor } from '@cucumber/cucumber';
import { AppConfig } from '../app.config';
import { getDriver } from './driver';
import logger from './logger';
import {
  getGherkinScenarioMap,
  getGherkinStepMap,
} from '@cucumber/cucumber/lib/formatter/helpers/gherkin_document_parser';
import { getStepKeyword } from '@cucumber/cucumber/lib/formatter/helpers/pickle_parser';
import { CustomWorld } from './World';

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

setWorldConstructor(CustomWorld);

BeforeAll(async () => {
  logger.init();
  console.log("Before All Navigating to: " + AppConfig.appUrl);
  await getDriver().navigate().to(AppConfig.appUrl);
});


Before(async function (scenario) {
  this.attachLogger(logger);
  this.gherkinScenarioMap = getGherkinScenarioMap(scenario.gherkinDocument);
  this.gherkinStepMap = getGherkinStepMap(scenario.gherkinDocument);
  console.log(`[Scenario]: ${scenario.pickle.name}`);
});

After(async function (scenario) {
  scenario?.result?.message && console.log(scenario.result.message);
  console.log(`[${scenario.result.status} - Scenario]: ${scenario.pickle.name}`);
  if (scenario.result.status === "FAILED") {
    await tryAttachScreenshot(this, scenario);
  }
  this.takeLogSnapshot();
  this.detachLogger();
});

AfterAll(async function () {
  // perform some shared teardown
  await getDriver().manage().deleteAllCookies();
  await getDriver().quit();
});

BeforeStep(async function (step) {
  console.log(
    `[Step]: ${getStepKeyword({
      ...step,
      gherkinStepMap: this.gherkinStepMap,
    })}${step.pickleStep.text}`,
  );
});
