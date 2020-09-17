const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
  
 
    passport.serializeUser((user, cb) => {
      cb(null, user._id);
    });
  
    passport.deserializeUser((id, cb) => {
      User.findOne({ _id: id })
        .then(user => cb(null, user))
        .catch(err => cb(err));
    });

    passport.use(
        new LocalStrategy(

          {
            usernameField: 'username', // by default
            passwordField: 'password' // by default
          },

          (username, password, done) => {
  
            User.findOne({ username: username })
              .then(user => {

                if (!user) {
                  return done(null, false, { message: 'Incorrect username or password' });
                }
    
               
                if (!bcrypt.compareSync(password, user.passwordHash)) {
                  return done(null, false, { message: 'Incorrect username or password' });
                }
    
               
                done(null, user);
              })
              .catch(err => {
                console.error(err);
                return done(err);
              });
          }
        )
      );
    };