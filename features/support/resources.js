module.exports = function Resources(urlsKeyedByFriendlyName) {
    return {
        urlForFriendlyName: function(friendlyName) {
            if(!urlsKeyedByFriendlyName.hasOwnProperty(friendlyName)) throw new Error("no url with friendly name "+friendlyName);
            return urlsKeyedByFriendlyName[friendlyName];
        }
    }
}