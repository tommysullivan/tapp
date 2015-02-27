module.exports = function(testRunsModel, tappAPI, exceptionView) {
    function getURL(request, testRunModel) {
        return 'http://' + request.headers.host + '/test-runs/' + testRunModel.id();
    }
    return {
        create: function(request, response) {
            try {
                var testRunModel = testRunsModel.addNewTestRunViaJSON(request.body);
                testRunModel.save();
                testRunModel.executeTestRun();
                response.statusCode = 201;
                response.append('location', getURL(request, testRunModel));
                response.end();
            }
            catch(exception) {
                exceptionView.render(exception, response);
            }
        },
        get: function(request, response, id) {
            var testRun = testRunsModel.getById(id);
            response.append('Content-Type', 'application/vnd.lookout.pa.test-run+json;version=1.0.0');
            response.statusCode = 200;
            response.end(testRun.toJSONString());
        },
        patch: function(request, response, id) {
            var testRunModel = testRunsModel.getById(id);
            testRunModel.applyPatch(request.body, getURL(request, testRunModel), completionCallback);
            function completionCallback() {
                testRunModel.save();
                response.statusCode = 204;
                response.end();
            }
        }
    }
}