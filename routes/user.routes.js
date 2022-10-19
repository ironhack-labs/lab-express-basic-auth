const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcryptjs = require("bcryptjs");

// GET => '/auth/signup' => renderiza vista de formulario
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST => '/auth/signup' => recibe info de formulario y crea un usuario
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup.hbs", {
      errorMessage: "Introducir caracteres!",
    });
    return;
  }

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "Introducir contrasena valida!",
    });
    return;
  }

  try {
    const userForm = await User.findOne({ username: username });
    if (userForm !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "El usuario ingresado ya existe!",
      });
      return;
    }

    const salt = await bcryptjs.genSalt(12);
    const hashPass = await bcryptjs.hash(password,salt);

    let newUser = {
      username : username,
      password: hashPass
    }

    await User.create(newUser);

    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

// GET => '/auth/login' => renderiza vista de formulario de acceso a la pagina
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST => '/auth/login' => recibe credenciales de usuario y valida el mismo


// GET => '/auth/logout' => redirecciona home y cierra sesion
router.get("/logout", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
