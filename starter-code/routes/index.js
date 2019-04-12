const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/user")


/* GET home page */
router.get('/', (req, res, next) => {
  const data = {
    action: "signup"
  }

  res.render('index', data);
});



router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  User
    .findOne({ username: username })
    .then((userData) => {
      const isAuthorized = bcrypt.compareSync(password, userData.password)

      if (isAuthorized) {
        req.session.currentUser = userData
        res.render("success", userData)
      } else {
        res.render("no-success")
      }

      // // res.json({authorized: isAuthorized})
    })


});


router.get('/login', (req, res, next) => {
  const data = {
    action: "login"
  }

  res.render('index', data);
});


router.get('/signup', (req, res, next) => {
  const data = {
    action: "signup"
  }

  res.render('index', data);
});

router.post('/signup', (req, res, next) => {
  let saltRounds = 1
  let salt = bcrypt.genSaltSync(saltRounds)
  let encryptedPwd = bcrypt.hashSync(req.body.password, salt)

  User
    .create({ username: req.body.username, password: encryptedPwd })
    .then((userGenerated) => {
      res.render("created", userGenerated)
    })
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/login");
  });
});

// Other pages
router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next();
  } else {                         
    res.redirect("/login");        
  }                                
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});


module.exports = router;
