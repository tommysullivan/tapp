module.exports = function(paPortalAPI) {
    return {
        start: function() {
            var routes = [
                paPortalAPI.newTestRunsRoute(),
                paPortalAPI.newDeploymentNotificationsRoutes(),
                paPortalAPI.newExternalRoutes(),
                paPortalAPI.newHeathCheckRoute()
            ]
            routes.forEach(function(route) { route.setupRouter(); });
        }
    }
}