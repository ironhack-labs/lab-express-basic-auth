const User = require('../models/user.model');

module.exports.index = (req, res, next) => {
  res.render('index')
}
module.exports.login = (req, res, next) => {
  res.render('users/login')
}
module.exports.signup = (req, res, next) => {
  res.render('users/signup')
}
module.exports.profile = (req, res, next) => {
  res.render('users/profile', {user: req.currentUser})
}

module.exports.doSignup = (req, res, next) => {
  const newUser = new User(req.body)
  newUser.save()
    .then(() => res.redirect('/users/profile'))
    .catch(errors => res.render('users/signup', {errors, user: req.body})) 
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({username: req.body.username})
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if(match) {
              req.session.userId = user._id
              res.redirect('/users/profile')
            } else {
              errors = 'User or Password incorrect'
              res.render('users/login', {errors, user: req.body})
            }
          })
          .catch(next)
      } else {
        errors = 'User or Password incorrect'
        res.render('users/login', {errors, user: req.body})
      }
    })
    .catch(next) 
}

module.exports.logout = (req, res, next) => {
  res.render('users/logout')
}

module.exports.doLogout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/users/login')
}