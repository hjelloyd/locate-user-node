# Created by heather.lloydcunningham
Feature: locate users
  tests the locate user api

  Scenario Outline: when the city: <city> and distance: <distance> parameters are invalid
    Given the cities have the coordinates below
      | city   | latitude  | longitude |
      | London | 51.509865 | -0.118092 |
    When the api is called with city: '<city>' and distance: '<distance>'
    Then the response status returned is 400
    And the message returned is '<message>'

    Examples:
      | city     | distance | message                                                                                 |
      | 500      | london   | "city" with value "500" fails to match the letters pattern. "distance" must be a number |
      | london   | -1       | "distance" must be greater than or equal to 0                                           |
      | new york | 50       | "city" with value "new york" fails to match the letters pattern                         |

  Scenario: when there are only users that live in a city
    Given the cities have the coordinates below
      | city      | latitude  | longitude |
      | Blackpool | 51.509865 | -0.118092 |
    When the api is called with city: 'blackpool' and distance: '50'
    Then the response status returned is 200
    And the users are returned as below
      | id | first_name | last_name  | type     |
      | 1  | "Maurise"  | "Shieldon" | ["CITY"] |

  Scenario: when there are only users that are in the vicinity of a city
    Given the cities have the coordinates below
      | city    | latitude  | longitude |
      | Glasgow | 55.861753 | -4.252603 |
    When the api is called with city: 'glasgow' and distance: '50'
    Then the response status returned is 200
    And the users are returned as below
      | id | first_name | last_name | type         |
      | 1  | "Jessica"  | "Morris"  | ["VICINITY"] |

  Scenario: when a user is in their home city
    Given the cities have the coordinates below
      | city    | latitude  | longitude |
      | Glasgow | 55.861753 | -4.252603 |
    When the api is called with city: 'MADRID' and distance: '50'
    Then the response status returned is 200
    And the users are returned as below
      | id | first_name | last_name  | type                |
      | 1  | "Bendix"   | "Halgarth" | "CITY", "VICINITY"] |

  Scenario: when there are no coordinates for the city
    Given the cities have the coordinates below
      | city   | latitude  | longitude |
      | Madrid | 40.416775 | -3.703790 |
    When the api is called with city: 'Birmingham' and distance: '5'
    Then the response status returned is 206
    And the users are returned as below
      | id | first_name | last_name  | type     |
      | 5  | "Rosita"   | "Ferrulli" | ["CITY"] |

  Scenario: when there are multiple users home and in the vicinity of a city
    Given the cities have the coordinates below
      | city   | latitude  | longitude |
      | Madrid | 40.416775 | -3.703790 |
    When the api is called with city: 'glasgow' and distance: '5'
    Then the response status returned is 200
    And the users are returned as below
      | id | first_name | last_name  | type                 |
      | 3  | "Meghan"   | "Southall" | ["CITY", "VICINITY"] |
      | 4  | "Sidnee"   | "Silwood"  | ["CITY"]             |
      | 5  | "Rosita"   | "Ferrulli" | ["VICINITY"]         |

  Scenario: when there are multiple users home and in the vicinity of a city but the city has no coordinates
    Given the cities have the coordinates below
      | city   | latitude  | longitude |
      | Madrid | 40.416775 | -3.703790 |
    When the api is called with city: 'london' and distance: '5'
    Then the response status returned is 206
    And the users are returned as below
      | id | first_name | last_name  | type     |
      | 3  | "Meghan"   | "Southall" | ["CITY"] |
      | 4  | "Sidnee"   | "Silwood"  | ["CITY"] |
