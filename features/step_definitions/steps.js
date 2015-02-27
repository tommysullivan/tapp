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

    this.When(/^I call the remembered "([^"]*)"$/, function (rememberedItemName, callback) {
        this.request(this.rememberedItems[rememberedItemName], onRequestComplete.bind(this));
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
        if(this.rememberedItems==null) this.rememberedItems={}
        var validNumberPlaceholder = 8273468273;
        var validURLPlaceholder = "http://validURLHere";
        var responseJSONHash = JSON.parse(this.recentResponseBody);

        expectedJSONString = expectedJSONString.replace("{{valid number}}", validNumberPlaceholder.toString());
        expectedJSONString = expectedJSONString.replace("{{valid url}}", validURLPlaceholder);
        expectedJSONString = expectedJSONString.replace("{{preExistingId}}", this.preExistingId);

        var tokens = expectedJSONString.match(/{{.*}}/);
        if(tokens!=null) {
            tokens.forEach(replaceTokenValue.bind(this));
            function replaceTokenValue(token) {
                var rememberedItemName = token.substr(2, token.length-4);
                if(this.rememberedItems.hasOwnProperty(rememberedItemName)) {
                    expectedJSONString = expectedJSONString.replace(token, this.rememberedItems[rememberedItemName]);
                }
            }
        }

        var expectedJSONHash = JSON.parse(expectedJSONString);

        for(var propertyName in expectedJSONHash) {
            var expectedValue = expectedJSONHash[propertyName];
            var actualValue = responseJSONHash[propertyName];
            if(expectedValue==validNumberPlaceholder) {
                this.expect(actualValue).to.be.numeric;
                expectedJSONHash[propertyName] = actualValue;
            }
            else if(expectedValue==validURLPlaceholder) {
                this.expect(actualValue).to.be.a.string;
                expectedJSONHash[propertyName] = actualValue;
            }
        }

        try {
            this.expect(expectedJSONHash).to.deep.equal(responseJSONHash);
        }
        catch(e) {
            var message = "expected deep equality.\n  expected: "+expectedJSONString+"\n  actual: "+this.recentResponseBody;
            throw new Error(message);
        }
        callback();
    });

    this.Given(/^a Jenkins job would do the following PATCH after we complete AUTO\-(\d+)$/, function (arg1, callback) {
        callback();
    });

    this.When(/^I PATCH the remembered "([^"]*)" with the following JSON:$/, function (rememberedItemName, jsonString, callback) {
        var url = this.rememberedItems[rememberedItemName];
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

    this.Given(/^I remember the location header as "([^"]*)" for later use$/, function (rememberedItemName, callback) {
        if(this.rememberedItems==null) this.rememberedItems = {}
        this.rememberedItems[rememberedItemName] = this.recentResponse.headers.location;
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

    this.Given(/^I remember the "([^"]*)" property of the response as "([^"]*)" for later use$/, function (propertyName, rememberedItemName, callback) {
        if(this.rememberedItems==null) this.rememberedItems = {}
        var responseJSON = JSON.parse(this.recentResponseBody);
        this.rememberedItems[rememberedItemName] = responseJSON[propertyName];
        callback();
    });

}