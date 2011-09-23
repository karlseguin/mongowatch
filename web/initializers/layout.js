var dateFormat = require('dateformat');

var property = function() {
  var value = null;
  return {
    get: function() { return value; },
    set: function(newValue) { value = newValue; }
  };
}
module.exports = function(app) {
  app.dynamicHelpers({
    headerSection: function() { return new property(); },
    isLoggedIn: function(req) { return req.session && req.session.aid; }
  });
  
  app.helpers({
    niceDate: function(date) { return dateFormat(date, 'mmm dd, yyyy HH:MM'); }
  })
};
