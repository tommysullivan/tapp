module.exports = function DeploymentVerificationsController(deploymentNotificationsModel, exceptionView, tappAPI) {
    return {
        create: function(request, response) {
            try {
                var deploymentVerificationModel = tappAPI.newDeploymentNotificationModel(request.body);
                deploymentVerificationModel.save();
                var selfURL = 'http://' + request.headers.host + '/deployment-notifications/' + deploymentVerificationModel.id();
                deploymentVerificationModel.processNotification(processingCompleteCallback, selfURL);
                function processingCompleteCallback() {
                    response.statusCode = 201;
                    response.append('location', selfURL);
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