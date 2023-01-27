const User = require("../models/User.model");
const createError = require('http-errors');
const mongoose = require("mongoose");

module.exports.index = (req, res, next) => {
  res.render("index");
};

module.exports.signup = (req, res, next) => {
  res.render("auth/signup");
};

module.exports.doSignup = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render("auth/signup", {
      user: {
        username: req.body.username,
      },
      errors,
    });
  };
  User.findOne({ username: req.body.username })
  .then((user) => {
    if (!user) {
      return User.create(req.body)
      .then((user) => {
        console.log(`${user.username} has been created`)
        res.render("auth/confirmation-user");
      });
    } else {
      renderWithErrors({username : "Username already in use", 
      password : "password is required" })
    }
  })
  .catch(err =>{
    if(err instanceof mongoose.Error.ValidationError){
      renderWithErrors(err.errors)
    } else {
      next(err)
    }
  })
};
