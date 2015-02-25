module.exports = function() {

    this.When(/^I POST the following JSON to the "([^"]*)" resource:$/, function (resourceName, jsonString, callback) {
        var url = this.resources.urlForFriendlyName(resourceName);
        if(jsonString.indexOf("{{preExistingId}}")!=-1) {
            this.preExistingId = Math.random()*1000000|0;
            jsonString = jsonString.replace("{{preExistingId}}", this.preExistingId);
        }

        var jsonHashToPost = JSON.parse(jsonString);
        var requestOptions = {
            method: 'POST',
            json: true,
            body: jsonHashToPost
        }
        this.request(url, requestOptions, onRequestComplete.bind(this));
        function onRequestComplete(error, response, body) {
            if(error) callback.fail();
            this.recentResponse = response;
            this.recentResponseBody = body;
            callback();
        }
    });

    this.Then(/^I receive a(n)? "([^"]*)" response$/, function (aOrAn, responseStatusName, callback) {
        var responseStatus = this.responseStatuses.named(responseStatusName);
        this.expect(this.recentResponse.statusCode).to.equal(responseStatus.code());
        callback();
    });

    this.Then(/^a URL is returned in the location header$/, function (callback) {
        var locationHeader = this.recentResponse.headers.location;
        this.expect(locationHeader).not.to.be.null;
        this.expect(locationHeader).to.be.a.string;
        callback();
    });

    this.Given(/^I remember the URL for later use$/, function (callback) {
        this.rememberedURL = this.recentResponse.headers.location;
        callback();
    });


    this.When(/^I call the remembered URL$/, function (callback) {
        this.request(this.rememberedURL, onRequestComplete.bind(this));
        function onRequestComplete(error, response, body) {
            if(error) callback.fail(error);
            this.recentResponse = response;
            this.recentResponseBody = body;
            callback();
        }
    });

    this.Given(/^the Content\-Type of the representation is "([^"]*)"$/, function (expectedContentType, callback) {
        this.expect(this.recentResponse.headers["content-type"]).to.equal(expectedContentType);
        callback();
    });

    this.Then(/^the response contains the following JSON:$/, function (expectedJSONString, callback) {
        var responseJSONHash = JSON.parse(this.recentResponseBody);
        this.expect(responseJSONHash.id).not.to.be.null;
        expectedJSONString = expectedJSONString.replace("{{generatedId}}", responseJSONHash.id);
        expectedJSONString = expectedJSONString.replace("{{preExistingId}}", this.preExistingId);
        var jsonHash = JSON.parse(expectedJSONString);
        try {
            this.expect(jsonHash).to.deep.equal(responseJSONHash);
        }
        catch(e) {
            var message = "expected deep equality.\n  expected: "+expectedJSONString+"\n  actual: "+this.recentResponseBody;
            throw new Error(message);
        }
        callback();
    });

    this.Given(/^a Jenkins or other job would be triggered and upon completion would PATCH the remembered URL with the following JSON:$/, function (jsonString, callback) {
        var url = this.rememberedURL;
        var jsonHashToPatch = JSON.parse(jsonString);
        var requestOptions = {
            method: 'PATCH',
            json: true,
            body: jsonHashToPatch
        }
        this.request(url, requestOptions, onRequestComplete.bind(this));
        function onRequestComplete(error, response, body) {
            if(error) callback.fail();
            callback();
        }
    });

    this.Given(/^I remember the URL in the location header for later use$/, function (callback) {
        this.rememberedURL = this.recentResponse.headers.location;
        callback();
    });

    this.Then(/^the body contains the message "([^"]*)"$/, function (expectedMessage, callback) {
        this.expect(this.recentResponseBody).to.equal(expectedMessage);
        callback();
    });

    this.Given(/^that the pa_portal_configuration.json does not list unsupported1 or unsupported2 as a supported component$/, function(callback) {
        callback();
    });

    this.Given(/^that the pa_portal_configuration\.json does not list unsupportedEnvironment as a supported environment$/, function (callback) {
        callback();
    });

}