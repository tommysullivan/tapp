module.exports = function ExceptionView(defaultErrorContentType) {
    return {
        render: function(exception, response) {
            var contentTypeWithoutFormat = exception.isPAError ? exception.contentType : defaultErrorContentType;
            response.append('Content-Type', contentTypeWithoutFormat + '+text; charset=utf-8');
            //response.append('Content-Type', 'text');
            response.statusCode = 403;
            response.end(exception.message);
        }
    }
}