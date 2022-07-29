
const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
    res.render("users/register");
  };
  
  module.exports.doRegister = (req, res, next) => {
    const user = req.body;
  
    User.findOne({ email: user.email })
      .then((userFound) => {
        if (userFound) {
          res.render("users/register", {
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
        res.render("users/register", {
          user,
          errors: err.errors,
        });
        next(err);
      });
  };
  