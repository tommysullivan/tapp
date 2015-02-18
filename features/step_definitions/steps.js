var Resources = require('../support/resources');

var expect = require('chai').expect;
var request = require('request');
var resources = new Resources();

module.exports = function() {
    this.Given(/^I am requesting a test that is known to finish after "([^"]*)" seconds$/, function (seconds, callback) {
        this.secondsUntilTestIsExpectedToFinish = seconds;
        callback();
    });

    this.When(/^I POST the following JSON to the "([^"]*)" resource:$/, function (resourceName, jsonString, callback) {
        var url = resources.urlForFriendlyName(resourceName);
        var jsonHashToPost = JSON.parse(jsonString);
        var requestOptions = {
            method: 'POST',
            json: true,
            body: jsonHashToPost
        }
        request(url, requestOptions, onRequestComplete.bind(this));
        function onRequestComplete(error, response, body) {
            if(error) callback.fail();
            this.recentResponse = response;
            callback();
        }
    });

    this.Then(/^I receive a CREATED response code$/, function (callback) {
        expect(this.recentResponse.statusCode).to.equal(302);
        callback.pending();
    });

    this.Given(/^a URL is returned in the location header$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I remember the URL in the location header$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^when I call that URL, I receive a (\d+) containing the following JSON:$/, function (arg1, string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I wait "([^"]*)" extra seconds after the time the test should have passed$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^when I call that URL, I receive a (\d+) containing the following JSON:$/, function (arg1, string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^when I call the URL in the JSON's result property, I get a (\d+) containing the following JSON:$/, function (arg1, string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });


}