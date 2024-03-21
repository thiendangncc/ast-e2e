import Header from "@/pageObjects/components/Header";
import Model from "@/pageObjects/components/Model";
import { Then, When } from "@cucumber/cucumber";
import { expect } from 'chai';

Then("I expect to see {string} modal displayed", async function (title: string) {
  const modelTitle = await Model.getTitle();
  expect(title).to.equal(modelTitle);
});
