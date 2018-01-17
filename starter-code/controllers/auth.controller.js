const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  User.findOne({ username: req.body.username })
      .then(user => {
          if (user != null) {
            console.log("Username already exists");            
            res.render('auth/signup', { user: user, error: { username: 'Username already exists'} })
          } else {
            user = new User(req.body);
            user.save()
              .then(() => {
                console.log("User created");                      
                res.redirect('/signup');
              }).catch(error => {
                if (error instanceof mongoose.Error.ValidationError) {
                  res.render('auth/signup', { user: user, error: error.errors })                      } else {
                  next(error)
                }
              });
          }  
        })
        //QUE SIGNIFICA ESTO?????
      .catch(error => next(error));
};