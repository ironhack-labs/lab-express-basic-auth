const express = require('express');
const router  = express.Router();
const User = require("../models/user");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  console.log(`Usuario ${username}`);

  // if(username === '' || password === '') throw new Error('Rellena ambos campos');

  User.create({
    username,
    password: hashPass
  }).then(user => {
    console.log(`Se ha creado el usuario ${user.username}`);
    res.redirect('/');
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body; 

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log("usuario logueado");
      console.log(user);
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
  User.findOne({"username": username})
  .then(user => {})
  .catch(e => {

  })
})

router.get('/secret/main', (req, res, next) => {
  if(req.session.currentUser) {
    return res.render('main');
  } 
  res.redirect('/');
})

router.get('/secret/private', (req, res, next) => {
  if(req.session.currentUser) {
    return res.render('private');
  } 
  res.redirect('/');
})


module.exports = router;
