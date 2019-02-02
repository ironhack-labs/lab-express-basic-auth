const express       = require('express');
const router        = express.Router();
const User          = require('../../models/User');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;

router.get('/', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/', (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(saltRounds);
  const hash     = bcrypt.hashSync(password, salt);
  const newUser   = User({
    username: userName,
    password: hash
  });

  if (userName === '' || password === '') {
    console.log('a')
    res.render('auth/signup', {errorMessage: 'Username and password cannot be null'})
  }

  User.findOne({username: userName})
  .then((result) => {
    if (result === null) {
      newUser.save()
      .then(() => {
        res.render('home')
      });
    } else {
      res.render('auth/signup', {errorMessage: 'Username already in use!'});
    }
  })

})

module.exports = router;