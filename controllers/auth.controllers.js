const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
  res.render("register");
};

module.exports.doRegister = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      console.log(user);
      user.checkPassword(req.body.password);
      res.redirect("/login");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.render("register", {
          user: {
            email: req.body.email,
          },
          errors: err.errors,
        });
      } else if (err.code === 11000) {
        // Handle MongoDB Duplicate Key Errors
        // Customize the error message based on the field causing the issue
        const field = Object.keys(err.keyValue)[0]; // Extract the field causing the conflict
        const value = err.keyValue[field]; // Extract the conflicting value
        res.render("register", {
          user: {
            email: req.body.email,
          },
          errors: {
            password: "Email or password incorrect"
          },
        });
      } else {
        console.log("***Register error2*** -->>>");
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("login");
};

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render("auth/login", {
      email,
      error: "Email o contraseña incorrectos",
    });
  };

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            req.session.userId = user.id; // genero cookie y session
            res.redirect("/profile");
          } else {
            console.log("Email o contraseña incorrectos"); // contraseña incorrecta
            renderWithErrors();
          }
        });
      }
    })
    .catch((err) => next(err));
};

module.exports.loggedIn = (req, res, next) => {
  res.render("profile");
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("express-cookie");
  res.redirect("/login");
};
