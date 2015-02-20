module.exports = function(testRunModelJSON, idUponSave, numSecondsToPretendThatTestingIsOccurring) {
    return {
        id: function() {
            if(!testRunModelJSON.hasOwnProperty('id')) throw new Error("test run model does not have an id");
            return testRunModelJSON.id;
        },
        save: function() {
            if(!testRunModelJSON.hasOwnProperty('id')) {
                testRunModelJSON.id = idUponSave;
            }
        },
        executeTestRun: function() {
            testRunModelJSON.status = 'in progress';
        },
        applyPatch: function(patchJSON) {
            if(patchJSON.hasOwnProperty('status')) testRunModelJSON.status = patchJSON.status;
            if(patchJSON.hasOwnProperty('testResultHref')) testRunModelJSON.testResultHref = patchJSON.testResultHref;
        },
        toJSONString: function() {
            return JSON.stringify(testRunModelJSON);
        }
    }
}