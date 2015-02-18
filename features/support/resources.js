module.exports = function Resources() {
    var urlsKeyedByFriendlyName = {
        "test-runs": "http://localhost:3000/test-runs/"
    }
    return {
        urlForFriendlyName: function(friendlyName) {
            if(!urlsKeyedByFriendlyName.hasOwnProperty(friendlyName)) throw new Error("no url with friendly name "+friendlyName);
            return urlsKeyedByFriendlyName[friendlyName];
        }
    }
}