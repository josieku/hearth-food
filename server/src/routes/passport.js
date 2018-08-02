var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/models').User;
//var MongoStore = require('connect-mongo')(session); //will use later??
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected',function(){
  console.log('Connected to MongoDB')
})

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

export default passport
