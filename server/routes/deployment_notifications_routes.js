module.exports = function(expressApp, router, tappAPI, baseURL, deploymentNotificationsPath, deploymentNotificationPath, mountPoint) {
    return {
        setupRouter: function() {
            router.post(deploymentNotificationsPath, function(request, response) {
                try {
                    tappAPI.newDeploymentNotificationsController(response).create(request, response);
                }
                catch(exception) {
                    tappAPI.newExceptionView().render(exception, response);
                }
            });
            router.get(deploymentNotificationPath, function(request, response) {
                tappAPI.newDeploymentNotificationsController(response).get(request, response, request.param('id'));
            });
            router.get(deploymentNotificationsPath, function(request, response) {
                tappAPI.newDeploymentNotificationsController(response).list(request, response);
            });
            expressApp.use(mountPoint, router);
        },
        deploymentURL: function(deploymentId) {
            return baseURL + deploymentNotificationPath.replace(':id',  deploymentId);
        }
    }
}