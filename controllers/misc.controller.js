const bcrypt = require("bcrypt");

module.exports.home = (req, res, next) => {
  res.redirect("/books");
};