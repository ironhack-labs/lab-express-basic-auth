const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
//const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route.guard");

router.get("/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", { message: "All fields are mandatory." });
    return;
  }
  User.findOne({ username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render("auth/signup", { message: "Username is taken" });
      return;
    } else {
      // Hashed password
      const salt = bcrypt.genSaltSync();
      const hashedPwd = bcrypt.hashSync(password, salt);
      User.create({ username, password: hashedPwd, email })
        .then((newUser) => {
          console.log(newUser);
          res.redirect("/auth/login");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});
router.get("/auth/login", (req, res) => res.render("auth/login"));
router.post("/auth/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }).then((userFromDB) => {
    if (userFromDB === null) {
      res.render("auth/login", { message: " Oops!!Wrong credentials" });
      return;
    }
    // Check if password from input form matches hashed password from database
    else if (bcrypt.compareSync(password, userFromDB.password)) {
      // req.session is an object provided by "express-session"
      req.session.User = userFromDB;
      res.redirect("/users/user-profile");
    } else {
      res.render("/auth/login", { message: "Oops!!Wrong credentials" });
      return;
    }
  });
});
router.get("/users/user-profile", isLoggedIn, (req, res) => {
  res.render("users/user-profile", { loggedUser: req.session.User });
});

router.get("/auth/logout", isLoggedIn, (req, res) => {
  // Logout user
  req.session.destroy();
  res.redirect("/");
});
router.get("/main", isLoggedIn, (req, res) => res.render("main"));
router.get("/private", isLoggedIn, (req, res) => res.render("private"));
module.exports = router;
