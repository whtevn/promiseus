var fs = require('q-io/fs');

module.exports = function(file){
	this.readCredentialFile = fs.read(file),
	this.listOfRegisteredEnvVars = [];
}

module.exports.prototype.register = function(name, obj){
	this[name] = this.readCredentialFile.then(function(creds){
		creds = JSON.parse(creds);
		var t = new obj(creds[name]);
		t.patch = function(name, func){
			t['_'+name] = t[name];
			t[name] = func;
		}
		return t
	});
	this.listOfRegisteredEnvVars.push(name);
	return this[name];
}

module.exports.prototype.loaded = function(injectors, func){
	// look through all promises
	// do function, inject in order
	//
	// if no injectors are given, get all and load in register order
	// given in this.listOfRegisteredEventVars
}
