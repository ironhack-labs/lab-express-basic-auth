// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();

const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/userProfile", (req, res) => {
  console.log(req.session.currentUser);
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      // console.log('Newly created user is: ', userFromDB);
      res.redirect("/login");
    })
    .catch((error) => next(error));
});

// GET route ==> to display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  //console.log("SESSION =====> ", req.session);
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "username is not registered. Try with other username.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.render("users/user-profile", {
          userInSession: req.session.currentUser,
        });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
