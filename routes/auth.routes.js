// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');
//bcryptjs setup
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


//Get route at signup page (displaying form to user)
router.get('/signup', (req, res) => res.render('auth/signup'));

//Post route at signup page to get user's data (use bcryptbjs)
router.post('/signup', (req, res, next) => {
    console.log("The form data: ", req.body);
    console.log('what the fuck')
   
      const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('userProfile') 
      })
      .catch(error => next(error)); 
  });

//Get route to redirect to user's page

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;