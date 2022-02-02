
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
 
const User = require('../models/User.model');

router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);
   
    const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
      })
      .then(userFromDB => {
        // console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile');
    })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
      })
      .catch(error => next(error));
  });
  
router.get('/signup', (req, res) => res.render('auth/signup.hbs'));

router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
  });




module.exports = router;
