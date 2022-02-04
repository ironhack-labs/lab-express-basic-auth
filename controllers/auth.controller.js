/* const res = require("express/lib/response"); */
const mongoose = require("mongoose");
const User = require("../models/User.model");

/* ITERATION 1: SIGN UP */

module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = ({ userName, email, password } = req.body);
  console.log("User successfully registered", req.body);

  const whenErrors = (errors) => {
    res.render("auth/register", {
      errors: errors,
      user: user,
    });
  };

  User.findOne({ email: email })
    .then((userFound) => {
      if (userFound) {
        whenErrors({ email: "This email already exists!" });
      } else {
        return User.create(user).then(() => res.redirect("/"));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        whenErrors(err.errors);
      } else {
        next(err);
      }
    });
};

/* module.exports.viewProfile = (req, res, next) => {
  res.render("users/user-profile"); */



  /* ITERATION 2: LOGIN */

  module.exports.login = (req, res, next) => {
    res.render("auth/login");
  };

  module.exports.doLogin = (req, res, next) => {
    const user = ({ userName, password } = req.body);
    console.log("User succesfully logged in", req.body);

    const whenLoginErrors = (errors) => {
      res.render("auth/login", {
        errors: errors,
        user: user,
      });
    };
  };

