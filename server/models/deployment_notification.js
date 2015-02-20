module.exports = function(jsonHash) {
    return {
        toJSONString: function() {
            return JSON.stringify(jsonHash);
        }
    }
}