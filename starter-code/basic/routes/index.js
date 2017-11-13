
const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'SIGNUP' });
});


/* GET home page. */
router.post('/signup', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      var salt     = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

      var newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
});



router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'LOGIN' });
});

// const bcrypt = require('bcrypt');
// const path = require('path');
// const debug = require('debug')('basic-auth:'+ path.basename(__filename));
// const bcryptSalt = 10;


// router.get('/', (req, res) => {
//   res.render('index', { title: 'INDEXJS' });
// });

//
// /* GET home page. */
// router.post('/signup', (req, res) => {
//
//   const username = req.body.username;
//   const password = req.body.password;
//
//   if (username === "" || password === "") {
//     res.render("auth/signup", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }
//
//   User.findOne({ "username": username },
//     "username",
//     (err, user) => {
//       if (user !== null) {
//         res.render("auth/signup", {
//           errorMessage: "The username already exists"
//         });
//         return;
//       }
//
//       var salt     = bcrypt.genSaltSync(bcryptSalt);
//       var hashPass = bcrypt.hashSync(password, salt);
//
//       var newUser = User({
//         username,
//         password: hashPass
//       });
//
//       newUser.save((err) => {
//         res.redirect("/");
//       });
//     });
//
// });

module.exports = router;
