var SES = require('aws-sdk').SES,
		Q = require('q');
		
module.exports = function(info){
	this.source = info.source;
	this.ses    = new SES(info.creds);
	this.creds	= info.creds;
};

module.exports.prototype.getQuota = function() {
	return Q.ninvoke(this.ses, 'getSendQuota').then(function(result){
		return result;
	});
}


