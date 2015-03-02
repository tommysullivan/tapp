module.exports = function(testRunsModel, tappAPI, testRunRoutes, listView, itemView, itemCreatedView, itemPatchedView) {
    return {
        create: function(request, response) {
            var testRunModel = tappAPI.newTestRunModel(request.body);
            testRunModel.save();
            var url = testRunRoutes.testRunURL(testRunModel.id());
            testRunModel.executeTestRun(testRunRoutes.testRunURL(testRunModel.id()), itemCreatedView.render.bind(itemCreatedView, url));
        },
        get: function(request, response, id) {
            var testRun = testRunsModel.getById(id);
            itemView.render(testRun);
        },
        patch: function(request, response, id) {
            var testRunModel = testRunsModel.getById(id);
            testRunModel.applyPatch(
                request.body,
                testRunRoutes.testRunURL(testRunModel.id()),
                itemPatchedView.render.bind(itemView)
            );
            testRunModel.save();
        },
        list: function(request, response) {
            listView.render(testRunsModel);
        }
    }
}