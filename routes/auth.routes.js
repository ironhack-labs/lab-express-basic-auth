const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", { errorMessage: "Fill out all the fields" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });

    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("auth/signup", {
        errorMessage: error.message,
      });

      console.log(error);
      next(error);
    }
  }
});

// Se incluir o isLoggedOut a página de login não abre, não consegui resolver este problema.
router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/login", { errorMessage: "Please input all the fields" });
    }

    let user = await User.findOne({ username });

    if (!user) {
      res.render("auth/login", { errorMessage: "Account does not exist" });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      console.log(user);
      res.redirect("/main");
    } else {
      res.render("auth/login", { errorMessage: "Wrong credentials" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/main", isLoggedIn, (req, res) => {
  let user = req.session.user;

  res.render("main", user);
});

router.get("/private", isLoggedIn, (req, res) => {
  let user = req.session.user;

  res.render("private", user);
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;
