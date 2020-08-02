const mongoose = require('mongoose')
const User = require('../models/User.model')

module.exports.login = (req, res, next) => {
  res.render('users/login');
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if(match) {
              req.session.userId = user_id
              console.log("He entrado!");
              res.redirect('/main')
            } else {
              res.render('/users/login')
            }
          })
          .catch(next)
      } else {
        res.render('users/signup')
      }
    })
    .catch(next)
}

module.exports.signup = (req, res, next) => {
  res.render('users/signup');
}

module.exports.createUser = (req, res, next) => {
  const user = new User(req.body)
  
  user.save()
  .then(() => {
    res.redirect('/login')
    console.log("Logeado");
  })
  .catch(err => {
    //res.render('users/signup', {error: err.errors, user})
    console.log(err);
  })
}

module.exports.logged = (req, res, next) => {
  res.render('/main');
}