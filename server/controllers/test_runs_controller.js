module.exports = function(testRunsModel, paPortalAPI) {
    return {
        create: function(req, res) {
            try {
                var testRunModel = testRunsModel.addNewTestRunViaJSON(req.body);
                testRunModel.save();
                testRunModel.executeTestRun();
                res.statusCode = 201;
                res.append('location', 'http://' + req.headers.host + '/test-runs/' + testRunModel.id());

            }
            catch(e) {
                if(e.message = paPortalAPI.newUnsupportedComponentError().message) {
                    res.append('Content-Type', 'text/vnd.lookout.pa.unsupported-component-exception');
                    res.statusCode = 403;
                    res.body = e.message;
                } else {
                    res.statusCode = 500;
                }
            }
            finally {
                res.end();
            }
        },
        get: function(req, res, id) {
            var testRun = testRunsModel.getById(id);
            res.append('Content-Type', 'application/vnd.lookout.pa.test-run+json;version=1.0.0');
            res.statusCode = 200;
            res.end(testRun.toJSONString());
        },
        patch: function(req, res, id) {
            var testRun = testRunsModel.getById(id);
            testRun.applyPatch(req.body);
            testRun.save();
            res.statusCode = 204;
            res.end();
        }
    }
}