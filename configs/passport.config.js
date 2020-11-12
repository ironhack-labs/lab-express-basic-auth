const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User.model");
const bcryptjs = require("bcrypt");

 
module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
          {
            username: 'username', 
            password: 'password', 
            passReqToCallback: true
          },
          (req, username, password, done) => {
            User.findOne({ username })
              .then(user => {
                if (!user) {
                  return done(null, false, { message: 'Incorrect username' });
                }
       
                if (!bcryptjs.compareSync(password, user.password)) {
                  return done(null, false, { message: 'Incorrect password' });
                }
       
                done(null, user);
              })
              .catch(err => done(err));
          })
      );
      passport.serializeUser((user, cb) => cb(null, user._id));
      passport.deserializeUser((id, cb) => {
        User.findById(id)
          .then(user => cb(null, user))
          .catch(err => cb(err));
      });
}
  