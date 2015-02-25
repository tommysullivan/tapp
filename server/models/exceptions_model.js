module.exports = function(exceptionConfigCollection) {
    return {
        newException: function(configuredExceptionName) {
            var configuredException = exceptionConfigCollection.filter(whereNameMatches).first();
            function whereNameMatches(exceptionConfig) {
                return exceptionConfig.name==configuredExceptionName
            }

            var error = new Error(configuredException.message);
            error.isPAError = true;
            error.contentType = configuredException.contentType;
            error.httpStatusIfUncaught = configuredException.httpStatusIfUncaught;
            return error;
        },
        newDuplicateIdException: function(id) {
            return this.newException('DuplicateIdException');
        },
        newUnsupportedComponentException: function() {
            return this.newException('UnsupportedComponentException');
        },
        newUnsupportedEnvironmentException: function() {
            return this.newException('UnsupportedEnvironmentException');
        }
    }
}