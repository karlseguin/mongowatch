var User = require('../models/user'),
    sessions = require('cookie-sessions');
  
module.exports = function(app){
  
  app.get('/', function(req, res){
    res.render('login');
  });
  
  app.post('/', sessions({secret: app.set('secret')}), function(req, res){
    User.loadFromCredentials(req.body.username, req.body.password, function( user){
      if (user == null) { res.render('login', {error: 'invalid username or password, please try again'}); return; }
      signin(req, user, res)
      res.redirect('/stats?l=1');
    });
  });
  
  app.get('/about', function(req, res){
    User.loadFromCredentials(req.body.username, req.body.password, function( user){
      if (user == null) { res.render('login', {error: 'invalid username or password, please try again'}); return; }
      signin(req, user, res)
      res.redirect('/stats?l=1');
    });
  });
  
  app.get('/logout', sessions({secret: app.set('secret')}), function(req, res){
    delete req.session.aid;
    res.redirect('/');
  });

  function signin(req, user) {
    req.session = {aid: user.id};
  }
};