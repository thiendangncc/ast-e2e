import { FormControl } from "./FormControl";

export class SelectBox extends FormControl {
  // override
  async type(text) {
    await this.waitVisible();
    throw new Error(`Not implement now ${text}`);
  }

  async selectByText(text) {
    await this.waitVisible();
    throw new Error(`Not implement now ${text}`);
  }
  async selectByValue(value) {
    await this.waitVisible();
    throw new Error(`Not implement now ${value}`);
  }
  async select(index) {
    await this.waitVisible();
    throw new Error(`Not implement now ${index}`);
  }
}
