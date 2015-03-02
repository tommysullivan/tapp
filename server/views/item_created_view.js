module.exports = function(response) {
    return {
        render: function(url) {
            response.statusCode = 201;
            response.append('location', url);
            response.end();
        }
    }
}