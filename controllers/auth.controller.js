const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = req.body;

  User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        res.render("auth/register", {
          user,
          errors: {
            email: "Email already exist",
          },
        });
      } else {
        return User.create(user).then((userCreated) => {
          res.redirect("/profile");
        });
      }
    })
    .catch((err) => {
      res.render("auth/register", {
        user,
        errors: err.errors,
      });
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};

module.exports.doLogin = (req, res, next) => {
  console.log("SESSION ========================> ", req.session);

  const renderWithErrors = () => {
    res.render("auth/login", { error: "Invalid credentials." });
  };

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("no encuentra usuario")
        renderWithErrors();
        return;
      } else if (user) {
        console.log("encuentra usuario registrado")
        user.checkPassword(password).then((match) => {
          if (match) {
            console.log("hace match")
            req.session.currentUser = user;
            res.redirect("/profile");
          } else {
            renderWithErrors();
          }
        });
      }
    })
    .catch((error) => {
      console.log("entra al catch");
      next(error)});
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};