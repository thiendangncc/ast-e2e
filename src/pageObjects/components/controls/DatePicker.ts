import { FormControl } from "./FormControl";

export class DatePicker extends FormControl {
  // override
  async type(text) {
    await this.waitVisible();
    throw new Error(`Not implement now ${text}`);
  }
}
