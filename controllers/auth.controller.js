/* const res = require("express/lib/response"); */

const mongoose = require("mongoose");
const User = require("../models/User.model");

/* ITERATION 1: SIGN UP */

module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = ({ userName, email, password } = req.body);
  console.log("User successfully registered", req.body);

  const whenErrors = (errors) => {
    res.render("auth/register", {
      errors: errors,
      user: user,
    });
  };

  User.findOne({ email: email })
    .then((userFound) => {
      if (userFound) {
        whenErrors({ email: "This email already exists!" });
      } else {
        return User.create(user).then(() => res.redirect("/login"));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        whenErrors(err.errors);
      } else {
        next(err);
      }
    });
};


/* ITERATION 2: LOGIN */

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};
module.exports.doLogin = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((userFound) => {
      if (!userFound) {
        res.render("auth/login", {
          errors: {
            username: "Please provide a valid username or password",
          },
        });
      } else {
        userFound.checkPassword(password).then((match) => {
          if (!match) {
            res.render("auth/login", {
              errors: {
                username: "Please provide a valid username or password",
              },
            });
          } else {
            res.redirect("/");
            console.log("User succesfully logged in", req.body);
          }
        });
      }
    })
    .catch((err) => next(err));
};

/* LOGOUT USER */

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  console.log('User successfully disconnected')
  res.redirect('/login')
}
