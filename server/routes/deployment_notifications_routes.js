module.exports = function(expressApp, router, tappAPI, baseURL, deploymentNotificationsPath, deploymentNotificationPath, mountPoint) {
    return {
        setupRouter: function() {
            router.post(deploymentNotificationsPath, function(req, res) {
                tappAPI.newDeploymentNotificationsController().create(req, res);
            });
            router.get(deploymentNotificationPath, function(req, res) {
                tappAPI.newDeploymentNotificationsController().get(req, res, req.param('id'));
            });
            router.get(deploymentNotificationsPath, function(req, res) {
                tappAPI.newDeploymentNotificationsController().list(req, res);
            });
            expressApp.use(mountPoint, router);
        },
        deploymentURL: function(deploymentId) {
            return baseURL + deploymentNotificationPath.replace(':id',  deploymentId);
        }
    }
}