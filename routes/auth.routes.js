const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");

// ====================. SIGN UP .==============================>
router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  //password and username required
  if (!username || !password) {
    return res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
  }

  // make sure password is strong:

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    return res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  //encript password and create user
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

// ====================. LOGIN .==============================>

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { user, password } = req.body;

  if (user === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, user and password to login.",
    });
    return;
  }

  User.findOne({ user })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "User is not registered. Try with other User.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => {
  //protecting routes
  if (req.session.currentUser) {
    res.render("users/userProfile", { user: req.session.currentUser });
  } else {
    res.redirect("/login");
  }
});

router.get("/users/main", (req, res) => {
  //protecting routes
  if (req.session.currentUser) {
    res.render("users/main");
  } else {
    res.redirect("/login");
  }
});

router.get("/users/private", (req, res) => {
  //protecting routes
  if (req.session.currentUser) {
    res.render("users/private");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
