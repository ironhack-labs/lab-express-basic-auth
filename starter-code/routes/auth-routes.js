const express = require('express');
const router  = express.Router();

const User = require("../models/user"); // User model

// BCrypt
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//signup page:
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // Validation (fields can't be empty)
  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ "username": username })  // User is unique (the user name can't be repeated)
.then(user => {
  if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
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
})
.catch(error => {
  next(error);
})
});

//login page:
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  });
});

// pages available after authentication
router.use((req, res, next) => {
  if (req.session.currentUser) {  //if theres a valid user go to the next (get) rout
    next();
  } else {
    res.redirect('/login');
  }
});

router.get("/main", (req, res, next) => {
  res.render("auth/main");
});

router.use((req, res, next) => {
  if (req.session.currentUser) {  //if theres a valid user go to the next (get) rout
    next();
  } else {
    res.redirect('/login');
  }
});

router.get("/private", (req, res, next) => {
  res.render("auth/private");
});

// logout rout
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;