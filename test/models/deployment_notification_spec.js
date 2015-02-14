var expect = require('chai').expect;
var DeploymentNotification = require('../../models/deployment_notification');

describe('DeploymentNotification', function() {
    var subject, jsonHash;
    beforeEach(function() {
        jsonHash = {
            "deploymentHref": "http://cicd/deployments/12345"
        }
        subject = DeploymentNotification(jsonHash);
    });
    describe('#constructor(jsonHash)', function() {
        it('returns an instance of DeploymentNotification', function() {
            expect(subject).not.to.be.null;
        });
    });
    describe('#toJSONString()', function() {
        it('gives me the jsonHash i expect', function() {
            expect(subject.toJSONString()).to.equal(JSON.stringify(jsonHash));
        });
    });
});