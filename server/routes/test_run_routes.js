module.exports = function(expressApp, router, tappAPI, baseURL, testRunsPath, testRunPath, mountPoint) {
    return {
        setupRouter: function() {
            router.post(testRunsPath, function(req, response) {
                try {
                    tappAPI.newTestRunsController(response).create(req, response);
                }
                catch(exception) {
                    tappAPI.newExceptionView().render(exception, response);
                }
            });
            router.get(testRunPath, function(req, response) {
                tappAPI.newTestRunsController(response).get(req, response, req.param('id'));
            });
            router.patch(testRunPath, function(req, response) {
                tappAPI.newTestRunsController(response).patch(req, response, req.param('id'));
            });
            router.get(testRunsPath, function(req, response) {
                tappAPI.newTestRunsController(response).list(req, response);
            });
            expressApp.use(mountPoint, router);
        },
        testRunURL: function(id) {
            return baseURL + testRunPath.replace(':id', id);
        },
        testRunsURL: function() {
            return baseURL + testRunsPath
        }
    }
}