Feature: Dashboard Net Worth Display

  As a user
  I want to see my net worth on the dashboard
  So that I can understand my overall financial position

  Scenario: View net worth breakdown on dashboard
    Given I am on the dashboard page
    Then I should see the net worth displayed
    And I should see the breakdown by category
