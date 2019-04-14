const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user")
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) 
  {
    let username = req.session.currentUser.username;
    res.render('index', {name: username});
  }
  else {res.render('index');}
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {

  let username = req.body.username;
  let password = req.body.password;

  if(Error) {res.render("signup", {errorMessage: `Username ${username} already exists`})}
  
  if(username.length < 4 || (password.length > 8 && password.length < 4))
  {
    res.render("signup", {
      errorMessage: "Please enter both, username (min 4 chars) and password (min 4 - max 8) to sign up."
    })
    return;
  }

  let saltRounds = 5;
  let salt = bcrypt.genSaltSync(saltRounds)
  let encryptedPwd = bcrypt.hashSync(password, salt)

  Promise.resolve()
    .then(() => User.create({ username: username, password: encryptedPwd }))
      .then(newUser => console.log(`User added`))
      .catch(err => console.log("An error happened:", err))
    .then(res.render("login"))
  })

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let {username, password} = req.body

  User
    .findOne({ username: username })
    .then((userData) => 
    {
      if (!userData) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }

      const isAuthorized = bcrypt.compareSync(password, userData.password)

      if(isAuthorized)
      {
        req.session.currentUser = userData;
        res.redirect("/main");
      }
      else 
      {
        res.render("login", {errorMessage: "Incorrect password"})
      }
    })
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  let username = req.session.currentUser.username;
  res.render("main", {name: username});
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = router;
