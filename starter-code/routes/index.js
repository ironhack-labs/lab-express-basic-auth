const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
  if(req.session.currentUser){
    res.render('main');
  }else{
    res.render('index');
  }
});
router.get('/signup', (req, res, next) => {
  res.render('signup');
});
router.get('/login', (req, res, next) => {
  res.render('login');
});
router.get('/logout', (req, res, next) => {
  if(req.session.currentUser){
    req.session.destroy((err) => {
      err ? console.log(err) : null;
    });
  }
  res.redirect("/login");
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }
  const salt     = bcrypt.genSaltSync(12);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/login");
  })
  .catch(error => {
    console.log(error);
  })
});
router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign in."
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
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("login", {
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
    res.redirect("/login");         
  }                                 
}); 

router.get('/main', (req, res, next) => {
  res.render('main');
});
router.get('/private', (req, res, next) => {
  res.render('private');
});



module.exports = router;
