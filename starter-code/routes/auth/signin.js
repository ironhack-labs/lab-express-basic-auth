const express       = require('express');
const router        = express.Router();
const User          = require('../../models/User');
const bcrypt        = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('auth/signin');
});

router.post('/', (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;

  if (userName === '' || password === '') {
    res.render('auth/signin', {errorMessage: 'Username and password cannot be null'})
  }

  User.findOne({username: userName})
  .then((result) => {
    if (result && bcrypt.compareSync(password, result.password)) {
        req.session.currentUser = result;
        res.redirect('/home');
    } else {
      res.render('auth/signin', {errorMessage: 'Invalid username or password!'});
    }
  })

})

module.exports = router;