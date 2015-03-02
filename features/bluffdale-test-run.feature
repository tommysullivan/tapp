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

  Examples:
    | environment | expected status value |
    | stage1      | passed                |
    | prod1       | failed                |