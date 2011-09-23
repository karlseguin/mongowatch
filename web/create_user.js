var config = require('./config'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    Bcrypt = require('bcrypt'); 

var user = {username: process.argv[2], password: process.argv[3], secret: createSecret()};

if (!user.username || !user.password) {
  console.log('Usage: node create_user USERNAME PASSWORD')
  process.exit();
}

var secret = createSecret();
Bcrypt.gen_salt(10, function(err, salt) {
  Bcrypt.encrypt(user.password, salt, function(err, hash) {
    user.password = hash;
    user.username = user.username.toLowerCase();
    saveUser();
  });
});

function saveUser() {
  var db = new Db(config.mongo.database, new Server(config.mongo.host, config.mongo.port, {}));
  db.open(function(err, db) {
    db.collection('users', function(err, collection) {
      ensureIndex(collection, function() {
        collection.insert(user, {safe: true}, function(err, result) {
          if (err) { console.log(err); process.exit(); }
          console.log("User added:\n\tYour key is %s\n\tYour secret is %s", result[0]._id, user.secret);
          process.exit();
        });
      })
    });  
  });  
};

function ensureIndex(collection, callback) {
  collection.ensureIndex({username: 1}, {unique: true}, callback);
}

function createSecret() {
  var size = Math.random() * 20 + 15;
  var secret = ''
  for(var i = 0; i < size; ++i) {
    secret += String.fromCharCode(Math.random() * 94 + 32)
  }
  return secret;
};