const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = req.body;

  User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        res.render("auth/register", {
          user,
          errors: {
            emailExist: "Email already exist",
          },
        });
        return;
      } else {
        return User.create(user).then((userCreated) => {
          res.redirect("/profile");
        });
      }
    })
    .catch((err) => {
      console.log("errors", err);
      res.render("auth/register", {
        user,
        errors: err.errors,
      });
      next(err);
    });
};
  
  module.exports.login = (req, res, next) => {};
  module.exports.doLogin = (req, res, next) => {};