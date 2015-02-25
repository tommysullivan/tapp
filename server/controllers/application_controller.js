module.exports = function(paPortalAPI) {
    return {
        start: function() {
            var routes = [
                paPortalAPI.newTestRunsRoute(),
                paPortalAPI.newDeploymentNotificationsRoutes()
            ]
            routes.forEach(function(route) { route.setupRouter(); });
        }
    }
}