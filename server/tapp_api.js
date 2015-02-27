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
var collections = require('collections');
var request = require('request');
var fs = require('fs');

module.exports = function(paPortalConfigurationJSON, expressPackage, expressApp) {
    var nextSaveId = 0;
    var testRunModelsArray = []
    var deploymentNotificationModelsCollection = collections.Collection([]);
    return {
        //CONFIG
        newSupportedComponents: function() {
            return collections.Collection(paPortalConfigurationJSON['supportedComponents']);
        },
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
        newTestRunsController: function() {
            return new TestRunsController(
                this.newTestRunsModel(),
                this,
                this.newExceptionView(),
                paPortalConfigurationJSON['testRunsContentType'],
                this.newTestRunRoutes()
            );
        },
        newTestRunModel: function(testRunModelJSON) {
            nextSaveId++;
            return new TestRunModel(
                testRunModelJSON,
                nextSaveId,
                collections,
                this.newSupportedComponents(),
                this.newExceptionsModel(),
                this.newSupportedEnvironments(),
                request,
                this,
                testRunModelsArray
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
        newDeploymentNotificationsController: function() {
            return new DeploymentNotificationsController(
                this.newDeploymentNotificationsModel(),
                this.newExceptionView(),
                this,
                paPortalConfigurationJSON['deploymentNotificationContentType'],
                this.newDeploymentNotificationsRoutes()
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