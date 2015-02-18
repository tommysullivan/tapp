module.exports = function Resources() {
    var urlsKeyedByFriendlyName = {
        "deployment-notifications": "http://localhost:3000/deployment-notifications"
    }
    return {
        urlForFriendlyName: function(friendlyName) {
            if(!urlsKeyedByFriendlyName.hasOwnProperty(friendlyName)) throw new Error("no url with friendly name "+friendlyName);
            return urlsKeyedByFriendlyName[friendlyName];
        }
    }
}