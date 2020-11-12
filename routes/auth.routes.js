const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

const { Router } = require("express");
const router = new Router();

router.get("/auth/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

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
      console.log("New created user is: ", userFromDB);
      res.redirect("/");
    })
    .catch((error) => next(error));
});

router.get("/auth/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, usernme and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "Username is not registered. Try with a different username.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

module.exports = router;
