const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();

router.get('/', (req, res, next) =>{
  res.render('login');
})


router.post('/',(req, res , next) =>{
  const {username, password} = req.body;

  if(!username || !password){return res.render('login', {errorMessage: "Error!!! "})}

  console.log("post /")
  User.findOne({username})
  .then((user) => {
    if (!user) {
      return res.render('login', {errorMessage: "Error!! "})
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      return res.redirect('/home');
    } else {
      return res.render('login', {errorMessage: "Wrong password!!"})
    }
  })
  .catch(error =>{
    next(error);
  })
})

module.exports = router;