var ApplicationController = require('./controllers/application_controller');

var TestRunsRoute = require('./routes/test_runs_route');
var TestRunsModel = require('./models/test_runs_model');
var TestRunModel = require('./models/test_run_model');
var TestRunsController = require('./controllers/test_runs_controller');
var collections = require('collections');
var fs = require('fs');

module.exports = function PAPortalAPI(paPortalConfigurationPath, expressPackage, expressApp) {
    var nextSaveId = 0;
    return {
        newConfiguration: function() {
            return JSON.parse(fs.readFileSync(paPortalConfigurationPath));
        },
        newSupportedComponents: function() {
            return collections.Collection(this.newConfiguration()['supportedComponents']);
        },
        newUnsupportedComponentError: function() {
            return new Error("The requested components are not supported by pa portal at this time");
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
        newTestRunsController: function() {
            return new TestRunsController(this.newTestRunsModel(), this);
        },
        newTestRunModel: function(testRunModelJSON) {
            nextSaveId++;
            return new TestRunModel(testRunModelJSON, nextSaveId, collections, this.newSupportedComponents(), this);
        }
    }
}