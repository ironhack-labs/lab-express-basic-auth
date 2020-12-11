const { Router } = require('express');
const User = require('../models/User.model');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => res.render('views/signup'));
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
            username,
            email,   
            passwordHash: hashedPassword
          });
        })
        .then(userFromDB => {
          console.log('Newly created user is: ', userFromDB);
        })
        .catch(error => next(error));
    });

module.exports = router;