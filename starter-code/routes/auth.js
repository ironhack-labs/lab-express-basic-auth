const express = require('express');
const router  = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET signup page

router.get("/auth/signup", (req, res, next) => {
 res.render("auth/signup");
});

// POST signup page

router.post('/auth/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Please provide a username and password to sign up'
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect('/');
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});


// GET login page

router.get("/auth/login", (req, res, next) => {
  res.render("auth/login");
});

// Post login page

router.post("/auth/login", (req, res, next) => {
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
    
        req.session.currentUser = user;
        res.redirect("/")
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/private");
});

router.get("/main", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/main");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
