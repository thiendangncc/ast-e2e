import { FormControl } from "./FormControl";

const path = require('path');

export class Uploader extends FormControl {
  // override
  async selectFile(imagePath: string) {
    await this.webElement.sendKeys(path.resolve(__dirname, `../../../../upload/${imagePath}`));
  }
}
