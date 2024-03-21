import SideBar from "@/pageObjects/components/SideBar";
import { When } from "@cucumber/cucumber";

When("I click to {string} on menu", async function (menuName: string) {
  await SideBar.clickMenu(menuName);
});

When("I click to {string} on sub-menu", async function (menuName: string) {
  await SideBar.clickSubMenu(menuName);
});
