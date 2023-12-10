const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports.login = (req, res, next) => {
  res.render("users/login", { errors: false });
};

module.exports.register = (req, res, next) => {
  res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((dbUser) => {
    if (dbUser) {
      res.render("users/login", {
        user: {
          username,
          password,
        },
        errors: {
          username: "Username already in use!",
        },
      });
    } else {
      User.create(req.body)
        .then((createdUser) => {
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
};

module.exports.doLogin = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            req.session.userId = user.id;
            res.redirect("/profile");
          } else {
            console.error("Incorrect username or password");
            res.redirect('/login')
          }
        });
      } else {
        console.error("Incorrect username or password");
        res.redirect('/login')
      }
    })
    .catch((err) => next(err));
};

module.exports.main = (req, res, next) => {
    res.render('main')
}

module.exports.private = (req, res, next) => {
    res.render('private')
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
};

module.exports.profile = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .then((user) => {
            res.render('users/profile', { user });
        })
        .catch((err) => next(err));
};