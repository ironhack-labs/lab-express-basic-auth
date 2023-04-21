const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./../models/User.model");
const { isLoggedOut, isLoggedIn } = require("../middlewares/route-guard.js");

const saltRounds = 10;

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render("auth/signup-form", {
        errorMessage:
          "El password debe tener al menos 6 caracteres y debe contener un número, una minúscula y una mayúscula.",
      });
      return;
    }

    if (!username || !email || !password) {
      res.render("auth/signup-form", {
        errorMessage: "Es necesario rellenar todos los campos.",
      });
      return;
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      res.render("auth/signup-form", {
        errorMessage: "El usuario y/o email ya están en uso",
      });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({ username, email, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(500)
        .render("auth/signup-form", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup-form", {
        errorMessage:
          "El usuario y el email deben ser únicos, y alguno está en uso.",
      });
    } else {
      next(error);
    }
  }
});

router.get("/log-in", (req, res, next) => {
  res.render("auth/login-form");
});

router.post("/log-in", async (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.render("auth/login-form", {
        errorMessage: "Se necesitan ambos campos para el log-in.",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.render("auth/login-form", {
        errorMessage: "El email y/o la contraseña son incorrectos",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      res.render("users/profile", { user });
      req.session.currentUser = user;
      console.log("USER =====> ", user);
      res.redirect("/auth/profile");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("users/profile", { userInSession: req.session.currentUser });
});

// router.post("/profile", (req, res) => {
//   res.render("users/profile", { userInSession: req.session.currentUser });
// });

router.post("/log-out", (req, res, next) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
