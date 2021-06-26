const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

module.exports.home = (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("index", { users });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.new = (req, res, next) => {
  res.render("new-user");
};

module.exports.create = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.render("new-user", {
          errors: e.errors,
          user: {
            email: req.body.email,
          },
        });
      } else if (e.code === 11000) {
        res.render("new-user", {
          errors: {
            email: "There is already an account registered with this email",
            username: "There is an account with this username",
          },
          user: {
            email: req.body.email,
            username: req.body.username,
          },
        });
      } else {
        next(e);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("login");
};

module.exports.doLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.render("login", {
          errorMessage: "Username or Password are invalid",
          user: {
            username: req.body.username,
          },
        });
      } else {
        return user.checkPassword(req.body.password).then((match) => {
          if (match) {
            req.session.currentUser = user;
            res.redirect("/profile");
          } else {
            res.render("login", {
              errorMessage: "Username or password are invalid",
              user: {
                username: req.body.username,
              },
            });
          }
        });
      }
    })
    .catch((e) => next(e));
};

module.exports.profile = (req, res, next) => {
  console.log(req.session.currentUser);
  res.render("profile");
};
module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.render("edit-user", { user });
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports.update = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((user) => {
      res.redirect("/");
    })
    .catch((e) => {
      console.error(e);
    });
};
module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};
