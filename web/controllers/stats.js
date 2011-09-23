var Stat = require('../models/stat'),
    User = require('../models/user'),
    sessions = require('cookie-sessions');
  
module.exports = function(app){

  app.get('/stats', sessions({secret: app.set('secret')}), function(req, res){
    loadUser(req, function(user) {
      if (!user) { res.redirect('/login'); return; }
      
      Stat.getOverview(user, function(err, stats){
        if (stats.length == 1 && req.param('l')) {
          res.redirect('/stats/' + stats[0].server)
        } else {
          res.render('overview', {stats: stats});
        }
      });
    });
  });
  
  app.get('/stats/:server', sessions({secret: app.set('secret')}), function(req, res){
    loadUser(req, function(user) {      
      if (!user) { res.redirect('/login'); return; }
      Stat.getStats(user, req.params.server, function(err, stats){
        res.render('server', {stats: stats});
      });
    });
  });
  
  
  function loadUser(req, callback) {
    if (req.session && req.session.aid) {
      User.findById(req.session.aid, function(err, user) {
        callback(user);
      });
    } else {
      callback(null);
    }
  };
};