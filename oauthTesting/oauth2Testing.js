/*
const express = require('express');
//const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

//app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "545752795087-hq4jrm49c10nn9j917qd6dd7oh8m8q78.apps.googleusercontent.com",
    clientSecret: "SN97IW0QuGvSuBX5y_WKoKX_",
    callbackURL: "/return"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/login', passport.authenticate('oauth2', {
  session: true,
  successReturnToOrRedirect: '/'
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

*/
require('dotenv').config();

var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: "545752795087-hq4jrm49c10nn9j917qd6dd7oh8m8q78.apps.googleusercontent.com",
    clientSecret: "SN97IW0QuGvSuBX5y_WKoKX_",
    callbackURL: '/return'
  },
  function(accessToken, refreshToken, profile, cb) {

    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes. 
// Note: After a login, you will be redirected to home, but when logged in, it will display new information
// Changing that to the main home of the app may be an easy way to connect this login to the app.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });


app.get('/login/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.listen(process.env['PORT'] || 3000);
