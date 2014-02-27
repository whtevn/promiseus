var libxmljs = require('libxmljs'),
		q = require('q');
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
module.exports = {
	request: function(request){
		request.body = (request.body||'');
		var types  = {
			'text/json': JSON.stringify,
			'multipart/form': function(data){
				for(key in data){
					data[key] = JSON.stringify(data[key]);
				}
				return querystring.stringify(data);
			}
		};

		if(request.headers && request.headers.ContentType && types[request.headers.ContentType]){
			request.body = types[request.headers.ContentType](request.body);
		}
		return BufferStream(request.body, "utf-8");
	},
	response: function(response){
		var types  = {
			'/json': JSON.parse,
			'/xml': libxmljs.parseXml
		};
		return response.body.read().then(function(readResponse){
			var contentType = (response.headers.contentType||response.headers['content-type']||'text/html');
			responseObj = {
				status: response.status,
				data: readResponse.toString('utf8')
			}
			for(type in types){
				if(contentType.match(type)){
					responseObj.data = types[type](responseObj.data);
				}
			}
			//return Q.fcall(function(){ return responseObj; });
			return responseObj;
		})
	}
}
