const User = require("../models/User.model")

module.exports.signup = (req, res, next) => {
    res.render("signup")
}

module.exports.doSignup = (req, res, next) => {
  console.log("slay")
  User.create(req.body)
    .then(user => res.redirect("/"))
    .catch(err => next(err))
}