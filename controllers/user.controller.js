const User = require('../models/User.model')
const bycrypt = require('bcrypt')

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
              res.render('/user: _id')
            } else {
              res.render('/users/login')
            }
          })
      } else {
        res.render('users/signup')
      }
    })
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