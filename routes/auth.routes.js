// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

//we set the bcryptjs
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

//Require user model to be able to save users in the DB
const User = require('../models/User.model');

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    // console.log('The form data: ', req.body);

    const {username, email, password} = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username, //User model username is unique so it will ask for a different one each time
                email, // same above
                passwordHash: hashedPassword
                // console.log(`Password hash: ${hashedPassword}`);
            });
        })
        .then(userFromDB=>{
            // console.log(`Newly created user is: `, userFromDB)
            res.redirect(`/userProfile`)
        })
        .catch(error => next(error));
  });

  //Get route to dispkay the user-profile page
router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;


module.exports = router;
