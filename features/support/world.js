module.exports = function() {
    var Zombie = require('zombie');
    this.World = function(worldDefinitionCompleted) {
        this.browser = new Zombie();
        this.visit = function(url, callback) {
            this.browser.visit(url, callback);
        };
        worldDefinitionCompleted();
    };
}