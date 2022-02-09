const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

router.get('/signup', ifLoggedRedirect(), (req, res, next) => {
  res.render('auth/signup', {});
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  // Form validation should be added here
  User.findOne({ username: username }).then((retievedUser) => {
    if (retievedUser) {
      res.render('auth/signup', { message: `Username already taken` });
      return;
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username, password: hash })
        .then((createdUser) => {
          //   console.log(createdUser);
          res.redirect('/login');
        })
        .catch((err) => next(err));
    }
  });
});

function ifLoggedRedirect() {
  return (req, res, next) => {
    if (req.session.user) {
      res.redirect('/profile');
    } else {
      next();
    }
  };
}

router.get('/login', ifLoggedRedirect(), (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username }).then((retrievedUser) => {
    if (!retrievedUser) {
      res.redirect('/login', { message: `Invalid credentials` });
      return;
    }
    if (bcrypt.compareSync(password, retrievedUser.password)) {
      //   console.log(username, ' authenticated');

      req.session.user = retrievedUser;
      //   console.log(req.session);
      res.redirect('/profile');
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.render('index');
});

module.exports = router;
