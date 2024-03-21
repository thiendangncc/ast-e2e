Feature: AMS Login
    As an admin user
    I want to visit the ams website
    So that I can Login into my account
Rule: Test from login page
  Background: Go to the login page
    Given I go to the login page successfully
  Scenario: Attempt to login without credentials
    When I attempt to login without any credentials
    Then I expect to see login error message "'username' is required" and "'password' is required"

  Scenario: Attempt to login with wrong credentials
    When I enter email as "wrong@email.com"
    And I enter password as "wrongPassword"
    And I attempt to login
    Then I expect to see alert message "Thông tin đăng nhập không chính xác"
  # declerative
  Scenario: Attempt to login with wrong credentials
    When I attempt to login with "wrong@email.com" and "wrongPassword"
    Then I expect to see alert message "Thông tin đăng nhập không chính xác"

  Scenario: Attempt to login with correct credentials
    When I enter email as "adminUser[0].username" in config
    And I enter password as "adminUser[0].password" in config
    And I attempt to login
    Then I expect to see page title "Thống kê"
