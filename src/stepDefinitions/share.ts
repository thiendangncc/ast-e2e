import { Then, When } from "@cucumber/cucumber";
import { BusinessPage } from "../pageObjects/BusinessPage";
import { expect } from 'chai';
import { Form } from "@/pageObjects/components/controls/Form";
const businessPage = new BusinessPage();

When('I click on the {string} button', async (name: string) => {
  await businessPage.clickButtonByName(name);
})

Then('I expect to see alert message {string}', async (msg) => {
  const text = await businessPage.getErrorMessage();
  expect(msg).to.equal(text);
})

Then('I expect to see page title {string}', async (msg) => {
  const text = await businessPage.getPageTitle();
  expect(msg).to.equal(text);
})

Then('I expect to see inputs', async (table: any) => {
  const form = Form.by('.ant-form') as Form;
  for (const item of table.hashes()) {
    await form.verifyLabelAndPlaceholder(item.label, item.placeholder)
  }
  console.log('tabletabletable', table.hashes(), table.raw());
})
