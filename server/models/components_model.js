module.exports = function(componentsConfigurationArray, tappAPI, exceptionsModel) {
    return {
        componentModelNamed: function(componentName) {
            var componentConfig = componentsConfigurationArray.filter(componentNamesMatch)[0];
            function componentNamesMatch(componentConfig) { return componentConfig.name==componentName; }
            if(componentConfig==null) throw exceptionsModel.newUnsupportedComponentException();
            return tappAPI.newComponentModel(componentConfig);
        }
    }
}