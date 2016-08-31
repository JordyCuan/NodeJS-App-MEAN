var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();


// Router
var routes = require('./routes/index');


// Modelo OCM de Base de Datos con Mongoose
var dbConfig = require('./models/db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'SeNecesitaUnaLllaveSecreta123'})); // TODO - Llave?
app.use(passport.initialize());
app.use(passport.session());


/*
// TODO - Esto realmente va aqui??
passport.serializeUser(function(user, done) {
	done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});


var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

// passport/login.js
passport.use(
	'login', 
	new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) { 
		// check in mongo if a user with username exists or not
		User.findOne({ '_username' :  username }, 
			function(err, user) {
				// In case of any error, return using the done method
				if (err)
					return done(err);
				// Username does not exist, log error & redirect back
				if (!user) {
					console.log('User Not Found with username '+username);
					return done(null, false, 
								req.flash('message', 'User Not found.'));                 
				}
				// User exists but wrong password, log the error 
				if (!isValidPassword(user, password)){
					console.log('Invalid Password');
					return done(null, false, 
								req.flash('message', 'Invalid Password'));
				}
				// User and password both match, return user from 
				// done method which will be treated like success
				return done(null, user);
			}
		);
	})
);

*/






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
	message: err.message,
	error: {}
  });
});


module.exports = app;
