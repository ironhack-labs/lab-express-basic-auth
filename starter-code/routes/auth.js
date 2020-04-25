const express=require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch(e) {
    next(e);
  }
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password,salt);

  // Checking if username and password are not empty
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username is already taken",
      });
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        username: username,
        password: hashPass,
      })
        .then((user) => {
          console.log("User has been created", user.username);
          //Send or render somewhere
          res.redirect("/login");
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

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  ///Is username created
  User.findOne({ username: username }).then((user) => {
    if (user === null) {
      res.render("auth/login", { errorMessage: "Invalid credentials" });
      return;
    }
    ///Do username and password match
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/views/main.hbs");
    } else {
      res.render("auth/login", { errorMessage: "Invalid credentials" });
    }
  });
});


module.exports = router;