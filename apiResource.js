var https = require('q-io/http'),
    querystring = require('querystring'),
    BufferStream = require("q-io/buffer-stream"),
    processByMimeType = require("./lib/mimeProcessor")

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
	this.opts = options;
}


resource.prototype.makeRequest = function(verb,path,data) {
	this.opts.path = this.apiPath+path;
	this.opts.method=verb;
	if(data.query){
		for(key in data.query){
			data.query[key] = JSON.stringify(data.query[key]);
		}
		this.opts.path = this.opts.path+"?"+querystring.stringify(data.query);
	}
	if(data.body){
		this.opts.body = BufferStream(JSON.stringify(data.body), "utf-8");
	}
	var responseObj = {};
	return https.request(this.opts)
		.then(processByMimeType)
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
