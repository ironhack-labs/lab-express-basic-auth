const express = require('express');
const logRouter = express.Router();

const User = require('./../models/User');

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

//POST login
logRouter.post('/', (req, res, next) => {
  const {username, password} = req.body;

  User.findOne({username})
    .then( user => {
      if (!user) {
        res.render('auth/login', {errorMsg: "This user doesn't exist."})
        return;
      }

      const passwordDB = user.password;
      const passwordCorrect = bcrypt.compareSync(password, passwordDB);
      
      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect('/');
      }
      else {
        res.render('auth/login', {errorMsg: 'Wrong password!'})
      };
    })
    .catch( err => console.log(err));
})

//GET login
logRouter.get('/', (req, res, next) => {
  res.render('auth/login')
})

module.exports = logRouter;