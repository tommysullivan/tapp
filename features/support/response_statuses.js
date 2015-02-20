module.exports = function(responseStatusesArray) {
    return {
        all: function() { return responseStatusesArray; },
        named: function(statusName) {
            var responseStatus = responseStatusesArray.filter(function(rS) { return rS.name()==statusName;})[0];
            if(responseStatus==null) throw new Error("Could not find response status named "+statusName);
            return responseStatus;
        }
    }
}