const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
    res.render('signup')
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    if (password.length < 6) {
        res.render('signup', {message: 'Your password is too short'});
        return
    }
    if (username.length < 4) {
        res.render('signup', {message: 'Invalid username format' });
        return
    }

    User.findOne({username: username})
      .then(userExist => {
          if (userExist) {
            res.render('signup', {message: 'This username is not available' });
            return;
          } else {
              const salt = bcrypt.genSaltSync();
              const hash = bcrypt.hashSync(password, salt);
              User.create({username: username, password: password})
                .then(success => {
                    console.log(success)
                })
                res.redirect('signup/success')
          }
      })
});

module.exports = router;