Feature: Request a basic test run
  As an automated software deployment pipeline system
  I want to request a basic test run
  So that post-deployment integration tests can verify the functionality of the deployed-to environment and let me know the result

  Scenario Outline: Request Test Run for supported component(s)
    Given I am requesting a test that is known to <pass or fail> after "5" seconds
    When I POST the following JSON to the "test-run-requests" resource:
    """
    {
      "components": ["serviceA", "chefRecipeB", "etc"],
      "environment": "stageX"
    }
    """
    And I remember the URL returned in the location header
    Then when I call that URL, I receive a 404 indicating the test result is not there yet
    And after I wait "10" seconds
    Then when I call that URL, I receive a 200 containing the following JSON:
    """
    {
      "success": <expected success value>,
      "detailsHref": "hrefToSomeTestResult"
    }
    """
    Examples:
      | pass or fail | expected success value |
      | pass         | true                   |
      | fail         | false                  |


  Scenario: Request Test Run for unsupported component(s)
    Given I am requesting a test for unsupported components
    When I POST the following JSON to the "test-run-requests" resource:
    """
    {
      "components": ["unsupported1", "unsupported2", "etc"],
      "environment": "stageX"
    }
    """
    Then I receive a 403 Forbidden response code
    And the body contains the message "The requested components are not supported by pa portal at this time"

  Scenario: Request Test Run for unsupported environment(s)
    Given I am requesting a test for unsupported components
    When I POST the following JSON to the "test-run-requests" resource:
    """
    {
      "components": ["serviceA", "chefRecipeB", "etc"],
      "environment": "unsupportedEnvironment"
    }
    """
    Then I receive a 403 Forbidden response code
    And the body contains the message "The requested environment is not supported by pa portal at this time"