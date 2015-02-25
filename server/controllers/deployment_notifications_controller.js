module.exports = function DeploymentVerificationsController(deploymentNotificationsModel, exceptionView) {
    return {
        create: function(request, response) {
            try {
                var deploymentVerificationModel = deploymentNotificationsModel.addNewDeploymentNotificationViaJSON(request.body);
                deploymentVerificationModel.save();
                deploymentVerificationModel.processNotification(processingCompleteCallback);
                function processingCompleteCallback() {
                    response.statusCode = 201;
                    response.append('location', 'http://' + request.headers.host + '/deployment-notifications/' + deploymentVerificationModel.id());
                    response.end();
                }
            }
            catch(exception) {
                exceptionView.render(exception, response);
            }
        },
        get: function(request, response, id) {
            var deploymentVerificationModel = deploymentNotificationsModel.getById(id);
            response.append('Content-Type', 'application/vnd.lookout.deploydb.deployment-notification+json;version=1.0.0');
            response.statusCode = 200;
            response.end(deploymentVerificationModel.toJSONString());
        }
    }
}