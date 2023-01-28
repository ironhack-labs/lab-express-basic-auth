const User = require("../models/User.model")

module.exports.signup = (req, res, next) => {
  res.render("signup")
}

module.exports.doSignup = (req, res, next) => {
  User.create(req.body)
    .then(user => res.redirect("/"))
    .catch(err => next(err))
}

module.exports.login = (req, res, next) => {
  res.render("login")
}

module.exports.doLogin = (req, res, next) => {
  const { username, password } = req.body

  User.findOne({ username })
    .then(user => {
      return user.checkPassword(password)
        .then(match => {
          req.session.userId = user.id
          res.redirect("/")
        })
    })
    .catch(err => next(err))
}

module.exports.profile = (req, res, next) => {
  res.render("profile")
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
}