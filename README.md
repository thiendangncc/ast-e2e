### Environment
- nodejs/npm: https://nodejs.org/en
- git: https://www.git-scm.com/downloads

Note: Install nodejs LTS version and git before start 
### Quick Start

1. Clone the project using `git clone ssh://ops.nccsoft.vn:22/DefaultCollection/NCC-ITTools/_git/NCC-ITTools-E2E`
2. Install node modules - `npm install`.
3. This should have started the server. Visit `http://dev-ams.nccsoft.vn` to confirm.
4. To run setup local env. Create .env file in root folder and copy the content from .env.example
5. To run tests - `npm run test`.
6. To run tests and see the report - `npm run test:report`.

### Introduction

The tests are BDD (Behaviour driven development) style. The feature describe the behaviour of the system under
test & are written in `gerkhin`. This can be found in the `login.feature` file. The feature files are also commonly
referred to as so called living or executable documentation. The features are backed by executable code called the `step definitions` (for example `login.step.ts`). The step definitions are the actual javascript code that gets executed to run the tests.

- [Cucumber JS](https://github.com/cucumber/cucumber-js)
- [Cucumber](https://cucumber.io)

#### package.json

The so called `devDependencies` section of the `package.json` file includes the below node modules to help us test
the app

```
"devDependencies": {
    "@cucumber/cucumber": "^8.11.1",
    "chai": "^4.3.7",
    "cucumber-html-reporter": "^5.5.0",
    "eslint": "^8.34.0",
    "selenium-webdriver": "^4.8.1"
}
```

The first of this is `chai` which provides support for writing easily readable assertions in our tests. Second is `cucumber` which provides us the ability of writing feature files and mapping them to step definition. Finally we have `selenium-webdriver` which actually acts a glue between the browser and the browser driver. In our case we are using "Chrome" and "Chromium".

- [Chai](http://www.chaijs.com/guide/styles/#assert)
- [Selenium JS](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs)
- [Webdriver API](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html)
- [Chromedriver](https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver)

#### Test code architecture

##### Page Object classes

The so called page object design pattern for testing encapsulates the properties and actions on a page (screen) into its own class so that the test code (step definitions) can interact with the pages without having to include any screen specific logic into the tests itself. The main advantage of this model is that the tests become
isolated from the screen design, they become simple to write and understand & are easier to maintain.

In the code that we have, the `LoginPage.ts` file contains the `LoginPage` class that abstracts away the interactions with the login page.

All of the page object classes inherit (extend) from the `BasePage` class that is defined in the `BasePage.ts` file.

##### Async & Await

The newer version of the java script standards have introduced the `async` and `await` keywords that have greatly simplified the writing of asynchronous code. An function marked as `async` always returns a `Promise`. Async functions are started synchronously but then are executed asynchronously removing the need to write the flaky waiting code which is not reliable.

The `await` keyword before an promise expression waits until the expression is resolved (the result is returned).

- [Async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

#### Cucumber

The cucumber discussion can be split into 3 parts. First how its being invoked, secondly the cucumber hooks and last but not the least the step definitions.

##### Invoking cucumber-js

The cucumber test run is invoked using the command `npm run test` which maps to the package script

##### hooks.js

Cucumber hooks are functions that are invoked during the lifecycle of a test run. They can be `Before` or `After`. These are opportunities for us to implement any setup or teardown code that is relevant at these points. For example we might want to load the login page before each test, set up the right web-driver instance, set global parameters etc.

Hooks are included in the code using

```
const { Before, After } = require('cucumber');
```

Hook functions could have the below signature.

```
Before({ options }, async function(scenario) { code });
After({ options }, async function(scenario) { code });
```

The `scenario` object passed to the function above will have the format `{sourceLocation: {line, uri}, result: {duration, status}, pickle}` for `After` hooks. For `Before` hook it does NOT have the `result` property.

Some of the `options` include `tags` & `timeout`. There can be more than one Before or After hook function declared. Before hooks are executed in the order they are declared. After hooks run in the opposite order of there declaration.

- [API](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/api_reference.md#afteroptions-fn)

BEFORE HOOK

```
Before({ timeout: CONSTANTS.HOOK_TIMEOUTS.BEFORE }, async function(scenario) {
    setDefaultTimeout(CONSTANTS.STEP_TIMEOUTS.TIMEOUT); // 1

    const browserName = this.parameters.browserName; // 2
    const scenarioName = scenario.pickle.name; // 3
    const builder = new webdriver.Builder(); // 4

    this.appUrl = APP_URL;

    driver = await builder
        .forBrowser(browserName)
        .build(); // 5

    this.driver = driver; // 6
    await this.driver.get(this.appUrl); // 7
});
```

The `Before` hook in our code above does the below

1. uses the cucumber supplied `setDefaultTimeout` method to set the default step timeout.
2. set the `browserName` property from the injected cucumber world property of the same name.
3. Extracts the scenario name.
4. Instantiates a webdriver Builder instance.
5. Creates the driver for the browser.
6. Sets the driver variable.
7. Loads the application starting url.

AFTER HOOK

```
After({ timeout: CONSTANTS.HOOK_TIMEOUTS.AFTER }, async function(scenario) {
    if (!this.driver) {
        return;
    } // 1

    if (scenario.result.status === Status.FAILED) {
        await tryAttachScreenshot(this);
        console.log(`Scenario - ${scenario.pickle.name} - FAILED`)
    } // 2

    await deinitWebdriver(); // 3
    delete this.driver; // 4
});
```

The After hook does the below

1. Checks if the driver instance exists else returns.
2. If scenario failed tries to take a screen shot and prints the failed scenario name on console.
3. Invokes the function `deinitWebdriver`.
4. Delete's the `driver` property from cucumber world.

Its worth noting that `this` refers to the cucumber `world` object inside the `Before` & `After` functions.

- [World](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/world.md)

##### Cucumber steps

Its the step definition code where the test execution finally happens. In our case `loginSteps.js` are where the step code resides.

```
const assert = require('chai').assert; // 1
const { Given, When, Then} = require('cucumber'); // 2
const And = Then; // 3
```

1. Requires the `chai` assertion code.
2. Requires cucumber `Given, When & Then` functions to add syntactic sugar to the code.
3. Some more syntactic sugar.

The step function take the format `Given|And|Then|When('...step text...', async function () {}, timeout`. The function need not be an async function. However since we are using await inside the code we need to make the function `async`.

[Steps](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/step_definitions.md#step-definitions)

##### Test report

Once the tests have been run using `npm run test`. The test report can be generated using `npm run testReport`. The `cucumber-html-reporter` node module has been used to generate test reports.

[Cucumber HTML Reporter](https://www.npmjs.com/package/cucumber-html-reporter)
