module.exports = function(paPortalAPI) {
    return {
        start: function() {
            var testRunsRoute = paPortalAPI.newTestRunsRoute();
            testRunsRoute.setupRouter();
        }
    }
}