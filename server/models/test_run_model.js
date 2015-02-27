module.exports = function(
    testRunModelJSON,
    idUponSave,
    collections,
    supportedComponents,
    exceptionsModel,
    supportedEnvironments,
    request,
    tappAPI,
    testRunModelsArray
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
        components: function() {
            return collections.Collection(testRunModelJSON.components);
        },
        environment: function() {
            return testRunModelJSON.environment;
        },
        promotionHref: function(newValue) {
            testRunModelJSON.promotionHref = newValue;
        },
        hasUnsupportedComponents: function() {
            function isUnsupported(componentName) { return !supportedComponents.contains(componentName); }
            return this.components().any(isUnsupported);
        },
        hasUnsupportedEnvironment: function() {
            return !supportedEnvironments.contains(this.environment());
        },
        status: function() {
            return testRunModelJSON.status;
        },
        executeTestRun: function() {
            if(this.hasUnsupportedComponents()) throw exceptionsModel.newUnsupportedComponentException();
            if(this.hasUnsupportedEnvironment()) throw exceptionsModel.newUnsupportedEnvironmentException();
            testRunModelJSON.status = 'in progress';
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