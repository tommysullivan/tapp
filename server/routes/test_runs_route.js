module.exports = function TestRunsRoute(expressApp, router, testRunsController) {
    return {
        setupRouter: function() {
            router.post('/test-runs', function(req, res) {
                testRunsController.create(req, res);
            });
            router.get('/test-runs/:id', function(req, res) {
                testRunsController.get(req, res, req.param('id'));
            });
            router.patch('/test-runs/:id', function(req, res) {
                testRunsController.patch(req, res, req.param('id'));
            });

            expressApp.use('/', router);
        }
    }
}