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
      | city     | distance | message                                                                                 |
      | 500      | london   | "city" with value "500" fails to match the letters pattern. "distance" must be a number |
      | london   | -1       | "distance" must be greater than or equal to 0                                           |
      | new york | 50       | "city" with value "new york" fails to match the letters pattern                         |

