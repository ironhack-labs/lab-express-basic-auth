const express = require('express');
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")

/* GET home page */
router.get("/signup", (req, res) => {
  res.render("signup")
})

router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login-user", (req, res) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
    .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    })
})

router.post("/signup-user", (req, res) => {
  if (req.body.password.length < 8) {
    res.render('signup', { errorMessage: "weak password" });
    return
  }

  User.
    findOne({ username: req.body.username })
    .then(foundUser => {
      if (foundUser) {
        res.render('signup', { errorMessage: "user already exists! :)" });
        return
      } else {
        const saltRounds = 10
        const theSalt = bcrypt.genSaltSync(saltRounds)
        const hashedPassword = bcrypt.hashSync(req.body.password, theSalt)

        User
          .create({ username: req.body.username, password: hashedPassword })
          .then(userCreatedData => {
            // res.render('index', userCreatedData);
            res.redirect("/login")
          })
      }
    })
})

router.get("/profile", (req, res) => {
  if (req.session.currentUser) {
    res.render('profile', req.session.currentUser);
  } else {
    res.redirect("/login");
  }
})

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render('private', req.session.currentUser);
  } else {
    res.redirect("/login");
  }
})

router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    res.render('main', req.session.currentUser);
  } else {
    res.redirect("/login");
  }
})


router.get("/logout", (req, res, next) => {
  console.log(req.route.path)
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = router;
