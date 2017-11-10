const express = require('express');
const User = require('../models/User');
const path = require('path');
//const debug = require('debug')('basic-auth:'+ path.basename(__filename));
const router = express.Router();
  const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/', (req, res) => {
  res.render('home', { title: 'HOME' });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post("/signup", (req, res) => {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  console.log(username, password);

  var newUser  = new User({
    username,
    password: hashPass
  });

  console.log(newUser);

  newUser.save((err) => {
    res.redirect("/");
  });
});
// router.post('/signup', (req, res) => {
//   console.log("HELLO");
//   console.log(req.body);
//   const user = req.body.username;
//   const password = req.body.password;
//   console.log(username,password);
//   console.log("VOLO");
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
