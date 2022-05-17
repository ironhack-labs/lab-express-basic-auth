const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const isLoggedOut = require("../middlewares/isLoggedOut");

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

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
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => res.render("users/user-profile"));

router.get("/signin", isLoggedOut, (req, res) => res.render("auth/signin"));

router.post("/signin", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signin", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/signin", { errorMessage: "User not found" });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = user;
        res.render("user/user-profile", { user });
      } else {
        res.render("auth/signin", { errorMessage: "Incorrect password" });
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
