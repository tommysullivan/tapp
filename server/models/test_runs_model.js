module.exports = function(testRunModelsArray) {
    return {
        getById: function(id) {
            var matchingTestRun = testRunModelsArray.filter(function(tR) { return tR.id()==id; })[0];
            if(matchingTestRun==null) throw new Error("could not find test run with id "+id);
            return matchingTestRun;
        }
    }
}