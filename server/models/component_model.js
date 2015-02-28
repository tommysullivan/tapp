module.exports = function(componentJSON, tappAPI) {
    return {
        executeTestsAgainstEnvironment: function(environmentName, callback) {
            var testJob = tappAPI.newTestJob(componentJSON.test);
            console.log(testJob);
            testJob.executeTestsAgainstEnvironment(environmentName, callback);
        }
    }
}