const mongoose = require("mongoose")
const User = require("../models/user.model")

module.exports.signUp = (req, res, next) => res.render("signup")
module.exports.newUser = (req, res, next) => {
  const user = new User(req.body)
  user
    .save()
    .then(() => res.redirect("login"))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("signup", { error: error.errors, user })
      } else if (error.code === 11000) {
        res.render("signup", {
          user,
          error: {
            email: {
              message: "user already exists",
            },
          },
        })
      } else {
        next(error)
      }
    })
    .catch(next)
}

module.exports.logIn = (req,res,next) => {
    res.render('login')
}

module.exports.welcomeUser = (req,res,next) => {
    res.send('sdada')
}

