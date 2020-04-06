const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/sign-up", (req, res, next) => {
  res.render("signup");
});

router.post("/sign-up", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ username: username })
    .then((user) => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        if (username === "" || password === "") {
          res.render("signup", {
            errorMessage: "Indicate a username and a password to sign up"
          });
          return;
        }
    
        res.redirect("/main");
      })
      .catch(error => {
        console.log(error);
      })
    .catch((error) => {
      next(error);
    });
})
})

router.get("/log-in", (req, res, next) => {
  res.render("login");
});

router.post("/log-in", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("log-in", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("log-in", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("log-in", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/log-in");
  }
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get('/private', (req, res, next) => {
  res.render('private')
})

module.exports = router;
