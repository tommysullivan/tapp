module.exports = function DeploymentNotificationModel(
    deploymentNotificationModelJSON,
    request,
    testRunsURL,
    promotionsURLTemplate,
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
                    "components": [this.service()],
                    "environment": this.environment(),
                    "triggeredBy": selfURL
                }
            }
            request(testRunsURL, requestOptions, onRequestComplete.bind(this));
            function onRequestComplete(error, response, body) {
                deploymentNotificationModelJSON.testRunHref = response.headers.location;
                processingCompleteCallback();
            }
        },
        promote: function(testRunModel, testRunURL, completionCallback) {
            var promotionsURL = promotionsURLTemplate.replace(':deploymentId', this.id());
            var requestOptions = {
                method: 'POST',
                json: true,
                body: {
                    "name": this.service(),
                    "url" : testRunURL,
                    "status" : testRunModel.status()
                }
            }
            request(promotionsURL, requestOptions, onPromotionPOSTRequestComplete);
            function onPromotionPOSTRequestComplete(error, response, body) {
                if(error) {
                    console.log("PROMOTION POST FAILED");
                    throw new Error("An error occurred promotion");
                }
                else {
                    testRunModel.promotionHref(response.headers.location);
                    completionCallback();
                }
            }
        },
        toJSONString: function() {
            return JSON.stringify(deploymentNotificationModelJSON);
        }
    }
}