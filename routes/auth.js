const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Solo donde las rutas de auth de sign up y login.
const User = require("../models/User.model");

// * Mostrar la pagina de signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// * Ejecutar el sign up y redirigir al usuario
router.post("/signup", async (req, res, next) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }
  const { email, password } = req.body;

  // * Encriptamos la contraseña del usuario
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      res.render("auth/signup", { errorMessage: "The email already exists!" });
      return;
    }
    await User.create({ email, password: hashPass });
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

// * Mostrar la pagina de Login
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// * Ejecutar el login y redirigir al usuario
router.post("/login", async (req, res, next) => {
  // Comprobar si el usuario coloca datos en el formulario
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to login",
    });
    return;
  }

  const { email, password } = req.body;

  try {
    // Buscar si el usuario existe enla base de datos
    const user = await User.findOne({ email: email });
    console.log(user);
    // Si el usuario no existe...
    if (!user) {
      res.render("auth/login", { errorMessage: "This email doesn't exists" });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password" });
    }
  } catch (error) {}
});

module.exports = router;
