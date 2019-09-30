const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {

  const { username , password } = req.body, bcryptSalt = 10;
  let error;

  // Validate that the required fields are entered in the form before creating User in DB
  if ( !username || !password ) {
    error = 'Please make sure to enter e-mail and password'
    return res.render('signup', { error });
  }
  if ( req.body.password !== req.body['confirm-password'] ) {
    error = 'Please make sure to confirm the password correctly';
    return res.render('signup', { error });
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({username})
  .then( user => {
    if ( user ) {
      error = 'That username is already taken'
      return res.render('signup', { error });
    }
    User.create({ username, password: hashPass })
    .then( user => {
      error = `User created correctly`;
      console.log('User created');
      res.redirect('/login');
    })
    .catch( error => console.log(error));
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  
  const { username , password } = req.body;
  let error;

  if( !username || !password ) {
    error = 'Please make sure to enter username and password';
    return res.render('login', { error });
  }

  User.findOne({ username })
  .then( user => {
    if( !user ) {
      error = 'There is no user registered with that username';
      return res.render('login', { error });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if(isValidPassword) {
      req.session.currentUser = user;
      res.redirect('/');
    }
    else {
      error = 'Wrong password'
      return res.render('login', { error });
    }
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy( () => {
    res.redirect('/');
  });
})

module.exports = router