var SQS = require('aws-sdk').SQS,
		Q = require('q');

module.exports = function(info){
	this.queueUrl = info.url;
	this.sqs = new SQS(info.creds);
};

module.exports.prototype.add = function(type, action, data){
	var packet = {
		type: type,
		action: action,
		data: data
	}
	return Q.ninvoke(this.sqs, 'sendMessage', {
		QueueUrl: this.queueUrl,
		MessageBody: JSON.stringify(packet)
	});
}

module.exports.prototype.read = function(){
	return Q.ninvoke(this.sqs, 'receiveMessage', { QueueUrl: this.queueUrl }).then(function(info){
		var ret = info;
		ret.requestId = info.ResponseMetadata.RequestId;
		if (!ret.Messages) {
			ret.Messages = [];
		}
		return ret
	});;
}

module.exports.prototype.register = function(){
	var name, queue=this;
	function doRegister(name){
		queue[name] = function(action, data){
			return queue.add(name, action, data);
		}
	}
	for(var i=0; i<arguments.length; i++){
		doRegister(arguments[i]);
	}
}
