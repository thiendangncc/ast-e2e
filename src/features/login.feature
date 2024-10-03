Feature: AMS Login
  As an admin user
  I want to visit the ams website
  So that I can Login into my account
  # Rule: Validation
  # ....
  Rule: Success
    Scenario: Attempt to login with correct credentials
      Given I go to the login page successfully
      When I login with org "947151026" email "trangvuhoai@ncc.asia" and password "123456"
      Then I expect to see page title "Thống kê"
