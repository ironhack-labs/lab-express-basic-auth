const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/User.model")

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUserId) {
    next()
  } else {
    res.redirect('/login')
  }
}

const isNotAuthenticated = (req, res, next) => {
  if (req.session.currentUserId) {
    res.redirect('/profile')
  } else {
    next()
  }
}

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.post('/register', (req, res, next) => {
    
  function renderWithErrors(errors) {
      res.status(400).render('../views/register', {
      errors: errors,
      user: req.body
      })
  }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        renderWithErrors({
          username: 'Username already exist. Try with a different one.'
        })
      } else {
        User.create(req.body)
          .then(() => {
            res.redirect('/')
          })
          .catch(e => {
            if (e instanceof mongoose.Error.ValidationError) {
              renderWithErrors(e.errors)
            } else {
              next(e)
            }
          })
      }
    })
    .catch(e => next(e))
 
});

router.post('/login', (req, res, next) => {

  function renderWithErrors() {
    res.render('login', {
      user: req.body,
      error: 'Wrong username or password. Try again.'
    })
  }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        renderWithErrors()
      } else {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              req.session.currentUserId = user.id

              res.redirect('/profile')
            } else {
              renderWithErrors()
            }
          })
      }
    })
    .catch(e => next(e))
})

router.post('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
})

router.get('/register', isNotAuthenticated, (req, res, next) => res.render('register'));

router.get('/login', isNotAuthenticated, (req, res, next) => res.render('login'));

router.get('/profile', isAuthenticated, (req, res, next) => res.render('profile'));

router.get('/main', isAuthenticated, (req, res, next) => res.render('main'));

router.get('/private', isAuthenticated, (req, res, next) => res.render('private'));

module.exports = router;
