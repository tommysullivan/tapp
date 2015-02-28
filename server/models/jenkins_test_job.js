module.exports = function(request, jenkinsCSRFCrumbURL, testJSON) {
    return {
        executeTestsAgainstEnvironment: function(environmentName, callback) {
            console.log('jenkinsCSRFCrumbURL='+jenkinsCSRFCrumbURL);
            var requestOptions = {
                method: 'GET',
                strictSSL: false
            }
            request(jenkinsCSRFCrumbURL, requestOptions, onCrumbDelivered.bind(this));
            function onCrumbDelivered(error, response, body) {
                var jsonResponse = JSON.parse(body);
                var crumb = jsonResponse['crumb'];
                var requestOptions = {
                    method: 'POST',
                    strictSSL: false
                }
                var url = testJSON['jenkinsJobURL'].replace('{{crumb}}', crumb).replace('{{cause}}', "pa+portal").replace('{{environment}}', environmentName);
                request(url, requestOptions, onRequestComplete.bind(this));
                function onRequestComplete(error, response, body) {
                    callback();
                }
            }
        }
    }
}