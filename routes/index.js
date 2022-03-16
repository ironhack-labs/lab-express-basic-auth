const router = require("express").Router();
const userModel = require("../models/User.model");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  const user = {
    username,
    password: hash,
  }

  await userModel.create(user);
  res.render("profile");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {

    const user = await userModel.findOne({ username: req.body.username });
    //console.log(user);

    const hashFromDb = user.password;
    const passwordCorrect = await bcrypt.compare(req.body.password, hashFromDb);

    console.log(passwordCorrect ? "Yes" : "No");
    if (!passwordCorrect) {
      throw Error("Password incorrect");
    }
    req.session.currentUser = user;
    res.redirect("/profile");
  } catch (err) {
    res.render("login", { error: "Wrong username or password" });
  }
});

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.redirect("/login");
  });
});

module.exports = router;
