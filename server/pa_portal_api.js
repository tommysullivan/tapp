var ApplicationController = require('./controllers/application_controller');

var TestRunsRoute = require('./routes/test_runs_route');
var TestRunsModel = require('./models/test_runs_model');
var TestRunModel = require('./models/test_run_model');
var TestRunsController = require('./controllers/test_runs_controller');

module.exports = function PAPortalAPI(paPortalConfiguration, expressPackage, expressApp) {
    var nextSaveId = 0;
    return {
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
            return new TestRunsController(this.newTestRunsModel());
        },
        newTestRunModel: function(testRunModelJSON) {
            nextSaveId++;
            return new TestRunModel(testRunModelJSON, nextSaveId, paPortalConfiguration.numSecondsToPretendThatTestingIsOccurring());
        }
    }
}