const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("./../models/User.model");

const saltRounds = 10;

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup-form", {
        errorMessage: "Por favor, rellena todos los campos.",
      });
      return;
    }

    const user = await User.findOne({ username });
    if (user) {
      res.render("auth/signup-form", {
        errorMessage: "El usuario y/o el email están en uso.",
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login-form");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("auth/login-form", {
        errorMessage: "Por favor rellena todos los campos.",
      });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.render("auth/login-form", {
        errorMessage: "Usuario o contraseña incorrectos.",
      });
      return;
    }
    if (!bcrypt.compareSync(password, user.password)) {
      res.render("auth/login-form", {
        errorMessage: "Usuario o contraseña incorrectos.",
      });
      return;
    }

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/profile", (req, res, next) => {
  res.render("auth/profile");
});

// Logout controller -> req.session destroy method
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
