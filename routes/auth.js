const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { request } = require("../app");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  // is the password 4+ characters
  if (password.length < 4) {
    res.render("auth/signup", {
      message: "Your password has to be 4 chars min",
    });
    return;
  }
  // is the username not empty
  if (username.length === 0) {
    res.render("auth/signup", { message: "Your username cannot be empty" });
    return;
  }
  // validation passed
  User.findOne({ username: username }).then((userFromDB) => {
    // if there is a user
    console.log(userFromDB);
    if (userFromDB !== null) {
      res.render("auth/signup", { message: "Your username is already taken" });
      return;
    } else {
      // we hash the password
      const salt = bcrypt.genSaltSync(10);
      console.log(salt);
      const hash = bcrypt.hashSync(password, salt);
      // create the user
      User.create({
        username: username,
        password: hash,
      })
        .then((createdUser) => {
          // console.log(createdUser);
          res.redirect("/");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/userProfile", (req, res) => res.render("auth/user-profile"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
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
      } else if (bcrypt.compareSync(password, user.password)) {
        res.render("auth/user-profile", {user});
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});


module.exports = router;
