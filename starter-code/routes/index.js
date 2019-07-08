const express = require('express');
const router  = express.Router();
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const Signup = require('../models/Authentication');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
})

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  Signup.create({
    username,
    password: hashPass,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    })
});

router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("/login", {
      errorMessage: "Please enter both, username and password to sign up.",
    });
    return;
  }

  Signup.findOne({ "username": username })
    .then(user => {
      if (!user) {
        res.render("/login", {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("/login", {
          errorMessage: "Incorrect password",
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
    res.redirect("/login");         
  }                                
});

router.get('/main', (req, res) => {
  res.render('main');
})

router.get('/private', (req, res) => {
  res.render('private');
})

module.exports = router;
