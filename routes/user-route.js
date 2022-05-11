const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const saltRounds = 10;
/* const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard"); */

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  //console.log(req.body);

  if (!username || !password) {
    res.render("signup", { errorMessage: "All fields are required" });
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then(() => res.redirect("/login"))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("signup", { errorMessage: err.message });
      } else if (err.code === 11000) {
        res.status(500).render("signup", {
          errorMessage:
            "Username and email need to be unique. Either one of them is already in use",
        });
      } else {
        next(err);
      }
    });
});

router.get("/login", isLoggedOut, (req, res, next) => res.render("login"));

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("login", { errorMessage: "All fields are required" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", { errorMessage: "User not found" });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = user;
        console.log(user);
        //console.log(req.session);
        res.render("profile", { user });
      } else {
        res.render("login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
