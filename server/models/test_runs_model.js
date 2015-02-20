module.exports = function(testRunModelsArray, factory) {
    return {
        addNewTestRunViaJSON: function(testRunJSONHash) {
            var testRunModel = factory.newTestRunModel(testRunJSONHash);
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