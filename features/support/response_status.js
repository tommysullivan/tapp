module.exports = function(code, name) {
    return {
        code: function() { return code; },
        name: function() { return name; }
    }
}