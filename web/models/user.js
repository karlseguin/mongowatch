var Store = new (require('./store').Store)('users', function(){return new User();}),
    Bcrypt = require('bcrypt'); 
  
var User = function User(secret, username) {
  this.username = username;
  this.password = this.id = null;
};

User.findById = function(id, callback) {
  try { id = Store.idFromString(id); }
  catch (err) { callback(null, null); return; }
  
  Store.findOne({_id: id}, function(err, result) {
    if (err) { callback(err); }
    else { callback(null, result); }
  });
};

User.loadFromCredentials = function(username, password, callback) {
  if (!username || !password) { callback(null); return; }
  Store.findOne({username: username.toLowerCase()}, function(err, user) {
    if (err || user == null) {callback(null); return; }
    Bcrypt.compare(password, user.password, function(err, result){
      callback(result ? user : null);
    });
  });
};

module.exports = User;