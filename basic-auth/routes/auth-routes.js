const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    password: hashPass
  });
  newUser.save().then(user => {
    res.redirect("/");
  });

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please enter username and password"
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });
      newUser.save().then(user => {
        res.redirect("/");
      });
    })
    .catch(error => {
      next(error);
    });

  newUser
    .save()
    .then(user => {
      res.redirect("/");
    })
    .catch(error => {
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username does not exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      //Save login in session
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    res.redirect("/login");
  });
});
module.exports = router;
