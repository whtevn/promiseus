var libxmljs = require('libxmljs');
// TODO: probably going to need a request and response method
// eg:
// 	modules.exports: {
// 		request: function(request){},
// 		response: function(response){}
// 	}
// benefits:
// 	set headers on request independent from response headers
// 	properly encode request data
//
modules.exports = {
	request: function(request){
		var types  = {
			'text/json': JSON.stringify,
			'multipart/form': function(data){
				for(key in data){
					data[key] = JSON.stringify(data[key]);
				}
				return querystring.stringify(data);
			}
		};

		if(request.headers.contentType && types[request.headers.contentType]){
			request.body = types[request.headers.contentType](request.body);
		}
		return BufferStream(request.body, "utf-8");
	},
	response: function(response){
		var types  = {
			'text/json': JSON.parse,
			'text/xml': libxmljs.parseXml
		};
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
}
