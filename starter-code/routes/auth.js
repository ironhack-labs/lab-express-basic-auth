const router = require('express').Router();
const User = require('../models/User');

// Modules for encription
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/', (req, res) => {
  res.render('home', { title: 'HOME' });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', { errorMessage: 'Indicate a username and a password to sign up' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { errorMessage: 'The username already exists' });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const password = bcrypt.hashSync(req.body.password, salt);

    const newUser  = new User({
      username: username,
      password: password
    });

    newUser.save((err) => {
      if (err) {
          res.render('auth/signup', { message: 'There has been an error'});
      } else {
          res.redirect('/');
      }
    });
  });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ 'username': username}, (err, user) => {
        if (err || !user) {
            res.render('auth/login', { errorMessage: "That username doesn't exist in the DB"});
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/');
        } else {
            res.render('auth/login', { errorMessage: 'Wrong password'});
        }
    });
});

router.get('/main', (req, res, next ) => {
    if (req.session.currentUser) {
    res.render('main');
  } else {
    res.redirect('/login');
  }
});

router.get('/private', (req, res, next ) => {
    if (req.session.currentUser) {
    res.render('private');
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
