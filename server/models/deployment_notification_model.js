module.exports = function DeploymentNotificationModel(deploymentNotificationModelJSON, restClient) {
    return {
        id: function() {
            return deploymentNotificationModelJSON.id;
        },
        save: function() {
        },
        processNotification: function() {
            //"service" : "passingComponent1",
            //    "environment" : "supportedEnvironment",
        },
        toJSONString: function() {
            return JSON.stringify(deploymentNotificationModelJSON);
        }
    }
}