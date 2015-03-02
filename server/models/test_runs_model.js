module.exports = function(testRunModelsArray) {
    return {
        getById: function(id) {
            var matchingTestRun = testRunModelsArray.filter(function(tR) { return tR.id()==id; })[0];
            if(matchingTestRun==null) throw new Error("could not find test run with id "+id);
            return matchingTestRun;
        },
        toJSONString: function() {
            var childJSONStrings = testRunModelsArray.map(function(testRunModel) { return testRunModel.toJSONString()});
            return JSON.stringify(childJSONStrings.map(function(childJSON) { return JSON.parse(childJSON) }));
        }
    }
}