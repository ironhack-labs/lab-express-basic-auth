const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');

routes.get('/sign-up', (req, res, next) => {
  const data = {
    title: 'We are glad to have you here!',
    action: '/users/sign-up',
    buttonTitle: 'Create my account'
  };

  res.render('users/form', data);
});

routes.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  const rounds = 10;

  const newUser = {
    username,
    password: bcrypt.hashSync(password, rounds)
  };

  User.create(newUser)
    .then(doc => {
      req.session.currentUser = doc;

      res.redirect('/private');
    })
    .catch(err => {
      console.log(`There was an error while creating a new user.`, err);
      res.redirect('/users/sign-up');
    });
});

routes.get('/login', (req, res, next) => {
  const data = {
    title: 'Welcome back!',
    action: '/users/login',
    buttonTitle: 'Login'
  };

  res.render('users/form', data);
});

routes.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(doc => {
      if (bcrypt.compareSync(password, doc.password)) {
        req.session.currentUser = doc;

        res.redirect('/private');
      } else {
        throw new Error('Users tried to login in with incorrect password');
      }
    })
    .catch(err => {
      console.log(`There was an error while authenticating a user.`, err);
      res.redirect('/users/login');
    });
});

module.exports = routes;
