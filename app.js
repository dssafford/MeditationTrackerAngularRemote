require('rootpath')();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');


var expressJwt = require('express-jwt');
var config = require('config.json');
var expressSession = require('express-session');
var session = require('express-session');


var routes = require('./routes/index')(passport);

var db = require('./db');



// Connect to DB
//mongoose.connect('mongodb://localhost/meditationtracker');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//var engines = require('consolidate');
//app.engine('jade', engines.jade);
//app.engine('ejs', engines.ejs);
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');



// set up port
    app.set('port', process.env.PORT || 3030);

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }))
app.use(expressSession({secret: 'mySecret', resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());


// Angular authorization
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});



// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

//app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
