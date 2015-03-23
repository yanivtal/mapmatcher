
module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('index.html');
  })

  // app.get('/api/v1/')
};