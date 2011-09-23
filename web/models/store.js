var Mongo = require('mongodb'),
  Db = Mongo.Db,
  Server = Mongo.Server,
  Binary = Mongo.BSONPure.Binary,
  ObjectID = Mongo.BSONPure.ObjectID,
  config = require('../config');
  
var db = new Db(config.mongo.database, new Server(config.mongo.host, config.mongo.port, {}));
exports.open = function(callback) {
  db.open(function(err, db) {
    callback(err, db);
  });
};

var Store = function Store(collectionName, create) {
  this.collectionName = collectionName;
  this.create = create;
};

Store.prototype.find = function(criteria, fields, callback) {
  var self = this;
  db.collection(this.collectionName, function(err, collection) {
    collection.find(criteria, fields, function(err, cursor) {
      cursor.toArray(callback);
    });
  });
};

Store.prototype.findOne = function(criteria, options, callback) {
  if (!callback) { callback = options; options = {};}
  var self = this;
  db.collection(this.collectionName, function(err, collection) {
    collection.findOne(criteria, options, function(err, result) {
      callback(null, result == null ? null : self.createInstance(result));
    });
  });
};

Store.prototype.findAndModify = function(criteria, sort, objNew, options, callback) {
  db.collection(this.collectionName, function(err, collection) {
    collection.findAndModify(criteria, sort, objNew, options, callback);
  });
};

Store.prototype.update = function(criteria, objNew, options, callback) {
  db.collection(this.collectionName, function(err, collection) {
    collection.update(criteria, objNew, options, callback);
  });
};

Store.prototype.save = function(document, options, callback) {
  db.collection(this.collectionName, function(err, collection) {
    collection.insert(document, options, callback);
  });
}

Store.prototype.idFromString = function(str) {
  return ObjectID.createFromHexString(str);
};

Store.prototype.createInstance = function(result) {
  var o = this.create(); 
  for (var field in result) {
    var f = field == '_id' ? 'id' : field;
    o[f] = result[field];
  }
  return o;
}

module.exports.Store = Store;
module.exports.Binary = Binary;