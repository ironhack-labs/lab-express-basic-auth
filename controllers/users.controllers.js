const User = require("../models/User.model");
const mongoose = require("mongoose");

//register
module.exports.register = (req, res, next) => {
  res.render("users/signup");
};

module.exports.doRegister = (req, res, next) => {
  const userProposal = req.body;

  function renderWithError(errors) {
    res.status(400).render("users/signup", {
      errors: errors,
      user: req.body,
    });
  }

  User.findOne({
    email: userProposal.email,
  })
    .then((user) => {
      if (user) {
        renderWithError({
          email: "A user with this email already exists",
        });
      } else {
        User.create(userProposal)
          .then(() => res.redirect("/"))
          .catch((e) => {
            if (e instanceof mongoose.Error.ValidationError) {
              renderWithError(e.errors);
            } else {
              next(e);
            }
          });
      }
    })
    .catch((e) => next(e));
};
// login
module.exports.login = (req, res, next) => {
  res.render("users/login");
};

module.exports.doLogin = (req, res, next) => {
  function renderWithErrors() {
    res.render("users/login", {
      user: req.body,
      error: "The e-mail address or password is not correct.",
    });
  }

  const { email } = req.body;
  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      renderWithErrors();
    } else {
      user.checkPassword(req.body.password).then((match) => {
        if (match) {
          req.session.currentUserId = user.id  
          res.render("users/profile", user);
        } else {
            renderWithErrors();
        }
      });
    }
  });
};

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
}