const Router = require('express').Router;
const bcrypt = require('bcrypt');
const authRouter = Router();
const User = require('../models/User.js');
const zxcvbn = require('zxcvbn');

authRouter.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage : null
  });
});

authRouter.post('/signup', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Please enter a username and password'
    });
  }

  User.findOne({ username : username }, { username : 1 }, (err, userDoc) => {
    if (err){
      next(err);
      return;
    }

    if (userDoc) {
      res.render('auth/signup', {
        errorMessage: 'The username already exists, be more original'
      });
      return;
    }

    if (zxcvbn(password).score < 2) {
      res.render('auth/signup', {
        errorMessage: 'Password too easy'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(6);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo = {
      username : username,
      password : hashPass
    };

    const theUser = new User(userInfo);

    theUser.save((err) => {
      if (err){
        res.render('auth/signup', {
          errorMessage: 'Oops, you did it again and you should stop'
        });
        return;
      }

      res.redirect('/');
    });
  });
});

authRouter.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRouter.post('/login', (req, res, next) => {
      console.log('Hello World!');
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/login', {  /// IF USER SUBMITS EMPTY FIELDS
      errorMessage: 'Please double-check and make sure both fields are filled out'
    });
    return;
  }


  User.findOne({username: username}, (err, userDoc) => {
    if (err) {
      next(err);
      return;
    }

    if (!userDoc) {
      res.render('auth/login', {   ///// IF USER USERNAME IS NOT CORRECT
        errorMessage: 'Username not found'
      });
      return;
    }


    if (bcrypt.compareSync(password, userDoc.password)) {
      req.session.currentUser = userDoc;
      res.redirect('/');
      return;
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect Password' //// IF USER PASSWORD IS INCORRECT
      });
      return;
    }
  });
});

authRouter.get('/logout', (req, res, next) => {
  req.session.destroy();

  res.redirect('/');
});

module.exports = authRouter;
