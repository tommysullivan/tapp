module.exports = function RestClient() {
    return {
        get: function(contentType, url) {},
        options: function(url) {
            return {
                headers: {
                    Accept: [
                        "application/json",
                        "application/vnd.lookout.cicd.deployment-notification+json;version=1.0.0",
                        "text/vnd.lookout.cicd.deployment-notification+html;version=1.0.0",
                        "text/html"
                    ],
                    Allow: ["GET","HEAD","POST","OPTIONS"]
                }
            }
        }
    }
}