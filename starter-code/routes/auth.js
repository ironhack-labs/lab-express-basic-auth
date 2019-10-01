const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

if (username === "" || password === "") {
  res.render("auth/signup", {
    errorMessage: "Indicate a username and a password to sign up"
  });
  return;
}

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
});

User.findOne({ "username": username })
.then(user => {
  if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: hashPass
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    })
})
.catch(error => {
  next(error);
})

module.exports = router;