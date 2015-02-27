module.exports = function(expressApp, router) {
    return {
        setupRouter: function() {
            router.get('/health', function(request, response) {
                response.statusCode = 200;
                response.end();
            });
            expressApp.use('/', router);
        }
    }
}