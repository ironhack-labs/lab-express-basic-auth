const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");


const User = require ('../models/User');
const mongoose = require ('mongoose');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  let name= req.body.user;
  let password = req.body.password
  if (name === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  const saltRound= 5;
  const salt= bcrypt.genSaltSync(saltRound);
  const hashPassword = bcrypt.hashSync(password, salt);
  User.create({name: name, password: hashPassword})
      .catch((err) => {
        console.log('An error happened:', err);
      })
      .then((user) => {
        console.log('The user has been saved', user.name)
      });

});



// app.post('/login', function (req, res) {
// 	User.findOne({
// 		user: req.body.user
// 	}).then(found => {
// 		const matches = bcrypt.compareSync(req.body.password, found.password)

// 		if (matches) {
// 			req.session.inSession = true
// 			req.session.user = req.body.user

// 			res.redirect('secret')
// 		} else {
// 			req.session.inSession = false
// 			res.redirect('login')
// 		}
// 	})
// })


module.exports = router;

