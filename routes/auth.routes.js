const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcrypt");
const mongoose = require("mongoose");

// Signup Form
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Sending signup info
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
    .status(500)
    .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt()
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword
      })
    })
    .then(() => res.redirect('/userProfile'))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      }
      else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username must be unique. Username is already used.'
        });
      }
      else {
        next(error);
      }
    });
});

// Login Form
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password to login.'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered. Try another username.' });
        return;
      }
      else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      }
      else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get("/userProfile", (req, res) => {
  console.log(req.session);
  res.render("users/userProfile", { currentUser: req.session.currentUser} );
});

router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
})



module.exports = router;




