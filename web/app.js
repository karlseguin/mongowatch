var express = require('express'),
    config = require('./config'),
    store = require('./models/store');
    
var app = module.exports = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //oh noes, all my secrets are belong to you!
  app.set('secret', 'B-WT9_\'9061O5_CK0_-_7;68\j^)!3:R30-1>-Lhyv_.~)-7Oo')
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: false })); 
});

app.configure('production', function(){
  app.error(function(err, req, res){
    res.send(err.message, {'Content-Type': 'text/plain' }, 500); //todo fix
  }); 
});

require('./initializers/routes')(app);
require('./initializers/layout')(app);

if (!module.parent) {
  store.open(function(err, db) {
    app.listen(config.listen.port);
    console.log('Express started on port ' + config.listen.port);
  });
}
