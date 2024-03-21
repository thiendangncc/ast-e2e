import { HTMLElement } from './../pageObjects/components/controls/HtmlElement';
import { getDriver } from './driver';

class Mouse {
  async moveTo(element: HTMLElement) {
    await element.waitVisible();
    const actions = getDriver().actions({async: true});
    await actions.move({origin: element.webElement}).perform();
  }

  async moveToOffset(offset: {x: number, y: number}) {
    const actions = getDriver().actions({async: true});
    await actions.move(offset).perform();
  }

  async dragAndDrop(draggable: HTMLElement, droppable: HTMLElement) {
    await draggable.waitVisible();
    await droppable.waitVisible();
    const actions = getDriver().actions({async: true});
    await actions.dragAndDrop(draggable.webElement, droppable.webElement).perform();
  }
}

export default new Mouse();
