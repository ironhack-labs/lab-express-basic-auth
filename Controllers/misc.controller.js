const User = require("../models/User.model");

module.exports.home = (req, res, next) => {
  res.render("index");
};

module.exports.panel = (req, res, next) => {
  User.find({ _id: { $ne: req.currentUser.id } }) // Excluir el usuario actual
    .then((users) => {
      res.render("control/panel", { users });
    })
    .catch((err) => next(err));
};