var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var config = require('./config/config');
var mongoose = require('./database/db.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  // express-session deprecated undefined saveUninitialized option; 添加下面两行
  resave:false,//添加这行
  saveUninitialized: true,//添加这行 
    secret: 'zgt',
    store: new mongoStore({
        url: config.dburl + config.dbname,
        ttl: 60*60,
        touchAfter: 3600
    })
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});
app.use(function(req, res, next) {
    var url = req.originalUrl;
    if(url.search("/mini") == -1) {
        if(!req.session.user && url != '/users/login' && url != '/') {
            return res.redirect('/');
        }
    }
    next();
});

require('./config/routes')(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
