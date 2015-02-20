Feature: Request a basic test run
  As an automated software deployment pipeline system
  I want to request a basic test run
  So that post-deployment integration tests can verify the functionality of the deployed-to environment and let me know the result

  Scenario Outline: Request Test Run for supported component(s)
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "components": <componentsJSONArray>,
      "environment": "<environmentName>"
    }
    """
    Then I receive a "CREATED" response
    And a URL is returned in the location header

    Given I remember the URL in the location header for later use
    When I call the remembered URL
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
      "id": "generatedIdHere",
      "components": <componentsJSONArray>,
      "environment": "<environmentName>",
      "status": "in progress"
    }
    """

    #TODO: Once we implement AUTO-234, we will not perform this GIVEN as we will expect a real system to update pa-portal with results
    Given a Jenkins or other job would be triggered and upon completion would PATCH the remembered URL with the following JSON:
    """
    {
      "status": "<expected status value>",
      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
    }
    """
    When I call the remembered URL
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
      "id": "generatedIdHere",
      "components": <componentsJSONArray>,
      "environment": "<environmentName>",
      "status": "<expected status value>",
      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
    }
    """
  Examples:
    | componentsJSONArray                        | environmentName | expected status value |
    | ["passingComponent1", "passingComponent2"] | goodEnvironment | passed                |
    | ["passingComponent1", "failingComponent2"] | goodEnvironment | failed                |
    | ["failingComponent1", "failingComponent2"] | goodEnvironment | failed                |
    | ["failingComponent1", "passingComponent2"] | goodEnvironment | failed                |
    | ["passingComponent1", "passingComponent2"] | badEnvironment  | failed                |


#  Scenario: Request Test Run for unsupported component(s)
#    Given I am requesting a test for unsupported components
#    When I POST the following JSON to the "test-run-requests" resource:
#    """
#    {
#      "components": ["unsupported1", "unsupported2"],
#      "environment": "goodEnvironment"
#    }
#    """
#    Then I receive a "Forbidden" response
#    And the body contains the message "The requested components are not supported by pa portal at this time"
#
#  Scenario: Request Test Run for unsupported environment(s)
#    Given I am requesting a test for unsupported components
#    When I POST the following JSON to the "test-run-requests" resource:
#    """
#    {
#      "components": ["passingComponent1", "passingComponent2"],
#      "environment": "unsupportedEnvironment"
#    }
#    """
#    Then I receive a "Forbidden" response
#    And the body contains the message "The requested environment is not supported by pa portal at this time"