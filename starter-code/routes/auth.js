const express = require('express');
const authRouter = express.Router();

const User = require('./../models/User');

const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const saltRounds = 10;



//POST '/signup' user check/create
authRouter.post('/', (req, res, next) => {
  const {username, password} = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', {errorMsg: 'You need to fill in a password'} )
    return;
  }

  User.findOne({username})
  .then( (user) => {
    if (user) {
      res.render('auth/signup', {errorMsg: 'That username already exists!'} )
    return;
    }
  
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  User.create({username, password: hashedPassword })
    .then(createUser => res.redirect('/'))
    .catch(err => {
      res.render('auth/signup', {errorMsg: 'There was an error while creating the user.'});
      //console.log('err', err);
      
    })
  })
  .catch( (err) => console.log(err));
})

//GET '/' signup form
authRouter.get('/', (req, res, next) => {
  res.render('auth/signup')
})

module.exports = authRouter;