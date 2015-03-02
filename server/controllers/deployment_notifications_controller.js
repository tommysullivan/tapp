module.exports = function(deploymentNotificationsModel, exceptionView, tappAPI, contentType, deploymentNotificationsRoutes, listContentType) {
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
        },
        list: function(request, response) {
            response.append('Content-Type', listContentType);
            response.statusCode = 200;
            response.end(deploymentNotificationsModel.toJSONString());
        }
    }
}