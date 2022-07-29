const router = require ('express').Router()

module.exports.home = (req, res, next) => {
  res.render("home");
};