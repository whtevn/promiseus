var env = require('../lib/envGen'),
		queue = require('../lib/queue'),
		ses = require('../lib/ses'),
		bucket = require('../lib/bucket'),
		apiResource = require('../lib/apiResource'),
		pinwheel = new apiResource(),
		clever   = new apiResource();

env = new env('./config.json');

env.register('queue', queue).then(function(q){
	q.register('user', 'teacher');
	return q;
})

env.register('queue', queue);
env.register('ses', ses);
env.register('bucket', bucket);
env.register('pinwheel', pinwheel);
env.register('clever', clever);

env.clever.then(function(clever){
	clever.get('students').then(function(response){
		console.log(response);
	});
});

module.exports = env;
