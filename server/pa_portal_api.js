var ApplicationController = require('./controllers/application_controller');

var TestRunsRoute = require('./routes/test_runs_route');
var TestRunsModel = require('./models/test_runs_model');
var TestRunModel = require('./models/test_run_model');
var TestRunsController = require('./controllers/test_runs_controller');
var ExceptionView = require('./views/exception_view');
var ExceptionsModel = require('./models/exceptions_model');
var collections = require('collections');
var fs = require('fs');

module.exports = function PAPortalAPI(paPortalConfigurationJSON, expressPackage, expressApp) {
    var nextSaveId = 0;
    return {
        newSupportedComponents: function() {
            return collections.Collection(paPortalConfigurationJSON['supportedComponents']);
        },
        newSupportedEnvironments: function() {
            return collections.Collection(paPortalConfigurationJSON['supportedEnvironments']);
        },
        newApplicationController: function() {
            return new ApplicationController(this);
        },
        newTestRunsRoute: function() {
            var router = expressPackage.Router();
            return new TestRunsRoute(expressApp, router, this.newTestRunsController());
        },
        newTestRunsModel: function() {
            var testRunModelsArray = []
            return new TestRunsModel(testRunModelsArray, this);
        },
        newExceptionView: function() {
            return new ExceptionView(paPortalConfigurationJSON['defaultErrorContentType']);
        },
        newTestRunsController: function() {
            return new TestRunsController(this.newTestRunsModel(), this, this.newExceptionView());
        },
        newExceptionConfigCollection: function() {
            return collections.Collection(paPortalConfigurationJSON['exceptions']);
        },
        newExceptionsModel: function() {
            return new ExceptionsModel(this.newExceptionConfigCollection());
        },
        newTestRunModel: function(testRunModelJSON) {
            nextSaveId++;
            return new TestRunModel(
                testRunModelJSON,
                nextSaveId,
                collections,
                this.newSupportedComponents(),
                this.newExceptionsModel(),
                this.newSupportedEnvironments()
            );
        }
    }
}