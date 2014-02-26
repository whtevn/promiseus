var https = require('q-io/http');
var querystring = require('querystring');
var BufferStream = require("q-io/buffer-stream");
var libxmljs = require('libxmljs');

/**
 * module: ApiResource
 * exports: boilerplate for dealing with resources
 * usage: 
 *
 *	var resource = require('./apiResource');
 *	new resource({
 *		host: 'api.clever.com',
 *		apiPath: '/v1.1/',
 *		ssl: true,
 *		auth: "Username:Pass",
 *		(xmlOrJson: 'JSON')
 *	});
 *
 *	var obj = resource.get('object') //=> returns promise for
 *	                                 //   GET https://api.clever.com/v1.1/object
 *	obj.then(function(data){
 *		console.log(data) //=> object literal of JSON response
 *	}).fail(function(err){
 *		// information about failure
 *	}); 
 *
 */

function resource(options){
	var key;
	if(options.auth){
		if(typeof options.auth == "string"){
			key = options.auth;
			if(!key.match(":")){
				key = key+":";
			}
		}else{
			key = options.auth.key+':'+(options.auth.pwd||'');
		}
		options.headers = options.headers||{};
		options.headers['Authorization'] = 'Basic ' + new Buffer(key).toString('base64')
		delete options.auth;
	}
	if(options.apiPath){
		this.apiPath = options.apiPath; 
		delete options.apiPath;
	}else{
		this.apiPath = '/';
	}
	if(options.xmlOrJson){
		this.xmlOrJson = options.xmlOrJson;
		delete options.xmlOrJson;
	}
	this.opts = options;
	if (!options.port)
		this.opts.port = 80;
}


resource.prototype.makeRequest = function(verb,path,data) {
	this.opts.path = this.apiPath+path;
	this.opts.method=verb;
	if(verb=="get"){
		for(key in data){
			data[key] = JSON.stringify(data[key]);
		}
		this.opts.path = this.opts.path+"?"+querystring.stringify(query);
	}
	this.opts.body = BufferStream(JSON.stringify(data), "utf-8");
	if (this.xmlOrJson) {var xmlOrJson = this.xmlOrJson; }
	var responseObj = {};
	return https.request(this.opts).then(function(response){
		responseObj.status = response.status;
		return response.body.read().then(function(readResponse){
			responseObj.data = readResponse.toString('utf8');
			if (xmlOrJson){
				if (xmlOrJson == "JSON") { responseObj.data = JSON.parse(readResponse.toString('utf8')); }
				if (xmlOrJson == "XML") { responseObj.data = libxmljs.parseXml(readResponse.toString('utf-8')); }
			}else{
				responseObj.data = readResponse.toString('utf8');
			}
		});
	}).then(function(){
		return responseObj;
	})
	.fail(function(err){
		console.log(err.stack);
	});
	
}

resource.prototype.post = function(path,data){
	return this.makeRequest("POST",path,data);
}
resource.prototype.get = function(path,data){
	return this.makeRequest("GET",path,data);
}
resource.prototype.put = function(path,data){
	return this.makeRequest("PUT",path,data);
}
resource.prototype.delete = function(path,data){
	return this.makeRequest("DELETE",path,data);
}
module.exports = function(){
	return resource
}
