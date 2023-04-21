const { Router } = require("express");
const router = new Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/guard");

const saltRounds = 10;

//GET router
router.get("/signup", (req, res, next) => res.render("auth/signup"));

router.get("/login", (req, res) => res.render("auth/login"));
router.get("profile", (req, res) =>
  res.render("profile", { userInSession: req.session.currentUser })
);

//POST router
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", {
        errorMessage: "Por favor rellena todos los campos.",
      });
      return;
    }
    const user = await User.findOne({ $or: [{ username }, { password }] });
    if (user) {
      res.render("auth/signup", {
        errorMessage: "El usuario y/o el email están en uso.",
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(password, salt);
    await User.create({ username, password: hashedPass });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("auth/login", {
        errorMessage: "Por favor rellena todos los campos.",
      });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.render("auth/login", {
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

    // Hacemos el inicio de sesión
    req.session.currentUser = user;
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("auth/profile");
});

// Logout controller -> req.session destroy method
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
