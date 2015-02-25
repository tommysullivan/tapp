module.exports = function DeploymentNotificationModel(deploymentNotificationModelJSON, request, testRunsURL) {
    return {
        id: function() {
            return deploymentNotificationModelJSON.id;
        },
        save: function() {
        },
        service: function() {
            return deploymentNotificationModelJSON.service;
        },
        environment: function() {
            return deploymentNotificationModelJSON.environment;
        },
        processNotification: function(processingCompleteCallback) {
            var requestOptions = {
                method: 'POST',
                json: true,
                body: {
                    "components": [this.service()],
                    "environment": this.environment()
                }
            }
            request(testRunsURL, requestOptions, onRequestComplete.bind(this));
            function onRequestComplete(error, response, body) {
                deploymentNotificationModelJSON.testRunHref = response.headers.location;
                processingCompleteCallback();
            }
        },
        toJSONString: function() {
            return JSON.stringify(deploymentNotificationModelJSON);
        }
    }
}