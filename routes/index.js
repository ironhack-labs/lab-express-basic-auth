const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("./../models/User.model");

const { isLoggedOut, isLoggedIn } = require("../middlewares/protected-routes");

const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* Sign up */
router.get("/sign-up", isLoggedOut, (req, res, next) => {
  res.render("sign-up");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("sign-up", { errorMessage: "Por favor completa los campos" });
      return;
    }
    const user = await User.findOne({ username });
    if (user) {
      res.render("auth/signup-form", {
        errorMessage: "El usuario ya existe.",
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (e) {
    next(e);
  }
});

// Log in

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("login", {
        errorMessage: "Por favor rellena los campos correctamente.",
      });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.render("login", {
        errorMessage: "Usuario o contraseña incorrectos.",
      });
      return;
    }
    if (!bcrypt.compareSync(password, user.password)) {
      res.render("login", {
        errorMessage: "Usuario o contraseña incorrectos.",
      });
      return;
    }

    req.session.currentUser = user;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// Profile

router.get("/personal-page", isLoggedIn, (req, res, next) => {
  res.render("personal-page");
});

// Log out

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
