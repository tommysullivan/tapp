module.exports = function(deploymentNotificationsModel, tappAPI, deploymentNotificationsRoutes, listView, itemView, itemCreatedView) {
    return {
        create: function(request, response) {
            var deploymentNotificationModel = tappAPI.newDeploymentNotificationModel(request.body);
            deploymentNotificationModel.save();
            var selfURL = deploymentNotificationsRoutes.deploymentURL(deploymentNotificationModel.id());
            deploymentNotificationModel.processNotification(itemCreatedView.render.bind(itemCreatedView, selfURL), selfURL);
        },
        get: function(request, response, id) {
            var deploymentVerificationModel = deploymentNotificationsModel.getById(id);
            itemView.render(deploymentVerificationModel);
        },
        list: function(request, response) {
            listView.render(deploymentNotificationsModel);
        }
    }
}