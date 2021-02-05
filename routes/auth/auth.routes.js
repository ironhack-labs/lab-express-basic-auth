const express = require("express");
const router = express.Router();

const User = require("../../models/User.model");

const bcrypt = require("bcrypt");

// Endpoints

// Signup
router.get("/signup", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (username.length === 0 || password.length === 0) {
      res.render("auth/signup-form", { errorMsg: "Rellena los campos" });
      return;
    }

    if (user) {
      res.render("auth/signup-form", { errorMsg: "Usuario ya registrado" });
      return;
    }

    const pwdRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
    if (!pwdRegex.test(password)) {
      res.render("auth/signup-form", {
        errorMsg:
          "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
      });
      return;
    }

    const bcryptSalt = 10;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });
});

//Login
router.get("/login", (req, res) => {
  res.render("auth/login-form");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username.length === 0 || password.length === 0) {
    res.render("auth/login-form", { errorMsg: "Rellena los campos" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login-form", { errorMsg: "Usuario no registrado" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        res.render("auth/login-form", { errorMsg: "Contraseña errónea" });
      }
      req.session.currentUser = user;
      console.log(req.session);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});
module.exports = router;
