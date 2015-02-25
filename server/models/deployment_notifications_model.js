module.exports = function DeploymentNotificationsModel(deploymentNotificationModelsArray, paPortalAPI, exceptionsModel) {
    function getById(id) {
        return deploymentNotificationModelsArray.filter(function(dN) { return dN.id()==id; })[0];
    }
    return {
        addNewDeploymentNotificationViaJSON: function(deploymentNotificationModelJSON) {
            var deploymentVerificationModel = paPortalAPI.newDeploymentNotificationModel(deploymentNotificationModelJSON);
            if(this.hasNotificationWithId(deploymentVerificationModel.id())) throw exceptionsModel.new
            deploymentNotificationModelsArray.push(deploymentVerificationModel);
            return deploymentVerificationModel;
        },
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