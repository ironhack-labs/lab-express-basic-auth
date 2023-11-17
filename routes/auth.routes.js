//creating Express router
const mongoose = require("mongoose");
const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

router.get("/signup", (req, res) => res.render("auth/signup"));
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Fill all fields, bastard.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "user or email or password is incorrect. chill bro and then try again",
        });
      } else {
        next(error);
      }
    });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage:
        "enter both, or you will not enter to the secret-mystic-unreal web",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "user or email or password is incorrect. chill bro and then try again",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //res.render("users/user-profile", { user });
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", {
          errorMessage:
            "user or email or password is incorrect. chill bro and then try again",
        });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
