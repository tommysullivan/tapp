module.exports = function(expressApp, router) {
    var promotions = [];
    var nextPromotionId = 0;
    return {
        setupRouter: function() {
            router.post('/deployments/:deploymentId/promotions', function(request, response) {
                var deploymentId = request.param('deploymentId');
                nextPromotionId++;
                promotions[nextPromotionId]=request.body;
                response.statusCode = 201;
                response.append('location', 'http://' + request.headers.host + '/deployments/' + deploymentId + '/promotions/' + nextPromotionId);
                response.end();
            });
            router.get('/deployments/:deploymentId/promotions/:promotionId', function(request, response) {
                var promotionId = request.param('promotionId');
                response.append('Content-Type', 'application/vnd.lookout.deploydb.promotion+json;version=1.0.0');
                response.statusCode = 200;
                response.end(JSON.stringify(promotions[parseInt(promotionId)]));
            });

            expressApp.use('/', router);
        }
    }
}