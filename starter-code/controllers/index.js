const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signupView = (req, res) => {
  res.render("signup");
};

exports.signupProcess = (req, res) => {
  const { user, password } = req.body;

  if (user === "" || password === "") {
    res.render("signup", {
      errorMessage: "Usuario y contraseña requeridos"
    });
  }
  User.findOne({ user })
    .then(check => {
      if (!check) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        User.create({
          user,
          password: hashPassword
        })
          .then(() => {
            res.redirect("/");
          })
          .catch(err => console.error(err));
      } else {
        res.render("signup", { errorMessage: "Usuario ya registrado" });
      }
    })
    .catch(err => {
      console.error(err);
    });
};

exports.loginView = (req, res) => {
  res.render("login");
};

exports.loginProcess = async (req, res) => {
  const { user = "", password = "" } = req.body;
  if (user === "" || password === "") {
    res.render("login", { errorMessage: "Error: Missing fields" });
  }
  const usr = await User.findOne({ user });
  if (!usr) {
    res.render("login", { errorMessage: "Error: User doesn't exists" });
  }
  if (bcrypt.compareSync(password, usr.password)) {
    req.session.currentUser = user;
    res.redirect("/");
  } else {
    res.render("login", { errorMessage: "Error: Incorrect Password" });
  }
};

exports.mainView = (req, res) => {
  res.render("main");
};

exports.privateView = (req, res) => {
  res.render("private");
};

exports.logout = async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
};
