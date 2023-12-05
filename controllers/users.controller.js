const mongoose = require("mongoose");
const User = require('../models/User.model');


module.exports.signup = (req, res, next) => {
  res.render('users/signup', { errors: false })
};


module.exports.signin = (req, res, next) => {
  res.render('users/signin')
}

module.exports.dosignup = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/signin");
    })
    .catch((err) => next(err));
}

module.exports.dosignin = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((dbUser) => {
    if (dbUser) {
      res.render("users/signin", {
        user: {
          username,
          password
        },
        errors: {
          username: "Este nombre de usuario ya esta en uso🥺",
        },
      });
    } else {
      User.create(req.body)
        .then(() => {
          res.redirect("/signup");
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            res.render("users/signin", {
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

module.exports.dosignup = (req, res, next) => {
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
                      console.error("Nombre o contraseña incorrectos")
                  }
              })
      } else {
          console.error("nombre o contraseña incorrectos")
      }
  })
      .catch((err) => next(err));
}


module.exports.main = (req, res, next) => {
  res.render("protect/main")
}

module.exports.private = (req, res, next) => {
  res.render("protect/private")
}


////////////////
module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
};


module.exports.profile = (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      res.render("users/profile", { user });
    })
    .catch((err) => next(err));
};