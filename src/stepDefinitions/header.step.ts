import Header from "@/pageObjects/components/Header";
import { When } from "@cucumber/cucumber";

When("I click to sync hrm button in header", async function () {
  await Header.syncHrm();
});

When("I click to logout button in header", async function () {
  await Header.logout();
});
