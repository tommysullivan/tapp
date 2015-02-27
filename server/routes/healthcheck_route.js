module.exports = function(expressApp, router, heathCheckPath, mountPoint) {
    return {
        setupRouter: function() {
            router.get(heathCheckPath, function(request, response) {
                response.statusCode = 200;
                response.end();
            });
            expressApp.use(mountPoint, router);
        }
    }
}