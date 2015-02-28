module.exports = function DeploymentNotificationModel(
    deploymentNotificationModelJSON,
    request,
    testRunRoutes,
    externalRoutes,
    deploymentNotificationsModel,
    exceptionsModel,
    deploymentNotificationModelsCollection
    ) {
    return {
        id: function() {
            return deploymentNotificationModelJSON.id;
        },
        save: function() {
            if(!deploymentNotificationModelsCollection.contains(this)) {
                if(deploymentNotificationsModel.hasNotificationWithId(this.id())) throw exceptionsModel.newDuplicateIdException(this.id());
                deploymentNotificationModelsCollection.add(this);
            }
        },
        service: function() {
            return deploymentNotificationModelJSON.service;
        },
        environment: function() {
            return deploymentNotificationModelJSON.environment;
        },
        processNotification: function(processingCompleteCallback, selfURL) {
            var requestOptions = {
                method: 'POST',
                json: true,
                body: {
                    "component": this.service(),
                    "environment": this.environment(),
                    "triggeredBy": selfURL
                }
            }
            request(testRunRoutes.testRunsURL(), requestOptions, onRequestComplete.bind(this));
            function onRequestComplete(error, response, body) {
                deploymentNotificationModelJSON.testRunHref = response.headers.location;
                processingCompleteCallback();
            }
        },
        promote: function(testRunModel, testRunURL, completionCallback) {
            var requestOptions = {
                method: 'POST',
                json: true,
                body: {
                    "name": this.service(),
                    "url" : testRunURL,
                    "status" : testRunModel.status()
                }
            }
            request(externalRoutes.promotionsURL(this.id()), requestOptions, onPromotionPOSTRequestComplete);
            function onPromotionPOSTRequestComplete(error, response, body) {
                testRunModel.promotionHref(response.headers.location);
                completionCallback();
            }
        },
        toJSONString: function() {
            return JSON.stringify(deploymentNotificationModelJSON);
        }
    }
}