Feature: Request a basic test run
  As an automated software deployment pipeline system
  I want to request a basic test run
  So that post-deployment integration tests can verify the functionality of the deployed-to environment and let me know the result

  Scenario Outline: Request Test Run for supported component(s)
    Given I am requesting a test that is known to finish after "5" seconds
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "components": <componentsJSONArray>,
      "environment": "<environmentName>"
    }
    """
    Then I receive a CREATED response code
    And a URL is returned in the location header
    Given I remember the URL in the location header
    Then when I call that URL, I receive a 200 containing the following JSON:
    """
    {
      "components": <componentsJSONArray>,
      "environment": "<environmentName>",
      "status": "in progress"
    }
    """
    And I wait "5" extra seconds after the time the test should have passed
    And when I call that URL, I receive a 200 containing the following JSON:
    """
    {
      "components": <componentsJSONArray>,
      "environment": "<environmentName>",
      "status": "<expected status value>",
      "result": "#{resultHref}"
    }
    """
    And when I call the URL in the JSON's result property, I get a 200 containing the following JSON:
    """
    {
      "thisWillBeA": "TestResult"
    }
    """
  Examples:
    | componentsJSONArray                        | environmentName | expected status value |
    | ["passingComponent1", "passingComponent2"] | goodEnvironment | passed                |
    | ["passingComponent1", "failingComponent2"] | goodEnvironment | failed                |
    | ["failingComponent1", "failingComponent2"] | goodEnvironment | failed                |
    | ["failingComponent1", "passingComponent2"] | goodEnvironment | failed                |
    | ["passingComponent1", "passingComponent2"] | badEnvironment  | failed                |


  Scenario: Request Test Run for unsupported component(s)
    Given I am requesting a test for unsupported components
    When I POST the following JSON to the "test-run-requests" resource:
    """
    {
      "components": ["unsupported1", "unsupported2"],
      "environment": "goodEnvironment"
    }
    """
    Then I receive a 403 Forbidden response code
    And the body contains the message "The requested components are not supported by pa portal at this time"

  Scenario: Request Test Run for unsupported environment(s)
    Given I am requesting a test for unsupported components
    When I POST the following JSON to the "test-run-requests" resource:
    """
    {
      "components": ["passingComponent1", "passingComponent2"],
      "environment": "unsupportedEnvironment"
    }
    """
    Then I receive a 403 Forbidden response code
    And the body contains the message "The requested environment is not supported by pa portal at this time"