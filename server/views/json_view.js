module.exports = function(response, contentType) {
    return {
        render: function(model) {
            response.append('Content-Type', contentType);
            response.statusCode = 200;
            response.end(model.toJSONString());
        }
    }
}