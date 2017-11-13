const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const isloggedIn = require('../middlewares/isLoggedIn');
//const path = require('path');
//const debug = require('debug')('basic-auth:'+ path.basename(__filename));
const router = express.Router();
const bcryptSalt = 10;

router.get('/register', (req, res) => {
  res.render('user/register');
});
router.get('/login', (req, res) => {
  res.render('user/login');
});
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.post('/login', (req, res) => {
  const username = req.body._username;
  const password = req.body._password;

  if (username === '' || password === '') {
    res.render('user/login', {
      errorMessage: "Indicate a username and password please"
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
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/home");
      } else {
        res.render("user/login", {
          errorMessage: "Incorrect password"
        });
      }
    });

});

router.post('/', (req, res) => {
  const username = req.body._username;
  const password = req.body._password;

  User.findOne({ "username": username }, "_username", (err, user) => {
    if (user != null) {
      res.render('user/register', {
        errorMessage: "User already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      console.log("NO");
      res.redirect("/");
    });

  });

});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next(); }
  else { res.redirect("/login"); }
});

router.get('/home', isloggedIn,(req,res) =>{
  res.render('user/home');

});

router.get('/logout',(req,res)=>{
  req.session.destroy(error => {
    res.redirect('/login');
  });
});

module.exports = router;
