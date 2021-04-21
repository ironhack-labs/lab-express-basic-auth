const router = require("express").Router();
const User = require("../models/User.model");
const passport = require('passport');
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

// Post passport

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
  })
);


//  Post

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username }).then((user) => {
    if (user === null) {
      // user is not in the db. Redirect to login
      res.render("login", { message: "Invalid credentials" });
      return;
    }
    // if user is in Db , check the password
    if (bcrypt.compareSync(password, user.password)) {
      // check with  hash and log in
      req.session.user = user;
      // go to the user profile
      res.redirect("/profile");
    }
  });
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (username === "") {
    res.render("signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("signup", { message: "This username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      console.log(`Password hash:`, hash);

      User.create({ username: username, email: email, password: hash }).then(
        (createdUser) => {
          res.redirect("/");
        }
      );
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
