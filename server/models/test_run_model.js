module.exports = function(
    testRunModelJSON,
    idUponSave,
    collections,
    exceptionsModel,
    supportedEnvironments,
    request,
    tappAPI,
    testRunModelsArray,
    componentsModel
    ) {
    return {
        id: function() {
            return testRunModelJSON.id;
        },
        save: function() {
            if(!testRunModelJSON.hasOwnProperty('id')) {
                testRunModelJSON.id = idUponSave;
                testRunModelsArray.push(this);
            }
        },
        component: function() {
            return componentsModel.componentModelNamed(testRunModelJSON['component']);
        },
        environment: function() {
            return testRunModelJSON.environment;
        },
        promotionHref: function(newValue) {
            testRunModelJSON.promotionHref = newValue;
        },
        status: function() {
            return testRunModelJSON.status;
        },
        executeTestRun: function(callback) {
            if(!supportedEnvironments.contains(this.environment())) throw exceptionsModel.newUnsupportedEnvironmentException();
            testRunModelJSON.status = 'in progress';
            this.component().executeTestsAgainstEnvironment(this.environment(), callback);
        },
        applyPatch: function(patchJSON, selfURL, completionCallback) {
            if(patchJSON.hasOwnProperty('status')) testRunModelJSON.status = patchJSON.status;
            if(patchJSON.hasOwnProperty('testResultHref')) testRunModelJSON.testResultHref = patchJSON.testResultHref;
            if(testRunModelJSON.hasOwnProperty('triggeredBy')) {
                request(testRunModelJSON.triggeredBy, onDeploymentNotificationGETRequestComplete.bind(this));
                function onDeploymentNotificationGETRequestComplete(error, response, body) {
                    var deploymentNotificationModel = tappAPI.newDeploymentNotificationModel(JSON.parse(body));
                    deploymentNotificationModel.promote(this, selfURL, completionCallback);
                }
            } else completionCallback();
        },
        toJSONString: function() {
            return JSON.stringify(testRunModelJSON);
        }
    }
}