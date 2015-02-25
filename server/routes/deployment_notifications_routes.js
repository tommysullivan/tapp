module.exports = function TestRunsRoute(expressApp, router, deploymentNotificationsController) {
    return {
        setupRouter: function() {
            router.post('/deployment-notifications', function(req, res) {
                deploymentNotificationsController.create(req, res);
            });
            router.get('/deployment-notifications/:id', function(req, res) {
                deploymentNotificationsController.get(req, res, req.param('id'));
            });

            expressApp.use('/', router);
        }
    }
}