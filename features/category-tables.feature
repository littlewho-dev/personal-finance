Feature: Dashboard Category Tables

  As a user
  I want to see my accounts grouped by category
  So that I can understand where my money is held

  Scenario: View category tables with sortable columns
    Given I am on the dashboard page
    Then I should see the "Cash" category table with its total
    And I should see the "Assets" category table with its total
    And I should see the "Debts" category table with its total
    And each category table should show accounts sorted by balance descending
    When I click the "Name" column header in the "Cash" table
    Then the "Cash" table should be sorted by name
