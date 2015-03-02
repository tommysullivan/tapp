module.exports = function DeploymentNotificationsModel(deploymentNotificationModelsCollection) {
    function notificationsWithId(id) {
        return deploymentNotificationModelsCollection.filter(function(dN) { return dN.id()==id; });
    }
    return {
        hasNotificationWithId: function(id) {
            return !notificationsWithId(id).isEmpty();
        },
        getById: function(id) {
            return notificationsWithId(id).first();
        },
        toJSONString: function() {
            var childJSONStrings = deploymentNotificationModelsCollection.map(function(testRunModel) { return testRunModel.toJSONString()});
            return JSON.stringify(childJSONStrings.map(function(childJSON) { return JSON.parse(childJSON) }).toArray());
        }
    }
}