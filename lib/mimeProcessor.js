var libxmljs = require('libxmljs');
modules.exports = function(response){
	var types  = {
		'text/json': JSON.parse,
		'text/xml': libxmljs.parseXml
	},
	return response.body.read().then(function(readResponse){
		responseObj = {
			status: response.status,
			data: readResponse.toString('utf8')
		}
		if(response.headers.contentType && types[response.headers.contentType]){
			responseObj.data = types[response.headers.contentType](responseObj.data);
		}
		return responseObj;
	})
}
