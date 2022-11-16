const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        // username: username, email: email
        username,
        email,
        password: hashedPassword
      });
    })
    .then(user => {
      res.redirect(`/user/${user.id}`);
    })
    .catch(error => next(error));
});

// GET route ==> to display the profile of a single user
router.get('/user/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then((user) => res.render('users/user-profile', {username, email} = user))
  .catch(error => next(error));
});

module.exports = router;
