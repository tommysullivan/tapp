module.exports = function(expressApp, router, baseURL, promotionsPath, promotionPath, promotionContentType, mountPoint) {
    var promotions = [];
    var nextPromotionId = 0;
    return {
        setupRouter: function() {
            router.post(promotionsPath, onPost.bind(this));
            function onPost(request, response) {
                var deploymentId = request.param('deploymentId');
                nextPromotionId++;
                promotions[nextPromotionId]=request.body;
                response.statusCode = 201;
                response.append('location', this.promotionURL(deploymentId, nextPromotionId));
                response.end();
            }
            router.get(promotionPath, function(request, response) {
                var promotionId = request.param('promotionId');
                response.append('Content-Type', promotionContentType);
                response.statusCode = 200;
                response.end(JSON.stringify(promotions[parseInt(promotionId)]));
            });
            expressApp.use(mountPoint, router);
        },
        promotionURL: function(deploymentId, promotionId) {
            return baseURL + promotionPath.replace(':deploymentId', deploymentId).replace(':promotionId', promotionId);
        },
        promotionsURL: function(deploymentId) {
            return baseURL + promotionsPath.replace(':deploymentId', deploymentId);
        }
    }
}