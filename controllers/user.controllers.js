const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
  res.render("register");
};

module.exports.login = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.render("login");
    })
    .catch((err) => next(err));
};
module.exports.doRegister = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => next(err));
};
