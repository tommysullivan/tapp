module.exports = function(testRunModelJSON, idUponSave, collections, supportedComponents, paPortalAPI) {
    return {
        id: function() {
            return testRunModelJSON.id;
        },
        save: function() {
            if(!testRunModelJSON.hasOwnProperty('id')) {
                testRunModelJSON.id = idUponSave;
            }
        },
        components: function() {
            return collections.Collection(testRunModelJSON.components);
        },
        executeTestRun: function() {
            if(this.components().any(isUnsupported)) throw paPortalAPI.newUnsupportedComponentError();
            function isUnsupported(componentName) { return !supportedComponents.contains(componentName); }
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