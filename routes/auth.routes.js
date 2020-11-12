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
  const { username, password } = req.body;
  console.log('The form data: ', req.body);

  if (!username || !password) {
    res.render("auth/signup", { errorMessage: "Fields cannot be empty!" });
    return;
  }

  User.findOne({ username })
    .then((results) => {
      //Check if user exists
      if (results !== null) {
        res.render("auth/signup", {
          errorMessage: "This username already exists!",
        });
        return;
      }

      // If its a new user we need to:
      // Step 1: Hash the incoming password
      // Step 2: Create the new user

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({
            username,
            password: hashedPassword,
          });

          newUser
            .save()
            .then(() => res.redirect("/"))
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

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

router.post('/userProfile', (req, res, next) => {
  bcryptjs
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/userProfile');
    })
})

router.get('/main', (req, res) => {
  res.render('main');
});

module.exports = router;