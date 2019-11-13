const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res, next) => {
  res.render('login.hbs');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  // eslint-disable-next-line object-shorthand
  User.findOne({ username })
    .then(result => {
      if (!result) {
        res.render('login.hbs', {
          msg: 'Login denied.',
        });
      }
      console.log(result.password);
      return bcrypt.compare(password, result.password).then(match => {
        if (!match) {
          res.render('login.hbs', {
            msg: 'Login denied.',
          });
        }
        // login successful
        req.session.user = result;
        res.redirect('/private');
      });
    })
    .catch(err => {
      next(err);
    });
});

// router.post('/signup', (req, res, next) => {
//   const { username, password } = req.body;
//   console.log(username, password);
//   if (!username)
//     return res.render('signup.hbs', { msg: "Username can't be empty" });
//   if (password.length < 8) {
//     return res.render('signup.hbs', {
//       msg: 'Password is too short. It must be 8 or more characters.',
//     });
//   }
//   bcrypt
//     .genSalt(11)
//     .then(salt => {
//       bcrypt.hash(password, salt);
//     })
//     .then(hash => User.create({ username, password: hash }))
//     .then(newUser => {
//       req.session.user = newUser;
//       res.redirect('/');
//     })
//     .catch(err => {
//       next(err);
//     });
// });
router.get('/signup', (req, res, next) => {
  res.render('signup.hbs');
});

router.post('/signup', (req, res, next) => {
  // const username = req.body.username;
  // const password = req.body.password;
  const { username, password } = req.body;

  if (!username) {
    res.render('signup.hbs', { message: "Username can't be empty" });
    return;
  }
  if (password.length < 8) {
    res.render('signup.hbs', { message: 'Password is too short' });
    return;
  }
  User.findOne({ username })
    .then(found => {
      if (found) {
        res.render('signup.hbs', { message: 'Username is already taken' });
        return;
      }
      return bcrypt
        .genSalt()
        .then(salt => {
          console.log('salt: ', salt);
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          console.log('hash: ', hash);
          return User.create({ username, password: hash });
        })
        .then(newUser => {
          console.log(newUser);
          req.session.user = newUser;
          res.redirect('/');
        });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    else return res.redirect('/');
  });
});

module.exports = router;
