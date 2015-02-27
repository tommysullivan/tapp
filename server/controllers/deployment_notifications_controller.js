module.exports = function(deploymentNotificationsModel, exceptionView, tappAPI, contentType, deploymentNotificationsRoutes) {
    return {
        create: function(request, response) {
            try {
                var deploymentNotificationModel = tappAPI.newDeploymentNotificationModel(request.body);
                deploymentNotificationModel.save();
                var selfURL = deploymentNotificationsRoutes.deploymentURL(deploymentNotificationModel.id());
                deploymentNotificationModel.processNotification(processingCompleteCallback, selfURL);
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
            response.append('Content-Type', contentType);
            response.statusCode = 200;
            response.end(deploymentVerificationModel.toJSONString());
        }
    }
}