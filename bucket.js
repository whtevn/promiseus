var S3 = require('aws-sdk').S3,
		Q = require('q'),
		UUID = require('node-uuid');

module.exports = function(info){
	this.bucketUrl = info.name;
	this.s3     = new S3(info.creds);
};

module.exports.prototype.get = function(key){
	var ret;
	return Q.ninvoke(this.s3, 'getObject', {
		Bucket: this.bucketUrl,
		Key: key
	}).then(function(data){
		return JSON.parse(data.Body.toString('utf-8')); 
	});
}

module.exports.prototype.save = function(value){
	if (arguments[1]) {
		key = arguments[1];
	} else {
		key = UUID.v1();
	}
	return Q.ninvoke(this.s3, 'putObject', {
		Bucket: this.bucketUrl,
		Key: key,
		Body: new Buffer(JSON.stringify(value), "utf-8")
	}).then(function(response){
		var ret = response;
		ret.key = key;
		return ret;
	});
}
