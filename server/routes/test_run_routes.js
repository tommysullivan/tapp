module.exports = function(expressApp, router, tappAPI, baseURL, testRunsPath, testRunPath, mountPoint) {
    return {
        setupRouter: function() {
            router.post(testRunsPath, function(req, res) {
                tappAPI.newTestRunsController().create(req, res);
            });
            router.get(testRunPath, function(req, res) {
                tappAPI.newTestRunsController().get(req, res, req.param('id'));
            });
            router.patch(testRunPath, function(req, res) {
                tappAPI.newTestRunsController().patch(req, res, req.param('id'));
            });
            router.get(testRunsPath, function(req, res) {
                tappAPI.newTestRunsController().list(req, res);
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