const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.list = (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("users/list", { users });
    })
    .catch((err) => next(err));
};

module.exports.register = (req, res, next) => {
    res.render("users/register")
}

module.exports.doRegister = (req, res, next) => {
    const { username, password } = req.body;

  User.findOne({ username }).then((dbUser) => {
    if (dbUser) {
      res.render("users/register", {
        user: {
          username,
          password
        },
        errors: {
          username: "Este username ya esta en uso!",
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
    const { username, password } = req.body;
    User.findOne({ username }) .then((user) => {
        if (user) {
            return user.checkPassword(password)
                .then((match) => {
                    if (match) {
                      req.session.userId = user.id
                        res.redirect("/profile")
                    }
                    else {
                        console.log("Username o contraseña incorrectos")
                    }
                })
        } else {
            console.log("Username o contraseña incorrectos")
        }
    })
        .catch((err) => next(err));
}

module.exports.profile = (req, res, next) => {
  res.render("users/profile");
}

module.exports.main = (req, res, next) => {
  res.render("protected/main")
}
 
module.exports.private = (req, res, next) => {
  res.render("protected/private")
}

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
};