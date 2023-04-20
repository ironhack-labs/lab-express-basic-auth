const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("./../models/User.model");
// const { isLoggedOut, isLoggedIn } = require("../middlewares/route-guard");

const saltRounds = 10;

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

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
    next(error);
  }
});

router.get("/log-in", async (req, res, next) => {
  res.render("auth/login-form");
});

router.post("/log-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.render("auth/login-form", {
        errorMessage: "Se necesitan ambos campos para el log-in.",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.render("auth/login-form", {
        errorMessage: "El email y/o la contraseña son incorrectos",
      });
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      res.render("auth/login-form", {
        errorMessage: "El email y/o la contraseña son incorrectos",
      });
      return;
    }

    req.session.currentUser = user;
    console.log(user);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/profile", (req, res, next) => {
  res.render("auth/profile");
});

router.get("/log-out", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
