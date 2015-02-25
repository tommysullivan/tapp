module.exports = function(paPortalAPI) {
    return {
        start: function() {
            var routes = [
                paPortalAPI.newTestRunsRoute(),
                paPortalAPI.newDeploymentNotificationsRoutes(),
                paPortalAPI.newExternalRoutes()
            ]
            routes.forEach(function(route) { route.setupRouter(); });
        }
    }
}