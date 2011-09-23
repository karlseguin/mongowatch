var Store = new (require('./store').Store)('statistics', function(){return new Stat();}),
    Binary = require('./store').Binary,
    Msgpack = require('msgpack'),
    config = require('../config');
  
var Stat = function Stat(key, server) {
  this.id = this.latest = null;
  this.key = key;
  this.server = server;
  this.data = [];
};

Stat.newDataPoint = function(user, server, data, callback) {
  var now = new Date();
  data.dated = now.getTime();
  var buffer = new Buffer(Msgpack.pack(data));
  validate(data, buffer, user, server, function(err){
    if (err) { callback(err); return; }
    var binary = new Binary(buffer);
    var key = {key: user.id, server: server};
    Store.findAndModify(key, [['key', 'ascending']], {$set: {latest: now}, $push: {data: binary}}, {upsert: true}, function(err, found) {
      if (found.data != null && found.data.length >= config.history) {
        Store.update(key, {$pop: {data: -1}})
      }
      callback(err);
    });
  });
};

Stat.getOverview = function(user, callback) {
  Store.find({key: user.id}, {_id: 1, server: 1, data: {$slice: -1}}, function(err, results) {
    unpackResults(results, function(r) {
      results.sort(function(a, b) { return a > b ? 1 : a < b ? -1 : 0 });
      callback(err, results);
    });
  });
};

Stat.getStats = function(user, server, callback) {
  Store.find({key: user.id, server: server}, {server: 1, data: 1}, function(err, results) {
    unpackResults(results, function(r) {
      callback(err, results[0]);
    });
  });
};

function validate(data, buffer, user, server, callback) {
  if (buffer.length > 500) { //basic check for now
    callback(new Error('Data length exceeds maximum'));
    return;
  }
  Store.findOne({key: user.id, server: server}, {fields: {latest: 1, _id: -1}}, function(err, result){
    if (result != null && result.latest != null && new Date().getTime() - result.latest.getTime() < (config.timeDelay * 60 * 1000)) {
      callback(new Error('Can only log 1 request per day per server'))
      return;
    }
    callback();
  });
};

function unpackResults(results, callback) {
  for(var i = 0; i < results.length; ++i) {
    for(var j = 0; j < results[i].data.length; ++j) {
      results[i].data[j] = Msgpack.unpack(results[i].data[j].buffer);
      results[i].data[j].dated = new Date(results[i].data[j].dated);
    }
  }
  callback(results);
};

module.exports = Stat;