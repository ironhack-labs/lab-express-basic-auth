const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      res.render("signup", {
        errorMessage: "Please input all the fields",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("signup", {
        errorMessage: error.message,
      });
    } else if (error.code === 11000) {
      res.render("signup", {
        errorMessage: "Username already create",
      });
    }
    console.log(error);
    next(error);
  }
});

// Login

router.get("/login", (req, res) => res.render("login"));

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!password || !username) {
      res.render("login", {
        errorMessage: "Please input all the fields",
      });
    }

    let user = await User.findOne({ username });
    if (!user) {
      res.render("signup", {
        errorMessage: "Username not found",
      });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;

      res.redirect("/profile");
    } else {
      res.render("login", { errorMessage: "Wrong password" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// profile

router.get("/profile", isLoggedIn, (req, res) => {
  let user = req.session.user;
  res.render("profile", user);
});

// logout

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

// pictures

router.get("/main", (req, res) => res.render("main"));


router.get("/private", (req, res) => res.render("private"));

module.exports = router;

/*render para pastas e arquivos = sem / no comeco 
para o site sao as rotas post e get e redirect  com a / 
*/
