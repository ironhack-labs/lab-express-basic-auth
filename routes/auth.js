const router = require("express").Router();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { password, userName } = req.body;

  if (!password || !userName) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide username and password.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    })
    .then((hash) => {
      const userDetails = {
        userName,
        passwordHash: hash,
      };
      return User.create(userDetails);
    })
    .then((userFromDB) => {
      res.redirect("/");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else {
        next(error);
      }
    });
});

router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

router.post("/login", isLoggedOut, (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  // Task: make query to DB to get details of the user
  User.findOne({ userName: userName })
    .then((userFromDB) => {
      if (!userFromDB) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
        //login sucessful
        req.session.currentUser = userFromDB;
        res.redirect("/");
      } else {
        //login failed
        res.render("auth/login", { errorMessage: "Incorrect credentials." });
      }
    })
    .catch((error) => console.log("Error getting user details from DB", error));
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
