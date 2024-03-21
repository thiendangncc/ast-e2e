import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import DashboardPage from '@/pageObjects/DashboardPage';
import LoginPage from '@/pageObjects/LoginPage';
import { TEST_DATA } from '@/data';

Given("I go to the login page successfully", async () => {
  await LoginPage.go(true);
});
Then(
  "I expect to see login error message {string} and {string}",
  async function (userNameError, passwordError) {
    const items = await LoginPage.getErrorTexts();
    expect(userNameError).to.equal(items[0]);
    expect(passwordError).to.equal(items[1]);
  }
);

Then("Dashboard is loaded done", async function () {
  await DashboardPage.waitPageLoaded();
});

Then("I attempt to login without any credentials", async function () {
  await LoginPage.signIn();
});

// declarative
When("I attempt to login with {string} and {string}", async function (username: string, password: string) {
  await LoginPage.enterUserEmail(username);
  await LoginPage.enterUserPassword(password);
  await LoginPage.signIn();
});

When("Log in Ams successfully as {string} user", async function (role: 'admin' | 'user') {
  let username = "";
  let password = "";
  switch(role) {// factory case
    case 'admin':
      username = TEST_DATA.adminUser[0].username;
      password = TEST_DATA.adminUser[0].password;
      break;
    default:
      break;
  }
  await LoginPage.login(username, password);
});
// end
When("I enter email as {string}", async function (emailAddress) {
  await LoginPage.enterUserEmail(emailAddress);
});

When("I enter password as {string}", async function (password) {
  await LoginPage.enterUserPassword(password);
});

When("I enter email as {config} in config", async function (emailAddress) {
  await LoginPage.enterUserEmail(emailAddress);
});

When("I enter password as {config} in config", async function (password) {
  await LoginPage.enterUserPassword(password);
});

When("I attempt to login", async function () {
  await LoginPage.signIn();
});
