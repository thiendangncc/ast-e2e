import { DatePicker } from "./DatePicker";
import { FormControl, IFormControl } from "./FormControl";
import { HTMLElement } from "./HtmlElement";
import { HtmlElementCollection } from "./HtmlElementCollection";
import { Textarea } from "./Textarea";
import { TextBox } from "./TextBox";
import { Uploader } from "./Uploader";
import { expect } from 'chai';

export type FormType = 'TextBox' | 'DatePicker' | 'Textarea' | 'Uploader';
export interface FormInput {
  type: FormType,
  locator: string,
  value: string
}

export class Form extends HTMLElement {
  labels = HtmlElementCollection.by('label');

  get(type: FormType, locator: string): IFormControl {
    switch (type) {
      case 'TextBox':
        return TextBox.by(`${this.selector} ${locator}`);
      break;
      case 'Textarea':
        return Textarea.by(`${this.selector} ${locator}`);
      break;
      case 'DatePicker':
        return DatePicker.by(`${this.selector} ${locator}`);
      break;
      case 'Uploader':
        return Uploader.by(`${this.selector} ${locator}`);
      break;
      default:
        return FormControl.by(`${this.selector} ${locator}`);
      break;

    }
  }

  async fill(input: FormInput) {
    const formItem = this.get(input.type, input.locator);
    await formItem.type(input.value);
  }

  async fillMultiple(inputs: FormInput[]) {
    for (let item of inputs) {
      await this.fill(item);
    }
  }

  async getValueByLabel(text: string) {
    const label = this.labels.findElementByText(text);
    const forId = label.getAttribute('for');

    return HTMLElement.by(`#${forId}`).getAttribute("value");
  }
  // verify
  async verifyLabelAndPlaceholder(label: string, placeholder: string) {
    const labelItem = await this.labels.findElementByText(label);
    const forId = await labelItem.getAttribute('for');
    // console.log('fridd', forId);

    return expect(placeholder).to.equal(await HTMLElement.by(`#${forId}`).getAttribute("placeholder"));
  }
}
