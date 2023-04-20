const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("./../models/User.model");

const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* Sign up */
router.get("/sign-up", (req, res, next) => {
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

module.exports = router;
