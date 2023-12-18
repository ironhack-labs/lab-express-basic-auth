const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const { RuntimeError } = require("cesium");

//GET route
router.get("/signup", (req, res) => res.render("auth/signup.hbs"));

//POST for processing form data
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    res.render("auth/signup", { errorMessage: "all fields required" });
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
    .catch((error) => next(error));
});

//GET for user profile
router.get("/userProfile", (req, res) => res.render("users/user-profile"));

//  LOGIN ROUTES

//GET
router.get("/login", (req, res) => res.render("auth/login"));

//POST login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "user not found" });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.render("user/user-profile", { user });
      } else {
        res.render("auth/login", { errorMessage: "user not foundffsbfs" });
      }
    })
    .catch((error) => next(error));
});
module.exports = router;
