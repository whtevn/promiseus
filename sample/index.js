var env = require('../lib/envGen'),
		queue = require('../lib/queue');
		ses = require('../lib/ses');
		bucket = require('../lib/bucket');
		apiResource = require('../lib/apiResource');

env = new env('./sample.js');

env.register('queue', queue).then(function(q){
	q.register('user', 'teacher');
	console.log(q.user);
	return q;
})

env.register('ses', ses);
env.register('celltrust', celltrust);
env.register('mongo', mongoclient);
env.register('apiResource', apiResource);
