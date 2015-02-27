Feature: health-check
  As an infrastructure monitoring system
  I want to periodically send requests to the health check endpoint
  So that I can verify the system is up and running and alert people if the healthcheck fails

  Scenario: Hit health check
    When I GET the "health check" resource
    Then I receive an "OK" response