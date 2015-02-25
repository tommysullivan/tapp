module.exports = function(testRunModelsArray, paPortalAPI) {
    return {
        addNewTestRunViaJSON: function(testRunJSONHash) {
            var testRunModel = paPortalAPI.newTestRunModel(testRunJSONHash);
            testRunModelsArray.push(testRunModel);
            return testRunModel;
        },
        getById: function(id) {
            var matchingTestRun = testRunModelsArray.filter(function(tR) { return tR.id()==id; })[0];
            if(matchingTestRun==null) throw new Error("could not find test run with id "+id);
            return matchingTestRun;
        }
    }
}