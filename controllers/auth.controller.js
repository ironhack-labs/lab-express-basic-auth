const User = require("../models/User.model");

module.exports.index = (req, res, next) => {
  User.find().then((users) => {
    res.render("index", { users });
  });
};

module.exports.create = (req, res, next) => {
  res.render("signup");
};

module.exports.doCreate = (req, res, next) => {
  User.create(req.body).then(() => {
    res.redirect("/");
  });
};

module.exports.login = (req, res, next) => {
  res.render("login");
};

module.exports.doLogin = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username, password }).then((user) => {
    if (user) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  });
};
