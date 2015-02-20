var fs = require('fs');
var expect = require('chai').expect;
var request = require('request');

var Resources = require('./resources');
var ResponseStatuses = require('./response_statuses');
var ResponseStatus = require('./response_status');

module.exports = function() {
    this.World = function(callback) {
        var testConfiguration = JSON.parse(fs.readFileSync(__dirname + '/test_configuration.json'));
        var responseStatusesArray = testConfiguration.responseStatuses.map(function(numberNamePair) {
            return new ResponseStatus(numberNamePair[0], numberNamePair[1]);
        })
        this.resources = new Resources(testConfiguration.urlsKeyedByFriendlyName);
        this.responseStatuses = ResponseStatuses(responseStatusesArray);
        this.expect = expect;
        this.request = request;
        callback();
    }
}