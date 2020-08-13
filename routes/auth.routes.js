
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

//SIGNUP

//get route and display signup form.
router.get('/signup', (req,res) => {
    res.render('auth/signup')
})

//post route with inputs from form.
router.post('/signup', (req, res, next) => {
    
    //destructure input data
    const { username, password } = req.body;

    //check if both fields are completed
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'Both field are mandatory'})
    
    //else => stop code with empty return
    return;
    }


    //Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.
    const regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

    if(!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password must have a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.'})
    
    //else => stop code with empty return    
    return;
    }

    //encrypt password
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password,salt))
        .then(hashedPassword => {
            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDb => {
            console.log('Newly created user is: ',userFromDb);
            res.redirect('/userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
              res.status(500).render('auth/signup', {
                errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              });
            } else {
              next(error);
            }
          });
});

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile');
  });



module.exports = router;