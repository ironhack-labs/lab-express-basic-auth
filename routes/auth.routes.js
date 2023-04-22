const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("./../models/User.model");
const saltRounds = 10;

// SIGN UP

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("auth/signup-form", { errorMessage: "Eyyy! Es necesario rellenar todos los campos" });
      return;
    }

    const user = await User.findOne({ username });
    if (user) {
      res.render("auth/signup-form", { errorMessage: "Lo sentimos...ese nombre de usuario ya está en uso" });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds); // crea la pass
    const hashedPassword = bcrypt.hashSync(password, salt); // la fusiona con la del usuario
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// LOG IN

router.get("/log-in", (req, res, next) => {
  res.render("auth/login-form");
});

router.post("/log-in", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.find({ username });
    req.session.currentUser = user;
    console.log(user);
    console.log(req.session);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
