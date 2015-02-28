Feature: deployment-notifications
  As an automated deployment pipeline system
  I want to notify pa-portal that a specific set of artifacts was deployed to a particular environment
  So that it can respond by running a test suite and providing success / failure feedback upon completion
#
  Scenario Outline:
    When I POST the following JSON to the "deployment-notifications" resource:
    """
    {
      "id" : {{preExistingId}},
      "artifact" : {
        "id" : 1,
        "group" : "com.example.cucumber",
        "name" : "cucumber-artifact",
        "version" : "1.0.1",
        "sourceUrl" : "http://example.com/maven/com.example.cucumber/cucumber-artifact/1.0.1/cucumber-artifact-1.0.1.jar",
        "createdAt" : "someTimestamp"
      },
      "service" : "passingComponent",
      "environment" : "supportedEnvironment",
      "status" : "COMPLETED"
    }
  """
    Then I receive a "CREATED" response
    And a URL is returned in the location header

    Given I remember the location header as "notification url" for later use
    When I call the remembered "notification url"
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.deploydb.deployment-notification+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
      "id" : {{preExistingId}},
      "artifact" : {
        "id" : 1,
        "group" : "com.example.cucumber",
        "name" : "cucumber-artifact",
        "version" : "1.0.1",
        "sourceUrl" : "http://example.com/maven/com.example.cucumber/cucumber-artifact/1.0.1/cucumber-artifact-1.0.1.jar",
        "createdAt" : "someTimestamp"
      },
      "service" : "passingComponent",
      "environment" : "supportedEnvironment",
      "status" : "COMPLETED",
      "testRunHref": "{{valid url}}"
    }
  """

    Given I remember the "testRunHref" property of the response as "test run URL" for later use
    When I call the remembered "test run URL"
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
      "id": {{valid number}},
      "component": "passingComponent",
      "environment": "supportedEnvironment",
      "status": "in progress",
      "triggeredBy": "{{valid url}}"
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
      "component": "passingComponent",
      "environment": "supportedEnvironment",
      "status": "<expected status value>",
      "triggeredBy": "{{notification url}}",
      "promotionHref": "{{valid url}}",
      "testResultHref": "http://hrefToSomewhereContainingAnHTMLAndOrJSONTestResult"
    }
    """

    Given I remember the "promotionHref" property of the response as "promotion URL" for later use
    When I call the remembered "promotion URL"
    Then I receive an "OK" response
    And the Content-Type of the representation is "application/vnd.lookout.deploydb.promotion+json;version=1.0.0"
    And the response contains the following JSON:
    """
    {
        "name": "passingComponent",
        "url" : "{{valid url}}",
        "status" : "<expected status value>"
    }
    """
  Examples:
  | expected status value |
  | passed                |
  | failed                |