const { default: mongoose } = require("mongoose");
const User = require("../models/User.model");

module.exports.signup = (req, res, next) => {
  res.render("auth/signup");
};

module.exports.doSignup = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render("auth/signup", {
      user: { username: req.body.username },
      errors,
    });
  };

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        //si no encuentra otro registro con el mismo username, lo crea
        return User.create(req.body).then((user) => {
          res.render("user/confirmation");
          console.info(`${user.username} has been created!`);
        });
      } else {
        renderWithErrors({
          username: "Sorry! Username already in use, try with another one :)",
        });
      }
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};

module.exports.doLogin = (req, res, next) => {
  const { username, password } = req.body;

  const renderWithErrors = () => {
    res.render("auth/login", {
      user: { username },
      errors: { username: "Username or password are incorrect. Try again!" },
    });
  };

  if (!username || !password) {
    renderWithErrors();
  }

  // Comprobar si hay un usuario con este email
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        renderWithErrors();
      } else {
        // Comprobamos que la contraseña sea correcta
        return user.checkPassword(password).then((match) => {
          if (!match) {
            renderWithErrors();
          } else {
            req.session.userId = user.id;
            res.redirect("/user/profile");
          }
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
