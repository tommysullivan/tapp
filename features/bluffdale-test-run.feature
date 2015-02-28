Feature: bluffdale test run
  As a human or program responsible for assuring quality
  I want to request an integration test run for bluffdale against multiple environments
  So that the integration tests can verify the functionality and let me know the result

  Scenario Outline: Request Test Run for Bluffdale in multiple environments
    When I POST the following JSON to the "test-runs" resource:
    """
    {
      "component": "bluffdale",
      "environment": "<environment>"
    }
    """
    Then I receive a "CREATED" response
#    And a URL is returned in the location header
#
#    Given I remember the location header as "test run URL" for later use
#    When I call the remembered "test run URL"
#    Then I receive an "OK" response
#    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
#    And the response contains the following JSON:
#    """
#    {
#      "id": {{valid number}},
#      "components": ["bluffdale"],
#      "environment": "<environment>",
#      "jenkinsJobHref": "{{valid url}}",
#      "status": "in progress"
#    }
#    """

#    Given I remember the "jenkinsJobHref" property of the response as "jenkins job URL" for later use
#    When the Jenkins job at remembered "jenkins job URL" has completed
#    And I call the remembered "test run URL"
#    Then I receive an "OK" response
#    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
#    And the response contains the following JSON:
#    """
#    {
#      "id": {{valid number}},
#      "components": <componentsJSONArray>,
#      "environment": "supportedEnvironment",
#      "jenkinsJobHref": "{{valid url}}",
#      "status": "<expected status value>",
#      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
#    }
#    """
  Examples:
    | environment | expected status value |
    | stage1      | passed                |
    | prod1       | failed                |