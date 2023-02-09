const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const router = new Router();
const saltRounds = 10;

router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Todos los campos son obligatorios. Por favor proporcione su nombre de usuario, correo electrónico y contraseña.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "La contraseña debe tener al menos 6 caracteres y debe contener al menos un número, una letra minúscula y una letra mayúscula.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashPassword) => {
      return User.create({ username, password: hashPassword });
    })
    .then((newUser) => {
      console.log("nuevo usuario", newUser);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "El nombre de usuario y el correo electrónico deben ser únicos. Ya se ha utilizado el nombre de usuario o el correo electrónico.",
        });
      } else {
        next(error);
      }
    });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  console.log("SESSION =====> ", req.session);

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage:
        "Por favor, ingrese tanto el correo electrónico como la contraseña para iniciar sesión.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "El correo electrónico no está registrado. Intente con otro correo electrónico.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Password incorrecto" });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("users/user-profiles", { userInSession: req.session.currentUser });
});

router.get("/private", (req, res) => {
  res.render("users/private", { userInSession: req.session.currentUser });
});

module.exports = router;
