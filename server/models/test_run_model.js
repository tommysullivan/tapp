module.exports = function(
    testRunModelJSON,
    idUponSave,
    collections,
    supportedComponents,
    exceptionsModel,
    supportedEnvironments,
    request,
    paPortalAPI,
    promotionsURLTemplate
    ) {
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
                    var deploymentNotificationModel = paPortalAPI.newDeploymentNotificationModel(JSON.parse(body));
                    var promotionsURL = promotionsURLTemplate.replace(':deploymentId', deploymentNotificationModel.id());
                    var requestOptions = {
                        method: 'POST',
                        json: true,
                        body: {
                            "name": deploymentNotificationModel.service(),
                            "url" : selfURL,
                            "status" : this.status()
                        }
                    }
                    request(promotionsURL, requestOptions, onPromotionPOSTRequestComplete);
                }
                function onPromotionPOSTRequestComplete(error, response, body) {
                    if(error) {
                        console.log("PROMOTION POST FAILED");
                        throw new Error("An error occurred promotion");
                    }
                    else {
                        testRunModelJSON.promotionHref = response.headers.location;
                        completionCallback();
                    }
                }
            } else completionCallback();
        },
        toJSONString: function() {
            return JSON.stringify(testRunModelJSON);
        }
    }
}