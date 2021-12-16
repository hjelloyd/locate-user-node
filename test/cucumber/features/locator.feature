# Created by heather.lloydcunningham
Feature: locate users
  tests the locate user api

  Scenario Outline: when the city: <city> and distance: <distance> parameters are invalid
    Given the cities have the coordinates below
      | city | latitude | longitude |
    When the api is called with city: '<city>' and distance: '<distance>'
    Then the response status returned is 400
    And the message returned is '<message>'

    Examples:
      | city     | distance | message                                                                           |
      | 500      | london   | city must be a string and distance must be an integer - exact wording will change |
      | london   | -1       | distance must be an positive integer - exact wording will change                  |
      | new york | 50       | city cannot contain spaces  - exact wording will change                           |

