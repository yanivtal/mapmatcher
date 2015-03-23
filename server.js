var express = require('express')
  , routes = require('./routes')
  , browserify = require('browserify-middleware')
  , app = express();

// Configure ejs templates and/or render html files under /views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/js', browserify('./app'));
app.use(express.static('public'));

// Include routes
routes(app);

var port = process.env.PORT || 3000;

app.listen(port);
console.log('Server is running on port ', port);