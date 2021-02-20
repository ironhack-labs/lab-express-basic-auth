const User = require("../models/User.model");
const mongoose = require("mongoose");
const { sendActivationEmail } = require("../configs/mailer.config");

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
          .then((user) => {
            /* console.log(user) */
            sendActivationEmail(user.email, user.activationToken);
            res.redirect("/");
          })
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
  function renderWithErrors(e) {
    res.render("users/login", {
      user: req.body,
      error: e || "The e-mail address or password is not correct.",
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
          if (user.active) {
            req.session.currentUserId = user.id;
            res.redirect("/profile");
          } else {
            renderWithErrors("Your account is not activated");
          }
        } else {
          renderWithErrors();
        }
      });
    }
  });
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};

module.exports.getProfile = (req, res, next) => {
  res.render("users/profile", { user: req.currentUser });
};

module.exports.getMain = (req, res, next) => {
  res.render("users/media")
}

module.exports.getPrivate = (req, res, next) => {
  res.render("users/private");
};

module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    {
      activationToken: req.params.token,
      active: false,
    },
    {
      activationToken: "active",
      active: true,
    }
  )
    .then((user) => {
      if (user) {
        res.render("users/login", {
          user: req.body,
          message:
            "Congratulations, you have activated your account. You can now log in.",
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(next);
};
