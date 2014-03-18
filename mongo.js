var Q = require('q'),
	mongodb = require('mongo-q')(),
	BSON = mongodb.BSONPure;

module.exports = function(info) {
	this.MongoClient = mongodb.MongoClient;
	this.host = info.host;
	this.database = info.database;
	this.creds = info.creds;
	this.connectString = "mongodb://"+this.creds.Username+":"+this.creds.Password+"@"+this.host+"/"+this.database;
}

module.exports.prototype.find = function(collection, obj){
	return collection.findQ(obj)
		.then(function (cursor) {
			return cursor.toArrayQ()
		})
		.then(function (result) {
			return result;
		})
}

module.exports.prototype.create = function(collection, obj){
	return collection.insertQ(obj);
}

module.exports.prototype.remove = function(collection, obj){
	return collection.removeQ(obj);
}
module.exports.prototype.update = function(collection, filterObj, obj){
	return collection.updateQ(filterObj, obj);
}

module.exports.prototype.set = function(collection, filterObj, obj){
	return collection.updateQ(filterObj, {$set: obj});
}

module.exports.prototype.run = function (method, tableName, obj, obj1){
	var mongo = this;
	if(typeof obj == "string"){
		obj = {_id: obj};
	}
	((obj&&obj._id&&typeof obj._id=='string')&&(obj._id= new BSON.ObjectID(obj._id)));
	((obj1&&obj1._id&&typeof obj1._id=='string')&&(obj1._id= new BSON.ObjectID(obj1._id)));
	return this.MongoClient.connectQ(this.connectString)
		.then(function(db){
		return db.collectionQ(tableName)
			.then(function(collection){
				return mongo[method](collection, obj, obj1);
			})
			.then(function(ret){
				db.close();
				return ret
			});
	});
}

module.exports.prototype.collection = function(){
	var name, mongo=this;
	function doRegister(name){
		mongo[name] = {
			get: function(id){
				return mongo.run('find', name, id)
				.then(function(res){
				return res[0];
				});
			},
			create: function(obj){
				return mongo.run('create', name, obj);
			},
			find: function(search){
				return mongo.run('find', name, search);
			},
			update: function(filter, set){
				var tmongo = this;
				return mongo.run('update', name, filter, set)
			},
			set: function(filter, set){
				var tmongo = this;
				return mongo.run('set', name, filter, set)
			},
			remove: function(obj){
				return mongo.run('remove', name, obj);
			}
		}
	}
	for(var i=0; i<arguments.length; i++){
		doRegister(arguments[i]);
	}
}
module.exports.prototype.collections = module.exports.prototype.collection;
