Feature: test-runs
  As a human or program responsible for assuring quality
  I want to request an integration test run for one or more components in a particular environment
  So that the integration tests can verify the functionality and let me know the result

  Scenario Outline: Request Test Run for supported component(s)
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "components": <componentsJSONArray>,
      "environment": "supportedEnvironment"
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
      "id": {{generatedId}},
      "components": <componentsJSONArray>,
      "environment": "supportedEnvironment",
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
      "id": {{generatedId}},
      "components": <componentsJSONArray>,
      "environment": "supportedEnvironment",
      "status": "<expected status value>",
      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
    }
    """
  Examples:
    | componentsJSONArray                        | expected status value |
    | ["passingComponent1", "passingComponent2"] | passed                |
    | ["passingComponent1", "failingComponent2"] | failed                |
    | ["failingComponent1", "failingComponent2"] | failed                |
    | ["failingComponent1", "passingComponent2"] | failed                |

  Scenario: Request Test Run for unsupported component(s)
    Given that the pa_portal_configuration.json does not list unsupported1 or unsupported2 as a supported component
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "components": ["unsupportedComponent1", "unsupportedComponent2"],
      "environment": "supportedEnvironment"
    }
    """
    Then I receive a "FORBIDDEN" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.unsupported-component-exception+text; charset=utf-8"
    And the body contains the message "The requested components are not supported by pa portal at this time"

  Scenario: Request Test Run for unsupported environment(s)
    Given that the pa_portal_configuration.json does not list unsupportedEnvironment as a supported environment
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "components": ["passingComponent1", "passingComponent2"],
      "environment": "unsupportedEnvironment"
    }
    """
    Then I receive a "FORBIDDEN" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.unsupported-environment-exception+text; charset=utf-8"
    And the body contains the message "The requested environment is not supported by pa portal at this time"