const User = require("../models/User.model");
module.exports.signUp = (req, res, next) => {
  res.render("user/sign-up");
};
module.exports.doSignUp = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.render("user/login");
    })
    .catch((error) => {
      res.render("user/sign-up", { errors: error.errors, user: req.body });
    });
};
module.exports.login = (req, res, next) => {
  res.render("user/login");
};
module.exports.doLogin = (req, res, next) => {
  //deconstrir el body
  const { username, password } = req.body;
  //crear una función de errores
  const renderWithErrors = () => {
    res.render("user/login", {
      errors: {
        message: "Email or password wrong",
      },
    });
  };

  //Ahora buscamos si existe el usuario por su email
  User.findOne({ username: username })
    .then((user) => {
      //si existe user será truty
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            //Aquí se pasa el id del usuario a la session
            req.session.userId = user.id;
            res.redirect("/user/profile");
          } else {
            renderWithErrors();
          }
        });
      } else {
        renderWithErrors();
      }
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.userProfile = (req, res, next) => {
  res.render("user/profile");
};
module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};
