module.exports = function(componentJSON, tappAPI) {
    return {
        executeTestsAgainstEnvironment: function(testRunURL, environmentName, callback) {
            var testJob = tappAPI.newTestJob(componentJSON.test);
            testJob.executeTestsAgainstEnvironment(testRunURL, environmentName, callback);
        }
    }
}