module.exports = function(app) {
  require('./../controllers/home')(app);
  require('./../controllers/api')(app);
  require('./../controllers/stats')(app);
};
