Feature: test-runs
  As a human or program responsible for assuring quality
  I want to request an integration test run for one component in a particular environment
  So that the integration tests can verify the functionality and let me know the result

  Scenario Outline: Request Test Run for supported component
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "component": "<componentName>",
      "environment": "supportedEnvironment"
    }
    """
    Then I receive a "CREATED" response
    And a URL is returned in the location header

    Given I remember the location header as "test run URL" for later use
    When I call the remembered "test run URL"
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
      "id": {{valid number}},
      "component": "<componentName>",
      "environment": "supportedEnvironment",
      "status": "in progress"
    }
    """

    Given a Jenkins job would do the following PATCH after we complete AUTO-234
    When I PATCH the remembered "test run URL" with the following JSON:
    """
    {
      "status": "<expected status value>",
      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
    }
    """
    When I call the remembered "test run URL"
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
      "id": {{valid number}},
      "component": "<componentName>",
      "environment": "supportedEnvironment",
      "status": "<expected status value>",
      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
    }
    """
  Examples:
    | componentName     | expected status value |
    | passingComponent  | passed                |
    | failingComponent  | failed                |

  Scenario: Request Test Run for unsupported component
    Given that the pa_portal_configuration.json does not define unsupported1 component
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "component": "unsupported1",
      "environment": "supportedEnvironment"
    }
    """
    Then I receive a "FORBIDDEN" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.unsupported-component-exception+text; charset=utf-8"
    And the body contains the message "The requested component is not supported by pa portal at this time"

  Scenario: Request Test Run for unsupported environment
    Given that the pa_portal_configuration.json does not list unsupportedEnvironment as a supported environment
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "component": "passingComponent",
      "environment": "unsupportedEnvironment"
    }
    """
    Then I receive a "FORBIDDEN" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.unsupported-environment-exception+text; charset=utf-8"
    And the body contains the message "The requested environment is not supported by pa portal at this time"

  Scenario: View list of test runs
    When I GET the "test-runs" resource
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.test-runs-list+json;version=1.0.0"
    And the response is a JSON array