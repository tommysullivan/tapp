module.exports = function(testRunsModel, tappAPI, exceptionView, contentType, testRunRoutes, listContentType) {
    return {
        create: function(request, response) {
            try {
                var testRunModel = tappAPI.newTestRunModel(request.body);
                testRunModel.save();
                testRunModel.executeTestRun(onComplete);
                function onComplete() {
                    response.statusCode = 201;
                    response.append('location', testRunRoutes.testRunURL(testRunModel.id()));
                    response.end();
                }
            }
            catch(exception) {
                exceptionView.render(exception, response);
            }
        },
        get: function(request, response, id) {
            var testRun = testRunsModel.getById(id);
            response.append('Content-Type', contentType);
            response.statusCode = 200;
            response.end(testRun.toJSONString());
        },
        patch: function(request, response, id) {
            var testRunModel = testRunsModel.getById(id);
            testRunModel.applyPatch(request.body, testRunRoutes.testRunURL(testRunModel.id()), completionCallback);
            function completionCallback() {
                testRunModel.save();
                response.statusCode = 204;
                response.end();
            }
        },
        list: function(request, response) {
            response.append('Content-Type', listContentType);
            response.statusCode = 200;
            response.end(testRunsModel.toJSONString());
        }
    }
}