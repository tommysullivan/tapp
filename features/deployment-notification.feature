Feature: deployment-notifications
  As an automated deployment pipeline system
  I want to notify pa-portal that a specific set of artifacts was deployed to a particular environment
  So that it can respond by running a test suite and providing success / failure feedback upon completion
#
Scenario:
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
      "service" : "passingComponent1",
      "environment" : "supportedEnvironment",
      "status" : "COMPLETED"
    }
  """
  Then I receive a "CREATED" response
  And a URL is returned in the location header

  Given I remember the URL in the location header for later use
  When I call the remembered URL
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
      "service" : "passingComponent1",
      "environment" : "supportedEnvironment",
      "status" : "COMPLETED",
      "testRunHref": "{{generatedTestRunHref}}"
    }
  """

  Given I remember the URL in the response's "reactionHref" property
  When I call the remembered URL
  Then I receive an "OK" response
  And the Content-Type of the representation is "application/vnd.lookout.pa.test-run+json;version=1.0.0"
  And the response contains the following JSON:
  """
    {
      "id": {{generatedId}},
      "components": ["passingComponent1"],
      "environment": "supportedEnvironment",
      "status": "in progress"
    }
  """