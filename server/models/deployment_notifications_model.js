module.exports = function DeploymentNotificationsModel(deploymentNotificationModelsArray) {
    function getById(id) {
        return deploymentNotificationModelsArray.filter(function(dN) { return dN.id()==id; })[0];
    }
    return {
        hasNotificationWithId: function(id) {
            return getById(id)!=null;
        },
        getById: function(id) {
            var matchingDeploymentNotification = getById(id);
            if(matchingDeploymentNotification==null) throw new Error("could not find deployment notification with id "+id);
            return matchingDeploymentNotification;
        }
    }
}