Feature: Notify PA Portal of a Deployment
  As an automated software deployment pipeline system
  I want to notify the integration testing portal of a recent deployment
  So that post-deployment integration tests can verify the functionality of the deployed-to environment and let me know the result

  Scenario: Discover all of the Deployment Notification content types supported by PA's deployment-notifications resource
    When I request supported content types for the "deployment-notifications" resource
    Then the supported content types include:
    """
    application/json
    application/vnd.lookout.cicd.deployment-notification+json;version=1.0.0
    text/vnd.lookout.cicd.deployment-notification+html;version=1.0.0
    text/html
    """

  Scenario: Discover the supported methods for PA's deployment-notifications resource
    When I request supported methods for the "deployment-notifications" resource
    Then the supported methods include:
    """
    GET
    HEAD
    POST
    OPTIONS
    """

  Scenario Outline: Determine whether or not the list of deployment-notifications has changed since I last asked for it
    Given I have an ETAG from a previous request for "deployment-notifications"
    And I have <not> added a deployment notification since that time
    When I <verb> the "deployment-notifications" resource
    Then I receive a status of <expected status>
  Examples:
    | not | verb | expected status |
    |     | GET  | OK              |
    |     | HEAD | FOUND           |
    | not | GET  | NOT MODIFIED    |
    | not | HEAD | NOT MODIFIED    |

  Scenario Outline: List all Deployment Notifications
    When I GET a <content type> representation of the "deployment-notifications" resource
    Then I see the <expected representation> of deployment notifications
  Examples:
    | content type                                                            | expected representation |
    | application/json                                                        | JSON representation     |
    | application/vnd.lookout.cicd.deployment-notification+json;version=1.0.0 | JSON representation     |
    | text/vnd.lookout.cicd.deployment-notification+html;version=1.0.0        | HTML representation     |
    | text/html                                                               | HTML representation     |

  Scenario: Notify PA of Deployment
    Given that I have created a representation of a deployment notification
    When I POST to the "deployment-notifications" resource
    Then I receive a status of CREATED
    And the location header contains URL of the newly created resource

  Scenario: View Deployment Notification
    Given that I have notified PA Portal of a deployment
    When I GET the newly created resource
    Then I see the resource I created

  Scenario: Progress Events are received
    When I notify PA Portal of a deployment
    Then I receive a processing start notification
    And I receive at least one progress notification
    And the final progress notification is for 100%

  Scenario: Deployment record is requested
    When I notify PA Portal of a deployment
    Then I receive a request for the deployment record

  Scenario: Successful completion
    Given I deploy an app with known good tests and state
    When I notify PA Portal of a deployment
    Then I receive a processing complete notification
    And it is successful
    And it contains a link to more information

  Scenario: Completion with errors
    Given I deploy an app with known bad tests
    When I notify PA Portal of a deployment
    Then I receive a processing complete notification
    And it indicates failure
    And it contains a link to more information

  Scenario: Cancel processing of a deployment notification
    Given that I have notified PA Portal of a deployment
    When I POST a cancellation
    Then the location header contains URL of the newly created resource
    When I GET the newly created resource
    Then I see the resource I created
    And It has a status of cancellation complete or canceling
    And I receive a processing complete notification
    And it indicates cancellation
    And it contains a link to more information