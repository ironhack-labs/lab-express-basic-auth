const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
// model
const User = require("../models/User.model.js")

router.get('/auth/signup', (req, res, next)=> res.render('auth/signup'));

const saltRounds =  10

router.post('/signup', (req, res, next)=> {
  //console.log(req.body)
  const {username, inputPassword} = req.body
  bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(inputPassword, salt))
    .then(hashedPassword => {
      return User.create({username, password: hashedPassword})
    }).then(newUserDb => console.log(newUserDb))
    .catch(err => console.log("error creating user for db: ", err))
});



module.exports = router;