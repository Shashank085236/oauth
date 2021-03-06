// Load required packages
var passport = require('passport');
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var BearerStrategy = require('passport-http-bearer').Strategy
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  (username, password, callback) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, (err, isMatch) => {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

//The one thing to note here is that when we call passport.use() we are not just supplying a BasicStrategy object. 
//Instead we are also giving it the name client-basic. Without this, we would not be able to have two BasicStragies running at the same time.
passport.use('client-basic', new BasicStrategy(
  (username, password, callback) => {
    Client.findOne({ id: username }, (err, client) => {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  (accessToken, callback) => {
    Token.findOne({value: accessToken }, (err, token) => {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, (err, user) => {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));


//The option of session being set to false tells passport to not store session variables between calls to our API. 
//This forces the user to submit the username and password on each call.
//BearerStategy which will allow us to authenticate requests made on behalf of users via an OAuth token. 
//This is done via the Authorization: Bearer <access token> header.
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
//support both basic and bearer type authentication
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
