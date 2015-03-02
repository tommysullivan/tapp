module.exports = function(response) {
    return {
        render: function() {
            response.statusCode = 204;
            response.end();
        }
    }
}