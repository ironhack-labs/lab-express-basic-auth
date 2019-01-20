const User = require("../models/user.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
  res.render("auth/register")
}

module.exports.doRegister = (req, res, next) => {
  User.findOne({username: req.body.username})
    .then(user => {
      if(user){
        res.render("auth/register", {
          user: req.body,
          errors: {
            username: 'Username already exists'
          }
        });
      } else {
        user = new User({
          username: req.body.username,
          password: req.body.password,
        });
        return user.save()
          .then(user => {
            res.redirect("/login")
          })
      }
    })
}