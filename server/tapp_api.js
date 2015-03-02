var collections = require('collections');
var request = require('request');
var fs = require('fs');

var ApplicationController = require('./controllers/application_controller');
var ExternalRoutes = require('./routes/external_routes');
var HealthCheckRoute = require('./routes/healthcheck_route');
var TestRunRoutes = require('./routes/test_run_routes');
var TestRunsModel = require('./models/test_runs_model');
var TestRunModel = require('./models/test_run_model');
var TestRunsController = require('./controllers/test_runs_controller');
var DeploymentNotificationsRoutes = require('./routes/deployment_notifications_routes');
var DeploymentNotificationsModel = require('./models/deployment_notifications_model');
var DeploymentNotificationModel = require('./models/deployment_notification_model');
var DeploymentNotificationsController = require('./controllers/deployment_notifications_controller');
var ExceptionView = require('./views/exception_view');
var ExceptionsModel = require('./models/exceptions_model');
var ComponentModel = require('./models/component_model');
var ComponentsModel = require('./models/components_model');
var DoNothingTestJob = require('./models/do_nothing_test_job');
var JenkinsTestJob = require('./models/jenkins_test_job');
var JSONView = require('./views/json_view');
var ItemCreatedView = require('./views/item_created_view');
var ItemPatchedView = require('./views/item_patched_view');

module.exports = function(paPortalConfigurationJSON, expressPackage, expressApp) {
    var nextSaveId = 0;
    var testRunModelsArray = []
    var deploymentNotificationModelsCollection = collections.Collection([]);
    return {
        newSupportedEnvironments: function() {
            return collections.Collection(paPortalConfigurationJSON['supportedEnvironments']);
        },

        //APP CONTROLLER
        newApplicationController: function() {
            return new ApplicationController(this);
        },

        //EXPRESS
        newExpressRouter: function() {
            return expressPackage.Router();
        },

        //EXCEPTIONS
        newExceptionView: function() {
            return new ExceptionView(paPortalConfigurationJSON['defaultErrorContentType']);
        },
        newExceptionConfigCollection: function() {
            return collections.Collection(paPortalConfigurationJSON['exceptions']);
        },
        newExceptionsModel: function() {
            return new ExceptionsModel(this.newExceptionConfigCollection());
        },

        newComponentsModel: function() {
            return new ComponentsModel(
                paPortalConfigurationJSON['components'],
                this,
                this.newExceptionsModel()
            );
        },
        newComponentModel: function(componentJSON) {
            return new ComponentModel(componentJSON, this);
        },
        newTestJob: function(testJSON) {
            switch(testJSON.type) {
                case "jenkins": return this.newJenkinsTestJob(testJSON);
                case "doNothing": return this.newDoNothingTestJob();
                default: throw new Error("Unknown test type: "+testJSON.type);
            }
        },
        newJenkinsTestJob: function(testJSON) {
            return new JenkinsTestJob(
                request,
                paPortalConfigurationJSON['jenkinsCSRFCrumbURL'],
                testJSON
            );
        },
        newDoNothingTestJob: function() {
            return new DoNothingTestJob();
        },

        newItemCreatedView: function(response) {
            return ItemCreatedView(response);
        },
        newItemPatchedView: function(response) {
            return ItemPatchedView(response);
        },

        //EXTERNAL ROUTES
        newExternalRoutes: function() {
            return new ExternalRoutes(
                expressApp,
                this.newExpressRouter(),
                paPortalConfigurationJSON['promotionsBaseURL'],
                paPortalConfigurationJSON['promotionsPath'],
                paPortalConfigurationJSON['promotionPath'],
                paPortalConfigurationJSON['promotionContentType'],
                paPortalConfigurationJSON['mountPoint']
            );
        },

        newHeathCheckRoute: function() {
            return new HealthCheckRoute(
                expressApp,
                this.newExpressRouter(),
                paPortalConfigurationJSON['healthCheckPath'],
                paPortalConfigurationJSON['mountPoint']
            );
        },

        //TEST RUNS
        newTestRunRoutes: function() {
            return new TestRunRoutes(
                expressApp,
                this.newExpressRouter(),
                this,
                paPortalConfigurationJSON['baseURL'],
                paPortalConfigurationJSON['testRunsPath'],
                paPortalConfigurationJSON['testRunPath'],
                paPortalConfigurationJSON['mountPoint']
            );
        },
        newTestRunsModel: function() {
            return new TestRunsModel(testRunModelsArray);
        },
        newTestRunsView: function(response) {
            return new JSONView(response, paPortalConfigurationJSON['testRunsListContentType']);
        },
        newTestRunItemView: function(response) {
            return new JSONView(response, paPortalConfigurationJSON['testRunContentType']);
        },
        newTestRunsController: function(response) {
            return new TestRunsController(
                this.newTestRunsModel(),
                this,
                this.newTestRunRoutes(),
                this.newTestRunsView(response),
                this.newTestRunItemView(response),
                this.newItemCreatedView(response),
                this.newItemPatchedView(response)
            );
        },
        newTestRunModel: function(testRunModelJSON) {
            nextSaveId++;
            return new TestRunModel(
                testRunModelJSON,
                nextSaveId,
                collections,
                this.newExceptionsModel(),
                this.newSupportedEnvironments(),
                request,
                this,
                testRunModelsArray,
                this.newComponentsModel()
            );
        },


        //DEPLOYMENT NOTIFICATIONS
        newDeploymentNotificationsRoutes: function() {
            return new DeploymentNotificationsRoutes(
                expressApp,
                this.newExpressRouter(),
                this,
                paPortalConfigurationJSON['baseURL'],
                paPortalConfigurationJSON['deploymentNotificationsPath'],
                paPortalConfigurationJSON['deploymentNotificationPath'],
                paPortalConfigurationJSON['mountPoint']
            );
        },
        newDeploymentNotificationsView: function(response) {
            return new JSONView(response, paPortalConfigurationJSON['deploymentNotificationsListContentType']);
        },
        newDeploymentNotificationView: function(response) {
            return JSONView(response, paPortalConfigurationJSON['deploymentNotificationContentType']);
        },
        newDeploymentNotificationsController: function(response) {
            return new DeploymentNotificationsController(
                this.newDeploymentNotificationsModel(),
                this,
                this.newDeploymentNotificationsRoutes(),
                this.newDeploymentNotificationsView(response),
                this.newDeploymentNotificationView(response),
                this.newItemCreatedView(response)
            );
        },
        newDeploymentNotificationsModel: function() {
            return new DeploymentNotificationsModel(deploymentNotificationModelsCollection);
        },
        newDeploymentNotificationModel: function(deploymentNotificationModelJSON) {
            return new DeploymentNotificationModel(
                deploymentNotificationModelJSON,
                request,
                this.newTestRunRoutes(),
                this.newExternalRoutes(),
                this.newDeploymentNotificationsModel(),
                this.newExceptionsModel(),
                deploymentNotificationModelsCollection
            );
        }
    }
}