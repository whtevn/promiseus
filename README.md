promiseus
=========

promise oriented wrappers for api resources and aws services

sample config file

	{
		"queue": {
			"url": "https://path/to/sqs",
			"creds": {
				"accessKeyId": "YourAccessKeyId",
				"secretAccessKey": "YourSecretAccessKey",
				"region": "aws-region-id"
			}
		},
		"bucket": {
			"name": "mrPostmanPayloads",
			"creds": {
				"accessKeyId": "YourAccessKeyId",
				"secretAccessKey": "YourSecretAccessKey",
				"region": "aws-region-id"
			}
		},
		"ses": {
			"source": "your@email.com",
			"creds": {
				"accessKeyId": "YourAccessKeyId",
				"secretAccessKey": "YourSecretAccessKey",
				"region": "aws-region-id"
			}
		},
		"twitter": {
			"host": "api.twitter.com",
			"path": "/1.1/",
			"ssl":true,
			"auth": "DEMO_KEY",
			"headers": {
				"ContentType": "text/json"
			}
		}
	}

sample application

	var env = require('promiseus/envGen'),
	    api = require('promiseus/apiResource'),
			twitter = new api();

	env.register('twitter', twitter)
	
	env.twitter.then(function (twitter){
			var twitterRequest = {
				screen_name: 'whtevn',
				count: 2
			}
			twitter.get('statuses/user_timeline.json', {query: twitterRequest})
				.then(function(response){
					console.log(response.status);
					console.log(response.data);
				});;
		});
