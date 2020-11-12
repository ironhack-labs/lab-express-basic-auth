const { Router } = require("express");
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require("../models/User.model");

//to display the signup form to users
//The get method reveals that upon the get request from the user, as a response the file signup.hbs will be sent and rendered to them.
router.get('/signup', (req, res) => res.render('auth/signup'));

//defines where to send the form data when a form is submitted.
router.post('/signup', (req, res, next) => {
  console.log('The form data: ', req.body);

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
});

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

router.post('/userProfile', (req, res, next) => {
  bcryptjs
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/userProfile');
    })
})

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  console.log('SESSION =====> ', req.session);

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // SAVE THE USER IN THE SESSION
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/userProfile', (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;