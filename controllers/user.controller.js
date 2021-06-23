const router = require("express").Router();

const User = require("../models/User.model");

module.exports.home = (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("index", { users });
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports.new = (req, res, next) => {
  res.render("new-user");
};

module.exports.create = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      console.log(user);
      res.redirect("/");
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports.id = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.render("user", { user });
    })
    .catch((e) => {
      console.error(e);
    });
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
    User.findByIdAndUpdate(req.params.id,req.body)
      .then((user) => {
        res.redirect("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };
