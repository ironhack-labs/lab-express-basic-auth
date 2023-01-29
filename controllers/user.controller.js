const User = require("../models/User.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports.create = (req, res, next) => {
  res.render("user/signup");
};

module.exports.profile = (req, res, next) => {
  res.render("user/profile");
};

module.exports.doCreate = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render("user/signup", {
      user: {
        email: req.body.email,
        username: req.body.username,
      },
      errors,
    });
  };

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return User.create(req.body).then((user) => {
          res.redirect("/login");
        });
      } else {
        renderWithErrors({ email: "Email already in use" });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("user/login");
};

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render("user/login", {
      user: { email },
      errors: { email: "Email or password are incorrect" },
    });
  };

  if (!email || !password) {
    renderWithErrors();
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        renderWithErrors();
      } else {
        return user.checkPassword(password).then((match) => {
          if (!match) {
            renderWithErrors();
          } else {
            req.session.userId = user.id;
            res.redirect("/profile");
          }
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};
