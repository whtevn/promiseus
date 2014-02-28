var Q = require('q');

module.exports = function(queue,id,packet){
	this.sqs = queue.sqs;
	this.queueUrl = queue.queueUrl;
	this.id = id;
	this.type = packet.type;
	this.action = packet.action;
	this.data = packet.data;
}

module.exports.prototype.delete = function(){
	return Q.ninvoke(this.sqs, 'deleteMessage', { QueueUrl: this.queueUrl, ReceiptHandle: this.id }).then(function(response){
		return response;
	});
}

module.exports.prototype.requeue = function(){
	return Q.ninvoke(this.sqs, 'changeMessageVisibility', { QueueUrl: this.queueUrl, ReceiptHandle: this.id, VisibilityTimeout: 0 }).then(function(response){
		return response;
	});
}