var Stat = require('../models/stat'),
    User = require('../models/user')
    Crypt = require('hashlib');
  
module.exports = function(app){

  app.param('user', function(req, res, next, user){
    User.findById  (user, function(err, user){
      if (err) return next(err);
      if (!user) return next(new Error('failed to find user'));
      req.user = user;
      next();
    });
  });
  
  app.param('sig', function(req, res, next, sig){
    req.signed = sig == Crypt.sha1(req.rawBody + req.user.secret);
    if (!ensureSignature(req)) { return; }
    next();
  });

  app.post('/api/stats/:user/:sig', function(req, res, next){
    if (!ensureSignature(req)) { return; }
    Stat.newDataPoint(req.user, req.body.name, req.body.data, function(err) { 
      if (err) { return next(err); }
      else { res.send(true); }
    });
  });
  
  function ensureSignature(req){
    if (!req.signed) { return req.next(new Error('invalid signature')); }
    return true;
  }
};