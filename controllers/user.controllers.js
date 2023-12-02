const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
    res.render("users/register")
}

module.exports.doRegister = (req, res, next) => {
    const { email, username } = req.body;

  User.findOne({ email }).then((dbUser) => {
    if (dbUser) {
      res.render("users/register", {
        user: {
          email,
          username,
        },
        errors: {
          email: "Este email ya esta en uso!",
        },
      });
    } else {
      User.create(req.body)
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            res.render("users/register", {
              user: {
                email,
                username,
              },
              errors: err.errors, 
            });
          } else {
            next(err);
          }
        });
    }
  });
}

module.exports.login = (req, res, next) => {
    res.render("users/login")
}

module.exports.doLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email }) .then((user) => {
        if (user) {
            return user.checkPassword(password)
                .then((match) => {
                    if (match) {
                        res.redirect("/profile")
                    }
                    else {
                        console.log("Email o contraseña incorrectos")
                    }
                })
        } else {
            console.log("Email o contraseña incorrectos")
        }
    })
        .catch((err) => next(err));
}


