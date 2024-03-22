import { World } from '@cucumber/cucumber';
interface ILogger {
  intercept: Function;
  clear: Function;
}

export class CustomWorld extends World {
  user: {};
  token: string;
  email: {};
  window: string;
  attributes: {};
  events: never[];
  myLogger?: ILogger;
  logs: never[];
  gherkinScenarioMap: null;
  gherkinStepMap: null;

  constructor(options) {
    super(options);
    this.user = {};
    this.token = '';
    this.email = {};
    this.window = '';
    this.attributes = {};
    this.events = [];
    this.logs = [];
    this.gherkinScenarioMap = null;
    this.gherkinStepMap = null;
  }

  attachLogger(logger) {
    this.myLogger = logger;
    this.myLogger?.intercept((...args) => {
      return this.logs.push(...(args as never[]));
    });
  }

  detachLogger() {
    if (this.myLogger) {
      this.myLogger.clear();
    }
  }

  takeLogSnapshot() {
    this.attach(this.logs.join('\n'), 'text/plain');
    this.logs = [];
  }

  setAttributeValues(attributes) {
    this.attributes = attributes;
  }

  getDataLayerEvens() {
    return this.events;
  }

  getAttributeValues() {
    const attrs = this.attributes;
    return attrs;
  }

  setEmail(email) {
    this.email = email;
    const printableObject = JSON.parse(JSON.stringify(email));
    printableObject.body = printableObject.body.substr(0, 500) + '...';
    console.log('Setting the email: \n' + JSON.stringify(printableObject));
  }

  setCurrentWindow(window) {
    this.window = window;
    console.log('Setting the window: ' + window);
  }

  getCurrentWindow() {
    const window = this.window;
    console.log('Getting the window: ' + window);
    return window;
  }
}
