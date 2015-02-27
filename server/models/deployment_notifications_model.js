module.exports = function DeploymentNotificationsModel(deploymentNotificationModelsCollection) {
    function notificationsWithId(id) {
        return deploymentNotificationModelsCollection.filter(function(dN) { return dN.id()==id; });
    }
    return {
        hasNotificationWithId: function(id) {
            return notificationsWithId(id).length()>0;
        },
        getById: function(id) {
            return notificationsWithId(id).first();
        }
    }
}