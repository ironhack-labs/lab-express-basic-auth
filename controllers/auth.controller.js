const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
  res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  User.findOne({ email })
    .then((dbUser) => {
      if (dbUser) {
        res.render("users/register", {
          user: {
            email,
            username,
          },
          errors: {
            email: "Email is already registered!",
          },
        });
      } else {
        User.create({
          username,
          email,
          password,
        }); 
        res.redirect("users/login")
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
