import { HTMLElement } from "./HtmlElement";
export interface IFormControl {
  type: (text: string) => Promise<void>;
}
export class FormControl extends HTMLElement implements IFormControl {

}
