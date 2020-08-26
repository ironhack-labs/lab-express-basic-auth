const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
// .post() route ==> to process form data
router.post('/signup', (req, res) => {
    //console.log('The form data: ', req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
      }
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password,salt))
    .then(hashedPassword => {
        return User.create({
            username,
            email,
            passwordHash: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log(`Newly created user is: `,userFromDB);
        res.redirect('/userProfile');
    })
    .catch(error => (error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
               errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
          } 
        else {
            next(error);
        }
    })
  });
  router.get('/userProfile', (req, res) => res.render('users/user-profile')); 
module.exports = router;