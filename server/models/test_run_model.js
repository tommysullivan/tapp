module.exports = function(testRunModelJSON, idUponSave, collections, supportedComponents, exceptionsModel, supportedEnvironments) {
    return {
        id: function() {
            return testRunModelJSON.id;
        },
        save: function() {
            if(!testRunModelJSON.hasOwnProperty('id')) {
                testRunModelJSON.id = idUponSave;
            }
        },
        components: function() {
            return collections.Collection(testRunModelJSON.components);
        },
        environment: function() {
            return testRunModelJSON.environment;
        },
        hasUnsupportedComponents: function() {
            function isUnsupported(componentName) { return !supportedComponents.contains(componentName); }
            return this.components().any(isUnsupported);
        },
        hasUnsupportedEnvironment: function() {
            return !supportedEnvironments.contains(this.environment());
        },
        executeTestRun: function() {
            if(this.hasUnsupportedComponents()) throw exceptionsModel.newUnsupportedComponentException();
            if(this.hasUnsupportedEnvironment()) throw exceptionsModel.newUnsupportedEnvironmentException();
            testRunModelJSON.status = 'in progress';
        },
        applyPatch: function(patchJSON) {
            if(patchJSON.hasOwnProperty('status')) testRunModelJSON.status = patchJSON.status;
            if(patchJSON.hasOwnProperty('testResultHref')) testRunModelJSON.testResultHref = patchJSON.testResultHref;
            //TODO: POST to the deployment resource.
        },
        toJSONString: function() {
            return JSON.stringify(testRunModelJSON);
        }
    }
}