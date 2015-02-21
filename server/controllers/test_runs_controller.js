module.exports = function(testRunsModel, paPortalAPI, exceptionView) {
    return {
        create: function(request, response) {
            try {
                var testRunModel = testRunsModel.addNewTestRunViaJSON(request.body);
                testRunModel.save();
                testRunModel.executeTestRun();
                response.statusCode = 201;
                response.append('location', 'http://' + request.headers.host + '/test-runs/' + testRunModel.id());
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
            var testRun = testRunsModel.getById(id);
            testRun.applyPatch(request.body);
            testRun.save();
            response.statusCode = 204;
            response.end();
        }
    }
}