import { FormControl } from "./FormControl";

export class Uploader extends FormControl {
  // override
  async selectFile(imagePath: string) {
    await this.waitVisible();
    this.type(`../../../../${imagePath}`)
  }
}
