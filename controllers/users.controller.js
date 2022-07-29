const User = require("../models/User.model");

module.exports.profile = (req, res, next) => {
  res.render("users/profile");
};