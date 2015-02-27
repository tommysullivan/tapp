module.exports = function(tappAPI) {
    return {
        start: function() {
            var routes = [
                tappAPI.newTestRunRoutes(),
                tappAPI.newDeploymentNotificationsRoutes(),
                tappAPI.newExternalRoutes(),
                tappAPI.newHeathCheckRoute()
            ]
            routes.forEach(function(route) { route.setupRouter(); });
        }
    }
}