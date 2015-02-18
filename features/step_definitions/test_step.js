var Resources = require('../support/resources');
var RESTClient = require('../support/rest_client');
var expect = require('chai').expect;

module.exports = function() {
    var resources = new Resources();
    var restClient = new RESTClient();

    this.When(/^I request supported content types for the "([^"]*)" resource$/, function (resourceFriendlyName, callback) {
        var resourceURL = resources.urlForFriendlyName(resourceFriendlyName);
        this.supportedMediaTypes = restClient.options(resourceURL).headers.Accept;
        callback();
    });

    this.Then(/^the supported content types include:$/, function (expectedMediaTypesString, callback) {
        var expectedMediaTypes = expectedMediaTypesString.split("\n");
        expectedMediaTypes.forEach(function(expectedMediaType) {
            expect(this.supportedMediaTypes).to.contain(expectedMediaType);
        }, this);
        expect(this.supportedMediaTypes.length).to.be.at.least(1);
        callback();
    });

    this.When(/^I request supported methods for the "([^"]*)" resource$/, function (resourceFriendlyName, callback) {
        var resourceURL = resources.urlForFriendlyName(resourceFriendlyName);
        this.supportedMethods = restClient.options(resourceURL).headers.Allow;
        callback();
    });

    this.Then(/^the supported methods include:$/, function (expectedMethodsString, callback) {
        var expectedMethods = expectedMethodsString.split("\n");
        expectedMethods.forEach(function(expectedMethod) {
            expect(this.supportedMethods).to.contain(expectedMethod);
        }, this);
        expect(this.supportedMethods.length).to.be.at.least(1);
        callback();
    });

}